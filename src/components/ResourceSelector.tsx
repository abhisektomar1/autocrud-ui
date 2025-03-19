import { useEffect, useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useGetIndividualResourceManageType } from "@/queries/resource";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { queryClient } from "@/queries/client";
import { CreatorDialog } from "./CreatorDialog";

interface ResourceSelectorProps {
  nodeId: string;
  resourceType: string;
  resourceCategory: string;
  appResourceType: string;
  allResources: ResourceModel[];
  resourceId: string;
  onResourceSelect: (resourceId: string) => void;
}

export interface ResourceModel {
  auth: string;
  authType: string;
  createdAt: string;
  createdBy: string;
  id: string;
  name: string;
  profile: string;
  space: string;
  type: string;
}

export function ResourceSelector({
  resourceId,
  resourceType,
  resourceCategory,
  allResources,
  onResourceSelect,
  appResourceType,
}: ResourceSelectorProps) {
  const { id } = useParams();
  const [popupCheckInterval, setPopupCheckInterval] = useState<number | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // const { data: resource } = useGetIndividualResource(id ?? "", resourceId);
  const { data: resourceManageType } = useGetIndividualResourceManageType(
    id ?? "",
    resourceType ?? "",
    resourceCategory
  );

  // const { data: callback, refetch: refetchCallback } = useGetCallback(
  //   resourceType ?? ""
  // );

  const [selectedResource, setSelectedResource] = useState<string>(resourceId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleResourceConnected = useCallback(
    (resourceId: string) => {
      // Here you would typically fetch the updated resource list
      // For now, we'll just close the dialog
      onResourceSelect(resourceId);
      setIsDialogOpen(false);
    },
    [onResourceSelect]
  );

  const handleOpenDialog = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsDialogOpen(true);
    setSelectedResource("");
  };

  useEffect(() => {
    if (resourceCategory === "oauth") {
      // Handle OAuth callback message
      const handleOAuthCallback = (event: MessageEvent) => {
        try {
          // Since the resource data is sent directly
          if (event.data.data && event.data.data.id) {
            // Check for resource object
            setIsProcessing(true);

            // Clear any existing interval
            if (popupCheckInterval) {
              window.clearInterval(popupCheckInterval);
              setPopupCheckInterval(null);
            }

            // Update queries and selection
            queryClient.invalidateQueries({
              queryKey: ["getAllResource"],
            });
            handleResourceConnected(event.data.data.id);
            toast.success("Connected successfully!");
          }
        } catch (error) {
          console.error("Error processing OAuth callback:", error);
          toast.error("Failed to process OAuth response");
        } finally {
          setIsProcessing(false);
        }
      };

      window.addEventListener("message", handleOAuthCallback);
      return () => {
        window.removeEventListener("message", handleOAuthCallback);
        // Clean up interval if component unmounts
        if (popupCheckInterval) {
          window.clearInterval(popupCheckInterval);
        }
      };
    }
  }, [handleResourceConnected, popupCheckInterval, resourceCategory]);

  // Update the Select onValueChange handler
  const handleValueChange = (value: string) => {
    if (value === "new") {
      handleOpenDialog();
    } else {
      setSelectedResource(value);
      onResourceSelect(value);
    }
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <Select
          value={selectedResource}
          onValueChange={handleValueChange}
          disabled={isProcessing}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={isProcessing ? "Connecting..." : "Select account"}
            />
          </SelectTrigger>
          <SelectContent>
            {(allResources ?? []).map((resource: ResourceModel) => (
              <SelectItem key={resource.id} value={resource.id}>
                {resource.name}
              </SelectItem>
            ))}
            <SelectItem value="new" className="text-primary">
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Connect new account
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isDialogOpen && (
        <CreatorDialog
          resourceType={resourceType}
          appResourceType={appResourceType}
          onResourceSelect={onResourceSelect}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          resourceCategory={resourceCategory}
          resourceManageType={resourceManageType}
        />
      )}
    </>
  );
}

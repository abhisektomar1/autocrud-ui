import React, { useState, useMemo } from "react";
import { useDeleteResource, useGetAllResource } from "@/queries/resource";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/badge";
import { FileText, Zap, Plus, Key, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResourceModel } from "@/components/ResourceSelector";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OptionMenu } from "@/components/settings/OptionMenu";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { DeleteAlert } from "@/components/settings/DeleteAlert";
import { CreatorDialog } from "@/components/CreatorDialog";


interface ResourceSettingsProps {
  spaceId: string;
}


const resource = ["OAuth", "API Key", "Basic", "Custom"];
const ResourceSettings: React.FC<ResourceSettingsProps> = ({ spaceId }) => {
  // const [isDialogOpen,setIsDialogOpen] = useState(false);
  const { data: resources, isLoading, error } = useGetAllResource(spaceId);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuthTypes, setSelectedAuthTypes] = useState<string[]>([]);
  const [selectedResource, setSelectedResource] = useState<ResourceModel | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // Get unique auth types from resources
  const authTypes = useMemo(() => {
    if (!resources) return [];
    return Array.from(new Set(resources.map((r: any) => r.authType)));
  }, [resources]);

  // Filter resources based on search query and selected auth types
  const filteredResources = useMemo(() => {
    if (!resources) return [];

    return resources.filter((resource: ResourceModel) => {
      const matchesSearch =
        searchQuery === "" ||
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.authType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAuthType =
        selectedAuthTypes.length === 0 ||
        selectedAuthTypes.includes(resource.authType);

      return matchesSearch && matchesAuthType;
    });
  }, [resources, searchQuery, selectedAuthTypes]);

  // Function to get icon based on resource type
  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "oauth":
        return <Shield className="h-5 w-5" />;
      case "apikey":
        return <Key className="h-5 w-5" />;
      case "basic":
        return <FileText className="h-5 w-5" />;
      case "custom":
        return <Zap className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };

  // Function to get badge color based on resource category
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "oauth":
        return "bg-blue-50 text-blue-600";
      case "apikey":
        return "bg-emerald-50 text-emerald-600";
      case "basic":
        return "bg-violet-50 text-violet-600";
      case "custom":
      default:
        return "bg-amber-50 text-amber-600";
    }
  };

  const deleteResource = useDeleteResource(spaceId);
  const queryClient = useQueryClient();

  const openEditDialog = (resource: ResourceModel) => {
    setSelectedResource(resource);
    setIsEditDialogOpen(true);
  }

  const openDeleteDialog = (resource: ResourceModel) => {
    setSelectedResource(resource);
    setIsDeleteDialogOpen(true);
  }

  const handleDeleteResource = () =>{
    if(selectedResource){
      deleteResource.mutate(selectedResource.id,{
        onSuccess:() => {
          queryClient.invalidateQueries(["getAllResource",spaceId]);
          setIsDeleteDialogOpen(false);
          setSelectedResource(null);
          toast("Resource deleted Successfully!",{
            type:"success",
            autoClose:2000,
          });
        },
        onError:(error) =>{
          toast("Failed to delete resource",{
            type:"error",
            autoClose:2000,
          })
          console.error("Error deleting resource",error);
        }
      })
    }
  }

  if (error) {
    return <div className="text-red-500">Error loading resources</div>;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-medium">Resources</h3>
              <p className="text-sm text-muted-foreground">
                Configure your external and internal connections
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Resource
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {resource.map((type: string) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                  >
                    {type}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Filter by Type
                  {selectedAuthTypes.length > 0 &&
                    ` (${selectedAuthTypes.length})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {authTypes.map((type: any) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={selectedAuthTypes.includes(type)}
                    onCheckedChange={(checked) => {
                      setSelectedAuthTypes((prev: any) =>
                        checked
                          ? [...prev, type]
                          : prev.filter((t: any) => t !== type)
                      );
                    }}
                  >
                    {type}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredResources.map((resource: ResourceModel) => (
                <div
                  key={resource.id}
                  className="overflow-hidden border border-gray-200 transition-all hover:shadow-md rounded-lg bg-card"
                >
                  <div className="flex p-5">
                    <div className="p-2 rounded-full bg-gray-100 mr-4 self-start">
                      {getResourceIcon(resource.authType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{resource.name}</h3>
                        <Badge className={getCategoryColor(resource.authType)}>
                          {resource.type.toUpperCase()}
                        </Badge>
                      </div>
                      {/* <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {resource.description}
                      </p> */}
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-gray-500">
                          Type: {resource.authType.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          Added:{" "}
                          {new Date(resource.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start -mt-1 ml-4">
                      <OptionMenu
                        resource={resource}
                        openEditDialog={openEditDialog}
                        openDeleteDialog={openDeleteDialog}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredResources.length === 0 && (
            <div className="text-center py-10 border rounded-md">
              <p className="text-gray-500">No resources found</p>
              <Button variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Add Your First Resource
              </Button>
            </div>
          )}
        </div>
        
      </div>
      {
        isEditDialogOpen && selectedResource && 
        <CreatorDialog
          isNew={false}
          resourceType={selectedResource?.type}
          appResourceType={"ask_ai"} // Passing hard coded value. Not able to access selectedResource->auth->resourceCategory->app/key
          isDialogOpen={isEditDialogOpen}
          setIsDialogOpen={setIsEditDialogOpen}
          resourceCategory={selectedResource?.authType}
        />
      }
      {
        selectedResource && (
          <DeleteAlert
            resource={selectedResource}
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            handleDelete={handleDeleteResource}
            isLoading={deleteResource.isLoading}
          />
        )
      }
      
    </>
    
  );
};

export default ResourceSettings;

import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import ResourceFormBuilder from "./ResourceFormBuilder";
import {
  useCreateNewResource,
  useEditResource,
} from "@/queries/resource";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { queryClient } from "@/queries/client";
import { useAuthStore } from "@/store/useAuthStore";

interface ResourceCreatorProps {
    resourceType: string;
    resourceCategory: string;
    isDialogOpen: boolean;
    setIsDialogOpen: any;
    appResourceType: string;
    onResourceSelect?: any;
    resourceManageType?: any;
    isNew?:boolean
}

export function CreatorDialog({
    isNew = true,
    resourceType,
    appResourceType,
    onResourceSelect,
    isDialogOpen,
    setIsDialogOpen,
    resourceCategory,
    resourceManageType,
}: ResourceCreatorProps) {
  const { id } = useParams();
  const [popupCheckInterval, setPopupCheckInterval] = useState<number | null>(
    null
  );

  const { mutate: createResource } = useCreateNewResource();
  const {mutate: editResource } = useEditResource();

  const handleResourceConnected = useCallback(
    (resourceId: string) => {
      // Here you would typically fetch the updated resource list
      // For now, we'll just close the dialog
      onResourceSelect(resourceId);
      setIsDialogOpen(false);
    },
    [onResourceSelect]
  );

  const extractFeilds = (fields: any[]) => {
    return Object.entries(fields).map(([, value]) => {
      return {
        ...value,
      };
    });
  };

  useEffect(() => {
    if (resourceCategory === "oauth") {
      // Handle OAuth callback message
      const handleOAuthCallback = (event: MessageEvent) => {
        try {
          // Since the resource data is sent directly
          if (event.data.data && event.data.data.id) {
            // Clear any existing interval
            if (popupCheckInterval) {
              window.clearInterval(popupCheckInterval);
              setPopupCheckInterval(null);
            }

            // Update queries and selection
            queryClient.invalidateQueries({
              queryKey: ["getAllResource"],
            });
            // handleResourceConnected(event.data.data.id);
            toast.success("Connected successfully!");
          }
        } catch (error) {
          console.error("Error processing OAuth callback:", error);
          toast.error("Failed to process OAuth response");
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
  }, [popupCheckInterval, resourceCategory]);
  const accessToken = useAuthStore.getState().accessToken;
  // More secure encryption function (you should use a proper library in production)
  const encryptState = (data: string) => {
    return data;
  };

  const getGeneratedUrl = (url: string, name: string) => {
    // Create the state object with spaceId and accessToken
    const stateObj = {
      name: name,
      spaceId: id || "",
      accessToken: accessToken,
    };

    // Convert to JSON string
    const stateJson = JSON.stringify(stateObj);

    const encryptedState = encryptState(stateJson);

    // Replace the state parameter in the URL with the encrypted state
    return url.replace(
      /state=([^&]*)/,
      `state=${encodeURIComponent(encryptedState)}`
    );
  };

  // Add a new function to handle the actual OAuth window opening
  const openOAuthWindow = (name: string) => {
    try {
      if (!resourceManageType?.data?.oauth?.authCodeURL) {
        toast.error("OAuth URL not found");
        return;
      }

      // Open OAuth popup window
      const width = 800;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const generatedUrl = getGeneratedUrl(
        resourceManageType.data.oauth.authCodeURL,
        name
      );

      console.log("generatedUrl", generatedUrl);
      const oauthPopup = window.open(
        generatedUrl,
        "OAuth Connection",
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );

      if (!oauthPopup) {
        throw new Error("Popup blocked");
      }

      // Check if popup was closed without completing the flow
      const checkInterval = window.setInterval(() => {
        if (oauthPopup.closed) {
          window.clearInterval(checkInterval);
          setPopupCheckInterval(null);
        }
      }, 1000);

      setPopupCheckInterval(checkInterval as unknown as number);
      setIsDialogOpen(false); // Close the confirmation dialog
    } catch (error) {
      console.error("Error opening OAuth window:", error);
      toast.error(
        "Failed to open OAuth window. Please allow popups for this site."
      );
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
            <DialogTitle>
              {resourceCategory === "oauth"
                ? "Connect OAuth Account"
                : `${isNew ? "Connect New" : "Edit"} Account`}
            </DialogTitle>
            <X
              onClick={() => setIsDialogOpen(false)}
              role="button"
              className="h-6 w-6 absolute right-4 top-4 cursor-pointer text-gray-500 hover:text-gray-700"
            />
          </DialogHeader>

          {resourceCategory === "oauth" ? (
            <div className="py-4">
              <p className="mb-4">
                You will be redirected to authenticate with the service
                provider.
              </p>
              <ResourceFormBuilder
                isNew={isNew}
                submitButtonText="Proceed to Authentication"
                fields={[
                  {
                    name: "Configuration Name",
                    variable: "configName",
                    description: "Name of the configuration",
                    type: "text",
                    is_array: false,
                    is_required: true,
                  },

                  ...extractFeilds(resourceManageType?.data?.fields ?? []),
                ]}
                onSubmit={(values) => {
                  openOAuthWindow(values.configName);
                }}
                initialValues={{}}
                spaceId={""}
              />
            </div>
          ) : (
            <ResourceFormBuilder
              isNew={isNew}
              fields={[
                {
                  name: "Configuration Name",
                  variable: "configName",
                  description: "Name of the configuration",
                  type: "text",
                  is_array: false,
                  is_required: true,
                },
                ...(resourceCategory === "apikey"
                  ? [
                      {
                        name: "API KEY",
                        variable: "apiKey",
                        description: "API KEY",
                        type: "text",
                        is_array: false,
                        is_required: true,
                      },
                    ]
                  : []),
                ...extractFeilds(resourceManageType?.data?.fields ?? []),
              ]}
              onSubmit={(values) => {
                if (resourceCategory === "apikey") {
                  const name = values.configName;
                  const apiKey = values.apiKey;
                  const payload = {
                    name: name,
                    type: resourceType,
                    space: id ?? "",
                    authType: resourceCategory as "custom" | "basic" | "apikey",
                    auth: {
                      [`${resourceCategory}`]: {
                        key: apiKey,
                        app: appResourceType,
                      },
                    },
                  };
                  {
                    isNew ? 
                    (
                      createResource(payload, {
                        onSuccess: (data) => {
                          toast.success("Resource created successfully");
                          queryClient.invalidateQueries({
                            queryKey: ["getAllResource"],
                          });
                          handleResourceConnected(data.data.id);
    
                          setIsDialogOpen(false);
                        },
                        onError: () => {
                          toast.error("Resource creation failed");
                        },
                      })
                    ) :
                    (
                      editResource(payload, {
                        onSuccess: () => {
                          toast.success("Resource updated successfully");
                          queryClient.invalidateQueries({
                            queryKey: ["getAllResource"],
                          })
                          setIsDialogOpen(false);
                        },
                        onError: () => {
                          toast.error('Resource updation failed');
                        }
                      })
                    )
                  }
                  
                } else {
                  const name = values.configName;
                  delete values.configName;
                  const payload = {
                    name: name,
                    type: resourceType,
                    space: id ?? "",
                    authType: resourceCategory as "custom" | "basic" | "apikey",
                    auth: {
                      [`${resourceCategory}`]: values,
                    },
                  };

                  {
                    isNew ? 
                    (
                      createResource(payload, {
                        onSuccess: (data) => {
                          toast.success("Resource created successfully");
                          queryClient.invalidateQueries({
                            queryKey: ["getAllResource"],
                          });
                          handleResourceConnected(data.data.id);
    
                          setIsDialogOpen(false);
                        },
                        onError: () => {
                          toast.error("Resource creation failed");
                        },
                      })
                    ) :
                    (
                      editResource(payload, {
                        onSuccess: () => {
                          toast.success("Resource updated successfully");
                          queryClient.invalidateQueries({
                            queryKey: ["getAllResource"],
                          })
                          setIsDialogOpen(false);
                        },
                        onError: () => {
                          toast.error('Resource updation failed');
                        }
                      })
                    )
                  }
                }
              }}
              initialValues={{}}
              spaceId={""}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

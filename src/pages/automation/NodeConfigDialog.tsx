import { useParams } from "react-router-dom";
import { useGetNodeFormDetail, useUpdateJob } from "@/queries/job";
import FormBuilder from "./FormBuilder";
import { useEffect, useState } from "react";
import { queryClient } from "@/queries/client";
import { toast } from "react-toastify";
import { ResourceSelector } from "@/components/ResourceSelector";
import { useGetAllResource } from "@/queries/resource";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NodeOutput } from "./NodeOutput";
import { NodeSelectionPanel } from "./NodeSelectionPanel";

export interface NodeFormModel {
  Value: string;
  description: string;
  field_name: string;
  field_type: string;
  is_required: boolean;
  max_length: number;
  name: string;
}

export interface Node {
  id: string;
  name: string;
  jobType: string;
  type?: string;
  data?: any;
}

export const NodeConfigSidebar = ({
  node,
  flowId,
  onClose,
}: {
  node: any;
  flowId: string;
  onClose: any;
}) => {
  const { id } = useParams();

  const [selectedResourceId, setSelectedResourceId] = useState<string>("");
  const { data } = useGetNodeFormDetail(node.jobType ?? "");
  const [activeTab, setActiveTab] = useState<string>("config");
  const [showNodeSelection, setShowNodeSelection] = useState(false);

  const { mutate: updatejob } = useUpdateJob();

  const transformFormValues = (values: any, type: string) => {
    const position = {
      x: node?.position?.x ?? 0,
      y: node?.position?.y ?? 0,
    };
    const measured = {
      width: node?.measured?.width ?? 195,
      height: node?.measured?.height ?? 60,
    };
    const transformedValues = {
      name: values.name || "",
      space: values.space || "",
      id: "",
      flowId: "",

      description: values.description || "",
      type: type || "api:trigger:http_request__1",
      group: values.group || "",
      links: node.links,
      position: {
        Measured: measured,
        Coordinates: position,
      },
      inputs: {
        resourceId: selectedResourceId,
        parameters: {
          ...values,
          resourceId: selectedResourceId,
        },
      },
    };

    return transformedValues;
  };

  const handleSubmit = (values: any) => {
    const jobType = node.jobType;
    const output = transformFormValues(values, jobType);
    output.space = id ?? "";

    output.id = node?.id;
    output.flowId = flowId;

    updatejob(output, {
      onSuccess() {
        queryClient.invalidateQueries("getFlow");
        queryClient.refetchQueries("getFlow");
        queryClient.invalidateQueries("getNodeFormData");
        queryClient.refetchQueries("getNodeFormData");
        queryClient.invalidateQueries("getNodeFormDetail");
        queryClient.refetchQueries("getNodeFormDetail");
        toast("Component Updated Successfully", {
          type: "success",
        });
      },
    });
  };

  const [parameter, setParameter] = useState();

  useEffect(() => {
    if (node) {
      setParameter(node.data.inputs.parameters);
      if (node.data.inputs.parameters?.resourceId) {
        setSelectedResourceId(node.data.inputs.parameters.resourceId);
      }
    }
  }, [node]);
  const { data: allResources } = useGetAllResource(id ?? "");

  const getResourceCategory = () => {
    if (data && data?.resource) {
      if (data.resource?.id.includes("smtp")) return "custom";
      if (data.resource?.id.includes("imap")) return "custom";
      if (data.resource?.id.includes("gmail")) return "oauth";
      if (data.resource?.id.includes("open_ai")) return "apikey";
    }
    return "";
  };

  return (
    <>
      {/* Overlay to capture clicks outside the sidebar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 z-0"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 flex h-full">
        {/* Node Selection Panel */}
        <AnimatePresence>
          {showNodeSelection && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              className="h-full w-[380px] bg-white shadow-xl border-l border-gray-200"
            >
              <NodeSelectionPanel
                variable="test"
                onSelect={() => {
                  setShowNodeSelection(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Configuration Panel */}
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          className="h-full w-80 sm:w-[540px] bg-gray-50 shadow-xl z-10 flex flex-col"
        >
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Configure {node.data.label}
              </h2>
              <div className="flex  items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNodeSelection(!showNodeSelection)}
                  className={"flex items-center gap-1"}
                >
                  {
                    showNodeSelection ? <X className="h-4 w-4"/> : <Plus className="h-4 w-4" />
                  }
                  {showNodeSelection ? "Hide Selection" : "Add Node"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-grow flex flex-col overflow-hidden"
          >
            <div className="px-4 pt-2 border-b">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="config">Configuration</TabsTrigger>
                <TabsTrigger value="execute">Execute & Output</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="config"
              className="flex-grow overflow-auto p-4 m-0 data-[state=inactive]:hidden"
            >
              {data?.resource && allResources && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">
                    Account Connection
                  </h3>
                  <ResourceSelector
                    nodeId={node.id}
                    resourceCategory={getResourceCategory()}
                    resourceId={selectedResourceId}
                    allResources={(allResources ?? []).filter(
                      (resource: any) =>
                        resource.type === data.resource.id.toLowerCase()
                    )}
                    resourceType={data.resource.id.toLowerCase()}
                    appResourceType={node.jobType?.split(":")[0]}
                    onResourceSelect={(resourceId: string) => {
                      setTimeout(() => {
                        setSelectedResourceId(resourceId);
                      }, 1000);
                    }}
                  />
                </div>
              )}
              {data &&
                (parameter ? (
                  <FormBuilder
                    key={node.id}
                    spaceId={id ?? ""}
                    isNewNode={false}
                    flowId={flowId ?? ""}
                    nodeId={node.id ?? ""}
                    initialValues={parameter}
                    fields={data?.request.sections[0].fields ?? []}
                    onSubmit={handleSubmit}
                    title="HTTP Request Configuration"
                    description="Configure your HTTP request parameters"
                  />
                ) : (
                  <FormBuilder
                    key={node.id}
                    isNewNode={true}
                    spaceId={id ?? ""}
                    flowId={flowId ?? ""}
                    nodeId={node.id ?? ""}
                    onSubmit={handleSubmit}
                    title="HTTP Request Configuration"
                    description="Configure your HTTP request parameters"
                    fields={data?.request.sections[0].fields ?? []}
                  />
                ))}
            </TabsContent>

            <TabsContent
              value="execute"
              className="flex-grow overflow-auto p-4 m-0 data-[state=inactive]:hidden"
            >
              <NodeOutput
                isReadOnly={true}
                node={node}
                flowId={flowId}
                spaceId={id ?? ""}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </>
  );
};

export default NodeConfigSidebar;

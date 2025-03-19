/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  List,
} from "lucide-react";
import { WorkspaceItem } from "@/types/workspace";
import CreateEditWorkspaceDialog from "../../component/modals/CreateWorkspace";
import "./GetStarted.css"; // Create this file for font definitions
import { motion } from "framer-motion";
import GridComponent from "./GridComponent";
import TableComponent from "./TableComponent";

const WorkspaceSection = ({
  memoizedWorkspace,
  handleWorkspaceClick,
  viewType,
  setViewType,
}: {
  memoizedWorkspace: WorkspaceItem[];
  handleWorkspaceClick: (id: string) => void;
  viewType: "grid" | "list";
  setViewType: (viewType: "grid" | "list") => void;
}) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="container mx-auto py-12 px-8 mb-16"
      >
        {/* All Workspaces - Table Section */}
        <Card className="w-full border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden all-workspaces-section">
          <CardHeader className="bg-slate-50 px-6 py-5 border-b border-slate-200/50">
            <div className="w-full flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-semibold text-slate-900">
                  All Workspaces
                </CardTitle>
                <CardDescription className="text-slate-600 mt-1 text-[0.925rem]">
                  Manage and organize your workspaces
                </CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <CreateEditWorkspaceDialog
                  isCollapsed={false}
                  workspace={null}
                  onClose={() => {}}
                  className="bg-violet-600 text-white hover:bg-violet-700"
                />
                <div className="flex items-center rounded-lg border border-slate-200 p-1">
                  <Button
                    variant={viewType === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-lg"
                    onClick={() => setViewType("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewType === "list" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-lg"
                    onClick={() => setViewType("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            {viewType === "list" && (
              <TableComponent
                memoizedWorkspace={memoizedWorkspace}
                handleWorkspaceClick={handleWorkspaceClick}
              />
            )}

            {viewType === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                {memoizedWorkspace?.map((space) => (
                  <GridComponent
                    key={space.id}
                    space={space}
                    handleWorkspaceClick={handleWorkspaceClick}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default WorkspaceSection;

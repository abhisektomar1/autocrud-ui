/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { create } from "zustand";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table2, Sparkles, Command, ArrowRight } from "lucide-react";
import { useSearchSpaces } from "@/queries/space";
import { WorkspaceItem } from "@/types/workspace";
import { formatDisplayDate } from "@/utils/string";
import { useNavigate } from "react-router-dom";
import { useActiveStore } from "@/store/useSelected";
import CreateEditWorkspaceDialog from "../../component/modals/CreateWorkspace";
import "./GetStarted.css"; // Create this file for font definitions
import { motion } from "framer-motion";
import WorkspaceSection from "./WorkspaceSection";
// import { QuickActionCard } from "./QuickActionCard";
import LandingSkeletoon from "@/components/skeletons/LandingSkeletoon";
import { useSearch } from "@/context/SearchContext";
import CreateEditTableSpaceDialog from "@/component/modals/CreateNewTable";

interface Store {
  workspaces: Workspace[];
  addWorkspace: (workspace: Workspace) => void;
  deleteWorkspace: (id: string) => void;
}

interface Workspace {
  id: string;
  name: string;
  lastUpdated: Date;
}

export const useWorkspaceStore = create<Store>((set) => ({
  workspaces: [
    {
      id: Date.now().toString(),
      name: "Teja AutoCRUD",
      lastUpdated: new Date(),
    },
  ],
  addWorkspace: (workspace) =>
    set((state) => ({ workspaces: [...state.workspaces, workspace] })),
  deleteWorkspace: (id) =>
    set((state) => ({
      workspaces: state.workspaces.filter((w) => w.id !== id),
    })),
}));

export default function GettingStartedPage() {
  const { data: workspace, isLoading } = useSearchSpaces("", 100);
  const [sortColumn, setSortColumn] = useState<"name" | "lastUpdated">(
    "lastUpdated"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isCollapsed] = useState(false);
  const [tableIsCollapsed] = useState(false);

  const [viewType, setViewType] = useState<"list" | "grid">("grid");

  const { searchText } = useSearch();

  const memoizedWorkspace: WorkspaceItem[] = useMemo(() => {
    if (!workspace?.data) return [];

    let filteredData = [...workspace.data];

    // Apply search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          (item.description &&
            item.description.toLowerCase().includes(searchLower))
      );
    }
    // Apply sorting
    return filteredData.sort((a, b) => {
      if (sortColumn === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        const dateA = new Date(a.updatedAt ?? a.createdAt).getTime();
        const dateB = new Date(b.updatedAt ?? b.createdAt).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
    });
  }, [workspace, sortColumn, sortDirection, searchText]);
  const navigate = useNavigate();
  const { setActive } = useActiveStore();

  const handleViewAll = () => {
    setSortColumn("lastUpdated");
    setSortDirection("desc");

    const tableSection = document.querySelector(".all-workspaces-section");
    if (tableSection) {
      tableSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleWorkspaceClick = (id: string) => {
    setActive(id);
    navigate(`/space/${id}/table`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-body mx-auto">
      {/* New Heading Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container pt-4 px-10 text-start mx-auto"
      >
        <h2 className="text-4xl font-semibold text-slate-900 leading-tight tracking-tight mx-auto">
          Accelerate Your Workflow with
          <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent tracking-normal">
            AutoCRUD
          </span>
        </h2>
      </motion.div>

      {/* Split Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="container mx-auto py-6 px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Workspace Creation Section */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="lg:col-span-8 relative overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-violet-500 to-indigo-500 p-10 transform-gpu"
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Collaborative Workspaces
              </h2>
              <p className="text-violet-100 text-lg max-w-2xl mb-6">
                Streamline your workflow with powerful automation <br />
                tools and efficient records management.
              </p>
              <CreateEditWorkspaceDialog
                isCollapsed={isCollapsed}
                workspace={null}
                onClose={() => {}}
                className="text-violet-900 bg-white text-md hover:bg-violet-50 hover:shadow-sm transition-all duration-300 p-4 w-[200px]"
              />
            </div>
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 opacity-10">
              <Command className="h-40 w-40" />
            </div>
          </motion.div>

          {/* Table Creation Section */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            className="lg:col-span-4 relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-amber-400 to-yellow-500 p-10"
          >
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
                Jumpstart Your Data
              </h1>
              <p className="text-amber-800 text-lg max-w-2xl mb-6">
                Organize information effortlessly with smart tables that adapt
                to your workflow needs.
              </p>

              {/* REPLACING CREATE NEW TABLE BUTTON WITH DIALOG */}
              <CreateEditTableSpaceDialog
                tableIsCollapsed={tableIsCollapsed}
                table={null}
                onClose={() => {}}
                memoizedWorkSpace={memoizedWorkspace}
                className="text-amber-900  bg-white/90 hover:bg-amber-50 hover:shadow-lg transition-all duration-300 border-amber-200 p-4 w-[200px]"
              />
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-amber-300/20 to-transparent" />
            <div className="absolute -right-20 top-1/2 -translate-y-1/2">
              <Table2 className="h-64 w-64 text-amber-300/20" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="container mx-auto pt-16"
      >
        <Card className="w-full border-none shadow-none  bg-transparent mx-auto py-8 px-8">
          <CardHeader className="relative w-full px-0 py-0 flex justify-between items-center">
            <div className="w-full flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-slate-800">
                  Recent Workflows
                </CardTitle>
                <CardDescription className="text-slate-500 mt-1">
                  Your most recently updated workspaces
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={handleViewAll}
                className="text-sm group"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-0 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {isLoading ? (
                <LandingSkeletoon />
              ) : !workspace?.data || workspace.data.length === 0 ? (
                <Card className="col-span-full p-8 border border-dashed">
                  <div className="text-center">
                    <Sparkles className="h-12 w-12 mx-auto text-violet-400 mb-4" />
                    <h3 className="text-lg font-medium text-slate-800 mb-2">
                      No workflows yet
                    </h3>
                    <p className="text-slate-500 mb-4">
                      Create your first workflow to get started
                    </p>
                    <Button
                      onClick={() => navigate("/workflows/new")}
                      className="bg-violet-600 hover:bg-violet-700 text-white"
                    >
                      Create Workflow
                    </Button>
                  </div>
                </Card>
              ) : (
                workspace.data
                  .sort((a, b) => {
                    const dateA = new Date(
                      a.updatedAt ?? a.createdAt
                    ).getTime();
                    const dateB = new Date(
                      b.updatedAt ?? b.createdAt
                    ).getTime();
                    return dateB - dateA;
                  })
                  .slice(0, 4)
                  .map((flow) => (
                    <Card
                      key={flow.id}
                      className="relative group cursor-pointer hover:shadow-lg transition-all duration-300 border border-slate-200/70 hover:border-violet-200 bg-gradient-to-b from-white to-violet-50/50 hover:to-violet-50 overflow-hidden"
                      onClick={() => {
                        setActive(flow.id);
                        navigate(`/space/${flow.id}`);
                      }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400/30 to-purple-300/30" />
                      <CardHeader>
                        <CardTitle className="text-lg group-hover:text-violet-600 transition-colors bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                          {flow.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-4 font-[450]">
                          {flow.description || "No description provided"}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          Last updated:{" "}
                          {formatDisplayDate(flow.updatedAt ?? flow.createdAt)}
                        </p>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <WorkspaceSection
        memoizedWorkspace={memoizedWorkspace}
        handleWorkspaceClick={handleWorkspaceClick}
        viewType={viewType}
        setViewType={setViewType}
      />
    </div>
  );
}

import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import WorkspaceHeader from "@/pages/workspace/WorkspaceHeader";
import { useParams } from "react-router-dom";
import { useGetSpace } from "@/queries/space";
import { useActiveStore } from "@/store/useSelected";

const WorkspaceLayout: React.FC = () => {
  const { id } = useParams();
  const { data: spaceData, isLoading: isSpaceLoading } = useGetSpace(id ?? "");
  const { setActive } = useActiveStore();

  useEffect(() => {
    if (id) {
      setActive(id);
    }
  }, [id, setActive]);

  // Prevent layout shift by showing a skeleton or maintaining height
  const headerHeight = "h-[64px]"; // Adjust this value based on your header's height

  return (
    <div className="h-full w-full bg-white darkk:bg-gray-900 text-gray-900 darkk:text-white">
      <main className="container mx-auto">
        {/* First Header - Workspace Info with fixed height */}
        <div className={headerHeight}>
          {isSpaceLoading ? (
            <div className="animate-pulse bg-gray-200 h-full w-full rounded" />
          ) : (
            <WorkspaceHeader
              name={spaceData?.name ?? ""}
              description={spaceData?.description ?? ""}
            />
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default WorkspaceLayout;

import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

interface KanbanSkeletonProps {
  isViewSidebarOpen?: boolean;
}

const KanbanSkeleton = ({ isViewSidebarOpen = true }: KanbanSkeletonProps) => {
  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-170px)]">
      {/* Sidebar Skeleton */}
      {isViewSidebarOpen && (
        <div className="fixed left-0 w-[250px] h-full border-r bg-gray-50/30 p-4 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
          {/* Sidebar Items */}
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="p-3 bg-white rounded-lg shadow-sm space-y-2 border-b border-gray-200">
              <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 overflow-auto transition-all duration-300 ease-in-out",
          isViewSidebarOpen ? "ml-[250px]" : "ml-0"
        )}
      >
        <div className="p-6">
          {/* Header Skeleton */}
          <div className="mb-8 space-y-6 border-b border-gray-200 pb-6">
            <div className="flex items-center justify-between">
              <div className="w-48 h-8 bg-gray-200 rounded animate-pulse" />
              <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-6">
              <div className="w-44 h-9 bg-gray-200 rounded animate-pulse" />
              <div className="w-44 h-9 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Columns Skeleton */}
          <div className="flex gap-6 overflow-x-auto pb-6">
            {[1, 2, 3, 4].map((columnIndex) => (
              <div key={columnIndex} className="flex-shrink-0 w-[280px] bg-gray-50/50 rounded-lg">
                {/* Column Header */}
                <div className="px-4 py-3 rounded-t-lg border-b border-gray-200 bg-gray-100/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-28 h-5 bg-gray-200 rounded animate-pulse" />
                      <div className="w-10 h-5 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="w-7 h-7 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>

                {/* Column Items */}
                <div className="p-3 space-y-3">
                  {[1, 2, 3].map((itemIndex) => (
                    <Card key={itemIndex} className="p-3 border border-gray-200 hover:shadow-sm transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse flex-shrink-0 mt-0.5" />
                        <div className="space-y-2.5 min-w-0 flex-1">
                          <div className="w-full h-5 bg-gray-200 rounded animate-pulse" />
                          <div className="w-4/5 h-4 bg-gray-200 rounded animate-pulse" />
                          <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanSkeleton; 
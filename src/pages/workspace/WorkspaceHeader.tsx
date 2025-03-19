import { useState, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { VStack } from "@/component/utils";
import DeleteConfirmationDialog from "@/component/DeleteDialog";
import { cn } from "@/lib/utils";
import UserProfile from "./UserProfile";

interface WorkspaceHeaderProps {
  name: string;
  description: string;
  isLoading?: boolean;
}

// Extract navigation items to a constant
const NAV_ITEMS = [
  { path: "table", label: "Table" },
  { path: "flow", label: "Flow" },
  { path: "settings", label: "Settings" },
];

function WorkspaceHeader({
  name,
  description,
  isLoading = false,
}: WorkspaceHeaderProps) {
  const { id } = useParams();
  const [selectedColor] = useState("bg-red-500");

  // Memoize color contrast function
  const getContrastTextColor = useMemo(
    () => (bgColor: string) => {
      return bgColor.includes("white") ||
        bgColor.includes("-100") ||
        bgColor.includes("-200") ||
        bgColor.includes("-300")
        ? "text-gray-800"
        : "text-white";
    },
    []
  );

  const location = useLocation();
  const pathname = location.pathname.split("/")[3];

  // Extract loading skeleton to a component
  const LoadingSkeleton = () => (
    <div className="space-y-2">
      <div
        className={cn(
          "h-6 rounded-full animate-pulse w-3/4",
          selectedColor.replace(/-\d+$/, "-400")
        )}
      />
      <div
        className={cn(
          "h-4 rounded-full animate-pulse w-1/2",
          selectedColor.replace(/-\d+$/, "-400")
        )}
      />
    </div>
  );

  // Extract navigation items rendering
  const renderNavItems = () => (
    <div className="flex items-center space-x-2 p-2">
      {NAV_ITEMS.map(({ path, label }) => (
        <a
          key={path}
          href={`/space/${id}/${path}`}
          className={cn(
            "px-4 py-2 text-xs font-medium hover:bg-white/10 transition-all rounded-full",
            pathname?.toLowerCase() === path?.toLowerCase()
              ? "bg-gray-300 text-gray-800 hover:text-gray-800 shadow-inner"
              : cn(
                  "hover:bg-gray-100 hover:text-gray-800",
                  getContrastTextColor(selectedColor)
                )
          )}
        >
          {label}
        </a>
      ))}
    </div>
  );

  return (
    <div className={cn("transition-colors", selectedColor)}>
      {/* Top Header */}
      <div className="px-4 py-2 flex justify-between items-center h-16">
        <div className="flex items-center space-x-8 ">
          <div className="flex flex-row items-center space-x-2">
            <a href="/">
              <img src="/vite.svg" className="p-2 w-10 h-10" />
            </a>
            <div
              className={cn(
                getContrastTextColor(selectedColor),
                "w-48 h-16 mt-4"
              )}
            >
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <VStack>
                  <span className="text-xl font-bold">{name}</span>
                  <span className="text-xs font-normal">{description}</span>
                </VStack>
              )}
            </div>
          </div>

          {renderNavItems()}
        </div>

        <div className="flex items-center space-x-2">
          <UserProfile />
        </div>
      </div>
      <DeleteConfirmationDialog id="deleteWorkspace" />
    </div>
  );
}

export default WorkspaceHeader;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkspaceItem } from "@/types/workspace";
import { formatDisplayDate } from "@/utils/string";
import "./GetStarted.css"; // Create this file for font definitions

const GridComponent = ({
  space,
  handleWorkspaceClick,
}: {
  space: WorkspaceItem;
  handleWorkspaceClick: (id: string) => void;
}) => {
  return (
    <Card
      key={space.id}
      className="relative group cursor-pointer transition-all duration-200 border border-slate-200/70 hover:border-violet-200 bg-gradient-to-b from-white to-violet-50/50 overflow-hidden transform-gpu hover:scale-[1.02] hover:shadow-xl will-change-transform hover:bg-gradient-to-b hover:from-white hover:to-violet-100/30"
      onClick={() => handleWorkspaceClick(space.id)}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-full transition-[opacity,transform] duration-300 group-hover:translate-x-full group-hover:opacity-30">
          <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12" />
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400/30 to-purple-300/30 will-change-transform group-hover:from-violet-500/40 group-hover:to-purple-400/40 transition-all duration-300" />

      <CardHeader>
        <CardTitle className="text-lg group-hover:text-violet-600 transition-colors bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          {space.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600 line-clamp-2 font-[450]">
          {space.description || "No description provided"}
        </p>
        <p className="text-xs text-slate-500 mt-3 font-medium">
          Last updated: {formatDisplayDate(space.updatedAt ?? space.createdAt)}
        </p>
      </CardContent>
    </Card>
  );
};

export default GridComponent;

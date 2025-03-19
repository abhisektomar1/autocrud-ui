import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDisplayDate } from "@/utils/string";

import "./GetStarted.css"; // Create this file for font definitions
import { WorkspaceItem } from "@/types/workspace";

const TableComponent = ({
  memoizedWorkspace,
  handleWorkspaceClick,
}: {
  memoizedWorkspace: WorkspaceItem[];
  handleWorkspaceClick: any;
}) => {
  return (
    <Table className="border-collapse transform-gpu">
      <TableHeader className="bg-slate-50">
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-6 py-4 font-semibold text-slate-700 text-sm border-b border-slate-200/50">
            Name
          </TableHead>
          <TableHead className="px-6 py-4 font-semibold text-slate-700 text-sm border-b border-slate-200/50">
            Description
          </TableHead>
          <TableHead className="px-6 py-4 font-semibold text-slate-700 text-sm border-b border-slate-200/50">
            Last Updated
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {memoizedWorkspace?.map((space: WorkspaceItem) => (
          <TableRow
            key={space.id}
            className="border-b border-slate-200/50 hover:bg-violet-50/30 transition-colors cursor-pointer will-change-transform"
            onClick={() => handleWorkspaceClick(space.id)}
          >
            <TableCell className="px-6 py-4 font-medium text-slate-800 group-hover:text-violet-700">
              {space.name}
            </TableCell>
            <TableCell className="px-6 py-4 text-slate-600 max-w-[300px] truncate font-[450]">
              {space.description || "No description provided"}
            </TableCell>
            <TableCell className="px-6 py-4 text-slate-500">
              {formatDisplayDate(space.updatedAt ?? space.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableComponent;

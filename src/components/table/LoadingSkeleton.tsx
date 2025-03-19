import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export const LoadingSkeleton = () => (
    <div className="overflow-x-auto bg-neutral-100">
      <Table className="w-full border bg-white">
        <TableHeader className="border-r bg-neutral-100">
          <TableRow className="text-left text-xs font-medium text-black hover:bg-white/100">
            <TableHead className="w-14 border-r text-center">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </TableHead>
            {[1, 2, 3, 4].map((i) => (
              <TableHead key={i} className="border-r p-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((row) => (
            <TableRow key={row} className="border">
              <TableCell className="w-14 border-r text-center">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </TableCell>
              {[1, 2, 3, 4].map((cell) => (
                <TableCell key={cell} className="h-10 border">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
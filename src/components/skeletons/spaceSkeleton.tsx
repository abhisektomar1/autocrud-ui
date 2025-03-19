import { Card, CardContent, CardHeader } from "../ui/card";

function SpaceSkeleton() {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="h-full overflow-hidden border border-gray-200">
          <CardHeader className="bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </CardHeader>
          <CardContent className="p-4 bg-gray-50">
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export default SpaceSkeleton;

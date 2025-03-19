
const FlowSkeleton = () => {
  return (
    <div className="w-full h-full bg-gray-50 relative">
      {/* Top Panel Controls Skeleton */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-8 w-20 bg-white rounded-md shadow animate-pulse"
          />
        ))}
      </div>

      {/* Left Add Node Button Skeleton */}
      <div className="absolute top-4 left-4 z-10">
        <div className="h-12 w-12 bg-white rounded-full shadow animate-pulse" />
      </div>

      {/* Flow Nodes Skeleton */}
      <div className="w-full h-full p-8 flex items-center justify-center">
        <div className="relative w-[600px] h-[300px]">
          {/* Trigger Node */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
            <div className="w-48 h-16 bg-white rounded-lg shadow-md animate-pulse" />
          </div>

          {/* Connection Line */}
          <div className="absolute left-52 top-1/2 transform -translate-y-1/2">
            <div className="w-32 h-1 bg-gray-200 animate-pulse" />
          </div>

          {/* Action Node */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <div className="w-48 h-16 bg-white rounded-lg shadow-md animate-pulse" />
          </div>
        </div>
      </div>

      {/* Bottom Controls Skeleton */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-8 w-8 bg-white rounded-md shadow animate-pulse"
          />
        ))}
      </div>

      {/* Mini-map Skeleton */}
      <div className="absolute bottom-4 right-4">
        <div className="w-32 h-24 bg-white rounded-md shadow animate-pulse" />
      </div>
    </div>
  );
};

export default FlowSkeleton;

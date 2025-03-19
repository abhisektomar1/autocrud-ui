import { useEffect, useState } from "react";
import { GroupIcon } from "lucide-react";

const TeamPage = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div
          className={`transition-all duration-1000 ease-out transform ${
            animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <GroupIcon className="w-16 h-16 text-purple-600 mx-auto mb-6 animate-pulse" />
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
            Teams & Setting Coming Soon
          </h1>
          <p className="text-lg text-gray-600 text-center mb-8">
            We're working hard to bring you an amazing new feature. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;

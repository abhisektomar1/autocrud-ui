import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { ArrowLeft, Mail, Home } from "lucide-react";

export default function Page404() {
  const navigate = useNavigate();
  const { role } = useAuthStore();
  const isAdmin = role?.toUpperCase() === "ADMIN";
 
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full relative z-10">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

        {/* Content Container */}
        <div className="relative backdrop-blur-sm bg-white/30 rounded-2xl p-10 shadow-2xl shadow-indigo-500/10">
          {/* 404 Text with Gradient */}
          <div className="relative mb-10">
            <h1 className="text-[120px] font-bold text-center bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent leading-none">
              404
            </h1>
            <div className="absolute inset-0 blur-3xl bg-indigo-600/10 -z-10" />
          </div>

          {/* Content */}
          <div className="text-center space-y-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-gray-900">Page not found</h2>
            <p className="text-base text-gray-600">
              The page you're looking for doesn't exist or has been moved. Let's
              get you back on track.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <button
                onClick={() => navigate(isAdmin ? "/user" : "/start")}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-lg 
                         bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 
                         transition-all duration-200 group hover:shadow-lg hover:shadow-indigo-500/30"
              >
                <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                Back to Home
              </button>

              <button
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-lg 
                         border border-gray-300 text-gray-700 text-sm font-medium 
                         hover:bg-white hover:border-indigo-600 hover:text-indigo-600
                         transition-all duration-200 group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-[-4px] transition-transform duration-200" />
                Go Back
              </button>
            </div>

            {/* Support Link */}
            <div className="pt-6">
              <a
                href="mailto:support@autocrud.com"
                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 
                         font-medium group bg-white/50 px-4 py-2 rounded-lg
                         hover:bg-white transition-all duration-200"
              >
                <Mail className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

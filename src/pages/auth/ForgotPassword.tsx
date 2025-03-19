import { useState } from "react";
import { useForgotPassword } from "../../queries/auth";
import { toast } from "react-toastify";
import { HStack, VStack } from "../../component/utils";
import { ArrowLeft, Mail, Rocket, Cog, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomHelmet from "../../component/CustomHelmet";
import { Spinner } from "../../components/ui/Spinner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { mutate: forgotPassword } = useForgotPassword();
  const navigate = useNavigate();

  function handleForgotPassword() {
    setLoading(true);
    forgotPassword(email, {
      onSuccess() {
        toast("Email sent for the registered mail", {
          type: "success",
          autoClose: 2000,
        });
        setLoading(false);
      },
      onError() {
        toast.error("Failed to send reset email. Please try again.");
        setLoading(false);
      },
    });
  }

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <CustomHelmet
          title="Forgot Password - AutoCRUD"
          description="Reset your AutoCRUD password"
          keywords="AutoCRUD, forgot password, reset password"
        />
        <div className="flex w-1/2 flex-col items-center justify-center px-4 py-8 sm:px-6 lg:flex-none lg:px-20 xl:px-40">
          <VStack className="items-start">
            <HStack className="items-start space-x-3 pb-4">
              <img
                className="h-10 w-auto drop-shadow-lg transform hover:scale-105 transition-transform"
                src="/vite.svg"
                alt="Autocrud"
              />
              <p className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-2xl font-bold text-transparent">
                AutoCRUD
              </p>
            </HStack>
            <div className="w-full max-w-sm space-y-8 rounded-2xl bg-white/80 backdrop-blur-lg p-8 pb-8 pt-6 shadow-xl lg:w-96">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Forgot Password
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      placeholder="Enter your email"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full rounded-lg border-0 py-3 pl-11 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary transition-all duration-200 hover:ring-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="flex w-full justify-center rounded-lg bg-gradient-to-r from-primary to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:from-primary/90 hover:to-indigo-700 transition-all duration-200 hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Spinner className="text-white" />
                        Sending reset link...
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </button>

                  <button
                    onClick={() => navigate("/login")}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </button>
                </div>
              </div>
            </div>
          </VStack>
        </div>

        <div className="relative hidden lg:block w-1/2">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-indigo-500/10 to-purple-500/10 animate-gradient-slow"></div>

          {/* Content container */}
          <div className="relative h-full flex flex-col items-center justify-center p-12">
            {/* Floating elements */}
            <div className="absolute top-20 right-20 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl animate-float"></div>

            {/* Main content */}
            <div className="text-center space-y-6 max-w-xl">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                Reset Your Password
              </h1>
              <p className="text-xl text-gray-600">
                Don't worry, we'll help you get back into your account
              </p>

              {/* Feature list */}
              <div className="grid grid-cols-2 gap-6 mt-12">
                {[
                  {
                    title: "Secure Reset",
                    desc: "Safe password recovery",
                    icon: <Rocket className="w-6 h-6 text-primary mb-2" />,
                  },
                  {
                    title: "Quick Process",
                    desc: "Reset in minutes",
                    icon: <Cog className="w-6 h-6 text-primary mb-2" />,
                  },
                  {
                    title: "Email Link",
                    desc: "Check your inbox",
                    icon: <Clock className="w-6 h-6 text-primary mb-2" />,
                  },
                  {
                    title: "24/7 Support",
                    desc: "We're here to help",
                    icon: <CheckCircle className="w-6 h-6 text-primary mb-2" />,
                  },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <HStack className="items-center gap-4">
                      <p className="text-primary">{feature.icon}</p>
                      <VStack className="items-start">
                        <h3 className="font-semibold text-gray-800">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600">{feature.desc}</p>
                      </VStack>
                    </HStack>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

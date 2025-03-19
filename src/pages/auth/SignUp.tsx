import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSignUp } from "../../queries/auth";
import { SignUpDetailsModel } from "../../types/auth";
import { initiateGitHubLogin } from "../../utils/githubAuth";
import { HStack, VStack } from "../../component/utils";
import { Lock, Mail, Rocket, Cog, Clock, CheckCircle } from "lucide-react";
import CustomHelmet from "../../component/CustomHelmet";
import { Spinner } from "../../components/ui/Spinner";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { mutate: signUp } = useSignUp();

  async function handleGitHubSignUp() {
    try {
      await initiateGitHubLogin();
      toast.success("Redirecting to GitHub...");
    } catch (error) {
      console.error("GitHub OAuth Error:", error);
      toast.error("GitHub signup failed. Please try again.");
    }
  }

  async function handleSignUp() {
    setLoading(true);

    const signUpData: SignUpDetailsModel = {
      email,
      password,
      name: email.split("@")[0],
      clientId: crypto.randomUUID(),
      user_metadata: {
        username: email.split("@")[0],
      },
    };

    signUp(signUpData, {
      onSuccess: () => {
        toast.success(
          "Account created successfully! Please check your email to verify your account.",
          {
            autoClose: 2000,
          }
        );
        setLoading(false);
        navigate("/login");
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message ||
            "Failed to create account. Please try again."
        );
        setLoading(false);
      },
    });
  }

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <CustomHelmet
          title="Sign Up - AutoCRUD"
          description="Create your AutoCRUD account"
          keywords="AutoCRUD, signup, register, automation"
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
                  Sign up
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Create your account to get started
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
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

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        type={showPassword ? "text" : "password"}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="block w-full rounded-lg border-0 py-3 pl-11 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary transition-all duration-200 hover:ring-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="show-password"
                    name="show-password"
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary transition-colors duration-200"
                  />
                  <label
                    htmlFor="show-password"
                    className="ml-3 text-sm text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                  >
                    Show Password
                  </label>
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    onClick={handleSignUp}
                    disabled={loading}
                    className="flex w-full justify-center rounded-lg bg-gradient-to-r from-primary to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:from-primary/90 hover:to-indigo-700 transition-all duration-200 hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Spinner className="text-white" />
                        Creating account...
                      </>
                    ) : (
                      "Create account"
                    )}
                  </button>

                  <button
                    onClick={handleGitHubSignUp}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Continue with GitHub
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <span
                      onClick={() => navigate("/login")}
                      className="font-semibold text-primary hover:text-primary/80 cursor-pointer transition-colors"
                    >
                      Sign in
                    </span>
                  </p>
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
                Join AutoCRUD
              </h1>
              <p className="text-xl text-gray-600">
                Start automating your development workflow today
              </p>

              {/* Feature list */}
              <div className="grid grid-cols-2 gap-6 mt-12">
                {[
                  {
                    title: "Quick Setup",
                    desc: "Get started in minutes",
                    icon: <Rocket className="w-6 h-6 text-primary mb-2" />,
                  },
                  {
                    title: "Auto Generation",
                    desc: "Generate CRUD automatically",
                    icon: <Cog className="w-6 h-6 text-primary mb-2" />,
                  },
                  {
                    title: "Time Saving",
                    desc: "Focus on core business logic",
                    icon: <Clock className="w-6 h-6 text-primary mb-2" />,
                  },
                  {
                    title: "Best Practices",
                    desc: "Follow industry standards",
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

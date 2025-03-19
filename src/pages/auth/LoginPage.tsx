import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSignIn } from "../../queries/auth";
import { SignInDetailsModel } from "../../types/auth";
import { useAuthStore } from "../../store/useAuthStore";
import { Lock, Mail, Rocket, Cog, Clock, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import CustomHelmet from "../../component/CustomHelmet";
// import { signInWithGitHub } from "../../utils/supabase";
import { initiateGitHubLogin } from "../../utils/githubAuth";
import { Spinner } from "../../components/ui/Spinner";

export default function LoginPage() {
  const { id, key } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [email, setEmail] = useState(id ?? "");
  //nikhilgmudakavi@gmail.com
  const [password, setPassword] = useState(key ?? "");
  //Passme@1

  useEffect(() => {
    const id = searchParams.get("id");
    const key = searchParams.get("key");
    if (id) {
      // Decode the email address properly
      const decodedEmail = decodeURIComponent(id).replace(" ", "+");
      setEmail(decodedEmail);
    }

    if (key) setPassword(key);

    // Remove id and key from URL
    if (id || key) {
      searchParams.delete("id");
      searchParams.delete("key");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams]);

  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const navigate = useNavigate();
  const { mutate: login } = useSignIn();
  const { setAuth } = useAuthStore();
  // const length = 3;
  // const [activeIndex, setActiveIndex] = useState(0);
  let count = 0;
  useEffect(() => {
    //timer to change the login image on right side
    const intervalId = setInterval(() => {
      count++;
      // setActiveIndex(count % length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [count]);

  // const imageUrl = loginPageImageUrl;
  async function handleGitHubLogin() {
    try {
      setGithubLoading(true);
      await initiateGitHubLogin();
      toast.success("Redirecting to GitHub...");
    } catch (error) {
      console.error("GitHub OAuth Error:", error);
      toast.error("GitHub login failed. Please try again.");
    } finally {
      setGithubLoading(false);
    }
  }

  async function handleLogin() {
    setLoginLoading(true);
    const loginDto: SignInDetailsModel = { email, password };

    login(loginDto, {
      onSuccess: (data) => {
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;

        setAuth({
          accessToken: data.token_type + " " + accessToken,
          refreshToken: refreshToken,
          isAuthenticated: data.user.email,
          email: data.user.email,
          id: data.user.id,
          role: data.user.role,
        });
        setEmail("");
        setPassword("");
        toast("Logged in successfully!", {
          type: "success",
          autoClose: 2000,
        });
        navigate("/start");
      },
      onError: (data: any) => {
       
        toast(data.response.data.error, {
          type: "error",
          autoClose: 2000,
        });
        setLoginLoading(false);
      },
    });
  }

  return (
    <>
    <div className="h-screen bg-white relative overflow-hidden">
      <CustomHelmet
        title="Login - AutoCRUD"
        description="Automate your tasks, hassle-free"
        keywords="AutoCRUD, Automate, tasks, activity"
      />

      {/* Bottom Illustrations */}
      <div className="absolute left-10 top-10 h-1/3 w-1/6 opacity-60">
        <div className="h-full w-full bg-[url('/top1.png')] bg-contain bg-left bg-no-repeat" />
      </div>

      <div className="absolute right-10 top-10 h-1/3 w-1/6 opacity-60">
        <div className="h-full w-full bg-[url('/top2.png')] bg-contain bg-left bg-no-repeat" />
      </div>
      <div className="absolute left-10 bottom-10 h-1/3 w-1/6 opacity-60">
        <div className="h-full w-full bg-[url('/right.svg')] bg-contain bg-left bg-no-repeat" />
      </div>
      <div className="absolute right-0 bottom-0 h-1/3 w-1/6 opacity-60">
        <div className="h-full w-full bg-[url('/right1.svg')] bg-contain bg-right bg-no-repeat" />
      </div>

      {/* Main Content */}
      <div className="relative mx-auto flex min-h-screen max-w-screen-xl flex-col items-center justify-center px-4">
        {/* Logo & Branding */}
        <div className="mb-8 flex items-center space-x-3">
          <img
            className="h-12 w-auto transform drop-shadow-lg transition-transform hover:scale-105"
            src="/vite.svg"
            alt="Autocrud"
          />
          <h1 className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
            AutoCRUD
          </h1>
        </div>

        {/* Login Card with Side Features */}
        <div className="flex items-stretch gap-8 w-full max-w-6xl">
          {/* Left Features */}
          <div className="w-1/4 space-y-6 mt-16">
            {[
            {
              title: "Quick Setup",
              desc: "Get started in minutes",
              icon: <Rocket className="w-6 h-6 text-primary" />,
            },
            {
              title: "Auto Generation",
              desc: "Generate CRUD automatically",
              icon: <Cog className="w-6 h-6 text-primary" />,
            },
            {
              title: "Time Saving",
              desc: "Focus on core business logic",
              icon: <Clock className="w-6 h-6 text-primary" />,
            },
            {
              title: "Best Practices",
              desc: "Follow industry standards",
              icon: <CheckCircle className="w-6 h-6 text-primary" />,
            },
          ]?.slice(0, 2).map((feature, i) => (
              <div
                key={i}
                className="group rounded-2xl bg-transparent p-6  transition-all duration-300 hover:-translate-y-1 border border-white/30"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 transform transition-transform group-hover:scale-125">
                    {feature?.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">{feature?.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{feature?.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Login Card */}
          <div className="flex-1 max-w-md space-y-8 rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-lg border border-white/30">
            <div className="text-center">
            <span
            className="text-2xl font-bold"
                  onClick={() => {
                    login(
                      {
                        email: "nikhilgmudakavi@gmail.com",
                        password: "Passme@1",
                      },
                      {
                        onSuccess: (data) => {
                          const accessToken = data.access_token;
                          const refreshToken = data.refresh_token;

                          setAuth({
                            accessToken: data.token_type + " " + accessToken,
                            refreshToken: refreshToken,
                            isAuthenticated: data.user.email,
                            email: data.user.email,
                            id: data.user.id,
                            role: data.user.role,
                          });
                          setEmail("");
                          setPassword("");
                          toast("Logged in successfully!", {
                            type: "success",
                            autoClose: 2000,
                          });
                          navigate("/start");
                        },
                        onError: (data: any) => {
                         
                          toast(data.response.data.error, {
                            type: "error",
                            autoClose: 2000,
                          });
                          setLoginLoading(false);
                        },
                      }
                    );
                  }}
                >
                  {" "}
                  Login to AutoCRUD
                </span>
              <p className="mt-2 text-sm text-gray-600">Please enter your details to access your account</p>
            </div>

            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative mt-1">
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

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div
                    onClick={() => navigate("/forgotPassword")}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </div>
                </div>
                <div className="relative mt-1">
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

              {/* Show Password Toggle */}
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
                  Show password
                </label>
              </div>

              {/* Login Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleLogin}
                  disabled={loginLoading || githubLoading}
                  className="flex w-full justify-center rounded-lg bg-gradient-to-r from-primary via-purple-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loginLoading ? (
                    <>
                      <Spinner className="text-white" />
                      <span className="ml-2">Signing in...</span>
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <button
                  onClick={handleGitHubLogin}
                  disabled={loginLoading || githubLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {githubLoading ? (
                    <>
                      <Spinner className="text-white" />
                      <span>Connecting to GitHub...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  className="font-semibold text-primary hover:text-primary/80 cursor-pointer transition-colors"
                >
                  Sign up
                </span>
              </p>
            </div>
          </div>

          {/* Right Features */}
          <div className="w-1/4 space-y-6 mt-16">
            {[
            {
              title: "Quick Setup",
              desc: "Get started in minutes",
              icon: <Rocket className="w-6 h-6 text-primary" />,
            },
            {
              title: "Auto Generation",
              desc: "Generate CRUD automatically",
              icon: <Cog className="w-6 h-6 text-primary" />,
            },
            {
              title: "Time Saving",
              desc: "Focus on core business logic",
              icon: <Clock className="w-6 h-6 text-primary" />,
            },
            {
              title: "Best Practices",
              desc: "Follow industry standards",
              icon: <CheckCircle className="w-6 h-6 text-primary" />,
            },
          ]?.slice(2).map((feature, i) => (
              <div
                key={i}
                className="group rounded-2xl bg-white/20 p-6  backdrop-blur-lg hover:bg-white/40 transition-all duration-300 hover:-translate-y-1 border border-white/30"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 transform transition-transform group-hover:scale-125">
                    {feature?.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">{feature?.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{feature?.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

     
      </div>
    </div>
    </>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResetPassword } from "../../queries/auth";
import { ResetPasswordDetailModel } from "../../types/auth";
import { toast } from "react-toastify";
import { HStack, VStack } from "../../component/utils";
import { Lock, ArrowLeft, Rocket, Cog, Clock, CheckCircle } from "lucide-react";
import CustomHelmet from "../../component/CustomHelmet";
import { Spinner } from "../../components/ui/Spinner";

export default function ChangePasswordPage() {
  const token = window.location.href.split("=");
  const jwt = token[1];
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { mutate: resetPassword } = useResetPassword();

  function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!jwt) {
      toast.error("Invalid reset link");
      return;
    }

    setLoading(true);
    const passwordDto: ResetPasswordDetailModel = {
      newPassword,
      jwt,
    };
    resetPassword(passwordDto, {
      onSuccess() {
        setNewPassword("");
        setConfirmPassword("");
        toast("Password changed successfully", {
          type: "success",
          autoClose: 2000,
        });
        navigate("/login");
      },
      onError() {
        toast.error("Failed to change password. Please try again.");
        setLoading(false);
      },
    });
  }

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <CustomHelmet
          title="Change Password - AutoCRUD"
          description="Change your AutoCRUD password"
          keywords="AutoCRUD, change password, reset password"
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
                  Change Password
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Enter your new password below
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="newpassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="newpassword"
                        name="newpassword"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        placeholder="Enter new password"
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="block w-full rounded-lg border-0 py-3 pl-11 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary transition-all duration-200 hover:ring-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmpassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="confirmpassword"
                        name="confirmpassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        placeholder="Confirm new password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="flex w-full justify-center rounded-lg bg-gradient-to-r from-primary to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:from-primary/90 hover:to-indigo-700 transition-all duration-200 hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Spinner className="text-white" />
                        Changing password...
                      </>
                    ) : (
                      "Change Password"
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
                Change Your Password
              </h1>
              <p className="text-xl text-gray-600">
                Create a strong password to secure your account
              </p>

              {/* Feature list */}
              <div className="grid grid-cols-2 gap-6 mt-12">
                {[
                  {
                    title: "Strong Security",
                    desc: "Keep your account safe",
                    icon: <Rocket className="w-6 h-6 text-primary mb-2" />,
                  },
                  {
                    title: "Easy Process",
                    desc: "Simple password update",
                    icon: <Cog className="w-6 h-6 text-primary mb-2" />,
                  },
                  {
                    title: "Quick Update",
                    desc: "Instant password change",
                    icon: <Clock className="w-6 h-6 text-primary mb-2" />,
                  },
                  {
                    title: "Secure Access",
                    desc: "Protected account",
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

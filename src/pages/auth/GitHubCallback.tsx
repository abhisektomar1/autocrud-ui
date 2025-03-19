import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../queries/api";

export default function GitHubCallback() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    async function handleOAuthCallback() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (!code) {
          toast.error("No authorization code found");
          navigate("/login");
          return;
        }

        const response = await api.post("/api/auth/github", { code });
        const { access_token, refresh_token, user } = response.data;

        setAuth({
          accessToken: `Bearer ${access_token}`,
          refreshToken: refresh_token,
          isAuthenticated: true,
          email: user.email,
          id: user.id,
          role: user.role,
          provider: "github"
        });

        toast.success("Successfully logged in with GitHub!");
        navigate("/start");
      } catch (error) {
        console.error("GitHub OAuth Error:", error);
        toast.error("Failed to authenticate with GitHub");
        navigate("/login");
      }
    }

    handleOAuthCallback();
  }, [navigate, setAuth]);

  return <div>Processing GitHub login...</div>;
}
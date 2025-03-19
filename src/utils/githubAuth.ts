const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_GITHUB_CALLBACK_URL;

export function initiateGitHubLogin() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'user:email',
  });

  window.location.href = `${GITHUB_AUTH_URL}?${params}`;
}
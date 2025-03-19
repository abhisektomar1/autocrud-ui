import { Navigate, useRoutes } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { LayoutMain } from "./pages/layout/LayoutMain";
import { lazy, Suspense } from "react";

const FlowSpacePage = lazy(() => import("./pages/workspace/FlowsData"));
const TableSpacePage = lazy(() => import("./pages/workspace/TableSpacePage"));
const SettingsPage = lazy(() => import("./pages/workspace/SettingsPage"));
const DynamicTable = lazy(() => import("./pages/workspace/Table"));
const Page404 = lazy(() => import("./pages/error/Page404"));
const DynamicKanbanBoard = lazy(
  () => import("./pages/kanban/DynamicKanbanBoard")
);
const AutomationPage = lazy(() => import("./pages/automation/AutomationPage"));
const GitHubCallback = lazy(() => import("./pages/auth/GitHubCallback"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const SignUpPage = lazy(() => import("./pages/auth/SignUp"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPassword"));
const ChangePasswordPage = lazy(() => import("./pages/auth/ChangePassword"));
const GetStartedPage = lazy(() => import("./pages/getStarted/GetStarted"));
const TeamPage = lazy(() => import("./component/comingsoon/TeamPage"));
const FormPage = lazy(() => import("./component/comingsoon/FormPage"));
const GalleryPage = lazy(() => import("./component/comingsoon/GalleryPage"));

// Simple fallback component
function LoadingFallback() {
  return <div className="p-4 text-muted-foreground">Loading...</div>;
}

export default function Router() {
  const { isAuthenticated } = useAuthStore();
  return useRoutes([
    {
      path: "/login",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <LoginPage />
        </Suspense>
      ),
    },
    {
      path: "/signup",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <SignUpPage />
        </Suspense>
      ),
    },
    {
      path: "/github/callback",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <GitHubCallback />
        </Suspense>
      ),
    },
    {
      path: "/forgotPassword",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <ForgotPasswordPage />
        </Suspense>
      ),
    },
    {
      path: "/changePassword",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <ChangePasswordPage />
        </Suspense>
      ),
    },
    {
      path: "/",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <Navigate to="/start" replace />
        </Suspense>
      ),
    },
    {
      path: "/",
      element: isAuthenticated ? (
        <LayoutMain />
      ) : (
        <Suspense fallback={<LoadingFallback />}>
          <Navigate to="/login" replace />
        </Suspense>
      ),
      children: [
        {
          path: "start",
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <GetStartedPage />
            </Suspense>
          ),
        },
        {
          path: "team",
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <TeamPage />
            </Suspense>
          ),
        },
        {
          path: "forms/:id",
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <FormPage />
            </Suspense>
          ),
        },
        {
          path: "gallery/:id",
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <GalleryPage />
            </Suspense>
          ),
        },
        // Workspace routes wrapped in WorkspaceLayout
        {
          path: "space/:id",
          children: [
            {
              path: "",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <Navigate to="table" replace />
                </Suspense>
              ),
            },
            {
              path: "table",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <TableSpacePage />
                </Suspense>
              ),
            },
            {
              path: "flow",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <FlowSpacePage />
                </Suspense>
              ),
            },
            {
              path: "table/:tableId",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <DynamicTable />
                </Suspense>
              ),
            },
            {
              path: "settings",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <SettingsPage />
                </Suspense>
              ),
            },
            {
              path: "table/:tableId/view/:viewId",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <DynamicKanbanBoard />
                </Suspense>
              ),
            },
            {
              path: "table/:tableId/grid/:viewId",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <DynamicTable />
                </Suspense>
              ),
            },
            {
              path: "flow/:flowId",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <AutomationPage />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
    {
      path: "/404",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <Page404 />
        </Suspense>
      ),
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { CircleUser, Grid, Image, Inbox, Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Nav } from "./NavLayout";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "@/layout/footer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo } from "react";
import { queryClient } from "@/queries/client";
import { useAuthStore } from "@/store/useAuthStore";
import { useSignOut } from "@/queries/auth";
import { useMultipleSpaces, useSearchSpaces } from "@/queries/space";
import CreateEditWorkspaceDialog from "../../component/modals/CreateWorkspace";
import { useActiveStore } from "@/store/useSelected";
import CreateEditAutomationDialog from "../../component/modals/CreateAutomation";
import { useMediaQuery } from "react-responsive";
import { useMultipleSpacesForFlows } from "@/queries/flow";

// interface Workspace {
//   id: string;
//   name: string;
// }

interface MultipleSpace {
  space: string;
  id: string;
  name: string;
}

// interface Flow {
//   title: string;
//   id: string;
//   label: string;
//   url: string;
//   icon: LucideIcon;
//   variant: "default" | "ghost";
//   children?: Flow[];
//   children?: Flow[];
// }

export function LayoutMain() {
  const navCollapsedSize = 4;
  // const [defaultLayout, setDefaultLayout] = React.useState([20, 32, 48]);
  // const [defaultCollapsed, setDefaultCollapsed] = React.useState(false);
  const defaultLayout = [20, 32, 48];
  const defaultCollapsed = false;
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const { active, setActive } = useActiveStore();
  const navigate = useNavigate();
  const { clear } = useAuthStore();
  const { mutate: signOut } = useSignOut();
  const isMobile = useMediaQuery({ maxWidth: 640 });

  const location = useLocation();
  const isSpacePage = location.pathname.startsWith("/space/");

  function logout() {
    localStorage.clear();
    queryClient.clear();
    clear();
    signOut();
    navigate("/login");
  }
  const { data: workspace } = useSearchSpaces("", 100);

  const { data: multipleSpace, refetch: refetchMultipleSpace } =
    useMultipleSpaces(workspace?.data.map((ele) => ele.id) ?? []);

  const { data: multipleSpaceForFlows, refetch: refetchFlowMultipleSpace } =
    useMultipleSpacesForFlows(workspace?.data.map((ele) => ele.id) ?? []);

  React.useEffect(() => {
    if ((workspace?.data?.length ?? 0) > 0) refetchMultipleSpace();
  }, [workspace]);

  React.useEffect(() => {
    if ((workspace?.data?.length ?? 0) > 0) refetchFlowMultipleSpace();
  }, [workspace]);

  React.useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false);
    }
  }, [isMobile]);

  // if (isWorkspaceLoading || isMultipleSpacesLoading) {
  //   return <div>Loading...</div>; // Replace with a spinner
  // }

  const combinedWorkspace = useMemo(() => {
    if (!workspace?.data) return [];

    return workspace.data.map((data) => {
      // Get tables for this workspace
      const tables = (multipleSpace || [])
        .filter((ele: MultipleSpace) => ele.space === data.id)
        .map((data: MultipleSpace) => ({
          title: data.name,
          id: data.id,
          label: "",
          url: `space/${data.space}/table/${data.id}`,
          icon: Grid,
          variant: "ghost",
          type: "table",
        }));

      // Get flows for this workspace
      const flows = (multipleSpaceForFlows || [])
        .filter((ele: MultipleSpace) => ele.space === data.id)
        .map((data: MultipleSpace) => ({
          title: data.name,
          id: data.id,
          label: "",
          url: `space/${data.space}/flow/${data.id}`,
          icon: Grid,
          variant: "ghost",
          type: "flow",
        }));

      // Combine tables and flows into a single children array
      // const combinedChildren = [...tables, ...flows].sort((a, b) =>
      //   a.title.localeCompare(b.title)
      // );

      // Create grouped structure
      const children = [
        {
          title: "Tables",
          id: `${data.id}-tables`,
          label: "",
          icon: Grid,
          variant: "ghost",
          type: "group",
          children: tables,
        },
        {
          title: "Flows",
          id: `${data.id}-flows`,
          label: "",
          icon: Grid,
          variant: "ghost",
          type: "group",
          children: flows,
        },
      ];

      return {
        title: data.name,
        id: data.id,
        label: "",
        icon: Image,
        variant: "ghost",
        url: "space",
        children: children,
      };
    });
  }, [multipleSpace, multipleSpaceForFlows, workspace]);

  const { email } = useAuthStore();
  //const isLoading = isWorkspaceLoading || isMultipleSpacesLoading;
  return (
    <div className="bg-gray-100">
      <div className="bg-white h-screen mx-auto">
        <TooltipProvider delayDuration={0}>
          <ResizablePanelGroup
            direction="horizontal"
            // onLayout={(sizes: number[]) => {}}
            className="h-full  max-h-[800px] items-stretch"
          >
            {!isMobile && !isSpacePage && (
              <ResizablePanel
                defaultSize={defaultLayout[0]}
                collapsedSize={navCollapsedSize}
                collapsible={true}
                minSize={15}
                maxSize={16}
                onCollapse={() => setIsCollapsed(true)}
                onResize={() => setIsCollapsed(false)}
                className={cn(
                  isCollapsed &&
                    "min-w-[50px] transition-all duration-300 ease-in-out"
                )}
              >
                <div
                  className={cn(
                    "flex h-[52px] font-semibold items-center justify-start",
                    isCollapsed ? "h-[52px] px-2" : "px-2"
                  )}
                >
                  <img src="/vite.svg" className="p-2 w-10 h-10" />
                  {!isCollapsed && <p>AutoCRUD</p>}
                 
                </div>

                <Separator />

                <div className="h-[calc(100vh-52px)] overflow-y-auto overflow-x-hidden">
                  <Nav
                    isCollapsed={isCollapsed}
                    onClick={setActive}
                    active={active}
                    links={[
                      {
                        id: "team",
                        title: "Team & Settings",
                        url: "/team",
                        label: "128",
                        icon: Inbox,
                        variant: "default",
                      },
                    ]}
                  />
                  <CreateEditWorkspaceDialog
                    isCollapsed={isCollapsed}
                    workspace={null}
                    onClose={() => {
                      /* handle close */
                    }}
                  />

                  <Separator />
                  <Nav
                    isCollapsed={isCollapsed}
                    links={[
                      {
                        title: "Get Started",
                        id: "start",
                        label: "",
                        url: "start",
                        icon: Image,
                        variant: "ghost",
                      },
                      ...combinedWorkspace,
                    ]}
                    active={active}
                    onClick={setActive}
                  />
                  <CreateEditAutomationDialog
                    isCollapsed={isCollapsed}
                    automation={null}
                    onClose={() => {
                      /* handle close */
                    }}
                  />
                </div>
              </ResizablePanel>
            )}

            {/*DOUBLE TAP BAR TO RESET NAVBAR COLLAPSE*/}
            <ResizableHandle
              withHandle={!isMobile}
              className="relative flex items-center justify-center bg-border"
              onToggleNavbar={() => {
                setIsCollapsed((prev) => !prev);
              }}
              {...(!isMobile && {
                onTouchEnd: (e) => {
                  if (e.detail === 2) {
                    setIsCollapsed((prev) => !prev);
                  }
                },
              })}
            />
            {!isMobile && !isSpacePage && (
              <ResizableHandle
                withHandle={!isMobile}
                className="relative flex items-center justify-center bg-border"
                onToggleNavbar={() => {
                  setIsCollapsed((prev) => !prev);
                }}
                {...(!isMobile && {
                  onTouchEnd: (e) => {
                    if (e.detail === 2) {
                      setIsCollapsed((prev) => !prev);
                    }
                  },
                })}
              />
            )}
            <ResizablePanel
              defaultSize={isSpacePage ? 100 : defaultLayout[1]}
              minSize={30}
            >
              <div
                className={`flex-1 bg-white h-screen overflow-y-auto transition-all duration-300 ease-in-out`}
                id="outlet"
              >
                <div className="relative w-full min-h-screen bg-white">
                  <header
                    className={cn(
                      "sticky top-0 z-50 flex h-[53px] items-center gap-4 border-b bg-background px-4 md:px-6",
                      isSpacePage && "hidden"
                    )}
                  >
                    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                      <a
                        href="#"
                        className="text-foreground transition-colors hover:text-foreground"
                      >
                        Dashboard
                      </a>
                    </nav>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="shrink-0 md:hidden"
                        >
                          <Menu className="h-5 w-5" />
                          <span className="sr-only">
                            Toggle navigation menu
                          </span>
                          <span className="sr-only">
                            Toggle navigation menu
                          </span>
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left">
                        <div
                          className={cn(
                            "flex h-[52px] font-semibold items-center justify-start",
                            isCollapsed ? "h-[52px] px-2" : "px-2"
                          )}
                        >
                          <img src="/vite.svg" className="p-2 w-10 h-10" />
                          {!isCollapsed && <p>AutoCRUD</p>}
                             </div>

                        <Separator />
                        <div className="h-[calc(100vh-52px)] overflow-y-auto overflow-x-hidden scrollbar-hide  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
                          <Nav
                            isCollapsed={isCollapsed}
                            onClick={setActive}
                            active={active}
                            links={[
                              {
                                id: "team",
                                title: "Team & Settings",
                                url: "/team",
                                label: "128",
                                icon: Inbox,
                                variant: "default",
                              },
                            ]}
                          />
                          <CreateEditWorkspaceDialog
                            isCollapsed={isCollapsed}
                            workspace={null}
                            onClose={() => {
                              /* handle close */
                            }}
                          />

                          <Separator />
                          <Nav
                            isCollapsed={isCollapsed}
                            links={[
                              {
                                title: "Get Started",
                                id: "start",
                                label: "",
                                url: "start",
                                icon: Image,
                                variant: "ghost",
                              },
                              ...combinedWorkspace,
                            ]}
                            active={active}
                            onClick={setActive}
                          />
                        </div>
                      </SheetContent>
                    </Sheet>
                    <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                      <form className="ml-auto flex-1 sm:flex-initial">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search..."
                            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                          />
                        </div>
                      </form>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-full"
                          >
                            <CircleUser className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>
                            <div className="flex flex-col">
                              <p className="font-normal text-gray-600">
                                My Account
                              </p>
                              <p>{email}</p>
                            </div>
                          </DropdownMenuLabel>
                          {/* <DropdownMenuSeparator /> */}
                          {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
                          {/* <DropdownMenuItem>Support</DropdownMenuItem> */}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={logout}>
                            Logout
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </header>
                  <div className=" mx-auto w-full">
                    {/* <div className="h-screen mx-auto"> */}
                    <Outlet />
                  </div>

                  <div className="absolute bottom-0 w-full mt-6 ">
                    <Footer />
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TooltipProvider>
      </div>
    </div>
  );
}

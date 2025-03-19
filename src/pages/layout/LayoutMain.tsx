import * as React from "react";
import { Inbox, Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Nav } from "./NavLayout";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import Footer from "@/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateEditWorkspaceDialog from "../../component/modals/CreateWorkspace";
import { useActiveStore } from "@/store/useSelected";
import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";
import { useGetSpace } from "@/queries/space";
import WorkspaceHeader from "../workspace/WorkspaceHeader";
import { useSearch } from '@/context/SearchContext';
import UserProfile from "../workspace/UserProfile";

export function LayoutMain() {
  const defaultCollapsed = false;
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const { active, setActive } = useActiveStore();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const { id } = useParams();
  const location = useLocation();
  const { searchText, setSearchText } = useSearch();

  const { data: spaceData, isLoading: isSpaceLoading } = useGetSpace(id ?? "");

  useEffect(() => {
    if (id) {
      setActive(id);
    }
  }, [id, setActive]);

  const isSpacePage = location.pathname.startsWith("/space/");

  React.useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false);
    }
  }, [isMobile]);

  const handleSearchFocus = () => {
    if (location.pathname !== '/start') {
      navigate('/start');
    }
    setTimeout(() => {
      const workspacesSection = document.querySelector('.all-workspaces-section');
      if (workspacesSection) {
        workspacesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <div
      className={`flex-1 bg-white h-screen overflow-y-auto transition-all duration-300 ease-in-out  mx-auto`}
      id="outlet"
    >
      <div className="relative w-full min-h-screen bg-white">
        {isSpacePage ? (
          <WorkspaceHeader
            name={spaceData?.name ?? ""}
            description={spaceData?.description ?? ""}
        
            isLoading={isSpaceLoading}
          />
        ) : (
          <header
            className={cn(
              "sticky top-0 z-50 flex h-[53px] items-center gap-4 border-b bg-background px-4 md:px-6",
              isSpacePage && "hidden"
            )}
          >
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
              <div
                onClick={() => navigate("/start")}
                className={cn(
                  "flex h-[52px] font-semibold items-center justify-start",
                  isCollapsed ? "h-[52px] px-2" : "px-2"
                )}
              >
                <img src="/vite.svg" className="p-2 w-10 h-10" />
                {!isCollapsed && <p>AutoCRUD</p>}
              </div>
            </nav>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="px-0 py-2">
                <div
                  onClick={() => navigate("/start")}
                  className={cn(
                    "flex h-[52px] font-semibold items-center justify-start",
                    isCollapsed ? "h-[52px]" : ""
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
                </div>
              </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
              <form className="ml-auto flex-1 sm:flex-initial" onSubmit={(e) => e.preventDefault()}>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search your workspace..."
                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                    onFocus={handleSearchFocus}
                    onChange={handleSearchChange}
                    value={searchText}
                  />
                </div>
              </form>
             <UserProfile />
            </div>
          </header>
        )}

        <div className=" mx-auto w-full">
          {/* <div className="h-screen mx-auto"> */}
          <Outlet />
        </div>

        <div className="absolute bottom-0 w-full mt-6 ">
          <Footer />
        </div>
      </div>
    </div>
  );
}

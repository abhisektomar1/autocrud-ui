import React, { useState } from "react";
import { LucideIcon, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import AvatarCircle from "@/component/AvatarCircle";
import CreateTableDialog from "../../component/modals/CreateTable";
import CreateFlowDialog from "../../component/modals/CreateFlow";
// import AvatarCircle from "@/component/AvatarCircle";

interface NavLink {
  id: string;
  title: string;
  label?: string;
  icon: LucideIcon;
  url?: string;
  variant: string;
  type?: 'group' | 'table' | 'flow' | string;
  children?: NavLink[];
}

interface NavProps {
  isCollapsed: boolean;
  active: string;
  onClick: (id: string) => void;
  links: NavLink[];
}

interface NavItemProps {
  id: string;
  isCollapsed: boolean;
  active: string;
  onClick: (id: string) => void;
  link: NavLink;
  level?: number;
  openIds: string[];
  setOpenIds: React.Dispatch<React.SetStateAction<string[]>>;
}
const NavItem = ({
  id,
  link,
  isCollapsed,
  active,
  onClick,
  level = 0,
  openIds,
  setOpenIds,
}: NavItemProps) => {
  const navigate = useNavigate();
  const isOpen = openIds.includes(link.id);
  const [isCollapse, setIsCollapse] = useState(false);

  const handleClick = () => {
    if (link.children) {
      setOpenIds(prev => {
        if (isOpen) {
          return prev.filter(id => id !== link.id);
        } else {
          // Keep parent folders open when opening child folders
          if (link.type === 'group') {
            // If it's a group (Tables/Flows), keep the parent workspace open
            const parentId = id;
            if (!prev.includes(parentId)) {
              return [...prev, parentId, link.id];
            }
          }
          return [...prev, link.id];
        }
      });
    } else {
      if (link.url === "space") {
        const url = link.url + `/${id}`;
        navigate(url);
        onClick(link.id);
      } else {
        onClick(link.id);
        navigate(link?.url ?? "");
      }
    }
  };

  const renderContent = () => (
    <>
      <AvatarCircle name={link.title} backgroundColor={"#CACACA"} />
      {/* <link.icon className={cn("h-4 w-4", isCollapsed ? "" : "mr-2")} /> */}
      {!isCollapsed && (
        <>
          {link.title}
          {link.label && (
            <span
              className={cn(
                "ml-auto",
                link.variant === "default" && "text-background darkk:text-white"
              )}
            >
              {link.label}
            </span>
          )}
          {link.children &&
            (isOpen ? (
              <ChevronDown className="ml-auto h-4 w-4" />
            ) : (
              <ChevronRight className="ml-auto h-4 w-4" />
            ))}
        </>
      )}
    </>
  );


  return (
    <>
      {isCollapsed ? (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div
              onClick={handleClick}
              className={cn(
                buttonVariants({
                  variant: active === link.id ? "default" : "ghost",
                  size: "icon",
                }),
                "h-9 w-9",
                link.variant === "default" &&
                  "darkk:bg-muted darkk:text-muted-foreground darkk:hover:bg-muted darkk:hover:text-white"
              )}
            >
              {renderContent()}
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="flex items-center gap-4"
            style={{ zIndex: 9999 }}
          >
            {link.title}
            {link.label && (
              <span className="ml-auto text-muted-foreground">
                {link.label}
              </span>
            )}
            {link.children && (
              <div className="ml-2">
                <ChevronRight className="h-4 w-4" />
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      ) : (
        <div
          onClick={handleClick}
          className={cn(
            buttonVariants({
              variant: active === link.id ? "default" : "ghost",
              size: "sm",
            }),
            "w-full",
            link.variant === "default" &&
              "darkk:bg-muted darkk:text-white darkk:hover:bg-muted darkk:hover:text-white",
            "justify-start",
            level > 0 && "pl-6"
          )}
        >
          {renderContent()}
        </div>
      )}
      {isOpen && link.children && (
        <div className="flex-col items-start">
          {link.children.map((child) => (
            <NavItem
              key={child.id}
              id={link.id}
              link={child}
              isCollapsed={isCollapsed}
              active={active}
              onClick={onClick}
              level={level + 1}
              openIds={openIds}
              setOpenIds={setOpenIds}
            />
          ))}
          {!link.type && (
            <>
              <CreateTableDialog
                isCollapsed={isCollapse}
                table={null}
                workspaceId={id ?? ""}
                onClose={() => {
                  setIsCollapse(false);
                }}
              />
              <CreateFlowDialog
                isCollapsed={isCollapse}
                table={null}
                workspaceId={id ?? ""}
                onClose={() => {
                  setIsCollapse(false);
                }}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};
export function Nav({ links, isCollapsed, onClick, active }: NavProps) {
  const [openIds, setOpenIds] = useState<string[]>([]);

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2 cursor-pointer">
        {links.map((link) => (
          <NavItem
            key={link.id}
            link={link}
            isCollapsed={isCollapsed}
            active={active}
            onClick={onClick}
            id={link.id}
            openIds={openIds}
            setOpenIds={setOpenIds}
          />
        ))}
      </nav>
    </div>
  );
}
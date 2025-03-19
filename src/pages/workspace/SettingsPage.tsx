import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  KeyRound,
  Database,
  ChevronRight,
  ArrowLeft,
  Shield,
} from "lucide-react";
import GeneralSettings from "./settings/GeneralSettings";
import GlobalVariables from "./settings/GlobalVariables";
import ResourceSettings from "./settings/ResourceSettings";
import AccessSettings from "./settings/AccessSettings";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active,
  onClick,
}) => {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={`w-full text-black justify-start px-3 py-2 h-auto ${
        active ? "bg-secondary" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center w-full">
        <div className="mr-3">{icon}</div>
        <span>{label}</span>
        {active && <ChevronRight className="ml-auto h-4 w-4" />}
      </div>
    </Button>
  );
};

const SettingsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeView, setActiveView] = useState("general");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarItems = [
    {
      icon: <Settings className="h-4 w-4" />,
      label: "General",
      value: "general",
      component: <GeneralSettings />,
    },
    {
      icon: <KeyRound className="h-4 w-4" />,
      label: "Global Variables",
      value: "variables",
      component: <GlobalVariables spaceId={id || ""} />,
    },
    {
      icon: <Database className="h-4 w-4" />,
      label: "Resources",
      value: "resources",
      component: <ResourceSettings spaceId={id || ""} />,
    },
    {
      icon: <Shield className="h-4 w-4" />,
      label: "Access Management",
      value: "access-management",
      component: <AccessSettings  />,
    },
  ];

  const getPageTitle = () => {
    const activeItem = sidebarItems.find(item => item.value === activeView);
    return activeItem ? activeItem.label : "Settings";
  };

  const renderContent = () => {
    const activeItem = sidebarItems.find(item => item.value === activeView);
    return activeItem ? activeItem.component : sidebarItems[0].component;
  };

  return (
    <div className="container py-8 px-4">
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          className="flex items-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Settings className="h-4 w-4 mr-2" />
          {getPageTitle()}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } lg:block w-full lg:w-80 shrink-0`}
        >
          <Card className="p-4">
            <div className="mb-4 px-2">
              <h2 className="font-semibold text-lg">Settings</h2>
              <p className="text-sm text-muted-foreground">
                Manage your workspace settings
              </p>
            </div>
            <Separator className="my-2" />
            <div className="space-y-1 mt-4">
              {sidebarItems.map((item) => (
                <SidebarItem
                  key={item.value}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                  active={activeView === item.value}
                  onClick={() => {
                    setActiveView(item.value);
                    setIsMobileMenuOpen(false);
                  }}
                />
              ))}
            </div>
          </Card>
        </div>

        <div className="flex-1">
          <div className="bg-background pb-8">
            <div className="flex items-center justify-end mb-4 lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
            </div>

            <div>{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

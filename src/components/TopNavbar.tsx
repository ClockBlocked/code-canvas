import { PanelLeft, PanelRight, GitBranch, Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TopNavbarProps {
  onLeftSidebarToggle?: () => void;
  onRightSidebarToggle?: () => void;
}

export const TopNavbar = ({ 
  onLeftSidebarToggle, 
  onRightSidebarToggle 
}: TopNavbarProps) => {
  return (
    <header className="sticky top-0 z-50 h-14 border-b border-border bg-card">
      <div className="flex h-full items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={onLeftSidebarToggle}
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Left Sidebar</TooltipContent>
          </Tooltip>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
              <GitBranch className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-foreground">GitDev</span>
          </div>
        </div>

        {/* Center Section - Search (optional placeholder) */}
        <div className="hidden md:flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-64 justify-start text-muted-foreground gap-2"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="text-sm">Search or jump to...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              /
            </kbd>
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create New</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bell className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={onRightSidebarToggle}
              >
                <PanelRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Right Sidebar</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

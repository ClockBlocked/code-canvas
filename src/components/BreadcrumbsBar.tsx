import { ChevronRight, Home, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface BreadcrumbsBarProps {
  className?: string;
}

interface BreadcrumbItem {
  label: string;
  path: string;
  isDropdown?: boolean;
  dropdownItems?: { label: string; path: string }[];
}

export const BreadcrumbsBar = ({ className }: BreadcrumbsBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse current path into breadcrumb items
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    
    if (path === "/") {
      return [
        { label: "Repositories", path: "/", isDropdown: true, dropdownItems: [
          { label: "myRepo", path: "/repo/myRepo" },
          { label: "react-components", path: "/repo/react-components" },
          { label: "api-server", path: "/repo/api-server" },
        ]},
        { label: "myRepo", path: "/repo/myRepo" },
      ];
    }

    const segments = path.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Repositories", path: "/" }
    ];

    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        label: segment,
        path: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className={`h-10 border-b border-border bg-muted/30 px-4 flex items-center ${className || ""}`}>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <BreadcrumbItem key={item.path + index}>
              {index > 0 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-3.5 w-3.5" />
                </BreadcrumbSeparator>
              )}
              
              {item.isDropdown ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto py-0 px-1 gap-1 text-sm font-normal hover:text-primary"
                    >
                      <Home className="h-3.5 w-3.5" />
                      <span>{item.label}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {item.dropdownItems?.map((dropdownItem) => (
                      <DropdownMenuItem 
                        key={dropdownItem.path}
                        onClick={() => handleNavigate(dropdownItem.path)}
                      >
                        {dropdownItem.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage className="text-sm font-medium">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link 
                    to={item.path} 
                    className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                  >
                    {index === 0 && <Home className="h-3.5 w-3.5" />}
                    <span>{item.label}</span>
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

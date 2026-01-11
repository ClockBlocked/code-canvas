import { 
  FileCode, 
  Copy, 
  Download, 
  Upload, 
  Maximize2, 
  Minimize2, 
  WrapText, 
  Search, 
  Replace, 
  Undo2, 
  Redo2, 
  Settings, 
  Code2, 
  Eye, 
  GitBranch, 
  History, 
  Bookmark,
  MoreHorizontal,
  ChevronDown,
  File,
  Sun,
  Moon,
  Type,
  AlignLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface EditorHeaderProps {
  fileName: string;
  language: string;
  isFullscreen: boolean;
  isWrapped: boolean;
  isEditing: boolean;
  isDarkTheme: boolean;
  hasChanges: boolean;
  onCopy: () => void;
  onDownload: () => void;
  onUpload: () => void;
  onToggleFullscreen: () => void;
  onToggleWrap: () => void;
  onToggleSearch: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleEdit: () => void;
  onToggleTheme: () => void;
  onLanguageChange: (lang: string) => void;
  onFontSizeChange: (size: number) => void;
  fontSize: number;
}

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
];

export const EditorHeader = ({
  fileName,
  language,
  isFullscreen,
  isWrapped,
  isEditing,
  isDarkTheme,
  hasChanges,
  onCopy,
  onDownload,
  onUpload,
  onToggleFullscreen,
  onToggleWrap,
  onToggleSearch,
  onUndo,
  onRedo,
  onToggleEdit,
  onToggleTheme,
  onLanguageChange,
  onFontSizeChange,
  fontSize,
}: EditorHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      {/* Left Section - File Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm text-foreground">{fileName}</span>
          {hasChanges && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              Modified
            </Badge>
          )}
        </div>
        
        <Separator orientation="vertical" className="h-4" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              <Code2 className="h-3.5 w-3.5" />
              {languages.find(l => l.value === language)?.label || "Plain Text"}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {languages.map((lang) => (
              <DropdownMenuItem 
                key={lang.value} 
                onClick={() => onLanguageChange(lang.value)}
                className={language === lang.value ? "bg-accent" : ""}
              >
                {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center Section - Action Buttons */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={isEditing ? "secondary" : "ghost"} 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={onToggleEdit}
            >
              {isEditing ? <Code2 className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isEditing ? "View Mode" : "Edit Mode"}</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-4 mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onUndo}>
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onRedo}>
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-4 mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onToggleSearch}>
              <Search className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Search (Ctrl+F)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={isWrapped ? "secondary" : "ghost"} 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={onToggleWrap}
            >
              <WrapText className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Word Wrap</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-4 mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onCopy}>
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy Code</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onDownload}>
              <Download className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download File</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onUpload}>
              <Upload className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Upload File</TooltipContent>
        </Tooltip>
      </div>

      {/* Right Section - View Options */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onToggleTheme}>
              {isDarkTheme ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Theme</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Type className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onFontSizeChange(12)}>
              Small (12px)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFontSizeChange(14)}>
              Medium (14px)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFontSizeChange(16)}>
              Large (16px)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFontSizeChange(18)}>
              X-Large (18px)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onToggleFullscreen}>
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <GitBranch className="h-4 w-4 mr-2" />
              View Git Blame
            </DropdownMenuItem>
            <DropdownMenuItem>
              <History className="h-4 w-4 mr-2" />
              View History
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bookmark className="h-4 w-4 mr-2" />
              Add Bookmark
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <AlignLeft className="h-4 w-4 mr-2" />
              Format Document
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

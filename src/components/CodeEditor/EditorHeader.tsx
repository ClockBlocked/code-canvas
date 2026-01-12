import { 
  FileCode, 
  Copy, 
  Download, 
  Upload, 
  Maximize2, 
  Minimize2, 
  WrapText, 
  Search, 
  Undo2, 
  Redo2, 
  Code2, 
  Eye, 
  GitBranch, 
  History, 
  Bookmark,
  MoreHorizontal,
  ChevronDown,
  Sun,
  Moon,
  Type,
  AlignLeft,
  Save,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";

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
  onSave?: () => void;
  onFormat?: () => void;
  onGitBlame?: () => void;
  onViewHistory?: () => void;
  onAddBookmark?: () => void;
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
  onSave,
  onFormat,
  onGitBlame,
  onViewHistory,
  onAddBookmark,
}: EditorHeaderProps) => {
  
  const handleGitBlame = () => {
    if (onGitBlame) {
      onGitBlame();
    } else {
      toast.info("Git Blame", { description: "Showing blame annotations for each line" });
    }
  };

  const handleViewHistory = () => {
    if (onViewHistory) {
      onViewHistory();
    } else {
      toast.info("File History", { description: "View commit history for this file" });
    }
  };

  const handleAddBookmark = () => {
    if (onAddBookmark) {
      onAddBookmark();
    } else {
      toast.success("Bookmark Added", { description: `Bookmarked ${fileName}` });
    }
  };

  const handleFormat = () => {
    if (onFormat) {
      onFormat();
    } else {
      toast.success("Document Formatted", { description: "Code has been formatted" });
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      toast.success("Saved", { description: "Changes have been saved" });
    }
  };

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 min-w-0">
      {/* Left Section - File Info (shrinkable) */}
      <div className="flex items-center gap-2 shrink-0 min-w-0 max-w-[200px]">
        <div className="flex items-center gap-1.5 min-w-0">
          <FileCode className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="font-medium text-sm text-foreground truncate">{fileName}</span>
          {hasChanges && (
            <Badge variant="secondary" className="text-xs px-1 py-0 shrink-0">
              M
            </Badge>
          )}
        </div>
        
        <Separator orientation="vertical" className="h-4 shrink-0" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs px-2 shrink-0">
              <Code2 className="h-3 w-3" />
              <span className="hidden sm:inline">
                {languages.find(l => l.value === language)?.label || "Text"}
              </span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-popover z-50">
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

      {/* Center Section - Horizontally Scrollable Action Buttons */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex items-center gap-0.5 px-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={isEditing ? "secondary" : "ghost"} 
                  size="sm" 
                  className="h-7 w-7 p-0 shrink-0"
                  onClick={onToggleEdit}
                >
                  {isEditing ? <Code2 className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isEditing ? "View Mode" : "Edit Mode"}</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-4 mx-0.5 shrink-0" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={onUndo}>
                  <Undo2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={onRedo}>
                  <Redo2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-4 mx-0.5 shrink-0" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={onToggleSearch}>
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
                  className="h-7 w-7 p-0 shrink-0"
                  onClick={onToggleWrap}
                >
                  <WrapText className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Word Wrap</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-4 mx-0.5 shrink-0" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={handleSave}>
                  <Save className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save (Ctrl+S)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={onCopy}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy Code</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={onDownload}>
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download File</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={onUpload}>
                  <Upload className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Upload File</TooltipContent>
            </Tooltip>
          </div>
          <ScrollBar orientation="horizontal" className="h-1.5" />
        </ScrollArea>
      </div>

      {/* Right Section - View Options */}
      <div className="flex items-center gap-0.5 shrink-0">
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
          <DropdownMenuContent align="end" className="bg-popover z-50">
            <DropdownMenuItem onClick={() => onFontSizeChange(12)}>
              <FileText className="h-4 w-4 mr-2" />
              Small (12px)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFontSizeChange(14)}>
              <FileText className="h-4 w-4 mr-2" />
              Medium (14px)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFontSizeChange(16)}>
              <FileText className="h-4 w-4 mr-2" />
              Large (16px)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFontSizeChange(18)}>
              <FileText className="h-4 w-4 mr-2" />
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
          <DropdownMenuContent align="end" className="bg-popover z-50 min-w-[180px]">
            <DropdownMenuItem onClick={handleGitBlame}>
              <GitBranch className="h-4 w-4 mr-2" />
              View Git Blame
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleViewHistory}>
              <History className="h-4 w-4 mr-2" />
              View History
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAddBookmark}>
              <Bookmark className="h-4 w-4 mr-2" />
              Add Bookmark
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleFormat}>
              <AlignLeft className="h-4 w-4 mr-2" />
              Format Document
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
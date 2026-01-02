import { File, Code2, Clock, GitBranch, AlertCircle, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface EditorFooterProps {
  cursorLine: number;
  cursorColumn: number;
  lineCount: number;
  charCount: number;
  fileSize: string;
  language: string;
  encoding: string;
  lineEnding: string;
  indentType: string;
  hasErrors: boolean;
  hasWarnings: boolean;
  lastSaved?: Date;
}

export const EditorFooter = ({
  cursorLine,
  cursorColumn,
  lineCount,
  charCount,
  fileSize,
  language,
  encoding,
  lineEnding,
  indentType,
  hasErrors,
  hasWarnings,
  lastSaved,
}: EditorFooterProps) => {
  const formatTime = (date?: Date) => {
    if (!date) return "Never";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex items-center justify-between px-4 py-1.5 bg-muted/30 border-t border-border rounded-b-lg text-xs text-muted-foreground">
      {/* Left Section - Cursor Position & Stats */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="font-medium">Ln {cursorLine}</span>
          <span>,</span>
          <span className="font-medium">Col {cursorColumn}</span>
        </div>
        
        <Separator orientation="vertical" className="h-3" />
        
        <div className="flex items-center gap-1.5">
          <span>{lineCount} lines</span>
          <span>•</span>
          <span>{charCount.toLocaleString()} chars</span>
        </div>

        <Separator orientation="vertical" className="h-3" />

        <div className="flex items-center gap-1">
          <File className="h-3 w-3" />
          <span>{fileSize}</span>
        </div>
      </div>

      {/* Center Section - Status */}
      <div className="flex items-center gap-3">
        {hasErrors && (
          <div className="flex items-center gap-1 text-destructive">
            <AlertCircle className="h-3 w-3" />
            <span>Errors</span>
          </div>
        )}
        {hasWarnings && (
          <div className="flex items-center gap-1 text-yellow-500">
            <AlertCircle className="h-3 w-3" />
            <span>Warnings</span>
          </div>
        )}
        {!hasErrors && !hasWarnings && (
          <div className="flex items-center gap-1 text-green-500">
            <CheckCircle className="h-3 w-3" />
            <span>No Issues</span>
          </div>
        )}
      </div>

      {/* Right Section - File Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Saved {formatTime(lastSaved)}</span>
        </div>

        <Separator orientation="vertical" className="h-3" />

        <Badge variant="outline" className="text-xs h-5 px-1.5">
          {encoding}
        </Badge>

        <Badge variant="outline" className="text-xs h-5 px-1.5">
          {lineEnding}
        </Badge>

        <Badge variant="outline" className="text-xs h-5 px-1.5">
          {indentType}
        </Badge>

        <Badge variant="secondary" className="text-xs h-5 px-1.5">
          <Code2 className="h-3 w-3 mr-1" />
          {language}
        </Badge>
      </div>
    </div>
  );
};

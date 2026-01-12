import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  File, 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown,
  FileCode,
  FileJson,
  FileText,
  Search,
  Plus,
  MoreHorizontal,
  Star,
  GitFork,
  Lock,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { 
  getAllRepositories, 
  getFilesByRepo, 
  Repository, 
  FileItem,
  seedDatabase,
  initDB
} from "@/lib/db";

interface FileExplorerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect?: (file: FileItem) => void;
}

const getFileIcon = (fileName: string, type: "file" | "folder", isOpen?: boolean) => {
  if (type === "folder") {
    return isOpen ? <FolderOpen className="h-4 w-4 text-primary" /> : <Folder className="h-4 w-4 text-primary" />;
  }
  
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx':
      return <FileCode className="h-4 w-4 text-blue-400" />;
    case 'js':
    case 'jsx':
      return <FileCode className="h-4 w-4 text-yellow-400" />;
    case 'json':
      return <FileJson className="h-4 w-4 text-amber-400" />;
    case 'md':
      return <FileText className="h-4 w-4 text-muted-foreground" />;
    case 'css':
    case 'scss':
      return <FileCode className="h-4 w-4 text-pink-400" />;
    case 'html':
      return <FileCode className="h-4 w-4 text-orange-400" />;
    default:
      return <File className="h-4 w-4 text-muted-foreground" />;
  }
};

interface FileTreeItemProps {
  file: FileItem;
  level: number;
  selectedFileId?: string;
  onSelect: (file: FileItem) => void;
  repoName: string;
}

const FileTreeItem = ({ file, level, selectedFileId, onSelect, repoName }: FileTreeItemProps) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const isSelected = file.id === selectedFileId;
  const navigate = useNavigate();

  const handleClick = () => {
    if (file.type === "folder") {
      setIsExpanded(!isExpanded);
    } else {
      onSelect(file);
      // Navigate to the file path
      navigate(`/repo/${repoName}/${file.path}`);
      toast.success(`Opened ${file.name}`);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md transition-all duration-150",
          "hover:bg-accent active:scale-[0.98]",
          isSelected && "bg-accent text-accent-foreground ring-1 ring-primary/20"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {file.type === "folder" && (
          isExpanded ? 
            <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" /> : 
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
        )}
        {file.type === "file" && <span className="w-3" />}
        {getFileIcon(file.name, file.type, isExpanded)}
        <span className="truncate font-medium">{file.name}</span>
      </button>
    </div>
  );
};

export const FileExplorerSidebar = ({ isOpen, onClose, onFileSelect }: FileExplorerSidebarProps) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await initDB();
        await seedDatabase();
        const repos = await getAllRepositories();
        setRepositories(repos);
        
        if (repos.length > 0 && !selectedRepoId) {
          setSelectedRepoId(repos[0].id);
          const repoFiles = await getFilesByRepo(repos[0].id);
          setFiles(repoFiles);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load files");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadFiles = async () => {
      if (selectedRepoId) {
        const repoFiles = await getFilesByRepo(selectedRepoId);
        setFiles(repoFiles);
      }
    };
    loadFiles();
  }, [selectedRepoId]);

  const handleFileSelect = (file: FileItem) => {
    setSelectedFileId(file.id);
    onFileSelect?.(file);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const repos = await getAllRepositories();
      setRepositories(repos);
      if (selectedRepoId) {
        const repoFiles = await getFilesByRepo(selectedRepoId);
        setFiles(repoFiles);
      }
      toast.success("Files refreshed");
    } catch (error) {
      toast.error("Failed to refresh");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRepoSelect = (repo: Repository) => {
    setSelectedRepoId(repo.id);
    navigate(`/repo/${repo.name}`);
    toast.success(`Switched to ${repo.name}`);
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedRepo = repositories.find(r => r.id === selectedRepoId);

  if (!isOpen) return null;

  return (
    <aside className="w-64 h-full border-r border-border bg-sidebar flex flex-col shrink-0">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between h-auto py-2 px-3 hover:bg-accent"
            >
              <div className="flex items-center gap-2 truncate">
                <Folder className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate font-semibold">
                  {selectedRepo?.name || "Select Repository"}
                </span>
                {selectedRepo?.isPrivate && (
                  <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
                )}
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0 bg-popover z-50" align="start">
            <div className="p-2 border-b border-border">
              <p className="text-xs font-semibold text-muted-foreground px-2 uppercase tracking-wider">
                Your Repositories
              </p>
            </div>
            <ScrollArea className="max-h-64">
              {loading ? (
                <div className="p-4 space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <div className="p-1">
                  {repositories.map((repo) => (
                    <button
                      key={repo.id}
                      onClick={() => handleRepoSelect(repo)}
                      className={cn(
                        "flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm transition-all duration-150",
                        "hover:bg-accent active:scale-[0.98]",
                        selectedRepoId === repo.id && "bg-accent"
                      )}
                    >
                      <Folder className="h-4 w-4 text-primary shrink-0" />
                      <div className="flex-1 text-left truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold truncate">{repo.name}</span>
                          {repo.isPrivate && <Lock className="h-3 w-3 text-muted-foreground" />}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {repo.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                        <span className="flex items-center gap-0.5">
                          <Star className="h-3 w-3" />
                          {repo.stars}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <GitFork className="h-3 w-3" />
                          {repo.forks}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
            <div className="p-2 border-t border-border">
              <Button variant="ghost" size="sm" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                New Repository
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Search */}
      <div className="p-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-full" />
              ))}
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {searchQuery ? "No files found" : "No files in repository"}
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredFiles.map((file) => (
                <FileTreeItem
                  key={file.id}
                  file={file}
                  level={0}
                  selectedFileId={selectedFileId || undefined}
                  onSelect={handleFileSelect}
                  repoName={selectedRepo?.name || ""}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{filteredFiles.length} items</span>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>More options</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  );
};
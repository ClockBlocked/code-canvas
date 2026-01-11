import { useState, useCallback, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { EditorHeader } from "./EditorHeader";
import { EditorFooter } from "./EditorFooter";
import { useCodeMirror } from "./useCodeMirror";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SAMPLE_CODE = `// Welcome to the GitHub-style Code Editor
// Built with CodeMirror 6 and React

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
}

interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

/**
 * Custom hook for managing user authentication
 * @returns Authentication state and methods
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const result: ApiResponse<User> = await response.json();
        
        if (result.status === 'success') {
          setUser(result.data);
        } else {
          setError(result.message || 'Authentication failed');
        }
      } catch (err) {
        setError('Network error occurred');
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const result: ApiResponse<User> = await response.json();
      
      if (result.status === 'success') {
        setUser(result.data);
        return true;
      } else {
        setError(result.message || 'Login failed');
        return false;
      }
    } catch (err) {
      setError('Network error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  return { user, loading, error, login, logout };
}

// Example component using the auth hook
export const UserProfile: React.FC = () => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to continue</div>;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="p-6 rounded-lg shadow-lg"
      >
        <img
          src={user.avatar || '/default-avatar.png'}
          alt={user.name}
          className="w-16 h-16 rounded-full"
        />
        <h2 className="text-xl font-bold mt-4">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
        <span className="badge">{user.role}</span>
        <button onClick={logout} className="mt-4 btn-primary">
          Sign Out
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserProfile;
`;

const calculateFileSize = (content: string): string => {
  const bytes = new Blob([content]).size;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

interface CodeEditorProps {
  initialCode?: string;
  fileName?: string;
  initialLanguage?: string;
  onCodeChange?: (code: string) => void;
}

export const CodeEditor = ({ 
  initialCode = SAMPLE_CODE, 
  fileName = "useAuth.tsx",
  initialLanguage = "typescript",
  onCodeChange
}: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWrapped, setIsWrapped] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorColumn, setCursorColumn] = useState(1);
  const [fontSize, setFontSize] = useState(14);
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFileName, setCurrentFileName] = useState(fileName);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    setHasChanges(true);
    onCodeChange?.(newCode);
  }, [onCodeChange]);

  const handleCursorChange = useCallback((line: number, column: number) => {
    setCursorLine(line);
    setCursorColumn(column);
  }, []);

  const {
    containerRef: editorRef,
    undo,
    redo,
    openSearch,
    getContent,
    setContent,
  } = useCodeMirror({
    initialValue: code,
    language,
    isDark: isDarkTheme,
    readOnly: !isEditing,
    lineWrapping: isWrapped,
    fontSize,
    onChange: handleCodeChange,
    onCursorChange: handleCursorChange,
  });

  const handleCopy = useCallback(() => {
    const content = getContent();
    navigator.clipboard.writeText(content);
    toast.success("Code copied to clipboard");
  }, [getContent]);

  const handleDownload = useCallback(() => {
    const content = getContent();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = currentFileName;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${currentFileName}`);
  }, [getContent, currentFileName]);

  const handleUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setContent(content);
        setCurrentFileName(file.name);
        setHasChanges(false);
        
        // Auto-detect language from extension
        const ext = file.name.split('.').pop()?.toLowerCase();
        const langMap: Record<string, string> = {
          js: 'javascript',
          jsx: 'javascript',
          ts: 'typescript',
          tsx: 'typescript',
          py: 'python',
          html: 'html',
          css: 'css',
          json: 'json',
          md: 'markdown',
        };
        if (ext && langMap[ext]) {
          setLanguage(langMap[ext]);
        }
        toast.success(`Loaded ${file.name}`);
      };
      reader.readAsText(file);
    }
  }, [setContent]);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleSave = useCallback(() => {
    setLastSaved(new Date());
    setHasChanges(false);
    toast.success("Changes saved");
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  const lineCount = code.split('\n').length;
  const charCount = code.length;
  const fileSize = calculateFileSize(code);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "w-full transition-all duration-300",
        isFullscreen && "fixed inset-0 z-50 p-4 bg-background"
      )}
    >
      <Card className={cn(
        "overflow-visible shadow-lg border-border",
        isFullscreen && "h-full flex flex-col"
      )}>
        {/* Sticky header - sticks to top-14 (navbar height) when scrolling */}
        <div className="sticky top-14 z-40 bg-muted/50 border-b border-border rounded-t-lg">
          <EditorHeader
            fileName={currentFileName}
            language={language}
            isFullscreen={isFullscreen}
            isWrapped={isWrapped}
            isEditing={isEditing}
            isDarkTheme={isDarkTheme}
            hasChanges={hasChanges}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onUpload={handleUpload}
            onToggleFullscreen={handleToggleFullscreen}
            onToggleWrap={() => setIsWrapped(!isWrapped)}
            onToggleSearch={openSearch}
            onUndo={undo}
            onRedo={redo}
            onToggleEdit={() => setIsEditing(!isEditing)}
            onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
            onLanguageChange={setLanguage}
            onFontSizeChange={setFontSize}
            fontSize={fontSize}
          />
        </div>
        
        <div 
          ref={editorRef} 
          className={cn(
            "min-h-[400px] overflow-auto",
            isFullscreen && "flex-1",
            isDarkTheme ? "bg-[hsl(0,0%,15%)]" : "bg-background"
          )}
        />
        
        <EditorFooter
          cursorLine={cursorLine}
          cursorColumn={cursorColumn}
          lineCount={lineCount}
          charCount={charCount}
          fileSize={fileSize}
          language={language}
          encoding="UTF-8"
          lineEnding="LF"
          indentType="Spaces: 2"
          hasErrors={false}
          hasWarnings={false}
          lastSaved={lastSaved}
        />
      </Card>
      
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".js,.jsx,.ts,.tsx,.py,.html,.css,.json,.md,.txt"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default CodeEditor;

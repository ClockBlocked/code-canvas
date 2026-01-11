import { useState, useCallback, useEffect } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { TopNavbar } from "@/components/TopNavbar";
import { BreadcrumbsBar } from "@/components/BreadcrumbsBar";
import { FileExplorerSidebar } from "@/components/FileExplorerSidebar";
import { CodeOutlinePanel } from "@/components/CodeOutlinePanel";
import { Sparkles, Loader2 } from "lucide-react";
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

const Index = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [code, setCode] = useState(SAMPLE_CODE);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Navbar - Always sticky at top */}
      <TopNavbar 
        onLeftSidebarToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
        onRightSidebarToggle={() => setRightSidebarOpen(!rightSidebarOpen)}
      />

      {/* Breadcrumbs Bar */}
      <BreadcrumbsBar />

      {/* Main Layout with Sidebars */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - File Explorer */}
        <div className={cn(
          "transition-all duration-300 ease-in-out",
          leftSidebarOpen ? "w-64" : "w-0"
        )}>
          <FileExplorerSidebar 
            isOpen={leftSidebarOpen} 
            onClose={() => setLeftSidebarOpen(false)} 
          />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 space-y-4">
            {/* Feature Badges */}
            <div className="flex flex-wrap items-center gap-2 justify-center animate-fade-in">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <Sparkles className="h-3 w-3" />
                Syntax Highlighting
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                Multi-Language Support
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                Line Numbers
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                Search & Replace
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                Code Folding
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                Auto-Complete
              </span>
            </div>

            {/* Code Editor */}
            <div className="animate-scale-in">
              <CodeEditor onCodeChange={handleCodeChange} />
            </div>

            {/* Keyboard Shortcuts Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm animate-fade-in">
              <div className="p-3 rounded-lg bg-card border border-border">
                <kbd className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono text-xs">Ctrl+S</kbd>
                <span className="ml-2 text-muted-foreground">Save</span>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border">
                <kbd className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono text-xs">Ctrl+F</kbd>
                <span className="ml-2 text-muted-foreground">Search</span>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border">
                <kbd className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono text-xs">Ctrl+Z</kbd>
                <span className="ml-2 text-muted-foreground">Undo</span>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border">
                <kbd className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono text-xs">Ctrl+Y</kbd>
                <span className="ml-2 text-muted-foreground">Redo</span>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Code Outline */}
        <div className={cn(
          "transition-all duration-300 ease-in-out",
          rightSidebarOpen ? "w-64" : "w-0"
        )}>
          <CodeOutlinePanel
            isOpen={rightSidebarOpen}
            onClose={() => setRightSidebarOpen(false)}
            code={code}
            language="typescript"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;

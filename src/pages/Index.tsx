import { CodeEditor } from "@/components/CodeEditor";
import { Github, Code2, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                <Code2 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">CodeMirror Editor</h1>
                <p className="text-xs text-muted-foreground">GitHub-style file viewer & editor</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline">View on GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Feature Badges */}
          <div className="flex flex-wrap items-center gap-2 justify-center">
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
          <CodeEditor />

          {/* Keyboard Shortcuts Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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

      {/* Footer */}
      <footer className="border-t border-border mt-auto py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            Built with CodeMirror 6 • React • Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

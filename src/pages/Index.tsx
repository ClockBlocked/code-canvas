import { useRef, useEffect, useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { TopNavbar } from "@/components/TopNavbar";
import { BreadcrumbsBar } from "@/components/BreadcrumbsBar";
import { Sparkles } from "lucide-react";

const Index = () => {
  const breadcrumbsRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [isEditorSticky, setIsEditorSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (breadcrumbsRef.current && editorContainerRef.current) {
        const breadcrumbsRect = breadcrumbsRef.current.getBoundingClientRect();
        // When breadcrumbs top reaches the navbar bottom (top: 56px = navbar height)
        // The editor header should become sticky
        setIsEditorSticky(breadcrumbsRect.top <= 56);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar - Always sticky at top */}
      <TopNavbar />

      {/* Breadcrumbs Bar - Scrolls away, replaced by editor header */}
      <div 
        ref={breadcrumbsRef}
        className={`sticky top-14 z-40 transition-opacity duration-150 ${isEditorSticky ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <BreadcrumbsBar />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div ref={editorContainerRef} className="max-w-6xl mx-auto space-y-6">
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
          <CodeEditor stickyHeader={isEditorSticky} />

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

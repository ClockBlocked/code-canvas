import { useState, useEffect, useMemo } from "react";
import { 
  Code2, 
  Hash, 
  Braces, 
  Type,
  FunctionSquare,
  Variable,
  ChevronRight,
  ChevronDown,
  FileCode,
  Loader2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CodeOutlinePanelProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language: string;
}

interface Symbol {
  id: string;
  name: string;
  type: "function" | "class" | "interface" | "variable" | "type" | "const" | "export";
  line: number;
  children?: Symbol[];
}

const getSymbolIcon = (type: Symbol["type"]) => {
  switch (type) {
    case "function":
      return <FunctionSquare className="h-4 w-4 text-yellow-400" />;
    case "class":
      return <Braces className="h-4 w-4 text-orange-400" />;
    case "interface":
      return <Type className="h-4 w-4 text-blue-400" />;
    case "variable":
    case "const":
      return <Variable className="h-4 w-4 text-cyan-400" />;
    case "type":
      return <Type className="h-4 w-4 text-purple-400" />;
    case "export":
      return <Code2 className="h-4 w-4 text-green-400" />;
    default:
      return <Hash className="h-4 w-4 text-muted-foreground" />;
  }
};

const parseSymbols = (code: string, language: string): Symbol[] => {
  const symbols: Symbol[] = [];
  const lines = code.split('\n');
  let id = 0;

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // TypeScript/JavaScript patterns
    if (language === 'typescript' || language === 'javascript') {
      // Functions
      const functionMatch = trimmed.match(/^(?:export\s+)?(?:async\s+)?function\s+(\w+)/);
      if (functionMatch) {
        symbols.push({
          id: `sym-${id++}`,
          name: functionMatch[1],
          type: "function",
          line: index + 1,
        });
      }

      // Arrow functions assigned to const/let
      const arrowMatch = trimmed.match(/^(?:export\s+)?(?:const|let)\s+(\w+)\s*=\s*(?:async\s+)?\(?.*?\)?\s*=>/);
      if (arrowMatch) {
        symbols.push({
          id: `sym-${id++}`,
          name: arrowMatch[1],
          type: "function",
          line: index + 1,
        });
      }

      // Interfaces
      const interfaceMatch = trimmed.match(/^(?:export\s+)?interface\s+(\w+)/);
      if (interfaceMatch) {
        symbols.push({
          id: `sym-${id++}`,
          name: interfaceMatch[1],
          type: "interface",
          line: index + 1,
        });
      }

      // Types
      const typeMatch = trimmed.match(/^(?:export\s+)?type\s+(\w+)/);
      if (typeMatch) {
        symbols.push({
          id: `sym-${id++}`,
          name: typeMatch[1],
          type: "type",
          line: index + 1,
        });
      }

      // Classes
      const classMatch = trimmed.match(/^(?:export\s+)?class\s+(\w+)/);
      if (classMatch) {
        symbols.push({
          id: `sym-${id++}`,
          name: classMatch[1],
          type: "class",
          line: index + 1,
        });
      }

      // Const/Let variables (not functions)
      const constMatch = trimmed.match(/^(?:export\s+)?const\s+(\w+)\s*[:=](?!\s*(?:async\s+)?\(?.*?\)?\s*=>)/);
      if (constMatch && !trimmed.includes('=>')) {
        symbols.push({
          id: `sym-${id++}`,
          name: constMatch[1],
          type: "const",
          line: index + 1,
        });
      }
    }

    // Python patterns
    if (language === 'python') {
      const defMatch = trimmed.match(/^(?:async\s+)?def\s+(\w+)/);
      if (defMatch) {
        symbols.push({
          id: `sym-${id++}`,
          name: defMatch[1],
          type: "function",
          line: index + 1,
        });
      }

      const classMatch = trimmed.match(/^class\s+(\w+)/);
      if (classMatch) {
        symbols.push({
          id: `sym-${id++}`,
          name: classMatch[1],
          type: "class",
          line: index + 1,
        });
      }
    }
  });

  return symbols;
};

interface SymbolItemProps {
  symbol: Symbol;
  level: number;
  onClick: (line: number) => void;
}

const SymbolItem = ({ symbol, level, onClick }: SymbolItemProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = symbol.children && symbol.children.length > 0;

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          }
          onClick(symbol.line);
        }}
        className={cn(
          "flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md transition-colors",
          "hover:bg-accent group"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren ? (
          isExpanded ? 
            <ChevronDown className="h-3 w-3 shrink-0" /> : 
            <ChevronRight className="h-3 w-3 shrink-0" />
        ) : (
          <span className="w-3" />
        )}
        {getSymbolIcon(symbol.type)}
        <span className="truncate flex-1 text-left">{symbol.name}</span>
        <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          L{symbol.line}
        </span>
      </button>
      
      {hasChildren && isExpanded && (
        <div>
          {symbol.children?.map((child) => (
            <SymbolItem
              key={child.id}
              symbol={child}
              level={level + 1}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CodeOutlinePanel = ({ isOpen, onClose, code, language }: CodeOutlinePanelProps) => {
  const [loading, setLoading] = useState(true);

  const symbols = useMemo(() => {
    return parseSymbols(code, language);
  }, [code, language]);

  useEffect(() => {
    // Simulate parsing delay for large files
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [code]);

  const handleSymbolClick = (line: number) => {
    // Could scroll to line in editor here
    console.log("Navigate to line:", line);
  };

  // Group symbols by type
  const groupedSymbols = useMemo(() => {
    const groups: Record<string, Symbol[]> = {
      functions: [],
      classes: [],
      interfaces: [],
      types: [],
      variables: [],
    };

    symbols.forEach((symbol) => {
      if (symbol.type === "function") groups.functions.push(symbol);
      else if (symbol.type === "class") groups.classes.push(symbol);
      else if (symbol.type === "interface") groups.interfaces.push(symbol);
      else if (symbol.type === "type") groups.types.push(symbol);
      else groups.variables.push(symbol);
    });

    return groups;
  }, [symbols]);

  if (!isOpen) return null;

  return (
    <aside className="w-64 h-full border-l border-border bg-sidebar flex flex-col shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Outline</span>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Close panel</TooltipContent>
        </Tooltip>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-full" />
              ))}
            </div>
          ) : symbols.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Code2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No symbols found</p>
              <p className="text-xs mt-1">Try a different file</p>
            </div>
          ) : (
            <div className="space-y-4">
              {groupedSymbols.functions.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground px-2 mb-1 uppercase tracking-wider">
                    Functions ({groupedSymbols.functions.length})
                  </h3>
                  <div className="space-y-0.5">
                    {groupedSymbols.functions.map((symbol) => (
                      <SymbolItem
                        key={symbol.id}
                        symbol={symbol}
                        level={0}
                        onClick={handleSymbolClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {groupedSymbols.interfaces.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground px-2 mb-1 uppercase tracking-wider">
                    Interfaces ({groupedSymbols.interfaces.length})
                  </h3>
                  <div className="space-y-0.5">
                    {groupedSymbols.interfaces.map((symbol) => (
                      <SymbolItem
                        key={symbol.id}
                        symbol={symbol}
                        level={0}
                        onClick={handleSymbolClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {groupedSymbols.types.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground px-2 mb-1 uppercase tracking-wider">
                    Types ({groupedSymbols.types.length})
                  </h3>
                  <div className="space-y-0.5">
                    {groupedSymbols.types.map((symbol) => (
                      <SymbolItem
                        key={symbol.id}
                        symbol={symbol}
                        level={0}
                        onClick={handleSymbolClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {groupedSymbols.classes.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground px-2 mb-1 uppercase tracking-wider">
                    Classes ({groupedSymbols.classes.length})
                  </h3>
                  <div className="space-y-0.5">
                    {groupedSymbols.classes.map((symbol) => (
                      <SymbolItem
                        key={symbol.id}
                        symbol={symbol}
                        level={0}
                        onClick={handleSymbolClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {groupedSymbols.variables.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground px-2 mb-1 uppercase tracking-wider">
                    Variables ({groupedSymbols.variables.length})
                  </h3>
                  <div className="space-y-0.5">
                    {groupedSymbols.variables.map((symbol) => (
                      <SymbolItem
                        key={symbol.id}
                        symbol={symbol}
                        level={0}
                        onClick={handleSymbolClick}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          {symbols.length} symbol{symbols.length !== 1 ? 's' : ''} found
        </div>
      </div>
    </aside>
  );
};

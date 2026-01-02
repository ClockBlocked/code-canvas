import { useEffect, useRef, useState, useCallback } from "react";
import { EditorState, Extension } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab, undo, redo } from "@codemirror/commands";
import { syntaxHighlighting, indentOnInput, bracketMatching, foldGutter, foldKeymap, defaultHighlightStyle, HighlightStyle } from "@codemirror/language";
import { searchKeymap, highlightSelectionMatches, openSearchPanel } from "@codemirror/search";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { lintKeymap } from "@codemirror/lint";
import { tags } from "@lezer/highlight";

const getLanguageExtension = (language: string): Extension => {
  switch (language) {
    case "javascript":
      return javascript();
    case "typescript":
      return javascript({ typescript: true });
    case "python":
      return python();
    case "html":
      return html();
    case "css":
      return css();
    case "json":
      return json();
    case "markdown":
      return markdown();
    default:
      return [];
  }
};

const createLightTheme = () => EditorView.theme({
  "&": {
    backgroundColor: "hsl(0 0% 100%)",
    color: "hsl(210 18% 13%)",
  },
  ".cm-content": {
    caretColor: "hsl(212 92% 45%)",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "hsl(212 92% 45%)",
  },
  ".cm-selectionBackground, ::selection": {
    backgroundColor: "hsl(212 92% 45% / 0.2)",
  },
  ".cm-activeLine": {
    backgroundColor: "hsl(210 17% 95% / 0.5)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "hsl(210 17% 95% / 0.5)",
  },
  ".cm-gutters": {
    backgroundColor: "hsl(210 17% 98%)",
    color: "hsl(215 16% 47%)",
    borderRight: "1px solid hsl(214.3 31.8% 91.4%)",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 12px 0 8px",
    minWidth: "40px",
  },
  ".cm-foldGutter .cm-gutterElement": {
    padding: "0 4px",
  },
  ".cm-searchMatch": {
    backgroundColor: "hsl(45 100% 70%)",
    outline: "1px solid hsl(45 100% 50%)",
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "hsl(45 100% 60%)",
  },
  ".cm-selectionMatch": {
    backgroundColor: "hsl(212 92% 45% / 0.1)",
  },
}, { dark: false });

const createDarkTheme = () => EditorView.theme({
  "&": {
    backgroundColor: "hsl(0 0% 15%)",
    color: "hsl(248 0.3% 98.4%)",
  },
  ".cm-content": {
    caretColor: "hsl(212 79% 56%)",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "hsl(212 79% 56%)",
  },
  ".cm-selectionBackground, ::selection": {
    backgroundColor: "hsl(212 79% 56% / 0.3)",
  },
  ".cm-activeLine": {
    backgroundColor: "hsl(260 4.1% 27.9% / 0.3)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "hsl(260 4.1% 27.9% / 0.3)",
  },
  ".cm-gutters": {
    backgroundColor: "hsl(266 4% 18%)",
    color: "hsl(257 4% 70.4%)",
    borderRight: "1px solid hsl(0 0% 100% / 10%)",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 12px 0 8px",
    minWidth: "40px",
  },
  ".cm-foldGutter .cm-gutterElement": {
    padding: "0 4px",
  },
  ".cm-searchMatch": {
    backgroundColor: "hsl(45 100% 30%)",
    outline: "1px solid hsl(45 100% 40%)",
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "hsl(45 100% 40%)",
  },
  ".cm-selectionMatch": {
    backgroundColor: "hsl(212 79% 56% / 0.2)",
  },
}, { dark: true });

const lightHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: "#d73a49" },
  { tag: tags.comment, color: "#6a737d", fontStyle: "italic" },
  { tag: tags.string, color: "#032f62" },
  { tag: tags.number, color: "#005cc5" },
  { tag: tags.function(tags.variableName), color: "#6f42c1" },
  { tag: tags.definition(tags.variableName), color: "#24292e" },
  { tag: tags.typeName, color: "#22863a" },
  { tag: tags.className, color: "#6f42c1" },
  { tag: tags.propertyName, color: "#005cc5" },
  { tag: tags.operator, color: "#d73a49" },
  { tag: tags.punctuation, color: "#24292e" },
  { tag: tags.tagName, color: "#22863a" },
  { tag: tags.attributeName, color: "#6f42c1" },
  { tag: tags.attributeValue, color: "#032f62" },
]);

const darkHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: "#ff7b72" },
  { tag: tags.comment, color: "#8b949e", fontStyle: "italic" },
  { tag: tags.string, color: "#a5d6ff" },
  { tag: tags.number, color: "#79c0ff" },
  { tag: tags.function(tags.variableName), color: "#d2a8ff" },
  { tag: tags.definition(tags.variableName), color: "#c9d1d9" },
  { tag: tags.typeName, color: "#7ee787" },
  { tag: tags.className, color: "#d2a8ff" },
  { tag: tags.propertyName, color: "#79c0ff" },
  { tag: tags.operator, color: "#ff7b72" },
  { tag: tags.punctuation, color: "#c9d1d9" },
  { tag: tags.tagName, color: "#7ee787" },
  { tag: tags.attributeName, color: "#d2a8ff" },
  { tag: tags.attributeValue, color: "#a5d6ff" },
]);

interface UseCodeMirrorOptions {
  initialValue: string;
  language: string;
  isDark: boolean;
  readOnly: boolean;
  lineWrapping: boolean;
  fontSize: number;
  onChange?: (value: string) => void;
  onCursorChange?: (line: number, column: number) => void;
}

export const useCodeMirror = ({
  initialValue,
  language,
  isDark,
  readOnly,
  lineWrapping,
  fontSize,
  onChange,
  onCursorChange,
}: UseCodeMirrorOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [isReady, setIsReady] = useState(false);

  const undoAction = useCallback(() => {
    if (viewRef.current) {
      undo(viewRef.current);
    }
  }, []);

  const redoAction = useCallback(() => {
    if (viewRef.current) {
      redo(viewRef.current);
    }
  }, []);

  const openSearch = useCallback(() => {
    if (viewRef.current) {
      openSearchPanel(viewRef.current);
    }
  }, []);

  const getContent = useCallback(() => {
    return viewRef.current?.state.doc.toString() || "";
  }, []);

  const setContent = useCallback((content: string) => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: content }
      });
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const extensions: Extension[] = [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      foldGutter(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap,
        indentWithTab,
      ]),
      getLanguageExtension(language),
      isDark ? createDarkTheme() : createLightTheme(),
      syntaxHighlighting(isDark ? darkHighlight : lightHighlight),
      EditorView.updateListener.of((update) => {
        if (update.docChanged && onChange) {
          onChange(update.state.doc.toString());
        }
        if (update.selectionSet && onCursorChange) {
          const pos = update.state.selection.main.head;
          const line = update.state.doc.lineAt(pos);
          onCursorChange(line.number, pos - line.from + 1);
        }
      }),
      EditorView.theme({
        ".cm-content": {
          fontSize: `${fontSize}px`,
          lineHeight: "1.6",
        },
        ".cm-gutters": {
          fontSize: `${fontSize}px`,
        },
      }),
    ];

    if (readOnly) {
      extensions.push(EditorState.readOnly.of(true));
    }

    if (lineWrapping) {
      extensions.push(EditorView.lineWrapping);
    }

    const state = EditorState.create({
      doc: initialValue,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;
    setIsReady(true);

    return () => {
      view.destroy();
      viewRef.current = null;
      setIsReady(false);
    };
  }, [language, isDark, readOnly, lineWrapping, fontSize]);

  return {
    containerRef,
    isReady,
    undo: undoAction,
    redo: redoAction,
    openSearch,
    getContent,
    setContent,
  };
};

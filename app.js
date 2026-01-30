// Code Canvas - Vanilla JavaScript Application
// GitHub Dark Dimmed Theme

import { getIcon, createIconElement } from './icons.js';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab, undo, redo } from '@codemirror/commands';
import { syntaxHighlighting, indentOnInput, bracketMatching, foldGutter, foldKeymap, HighlightStyle } from '@codemirror/language';
import { searchKeymap, highlightSelectionMatches, openSearchPanel } from '@codemirror/search';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css as cssLang } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';
import { tags } from '@lezer/highlight';

// Sample code
const SAMPLE_CODE = `// Welcome to the GitHub-style Code Editor
// Built with CodeMirror 6 and Vanilla JavaScript

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
  }

  greet() {
    return \`Hello, \${this.name}!\`;
  }

  static fromJSON(json) {
    return new User(json.name, json.email);
  }
}

const userAuth = {
  currentUser: null,
  
  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        this.currentUser = result.data;
        return true;
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      return false;
    }
  },
  
  logout() {
    this.currentUser = null;
    localStorage.removeItem('authToken');
  }
};

export { User, userAuth, fibonacci };
`;

// File tree data
const fileTreeData = [
    { id: '1', name: 'src', type: 'folder', children: [
        { id: '2', name: 'components', type: 'folder', children: [
            { id: '3', name: 'Button.js', type: 'file' },
            { id: '4', name: 'Input.js', type: 'file' },
        ]},
        { id: '5', name: 'utils', type: 'folder', children: [
            { id: '6', name: 'helpers.js', type: 'file' },
        ]},
        { id: '7', name: 'index.js', type: 'file' },
        { id: '8', name: 'App.js', type: 'file' },
    ]},
    { id: '9', name: 'public', type: 'folder', children: [
        { id: '10', name: 'index.html', type: 'file' },
        { id: '11', name: 'styles.css', type: 'file' },
    ]},
    { id: '12', name: 'package.json', type: 'file' },
    { id: '13', name: 'README.md', type: 'file' },
];

// Application State
const state = {
    leftSidebarOpen: true,
    rightSidebarOpen: true,
    currentCode: SAMPLE_CODE,
    currentLanguage: 'javascript',
    currentFilename: 'useAuth.js',
    editorView: null,
    cursorLine: 1,
    cursorColumn: 1,
    isWrapped: false,
};

// Get language extension for CodeMirror
function getLanguageExtension(language) {
    switch (language) {
        case 'javascript':
            return javascript();
        case 'typescript':
            return javascript({ typescript: true });
        case 'python':
            return python();
        case 'html':
            return html();
        case 'css':
            return cssLang();
        case 'json':
            return json();
        case 'markdown':
            return markdown();
        default:
            return [];
    }
}

// Create dark theme for CodeMirror (GitHub Dark Dimmed)
const darkTheme = EditorView.theme({
    '&': {
        backgroundColor: 'hsl(0 0% 15%)',
        color: 'hsl(248 0.3% 98.4%)',
    },
    '.cm-content': {
        caretColor: 'hsl(212 79% 56%)',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: '14px',
        lineHeight: '1.6',
    },
    '.cm-cursor, .cm-dropCursor': {
        borderLeftColor: 'hsl(212 79% 56%)',
    },
    '.cm-selectionBackground, ::selection': {
        backgroundColor: 'hsl(212 79% 56% / 0.3)',
    },
    '.cm-activeLine': {
        backgroundColor: 'hsl(260 4.1% 27.9% / 0.3)',
    },
    '.cm-activeLineGutter': {
        backgroundColor: 'hsl(260 4.1% 27.9% / 0.3)',
    },
    '.cm-gutters': {
        backgroundColor: 'hsl(266 4% 18%)',
        color: 'hsl(257 4% 70.4%)',
        borderRight: '1px solid hsl(0 0% 100% / 10%)',
    },
    '.cm-lineNumbers .cm-gutterElement': {
        padding: '0 12px 0 8px',
        minWidth: '40px',
    },
    '.cm-foldGutter .cm-gutterElement': {
        padding: '0 4px',
    },
}, { dark: true });

// Syntax highlighting for dark theme
const darkHighlight = HighlightStyle.define([
    { tag: tags.keyword, color: '#ff7b72' },
    { tag: tags.comment, color: '#8b949e', fontStyle: 'italic' },
    { tag: tags.string, color: '#a5d6ff' },
    { tag: tags.number, color: '#79c0ff' },
    { tag: tags.function(tags.variableName), color: '#d2a8ff' },
    { tag: tags.definition(tags.variableName), color: '#c9d1d9' },
    { tag: tags.typeName, color: '#7ee787' },
    { tag: tags.className, color: '#d2a8ff' },
    { tag: tags.propertyName, color: '#79c0ff' },
    { tag: tags.operator, color: '#ff7b72' },
    { tag: tags.punctuation, color: '#c9d1d9' },
    { tag: tags.tagName, color: '#7ee787' },
    { tag: tags.attributeName, color: '#d2a8ff' },
    { tag: tags.attributeValue, color: '#a5d6ff' },
]);

// Initialize CodeMirror Editor
function initEditor() {
    const editorElement = document.getElementById('editor');
    
    const extensions = [
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
        getLanguageExtension(state.currentLanguage),
        darkTheme,
        syntaxHighlighting(darkHighlight),
        EditorView.updateListener.of((update) => {
            if (update.docChanged) {
                state.currentCode = update.state.doc.toString();
                updateEditorStats();
                updateOutline();
            }
            if (update.selectionSet) {
                const pos = update.state.selection.main.head;
                const line = update.state.doc.lineAt(pos);
                state.cursorLine = line.number;
                state.cursorColumn = pos - line.from + 1;
                updateCursorDisplay();
            }
        }),
    ];
    
    if (state.isWrapped) {
        extensions.push(EditorView.lineWrapping);
    }
    
    const startState = EditorState.create({
        doc: state.currentCode,
        extensions,
    });
    
    const view = new EditorView({
        state: startState,
        parent: editorElement,
    });
    
    state.editorView = view;
    updateEditorStats();
    updateOutline();
}

// Update editor statistics
function updateEditorStats() {
    const code = state.currentCode;
    const lines = code.split('\n').length;
    const chars = code.length;
    const bytes = new Blob([code]).size;
    
    let size;
    if (bytes < 1024) {
        size = `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
        size = `${(bytes / 1024).toFixed(1)} KB`;
    } else {
        size = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    
    document.getElementById('editor-lines').textContent = `${lines} lines`;
    document.getElementById('editor-chars').textContent = `${chars} chars`;
    document.getElementById('editor-size').textContent = size;
}

// Update cursor display
function updateCursorDisplay() {
    document.getElementById('editor-cursor').textContent = 
        `Ln ${state.cursorLine}, Col ${state.cursorColumn}`;
}

// Parse code for symbols (for outline)
function parseSymbols(code, language) {
    const symbols = [];
    const lines = code.split('\n');
    let id = 0;
    
    lines.forEach((line, index) => {
        const trimmed = line.trim();
        
        if (language === 'javascript' || language === 'typescript') {
            // Functions
            const functionMatch = trimmed.match(/^(?:export\s+)?(?:async\s+)?function\s+(\w+)/);
            if (functionMatch) {
                symbols.push({
                    id: `sym-${id++}`,
                    name: functionMatch[1],
                    type: 'function',
                    line: index + 1,
                });
            }
            
            // Arrow functions
            const arrowMatch = trimmed.match(/^(?:export\s+)?(?:const|let)\s+(\w+)\s*=\s*(?:async\s+)?\(?.*?\)?\s*=>/);
            if (arrowMatch) {
                symbols.push({
                    id: `sym-${id++}`,
                    name: arrowMatch[1],
                    type: 'function',
                    line: index + 1,
                });
            }
            
            // Classes
            const classMatch = trimmed.match(/^(?:export\s+)?class\s+(\w+)/);
            if (classMatch) {
                symbols.push({
                    id: `sym-${id++}`,
                    name: classMatch[1],
                    type: 'class',
                    line: index + 1,
                });
            }
            
            // Const/Let variables
            const constMatch = trimmed.match(/^(?:export\s+)?const\s+(\w+)\s*[:=](?!\s*(?:async\s+)?\(?.*?\)?\s*=>)/);
            if (constMatch && !trimmed.includes('=>')) {
                symbols.push({
                    id: `sym-${id++}`,
                    name: constMatch[1],
                    type: 'variable',
                    line: index + 1,
                });
            }
        }
    });
    
    return symbols;
}

// Update code outline
function updateOutline() {
    setTimeout(() => {
        const symbols = parseSymbols(state.currentCode, state.currentLanguage);
        
        const loadingEl = document.getElementById('outline-loading');
        const treeEl = document.getElementById('outline-tree');
        const emptyEl = document.getElementById('outline-empty');
        
        loadingEl.style.display = 'none';
        
        if (symbols.length === 0) {
            treeEl.style.display = 'none';
            emptyEl.style.display = 'flex';
            document.getElementById('symbol-count').textContent = '0 symbols found';
            return;
        }
        
        emptyEl.style.display = 'none';
        treeEl.style.display = 'block';
        
        // Group symbols by type
        const groups = {
            functions: symbols.filter(s => s.type === 'function'),
            classes: symbols.filter(s => s.type === 'class'),
            variables: symbols.filter(s => s.type === 'variable'),
        };
        
        let html = '';
        
        if (groups.functions.length > 0) {
            html += `<div class="outline-group">
                <div class="outline-group-title">Functions (${groups.functions.length})</div>`;
            groups.functions.forEach(symbol => {
                html += createOutlineItem(symbol);
            });
            html += '</div>';
        }
        
        if (groups.classes.length > 0) {
            html += `<div class="outline-group">
                <div class="outline-group-title">Classes (${groups.classes.length})</div>`;
            groups.classes.forEach(symbol => {
                html += createOutlineItem(symbol);
            });
            html += '</div>';
        }
        
        if (groups.variables.length > 0) {
            html += `<div class="outline-group">
                <div class="outline-group-title">Variables (${groups.variables.length})</div>`;
            groups.variables.forEach(symbol => {
                html += createOutlineItem(symbol);
            });
            html += '</div>';
        }
        
        treeEl.innerHTML = html;
        
        // Initialize icons
        initIcons();
        
        // Add click handlers
        treeEl.querySelectorAll('.outline-item').forEach(item => {
            item.addEventListener('click', () => {
                const line = parseInt(item.dataset.line);
                scrollToLine(line);
            });
        });
        
        document.getElementById('symbol-count').textContent = 
            `${symbols.length} symbol${symbols.length !== 1 ? 's' : ''} found`;
    }, 300);
}

// Create outline item HTML
function createOutlineItem(symbol) {
    const iconName = {
        function: 'function-square',
        class: 'braces',
        variable: 'variable',
    }[symbol.type] || 'hash';
    
    const colorClass = `symbol-${symbol.type}`;
    
    return `
        <button class="outline-item" data-line="${symbol.line}">
            <i data-icon="${iconName}" class="${colorClass}"></i>
            <span class="outline-item-name">${symbol.name}</span>
            <span class="outline-item-line">L${symbol.line}</span>
        </button>
    `;
}

// Scroll to line in editor
function scrollToLine(lineNumber) {
    if (!state.editorView) return;
    
    try {
        const line = state.editorView.state.doc.line(lineNumber);
        state.editorView.dispatch({
            selection: { anchor: line.from, head: line.from },
            scrollIntoView: true,
        });
        state.editorView.focus();
        showToast('Jumped to line ' + lineNumber, 'success');
    } catch (error) {
        console.error('Error scrolling to line:', error);
    }
}

// Render file tree
function renderFileTree() {
    const container = document.getElementById('file-tree');
    
    function renderItem(item, level = 0) {
        const isFolder = item.type === 'folder';
        const icon = isFolder ? 'folder' : getFileIcon(item.name);
        const paddingLeft = level * 12 + 8;
        
        let html = `
            <button class="file-tree-item" data-id="${item.id}" style="padding-left: ${paddingLeft}px;">
                ${isFolder ? '<i data-icon="chevron-right" class="chevron"></i>' : '<span style="width: 12px;"></span>'}
                <i data-icon="${icon}"></i>
                <span>${item.name}</span>
            </button>
        `;
        
        if (isFolder && item.children) {
            item.children.forEach(child => {
                html += renderItem(child, level + 1);
            });
        }
        
        return html;
    }
    
    let html = '';
    fileTreeData.forEach(item => {
        html += renderItem(item);
    });
    
    container.innerHTML = html;
    document.getElementById('file-count').textContent = `${countFiles(fileTreeData)} items`;
    
    // Initialize icons
    initIcons();
}

// Get file icon based on extension
function getFileIcon(filename) {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'js':
        case 'jsx':
        case 'ts':
        case 'tsx':
            return 'file-code';
        case 'json':
            return 'file-json';
        case 'md':
            return 'file-text';
        case 'css':
        case 'scss':
            return 'file-code';
        case 'html':
            return 'file-code';
        default:
            return 'file';
    }
}

// Count files in tree
function countFiles(items) {
    let count = 0;
    items.forEach(item => {
        count++;
        if (item.children) {
            count += countFiles(item.children);
        }
    });
    return count;
}

// Show toast notification
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 'alert-circle';
    
    toast.innerHTML = `
        <i data-icon="${icon}"></i>
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    initIcons();
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Editor actions
function editorUndo() {
    if (state.editorView) {
        undo(state.editorView);
    }
}

function editorRedo() {
    if (state.editorView) {
        redo(state.editorView);
    }
}

function editorSearch() {
    if (state.editorView) {
        openSearchPanel(state.editorView);
    }
}

function editorToggleWrap() {
    state.isWrapped = !state.isWrapped;
    // Recreate editor with new wrap setting
    if (state.editorView) {
        state.editorView.destroy();
        initEditor();
    }
    showToast(`Line wrap ${state.isWrapped ? 'enabled' : 'disabled'}`, 'success');
}

function editorCopy() {
    if (state.editorView) {
        const content = state.editorView.state.doc.toString();
        navigator.clipboard.writeText(content);
        showToast('Code copied to clipboard', 'success');
    }
}

function editorDownload() {
    const content = state.currentCode;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = state.currentFilename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${state.currentFilename}`, 'success');
}

function editorUpload() {
    document.getElementById('file-input').click();
}

function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            state.currentCode = content;
            state.currentFilename = file.name;
            
            // Auto-detect language
            const ext = file.name.split('.').pop()?.toLowerCase();
            const langMap = {
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
                state.currentLanguage = langMap[ext];
            }
            
            // Update editor
            if (state.editorView) {
                state.editorView.destroy();
                initEditor();
            }
            
            // Update UI
            document.getElementById('editor-filename').textContent = state.currentFilename;
            document.getElementById('editor-language-footer').textContent = 
                state.currentLanguage.charAt(0).toUpperCase() + state.currentLanguage.slice(1);
            
            showToast(`Loaded ${file.name}`, 'success');
        };
        reader.readAsText(file);
    }
}

function editorToggleFullscreen() {
    const container = document.getElementById('editor-container');
    
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            showToast('Fullscreen not available', 'error');
        });
    } else {
        document.exitFullscreen();
    }
}

// Sidebar toggles
function toggleLeftSidebar() {
    state.leftSidebarOpen = !state.leftSidebarOpen;
    const sidebar = document.getElementById('left-sidebar');
    if (state.leftSidebarOpen) {
        sidebar.classList.add('sidebar-open');
    } else {
        sidebar.classList.remove('sidebar-open');
    }
}

function toggleRightSidebar() {
    state.rightSidebarOpen = !state.rightSidebarOpen;
    const sidebar = document.getElementById('right-sidebar');
    if (state.rightSidebarOpen) {
        sidebar.classList.add('sidebar-open');
    } else {
        sidebar.classList.remove('sidebar-open');
    }
}

// Initialize icons
function initIcons() {
    // Replace all [data-icon] elements with actual SVG icons
    document.querySelectorAll('[data-icon]').forEach(el => {
        const iconName = el.getAttribute('data-icon');
        el.innerHTML = getIcon(iconName);
    });
}

// Initialize application
function init() {
    // Initialize icons
    initIcons();
    
    // Initialize editor
    initEditor();
    
    // Render file tree
    renderFileTree();
    
    // Event listeners
    document.getElementById('toggle-left-sidebar').addEventListener('click', toggleLeftSidebar);
    document.getElementById('toggle-right-sidebar').addEventListener('click', toggleRightSidebar);
    document.getElementById('close-right-sidebar').addEventListener('click', toggleRightSidebar);
    
    document.getElementById('editor-undo').addEventListener('click', editorUndo);
    document.getElementById('editor-redo').addEventListener('click', editorRedo);
    document.getElementById('editor-search').addEventListener('click', editorSearch);
    document.getElementById('editor-wrap').addEventListener('click', editorToggleWrap);
    document.getElementById('editor-copy').addEventListener('click', editorCopy);
    document.getElementById('editor-download').addEventListener('click', editorDownload);
    document.getElementById('editor-upload').addEventListener('click', editorUpload);
    document.getElementById('editor-fullscreen').addEventListener('click', editorToggleFullscreen);
    
    document.getElementById('file-input').addEventListener('change', handleFileUpload);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            showToast('Changes saved', 'success');
        }
    });
    
    console.log('Code Canvas initialized');
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

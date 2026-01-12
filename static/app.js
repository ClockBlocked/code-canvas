// ========================================
// GitHub-Style Code Editor - Static Version
// ========================================

// Sample Code
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

export default UserProfile;`;

// File Tree Data
const fileTreeData = [
  { id: '1', name: 'src', type: 'folder' },
  { id: '2', name: 'components', type: 'folder' },
  { id: '3', name: 'hooks', type: 'folder' },
  { id: '4', name: 'useAuth.tsx', type: 'file', ext: 'tsx' },
  { id: '5', name: 'useTheme.ts', type: 'file', ext: 'ts' },
  { id: '6', name: 'App.tsx', type: 'file', ext: 'tsx' },
  { id: '7', name: 'index.tsx', type: 'file', ext: 'tsx' },
  { id: '8', name: 'package.json', type: 'file', ext: 'json' },
  { id: '9', name: 'README.md', type: 'file', ext: 'md' },
  { id: '10', name: 'styles.css', type: 'file', ext: 'css' },
];

// State
let state = {
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  code: SAMPLE_CODE,
  selectedFileId: '4',
  hasChanges: false,
  lastSaved: null,
};

// DOM Elements
const elements = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  cacheElements();
  setupEventListeners();
  renderApp();
  simulateLoading();
});

function cacheElements() {
  elements.loadingScreen = document.getElementById('loading-screen');
  elements.app = document.getElementById('app');
  elements.leftSidebar = document.getElementById('left-sidebar');
  elements.rightSidebar = document.getElementById('right-sidebar');
  elements.toggleLeftSidebar = document.getElementById('toggle-left-sidebar');
  elements.toggleRightSidebar = document.getElementById('toggle-right-sidebar');
  elements.closeRightSidebar = document.getElementById('close-right-sidebar');
  elements.fileTree = document.getElementById('file-tree');
  elements.fileCount = document.getElementById('file-count');
  elements.fileSearch = document.getElementById('file-search');
  elements.codeDisplay = document.getElementById('code-display');
  elements.lineNumbers = document.getElementById('line-numbers');
  elements.outlineContent = document.getElementById('outline-content');
  elements.symbolCount = document.getElementById('symbol-count');
  elements.lineCount = document.getElementById('line-count');
  elements.charCount = document.getElementById('char-count');
  elements.fileSize = document.getElementById('file-size');
  elements.cursorLine = document.getElementById('cursor-line');
  elements.cursorCol = document.getElementById('cursor-col');
  elements.lastSaved = document.getElementById('last-saved');
  elements.modifiedBadge = document.getElementById('modified-badge');
  elements.toast = document.getElementById('toast');
  elements.toastMessage = document.getElementById('toast-message');
  elements.repoDropdownTrigger = document.getElementById('repo-dropdown-trigger');
  elements.repoDropdown = document.getElementById('repo-dropdown');
  
  // Buttons
  elements.btnCopy = document.getElementById('btn-copy');
  elements.btnDownload = document.getElementById('btn-download');
  elements.btnUpload = document.getElementById('btn-upload');
  elements.btnUndo = document.getElementById('btn-undo');
  elements.btnRedo = document.getElementById('btn-redo');
  elements.btnTheme = document.getElementById('btn-theme');
  elements.btnFullscreen = document.getElementById('btn-fullscreen');
}

function setupEventListeners() {
  // Sidebar toggles
  elements.toggleLeftSidebar.addEventListener('click', toggleLeftSidebar);
  elements.toggleRightSidebar.addEventListener('click', toggleRightSidebar);
  elements.closeRightSidebar.addEventListener('click', toggleRightSidebar);
  
  // File search
  elements.fileSearch.addEventListener('input', handleFileSearch);
  
  // Editor buttons
  elements.btnCopy.addEventListener('click', handleCopy);
  elements.btnDownload.addEventListener('click', handleDownload);
  
  // Dropdown
  elements.repoDropdownTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    elements.repoDropdown.classList.toggle('open');
  });
  
  document.addEventListener('click', () => {
    elements.repoDropdown.classList.remove('open');
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyDown);
}

function simulateLoading() {
  setTimeout(() => {
    elements.loadingScreen.classList.add('hidden');
    elements.app.classList.remove('hidden');
  }, 800);
}

function renderApp() {
  renderFileTree();
  renderCodeEditor();
  renderOutline();
  updateStats();
}

function renderFileTree(filter = '') {
  const filtered = fileTreeData.filter(file => 
    file.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  elements.fileTree.innerHTML = filtered.map(file => {
    const iconClass = getFileIconClass(file);
    const isSelected = file.id === state.selectedFileId;
    
    return `
      <button class="file-tree-item ${isSelected ? 'selected' : ''}" data-id="${file.id}">
        ${file.type === 'folder' ? `
          <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        ` : '<span style="width: 0.75rem"></span>'}
        <svg class="${iconClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${getFileIconPath(file)}
        </svg>
        <span class="file-name">${file.name}</span>
      </button>
    `;
  }).join('');
  
  elements.fileCount.textContent = `${filtered.length} items`;
  
  // Add click handlers
  elements.fileTree.querySelectorAll('.file-tree-item').forEach(item => {
    item.addEventListener('click', () => {
      state.selectedFileId = item.dataset.id;
      renderFileTree(filter);
    });
  });
}

function getFileIconClass(file) {
  if (file.type === 'folder') return 'file-icon-folder';
  switch (file.ext) {
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
      return 'file-icon-code';
    case 'json':
      return 'file-icon-json';
    case 'css':
    case 'scss':
      return 'file-icon-css';
    case 'md':
      return 'file-icon-md';
    default:
      return '';
  }
}

function getFileIconPath(file) {
  if (file.type === 'folder') {
    return '<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>';
  }
  return '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>';
}

function renderCodeEditor() {
  const lines = state.code.split('\n');
  
  // Line numbers
  elements.lineNumbers.innerHTML = lines.map((_, i) => 
    `<span>${i + 1}</span>`
  ).join('');
  
  // Syntax highlighted code
  elements.codeDisplay.innerHTML = highlightCode(state.code);
}

function highlightCode(code) {
  // Basic syntax highlighting
  let highlighted = escapeHtml(code);
  
  // Keywords
  const keywords = ['import', 'export', 'from', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'try', 'catch', 'finally', 'async', 'await', 'class', 'extends', 'new', 'this', 'null', 'true', 'false', 'interface', 'type', 'default'];
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b(${kw})\\b`, 'g');
    highlighted = highlighted.replace(regex, '<span class="keyword">$1</span>');
  });
  
  // Strings
  highlighted = highlighted.replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '<span class="string">$&</span>');
  
  // Comments
  highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');
  highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
  
  // Types
  highlighted = highlighted.replace(/:\s*([A-Z][a-zA-Z0-9]*(?:<[^>]+>)?)/g, ': <span class="type">$1</span>');
  
  // Function calls
  highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, '<span class="function">$1</span>(');
  
  // Numbers
  highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
  
  return highlighted;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderOutline() {
  const symbols = parseSymbols(state.code);
  
  const grouped = {
    functions: symbols.filter(s => s.type === 'function'),
    interfaces: symbols.filter(s => s.type === 'interface'),
    types: symbols.filter(s => s.type === 'type'),
    variables: symbols.filter(s => s.type === 'const' || s.type === 'variable'),
  };
  
  let html = '';
  
  if (grouped.functions.length > 0) {
    html += renderOutlineGroup('Functions', grouped.functions, 'function');
  }
  if (grouped.interfaces.length > 0) {
    html += renderOutlineGroup('Interfaces', grouped.interfaces, 'interface');
  }
  if (grouped.types.length > 0) {
    html += renderOutlineGroup('Types', grouped.types, 'type');
  }
  if (grouped.variables.length > 0) {
    html += renderOutlineGroup('Variables', grouped.variables, 'const');
  }
  
  elements.outlineContent.innerHTML = html || `
    <div style="text-align: center; padding: 2rem; color: var(--muted-foreground);">
      <p>No symbols found</p>
    </div>
  `;
  
  elements.symbolCount.textContent = `${symbols.length} symbol${symbols.length !== 1 ? 's' : ''} found`;
}

function renderOutlineGroup(title, items, type) {
  return `
    <div class="outline-group">
      <div class="outline-group-title">${title} (${items.length})</div>
      ${items.map(item => `
        <button class="outline-item" data-line="${item.line}">
          <svg class="symbol-${type}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${getSymbolIconPath(type)}
          </svg>
          <span class="item-name">${item.name}</span>
          <span class="item-line">L${item.line}</span>
        </button>
      `).join('')}
    </div>
  `;
}

function getSymbolIconPath(type) {
  switch (type) {
    case 'function':
      return '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="m10 8 4 4-4 4"/>';
    case 'interface':
    case 'type':
      return '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/>';
    case 'const':
    case 'variable':
      return '<path d="M16 16s-2-2-4-2-4 2-4 2"/><path d="M12 14V4"/><path d="M12 4c2 0 4 2 4 2"/><path d="M12 4c-2 0-4 2-4 2"/>';
    default:
      return '<circle cx="12" cy="12" r="10"/>';
  }
}

function parseSymbols(code) {
  const symbols = [];
  const lines = code.split('\n');
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // Functions
    const funcMatch = trimmed.match(/^(?:export\s+)?(?:async\s+)?function\s+(\w+)/);
    if (funcMatch) {
      symbols.push({ name: funcMatch[1], type: 'function', line: index + 1 });
    }
    
    // Arrow functions
    const arrowMatch = trimmed.match(/^(?:export\s+)?(?:const|let)\s+(\w+)\s*=\s*(?:async\s+)?\(?.*?\)?\s*=>/);
    if (arrowMatch) {
      symbols.push({ name: arrowMatch[1], type: 'function', line: index + 1 });
    }
    
    // Interfaces
    const interfaceMatch = trimmed.match(/^(?:export\s+)?interface\s+(\w+)/);
    if (interfaceMatch) {
      symbols.push({ name: interfaceMatch[1], type: 'interface', line: index + 1 });
    }
    
    // Types
    const typeMatch = trimmed.match(/^(?:export\s+)?type\s+(\w+)/);
    if (typeMatch) {
      symbols.push({ name: typeMatch[1], type: 'type', line: index + 1 });
    }
  });
  
  return symbols;
}

function updateStats() {
  const lines = state.code.split('\n');
  const chars = state.code.length;
  const bytes = new Blob([state.code]).size;
  
  elements.lineCount.textContent = lines.length;
  elements.charCount.textContent = chars.toLocaleString();
  elements.fileSize.textContent = formatBytes(bytes);
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function toggleLeftSidebar() {
  state.leftSidebarOpen = !state.leftSidebarOpen;
  elements.leftSidebar.classList.toggle('collapsed', !state.leftSidebarOpen);
}

function toggleRightSidebar() {
  state.rightSidebarOpen = !state.rightSidebarOpen;
  elements.rightSidebar.classList.toggle('collapsed', !state.rightSidebarOpen);
}

function handleFileSearch(e) {
  renderFileTree(e.target.value);
}

function handleCopy() {
  navigator.clipboard.writeText(state.code).then(() => {
    showToast('Code copied to clipboard');
  });
}

function handleDownload() {
  const blob = new Blob([state.code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'useAuth.tsx';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Downloaded useAuth.tsx');
}

function handleKeyDown(e) {
  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
    e.preventDefault();
    state.lastSaved = new Date();
    state.hasChanges = false;
    elements.lastSaved.textContent = state.lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    elements.modifiedBadge.classList.add('hidden');
    showToast('Changes saved');
  }
  
  if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
    e.preventDefault();
    showToast('Search: Use Ctrl+F in browser');
  }
}

function showToast(message) {
  elements.toastMessage.textContent = message;
  elements.toast.classList.add('show');
  
  setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 3000);
}

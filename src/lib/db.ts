// IndexedDB wrapper for repositories and files storage

const DB_NAME = "GitDevDB";
const DB_VERSION = 1;

export interface Repository {
  id: string;
  name: string;
  description?: string;
  language?: string;
  stars: number;
  forks: number;
  updatedAt: Date;
  isPrivate: boolean;
}

export interface FileItem {
  id: string;
  repoId: string;
  name: string;
  path: string;
  type: "file" | "folder";
  content?: string;
  size?: number;
  language?: string;
  updatedAt: Date;
}

let db: IDBDatabase | null = null;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Repositories store
      if (!database.objectStoreNames.contains("repositories")) {
        const repoStore = database.createObjectStore("repositories", { keyPath: "id" });
        repoStore.createIndex("name", "name", { unique: false });
      }

      // Files store
      if (!database.objectStoreNames.contains("files")) {
        const fileStore = database.createObjectStore("files", { keyPath: "id" });
        fileStore.createIndex("repoId", "repoId", { unique: false });
        fileStore.createIndex("path", "path", { unique: false });
      }
    };
  });
};

// Repository operations
export const getAllRepositories = async (): Promise<Repository[]> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["repositories"], "readonly");
    const store = transaction.objectStore("repositories");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getRepository = async (id: string): Promise<Repository | undefined> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["repositories"], "readonly");
    const store = transaction.objectStore("repositories");
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const addRepository = async (repo: Repository): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["repositories"], "readwrite");
    const store = transaction.objectStore("repositories");
    const request = store.add(repo);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const updateRepository = async (repo: Repository): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["repositories"], "readwrite");
    const store = transaction.objectStore("repositories");
    const request = store.put(repo);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const deleteRepository = async (id: string): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["repositories"], "readwrite");
    const store = transaction.objectStore("repositories");
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// File operations
export const getFilesByRepo = async (repoId: string): Promise<FileItem[]> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["files"], "readonly");
    const store = transaction.objectStore("files");
    const index = store.index("repoId");
    const request = index.getAll(repoId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getFile = async (id: string): Promise<FileItem | undefined> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["files"], "readonly");
    const store = transaction.objectStore("files");
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const addFile = async (file: FileItem): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["files"], "readwrite");
    const store = transaction.objectStore("files");
    const request = store.add(file);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const updateFile = async (file: FileItem): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["files"], "readwrite");
    const store = transaction.objectStore("files");
    const request = store.put(file);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const deleteFile = async (id: string): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(["files"], "readwrite");
    const store = transaction.objectStore("files");
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Seed initial data
export const seedDatabase = async (): Promise<void> => {
  const repos = await getAllRepositories();
  if (repos.length > 0) return;

  const sampleRepos: Repository[] = [
    {
      id: "repo-1",
      name: "myRepo",
      description: "A sample repository for demonstration",
      language: "TypeScript",
      stars: 42,
      forks: 12,
      updatedAt: new Date(),
      isPrivate: false,
    },
    {
      id: "repo-2",
      name: "react-components",
      description: "Reusable React component library",
      language: "TypeScript",
      stars: 156,
      forks: 34,
      updatedAt: new Date(Date.now() - 86400000),
      isPrivate: false,
    },
    {
      id: "repo-3",
      name: "api-server",
      description: "REST API backend service",
      language: "Python",
      stars: 89,
      forks: 21,
      updatedAt: new Date(Date.now() - 172800000),
      isPrivate: true,
    },
  ];

  const sampleFiles: FileItem[] = [
    {
      id: "file-1",
      repoId: "repo-1",
      name: "src",
      path: "/src",
      type: "folder",
      updatedAt: new Date(),
    },
    {
      id: "file-2",
      repoId: "repo-1",
      name: "components",
      path: "/src/components",
      type: "folder",
      updatedAt: new Date(),
    },
    {
      id: "file-3",
      repoId: "repo-1",
      name: "useAuth.tsx",
      path: "/src/hooks/useAuth.tsx",
      type: "file",
      size: 2048,
      language: "typescript",
      content: `import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auth logic here
    setLoading(false);
  }, []);

  return { user, loading };
}`,
      updatedAt: new Date(),
    },
    {
      id: "file-4",
      repoId: "repo-1",
      name: "Button.tsx",
      path: "/src/components/Button.tsx",
      type: "file",
      size: 1024,
      language: "typescript",
      content: `import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children }: ButtonProps) => {
  return (
    <button className={cn('px-4 py-2 rounded', variant === 'primary' && 'bg-primary')}>
      {children}
    </button>
  );
};`,
      updatedAt: new Date(),
    },
    {
      id: "file-5",
      repoId: "repo-1",
      name: "README.md",
      path: "/README.md",
      type: "file",
      size: 512,
      language: "markdown",
      content: `# myRepo

A sample repository for demonstration purposes.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features

- Modern React with TypeScript
- Tailwind CSS styling
- Component-based architecture
`,
      updatedAt: new Date(),
    },
    {
      id: "file-6",
      repoId: "repo-1",
      name: "package.json",
      path: "/package.json",
      type: "file",
      size: 768,
      language: "json",
      content: `{
  "name": "my-repo",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}`,
      updatedAt: new Date(),
    },
    {
      id: "file-7",
      repoId: "repo-1",
      name: "index.css",
      path: "/src/index.css",
      type: "file",
      size: 256,
      language: "css",
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: system-ui, sans-serif;
}`,
      updatedAt: new Date(),
    },
  ];

  for (const repo of sampleRepos) {
    await addRepository(repo);
  }
  for (const file of sampleFiles) {
    await addFile(file);
  }
};

# Code Canvas

A GitHub-style code editor built with vanilla JavaScript and CodeMirror 6.

## Features

- 🎨 **GitHub Dark Dimmed Theme** - Beautiful dark theme matching GitHub's design
- 📝 **Syntax Highlighting** - Support for JavaScript, TypeScript, Python, HTML, CSS, JSON, and Markdown
- 🔍 **Code Outline** - Functional right sidebar showing functions, classes, and variables
- 📁 **File Explorer** - Left sidebar with file tree navigation
- 🔎 **Search & Replace** - Built-in search functionality
- 📊 **Line Numbers** - Clear line numbering and code folding
- ⌨️ **Keyboard Shortcuts** - Full keyboard support (Ctrl+S, Ctrl+F, Ctrl+Z, etc.)
- 📤 **Import/Export** - Upload and download files
- 🖥️ **Fullscreen Mode** - Focus on your code

## Technologies

This project is built with:

- **HTML5** - Semantic markup
- **CSS3** - Custom styling with GitHub Dark Dimmed theme
- **Vanilla JavaScript (ES6+)** - No frameworks, just pure JavaScript
- **CodeMirror 6** - Powerful code editor component
- **Vite** - Fast build tool and dev server

## Getting Started

### Prerequisites

- Node.js 16+ and npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone https://github.com/ClockBlocked/code-canvas.git

# Navigate to the project directory
cd code-canvas

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will open at http://localhost:5173

### Build for Production

```sh
# Build the project
npm run build

# Preview the production build
npm run preview
```

## Usage

### Editor Controls

- **Toggle Left Sidebar** - Show/hide file explorer
- **Toggle Right Sidebar** - Show/hide code outline
- **Undo/Redo** - Standard undo/redo operations
- **Search** - Find and replace in code
- **Line Wrap** - Toggle line wrapping
- **Copy** - Copy code to clipboard
- **Download** - Save file to disk
- **Upload** - Load file from disk
- **Fullscreen** - Toggle fullscreen mode

### Keyboard Shortcuts

- `Ctrl+S` - Save (shows notification)
- `Ctrl+F` - Open search panel
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Tab` - Indent

### Code Outline

The right sidebar displays a structured outline of your code:
- Functions with line numbers
- Classes with line numbers
- Variables with line numbers

Click any symbol to jump to its location in the editor.

## Project Structure

```
code-canvas/
├── index.html      # Main HTML file
├── styles.css      # GitHub Dark Dimmed theme and styling
├── app.js          # Main application logic and CodeMirror setup
├── icons.js        # SVG icon definitions
├── vite.config.js  # Vite configuration
└── package.json    # Dependencies (CodeMirror only)
```

## License

MIT

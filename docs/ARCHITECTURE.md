# Architecture Overview

Modular Sticky utilizes a standard secure Electron architecture.

## 1. Process Model

- **Main Process (`main.js`)**
  - Handles application lifecycle (`app.whenReady()`).
  - Manages `BrowserWindow` creation (Main Manager vs. Note windows).
  - Owns all OS-level interactions (filesystem I/O, dialogs).
  - Maintains the atomic JSON store for notes.
  
- **Preload Script (`preload.js`)**
  - Bridges communication using `contextBridge.exposeInMainWorld`.
  - Exposes an `electronAPI` object with strict, verified channels.
  - No native Node.js libraries (`fs`, `child_process`) are accessible by the renderer.

- **Renderer Processes (`renderer.js` / `main-renderer.js`)**
  - Pure front-end UI logic running in Chromium.
  - Vanilla JS, HTML5, and CSS3.
  - Communicates with the main process exclusively via the exposed `electronAPI`.

## 2. Data Storage (Atomic JSON)

Notes are persisted to disk at `app.getPath('userData')/notes.json`. 
To prevent file corruption during sudden power loss or crashes, the application uses an atomic write mechanism:
1. Write temporary file to `notes.json.tmp`.
2. Perform a synchronous file rename: `fs.renameSync('notes.json.tmp', 'notes.json')`.
3. If corruption is detected at launch, a backup is created and the store is reset.

## 3. UI/UX Paradigm

The application employs a Neo-Noir Glass design system:
- **Manager Window**: Centralized dashboard to view all active notes, statistics, and pin states. Features a transparent glass backdrop.
- **Note Windows**: Frameless, draggable windows restricted to specific background colors. Contrast ratio is algorithmically determined to ensure text readability.

## 4. Real-time Synchronization

When a note is created, updated, or deleted, `main.js` broadcasts a `notes-state-update` event to the Manager window. This ensures the dashboard stays completely synchronized with the individual note windows across the desktop.

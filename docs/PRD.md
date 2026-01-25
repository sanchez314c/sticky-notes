# Product Requirements Document (PRD)

## 1. Executive Summary
Modular Sticky is a simple, elegant, and secure sticky notes application built with Electron. It allows users to create, manage, and customize floating sticky notes directly on their desktop. It features a modern, Neo-Noir glass-styled centralized manager window for an overview of all active notes, real-time synchronization between the manager and individual note windows, and a robust atomic storage mechanism to prevent data corruption.

## 2. Tech Stack
- **Framework**: Electron (v37.4.0)
- **Language**: JavaScript (Node.js for Main, Vanilla JS for Renderer)
- **Frontend**: HTML5, CSS3, Vanilla JS
- **Packaging**: electron-builder (v26.0.12)
- **Unique Dependencies**: `uuid` (for generating unique note identifiers)
- **Linting/Formatting**: ESLint, Prettier, TypeScript (for type checking)

## 3. Architecture Overview
The application follows a standard Electron multi-process architecture to ensure stability and security:
- **Main Process (`main.js`)**: Manages the application lifecycle, window instantiation, IPC communication routing, and direct disk I/O.
- **Preload Script (`preload.js`)**: Utilizes `contextBridge` to expose a secure, locked-down `electronAPI` to the renderer processes, fully encapsulating IPC calls.
- **Main Manager Renderer (`main-renderer.js` + `main.html`)**: Serves as the central control panel. It renders a grid of all active notes, statistics, and global actions.
- **Note Renderer (`renderer.js` + `note.html`)**: Handles individual note interactions including text input, auto-saving, color switching, and window controls (pin, minimize, close).
- **Data Storage**: A custom atomic store implementation inside `main.js` reads/writes JSON to the OS's `userData/notes.json` directory. It uses `.tmp` files and `fs.renameSync` to ensure disk-write atomicity and crash resilience.

## 4. Data Models

### Note Object
- `id` (string, UUID v4): Unique identifier.
- `content` (string): Text content of the note (Max 1 MB limit).
- `backgroundColor` (string): Hex color code (e.g., `#ffeb3b`).
- `x` (number): Screen X coordinate.
- `y` (number): Screen Y coordinate.
- `width` (number): Window width (min 200).
- `height` (number): Window height (min 200).
- `fontSize` (number): Font size for text content (range: 8 - 72).

### Notes State Snapshot
*(Broadcasted from Main to Manager window)*
- `notes` (Array of objects): Note summaries containing `id`, `content`, `backgroundColor`, and `isPinned` (boolean).
- `openCount` (number): Total count of actively rendered note windows.

## 5. API Specification

### IPC Handlers (Main <- Renderer)
- `create-note()`: Instantiates a new note window.
- `close-note(id)`: Closes a specific note window based on UUID.
- `save-note-content(id, content)`: Saves text content to the store.
- `update-note-color(id, color)`: Updates note background color.
- `minimize-note(id)`: Minimizes the specific note window.
- `toggle-always-on-top(id)`: Toggles note pinning (always on top). Returns new boolean state.
- `focus-note(id)`: Restores and focuses a specific note window.
- `main-window-minimize()`: Minimizes the manager window.
- `main-window-maximize()`: Toggles manager window maximization.
- `main-window-close()`: Closes the manager window.
- `request-notes-state()`: Returns the current notes state snapshot.
- `open-external(url)`: Validates and opens HTTP(S)/Mailto URLs in the default OS browser.

### IPC Events (Main -> Renderer)
- `load-note(data)`: Sent to a note window upon initial load to hydrate the view.
- `request-save()`: Sent to note windows before app quit to force a synchronous save.
- `notes-state-update(data)`: Broadcasts the full notes state to the manager window whenever a note is mutated (created, deleted, changed, pinned).
- `note-pin-changed(data)`: Event handler exposed via preload for future pin state reactivity.

## 6. Feature Catalog
- **Multiple Sticky Notes**: Create independent, draggable, and resizable note windows across the desktop.
- **Customizable Colors**: Select from 8 pre-defined colors per note. Contrast formulas auto-adjust text color (dark/light) for readability.
- **Pinning**: Toggle "Always on Top" for individual notes so they hover above other applications.
- **Manager Dashboard**: A centralized dashboard to view visual representations of all notes, open counts, and pinned counts.
- **Auto-save**: Content changes auto-save with a 1-second debounce. Window position/size changes save with a 300ms debounce.
- **Keyboard Shortcuts**: Cross-platform shortcuts (Cmd/Ctrl + N, W, S, M, T) for quick note management.
- **Crash-Resilient Storage**: Atomic saves to prevent JSON corruption. If corruption is detected at startup, corrupt files are backed up automatically.

## 7. User Interface Specification

### Main Manager Window
- **Theme**: Neo-Noir Glass Monitor design system featuring dark backgrounds (`#0a0b0e`), glass highlights, and teal accents (`#14b8a6`).
- **Layout**:
  - Frameless window with custom draggable title bar.
  - Action icons for About and Settings.
  - Standard circular window controls (Min/Max/Close).
  - Hero Card for "New Note" creation.
  - Metrics row displaying Total Notes, Open, and Pinned counts.
  - Dynamic Grid layout displaying visual cards for active notes showing color strips and content previews.
- **Modals**: About and Settings modals load over glass-blur overlays.

### Individual Note Window
- **Theme**: Translucent, frameless background tailored to the user-selected color.
- **Layout**:
  - Draggable header featuring Title and top-right controls (Pin, New, Minimize, Close).
  - Main text area with scrollbar styling that matches note aesthetics.
  - Footer with 8 color selection dots and a custom bottom-right resize handle.
  - Dynamic text coloring dependent on the RGB brightness of the background color.

## 8. Authentication & Authorization
- **None Required**: This is a local desktop application running exclusively within the user's OS context.
- **Input Sanitization**: All IPC commands perform explicit validation (e.g., verifying UUID string formats and strictly matching Hex color regexes) before applying modifications to the store.

## 9. Background Processes
- **Debounced Saves**:
  - Text input triggers a `1000ms` debounce timer.
  - Position updates trigger a `300ms` debounce timer.
  - Dimension updates trigger a `300ms` debounce timer.
- **Scheduled Flush**: Changes are flagged as `dirty` and a `store.scheduledFlush` is executed after `200ms` to batch multiple simultaneous UI updates into a single disk write.
- **State Broadcast**: The Main process autonomously broadcasts state updates to the Manager window whenever a note lifecycle event triggers.

## 10. External Integrations
- **No 3rd-Party Cloud APIs**: The application operates entirely offline.
- **OS Shell**: Integrates with the OS shell via `shell.openExternal` exclusively for whitelisted protocols (`http:`, `https:`, `mailto:`) to prevent malicious execution (e.g. `file://`).

## 11. Configuration & Environment
- **Storage Location**: Reads/writes primarily to `app.getPath('userData')/notes.json`.
- **Packaging Targets**:
  - Mac: dmg, zip, pkg, mas
  - Windows: nsis, msi, portable, zip
  - Linux: AppImage, deb, rpm, snap, tar.xz
- **Linux Specifics**: Specific command-line switches (`enable-transparent-visuals`, `disable-gpu-compositing`, `no-sandbox`) are applied before `app.whenReady()` to ensure transparent windows render correctly on Linux environments.

## 12. Infrastructure Requirements
- **Runtime**: Electron / Node.js
- **OS**: Windows, macOS, or Linux (X11/Wayland with compositing enabled for transparency).
- **Packaging**: Standard multi-platform build infrastructure via `electron-builder`.

## 13. Security Requirements
- **Renderer Restrictions**: `nodeIntegration: false` and `contextIsolation: true` are strictly enforced on all WebPreferences configurations.
- **API Exclusivity**: Preload scripts expose only explicit, narrow IPC channels. Access to standard Node.js or Electron libraries from the frontend is strictly prohibited.
- **Data Validation**: Regex validation on incoming UUIDs and HEX colors prevents injection attacks.
- **Memory Exhaustion Prevention**: `MAX_CONTENT_BYTES` of 1MB strictly enforced in the IPC handler to mitigate RAM exhaustion attacks from oversized clipboard pastes.
- **URL Validation**: `open-external` strictly whitelists valid browser protocols.
- **Content Security Policy (CSP)**: Strict CSP meta tags are included in all HTML files: `default-src 'self'; script-src 'self'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; font-src 'self' data:;`.

## 14. Reconstruction Notes
- **Atomic Store Implementation**: The atomic store requires temp file writing (`notes.json.tmp`) and an atomic `fs.renameSync` swap to prevent race conditions or data loss on power failure. Any future data store modifications MUST maintain this pattern.
- **IPC Listener Accumulation**: When modifying `preload.js` or frontend logic, any IPC listener setup (`ipcRenderer.on`) MUST be preceded by `ipcRenderer.removeAllListeners` for that event to prevent duplicate execution when a renderer reloads.
- **Text Readability**: Color selection relies on the `hexToRgb` brightness calculation formula in `renderer.js`. If new background options are added, this functionality must remain intact to ensure text contrast remains accessible.
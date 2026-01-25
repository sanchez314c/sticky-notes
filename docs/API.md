# Internal API & IPC Contracts

Communication between the Main process and Renderer processes is strictly handled via IPC (Inter-Process Communication) and exposed through `window.electronAPI`.

## From Renderer to Main (Invokes / Sends)

| Method | Parameters | Description |
|--------|------------|-------------|
| `createNote()` | None | Spawns a new sticky note window and updates the store. |
| `closeNote(id)` | `id` (String UUID) | Closes the specified note window and deletes its data. |
| `saveNoteContent(id, content)`| `id` (UUID), `content` (String) | Updates the text content of a note. |
| `updateNoteColor(id, color)` | `id` (UUID), `color` (Hex String) | Updates the background color of a note. |
| `minimizeNote(id)` | `id` (String UUID) | Minimizes the specific note window. |
| `toggleAlwaysOnTop(id)` | `id` (String UUID) | Toggles the "pinned" state. Returns boolean representing new state. |
| `focusNote(id)` | `id` (String UUID) | Restores and focuses the specified note window. |
| `mainWindowMinimize()` | None | Minimizes the main manager window. |
| `mainWindowMaximize()` | None | Toggles maximize/restore on the manager window. |
| `mainWindowClose()` | None | Closes the main manager window. |
| `requestNotesState()` | None | Returns an array of note objects + active counts. |
| `openExternal(url)` | `url` (String) | Opens safe URLs (`http(s)://`, `mailto:`) in default OS browser. |

## From Main to Renderer (Events)

| Event | Payload | Description |
|-------|---------|-------------|
| `load-note` | `{ id, content, backgroundColor, width, height, isPinned }` | Sent on note window initialization to populate data. |
| `request-save` | None | Dispatched before app quit to force synchronous saves. |
| `notes-state-update` | `{ notes, openCount }` | Broadcasted to the manager window whenever note state mutates. |
| `note-pin-changed` | `{ isPinned }` | Notifies a note window that its pin state was externally toggled. |

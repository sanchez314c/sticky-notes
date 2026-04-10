# Modular Sticky - Audit Report

## 1. Bugs
- **Zombie Notes on Close:** When a user clicks the "Close" button on a note, the window is destroyed, but the note is never deleted from `notes.json`. On the next app launch, all previously "closed" notes reappear. Closing a note should remove it from the store.
- **Race Condition on Close:** In `renderer.js`, `saveNoteContent()` is called immediately before `window.electronAPI.closeNote(noteId)`. Since IPC is asynchronous, the save operation can arrive after the close operation, resurrecting the deleted note in the store.
- **Double Load Saved Notes:** `loadSavedNotes` is called twice depending on OS behavior. `app.on('activate')` also calls `loadSavedNotes()` when `noteWindows.size === 0`, but `app.whenReady()` also calls it. This is generally fine but can be improved.

## 2. Security Issues
- **Missing Validations:** `save-note-content` truncates content over 1MB, which is good. However, no structural validation of `note.id` is done during note load in `loadSavedNotes`, though it is validated during IPC.
- **IPC Event Registration Leak:** The preload uses `removeAllListeners` followed by `on` for events like `notes-state-update`. This is a common pattern for hot-reloads but technically removes all listeners even if multiple parts of the renderer wanted to listen. Not a strict security issue, but a design flaw.

## 3. Performance Problems
- **Synchronous Disk I/O on Main Thread:** `flushNow()` in `main.js` uses `fs.writeFileSync` and `fs.renameSync`. Since `saveNoteContent` triggers a flush (via debounce), every time a note is modified, the main thread synchronously writes `notes.json` to disk. For large contents, this blocks the entire application (including the renderer UI). We must convert `flushNow` to use asynchronous file operations (`fs.promises.writeFile`).

## 4. Error Handling
- **No Delete Handler:** There is no dedicated delete mechanism if `close` just meant hide. Given the nature of Sticky Notes, `close` should mean delete, and it must be properly handled.
- **Uncaught Promise Rejections:** Several renderer IPC calls catch errors and log them, which is good, but `focusNote` silently catches them in `main-renderer.js`.

## Action Plan
1. Convert `store.flushNow` to async (`flushAsync`) using `fs.promises` to prevent main thread blocking, while retaining `flushSync` for the `before-quit` event.
2. Update `close-note` IPC handler to delete the note from `notes.json`.
3. Remove the conflicting `saveNoteContent()` calls before `closeNote()` in `renderer.js`.
4. Ensure `loadSavedNotes` does not duplicate notes.

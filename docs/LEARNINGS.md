# Architectural Learnings & Context

This document captures historical decisions, specific bug fixes, and "gotchas" discovered during development.

## 1. Atomic Saves
*Decision*: Using `.tmp` files with `fs.renameSync` rather than simple `fs.writeFileSync`.
*Reasoning*: Early versions experienced total data loss when the system lost power or the Electron process crashed exactly during the disk I/O flush. `renameSync` is atomic on POSIX and NTFS systems.

## 2. IPC Event Duplication
*Context*: We noticed that clicking a button once would trigger the event multiple times if the renderer had been reloaded (e.g., during development).
*Fix*: Ensure `ipcRenderer.removeAllListeners('event-name')` is called before setting `ipcRenderer.on('event-name')` in the preload/renderer scripts.

## 3. Text Contrast Algorithm
*Context*: With customizable backgrounds, text needs to remain readable.
*Implementation*: Instead of hardcoding text colors for every background, we implemented a generic `hexToRgb` brightness formula in `renderer.js` that automatically switches text to `#ffffff` or `#111827`.

## 4. Linux Transparency
*Context*: Transparent, frameless windows are notoriously tricky on Linux.
*Fix*: Added conditional `app.commandLine.appendSwitch` flags (`enable-transparent-visuals`, `disable-gpu-compositing`) specifically for Linux targets before `app.whenReady()` fires.

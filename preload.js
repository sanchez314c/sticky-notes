const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object.
// Listeners are registered once and removed before re-registration to
// prevent duplicate handler accumulation across hot reloads.
contextBridge.exposeInMainWorld('electronAPI', {
  // ── Note operations ───────────────────────────────────────────────────────
  createNote: () => ipcRenderer.invoke('create-note'),
  closeNote: id => ipcRenderer.invoke('close-note', id),
  saveNoteContent: (id, content) => ipcRenderer.invoke('save-note-content', id, content),
  updateNoteColor: (id, color) => ipcRenderer.invoke('update-note-color', id, color),
  minimizeNote: id => ipcRenderer.invoke('minimize-note', id),
  toggleAlwaysOnTop: id => ipcRenderer.invoke('toggle-always-on-top', id),
  focusNote: id => ipcRenderer.invoke('focus-note', id),

  // ── Main window controls ──────────────────────────────────────────────────
  mainWindowMinimize: () => ipcRenderer.invoke('main-window-minimize'),
  mainWindowMaximize: () => ipcRenderer.invoke('main-window-maximize'),
  mainWindowClose: () => ipcRenderer.invoke('main-window-close'),

  // ── Notes state (for main manager window) ────────────────────────────────
  requestNotesState: () => ipcRenderer.invoke('request-notes-state'),

  // ── External links ────────────────────────────────────────────────────────
  openExternal: url => ipcRenderer.invoke('open-external', url),

  // ── Receive messages from main ────────────────────────────────────────────
  // Deregister previous listener first to prevent stacking duplicates
  // if the renderer reloads.
  onLoadNote: callback => {
    ipcRenderer.removeAllListeners('load-note');
    ipcRenderer.on('load-note', (event, data) => callback(data));
  },
  onRequestSave: callback => {
    ipcRenderer.removeAllListeners('request-save');
    ipcRenderer.on('request-save', () => callback());
  },
  onNotesStateUpdate: callback => {
    ipcRenderer.removeAllListeners('notes-state-update');
    ipcRenderer.on('notes-state-update', (event, data) => callback(data));
  }
});

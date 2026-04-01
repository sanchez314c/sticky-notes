const { app, BrowserWindow, ipcMain, screen, Menu, shell } = require('electron');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Linux platform flags — must be set before app.whenReady()
if (process.platform === 'linux') {
  process.env.ELECTRON_FORCE_WINDOW_MENU_BAR = '1';
  app.commandLine.appendSwitch('enable-transparent-visuals');
  app.commandLine.appendSwitch('use-gl', 'angle');
  app.commandLine.appendSwitch('use-angle', 'swiftshader');
  app.commandLine.appendSwitch('disable-gpu-watchdog');
  app.commandLine.appendSwitch('no-sandbox');
}

// Global error handlers — prevent silent crashes
process.on('uncaughtException', err => {
  console.error('[main] uncaughtException:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[main] unhandledRejection at:', promise, 'reason:', reason);
});

const userDataPath = app.getPath('userData');
const notesFile = path.join(userDataPath, 'notes.json');
const notesTmpFile = `${notesFile}.tmp`;

// Maximum allowed content size per note (1 MB) — prevents OOM from huge pastes
const MAX_CONTENT_BYTES = 1 * 1024 * 1024;

// Valid hex color regex
const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

// Delay (ms) before broadcasting initial notes state after main window is ready.
// Gives the renderer a moment to attach its IPC listener before the first push.
const MAIN_WINDOW_READY_BROADCAST_DELAY_MS = 200;

// -----------------------------------------------------------------------
// Atomic store — reads and writes are synchronous but writes go through a
// tmp-file rename so a crash mid-write cannot corrupt the live notes.json.
// All mutations are serialised through a dirty-flag + flush mechanism to
// prevent race conditions between concurrent IPC calls.
// -----------------------------------------------------------------------
const store = (() => {
  let cache = null;
  let dirty = false;
  let flushTimer = null;

  function loadCache() {
    if (cache !== null) return;
    if (fs.existsSync(notesFile)) {
      try {
        const raw = fs.readFileSync(notesFile, 'utf8');
        cache = JSON.parse(raw);
        return;
      } catch (e) {
        console.error('[store] Failed to parse notes.json — attempting backup restore:', e.message);
        try {
          const ts = new Date().toISOString().replace(/[:.]/g, '-');
          fs.copyFileSync(notesFile, `${notesFile}.corrupted.${ts}`);
          console.error('[store] Corrupted file saved to', `${notesFile}.corrupted.${ts}`);
        } catch (_) {
          // Ignore backup errors
        }
        cache = {};
        return;
      }
    }
    cache = {};
  }

  let isFlushing = false;

  async function flushNow() {
    if (!dirty || isFlushing) return;
    isFlushing = true;
    try {
      const serialised = JSON.stringify(cache, null, 2);
      await fs.promises.writeFile(notesTmpFile, serialised, 'utf8');
      await fs.promises.rename(notesTmpFile, notesFile);
      dirty = false;
    } catch (e) {
      console.error('[store] Failed to flush notes.json async:', e.message);
    } finally {
      isFlushing = false;
      if (dirty) scheduledFlush();
    }
  }

  function flushSyncNow() {
    if (!dirty) return;
    try {
      const serialised = JSON.stringify(cache, null, 2);
      fs.writeFileSync(notesTmpFile, serialised, 'utf8');
      fs.renameSync(notesTmpFile, notesFile);
      dirty = false;
    } catch (e) {
      console.error('[store] Failed to flush notes.json sync:', e.message);
    }
  }

  function scheduledFlush() {
    if (flushTimer) return;
    flushTimer = setTimeout(() => {
      flushTimer = null;
      flushNow();
    }, 200);
  }

  return {
    get(key, defaultValue) {
      loadCache();
      const val = cache[key];
      return val !== undefined ? val : defaultValue;
    },
    set(key, value) {
      loadCache();
      cache[key] = value;
      dirty = true;
      scheduledFlush();
    },
    flushSync() {
      if (flushTimer) {
        clearTimeout(flushTimer);
        flushTimer = null;
      }
      flushSyncNow();
    }
  };
})();

// Store for all note windows
const noteWindows = new Map();
// Track pin state per note
const notePinState = new Map();

// Main manager window reference
let mainWindow = null;

// Default note properties
const DEFAULT_NOTE = {
  width: 300,
  height: 300,
  backgroundColor: '#ffeb3b',
  x: 100,
  y: 100
};

// -----------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------

function isValidNoteId(id) {
  return typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function isValidColor(color) {
  return typeof color === 'string' && HEX_COLOR_RE.test(color);
}

// -----------------------------------------------------------------------
// Notes state snapshot — used to broadcast to main manager window
// -----------------------------------------------------------------------
function getNotesStateSnapshot() {
  const notes = store.get('notes', {});
  const result = Object.values(notes).map(note => ({
    id: note.id,
    content: typeof note.content === 'string' ? note.content : '',
    backgroundColor: isValidColor(note.backgroundColor) ? note.backgroundColor : DEFAULT_NOTE.backgroundColor,
    isPinned: notePinState.get(note.id) || false
  }));
  return {
    notes: result,
    openCount: noteWindows.size
  };
}

// Broadcast notes state to the main manager window
function broadcastNotesState() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('notes-state-update', getNotesStateSnapshot());
  }
}

// -----------------------------------------------------------------------
// App menu
// -----------------------------------------------------------------------
function createMenu() {
  const isMac = process.platform === 'darwin';
  const mod = isMac ? 'Cmd' : 'Ctrl';

  const template = [
    {
      label: 'Sticky Notes',
      submenu: [
        {
          label: 'New Note',
          accelerator: `${mod}+N`,
          click: () => createNote()
        },
        {
          label: 'Save All Notes',
          accelerator: `${mod}+S`,
          click: () => store.flushSync()
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: `${mod}+Q`,
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: `${mod}+Z`, role: 'undo' },
        { label: 'Redo', accelerator: `Shift+${mod}+Z`, role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: `${mod}+X`, role: 'cut' },
        { label: 'Copy', accelerator: `${mod}+C`, role: 'copy' },
        { label: 'Paste', accelerator: `${mod}+V`, role: 'paste' },
        { label: 'Select All', accelerator: `${mod}+A`, role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: `${mod}+R`, role: 'reload' },
        { label: 'Toggle Developer Tools', accelerator: `Alt+${mod}+I`, role: 'toggleDevTools' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// -----------------------------------------------------------------------
// Main manager window — Neo-Noir Glass Monitor styled
// -----------------------------------------------------------------------
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 720,
    height: 540,
    minWidth: 580,
    minHeight: 420,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    resizable: true,
    roundedCorners: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // sandbox: false is intentional — the app already passes --no-sandbox at the
      // command-line level on Linux to support transparent windows (GPU compositing
      // requirement). Setting sandbox: true here would conflict with that flag.
      // contextIsolation: true + nodeIntegration: false + preload-only API surface
      // is the primary security boundary.
      sandbox: false,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false,
    icon: path.join(__dirname, 'resources', 'icons', 'icon.png')
  });

  mainWindow.loadFile('main.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Send initial notes state once the window is ready
    setTimeout(() => broadcastNotesState(), MAIN_WINDOW_READY_BROADCAST_DELAY_MS);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// -----------------------------------------------------------------------
// Note window management
// -----------------------------------------------------------------------
function createNote(noteData = null) {
  const id = noteData?.id || uuidv4();

  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
  const existingCount = noteWindows.size;
  const offsetX = (existingCount * 30) % Math.max(1, screenWidth - DEFAULT_NOTE.width);
  const offsetY = (existingCount * 30) % Math.max(1, screenHeight - DEFAULT_NOTE.height);

  const rawX = noteData?.x ?? DEFAULT_NOTE.x + offsetX;
  const rawY = noteData?.y ?? DEFAULT_NOTE.y + offsetY;
  const noteConfig = {
    id,
    x: Math.max(0, Math.min(rawX, screenWidth - DEFAULT_NOTE.width)),
    y: Math.max(0, Math.min(rawY, screenHeight - DEFAULT_NOTE.height)),
    width: Math.max(200, noteData?.width ?? DEFAULT_NOTE.width),
    height: Math.max(200, noteData?.height ?? DEFAULT_NOTE.height),
    content: typeof noteData?.content === 'string' ? noteData.content : '',
    backgroundColor: isValidColor(noteData?.backgroundColor) ? noteData.backgroundColor : DEFAULT_NOTE.backgroundColor,
    fontSize:
      typeof noteData?.fontSize === 'number' && noteData.fontSize >= 8 && noteData.fontSize <= 72
        ? noteData.fontSize
        : 14
  };

  const noteWindow = new BrowserWindow({
    x: noteConfig.x,
    y: noteConfig.y,
    width: noteConfig.width,
    height: noteConfig.height,
    minWidth: 200,
    minHeight: 200,
    frame: false,
    transparent: true,
    show: false,
    backgroundColor: '#00000000',
    alwaysOnTop: false,
    hasShadow: false,
    resizable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  noteWindow.loadFile('note.html');

  const showTimeout = setTimeout(() => {
    if (!noteWindow.isDestroyed() && !noteWindow.isVisible()) {
      noteWindow.show();
    }
  }, 3000);

  noteWindow.once('ready-to-show', () => {
    clearTimeout(showTimeout);
    noteWindow.show();
  });

  noteWindow.webContents.on('did-finish-load', () => {
    noteWindow.webContents.send('load-note', noteConfig);
  });

  noteWindow.webContents.on('render-process-gone', (_event, details) => {
    console.error(`[note ${id}] renderer crashed: ${details.reason} (exit ${details.exitCode})`);
    if (!noteWindow.isDestroyed()) {
      noteWindow.loadFile('note.html');
    }
  });

  noteWindows.set(id, noteWindow);
  notePinState.set(id, false);

  // Debounced position/size save
  let positionDebounce = null;
  noteWindow.on('moved', () => {
    clearTimeout(positionDebounce);
    positionDebounce = setTimeout(() => {
      if (!noteWindow.isDestroyed()) {
        const [x, y] = noteWindow.getPosition();
        updateNoteRecord(id, { x, y });
      }
    }, 300);
  });

  let resizeDebounce = null;
  noteWindow.on('resized', () => {
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => {
      if (!noteWindow.isDestroyed()) {
        const [width, height] = noteWindow.getSize();
        updateNoteRecord(id, { width, height });
      }
    }, 300);
  });

  noteWindow.on('closed', () => {
    // Clear pending debounce timers so they don't fire after the window is gone
    clearTimeout(positionDebounce);
    clearTimeout(resizeDebounce);
    noteWindows.delete(id);
    notePinState.delete(id);
    broadcastNotesState();
  });

  broadcastNotesState();
  return id;
}

// Safe field merge — only copies own enumerable properties, blocking prototype
// pollution via __proto__, constructor, or prototype keys that Object.assign
// would otherwise follow when given a crafted object.
function safeMerge(target, fields) {
  for (const key of Object.keys(fields)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    target[key] = fields[key];
  }
  return target;
}

function updateNoteRecord(id, fields) {
  if (!isValidNoteId(id)) return;
  const notes = store.get('notes', {});
  if (!notes[id]) notes[id] = { id };
  safeMerge(notes[id], fields);
  store.set('notes', notes);
}

// -----------------------------------------------------------------------
// Save all notes
// -----------------------------------------------------------------------
function saveAllNotes() {
  const notes = store.get('notes', {});

  noteWindows.forEach((window, id) => {
    if (!window.isDestroyed()) {
      const [x, y] = window.getPosition();
      const [width, height] = window.getSize();
      if (!notes[id]) notes[id] = { id };
      safeMerge(notes[id], { x, y, width, height });
      window.webContents.send('request-save');
    }
  });

  store.set('notes', notes);
  store.flushSync();
}

// -----------------------------------------------------------------------
// Load saved notes on startup
// -----------------------------------------------------------------------
function loadSavedNotes() {
  const notes = store.get('notes', {});
  // Prevent duplicate load if windows exist
  if (noteWindows.size > 0) return;

  if (Object.keys(notes).length === 0) {
    createNote();
  } else {
    Object.values(notes).forEach(note => {
      // Validate note payload safely before loading
      if (note && note.id && isValidNoteId(note.id)) {
        createNote(note);
      }
    });
  }
}

// -----------------------------------------------------------------------
// IPC handlers — note operations
// -----------------------------------------------------------------------
ipcMain.handle('create-note', () => {
  return createNote();
});

ipcMain.handle('close-note', (event, id) => {
  if (!isValidNoteId(id)) return;
  const window = noteWindows.get(id);
  if (window && !window.isDestroyed()) {
    window.close();
  }

  // Delete from store to prevent zombies on next load
  const notes = store.get('notes', {});
  if (notes[id]) {
    delete notes[id];
    store.set('notes', notes);
    broadcastNotesState();
  }
});

ipcMain.handle('save-note-content', (event, id, content) => {
  if (!isValidNoteId(id)) {
    console.warn('[ipc] save-note-content: invalid id rejected');
    return { ok: false, reason: 'invalid-id' };
  }
  if (typeof content !== 'string') {
    console.warn('[ipc] save-note-content: non-string content rejected');
    return { ok: false, reason: 'invalid-content' };
  }
  let truncated = false;
  if (Buffer.byteLength(content, 'utf8') > MAX_CONTENT_BYTES) {
    console.warn('[ipc] save-note-content: content exceeds max size, truncating');
    // MAX_CONTENT_BYTES / 4 is a safe conservative character limit because
    // UTF-8 encodes at most 4 bytes per code point.
    content = content.substring(0, MAX_CONTENT_BYTES / 4);
    truncated = true;
  }
  updateNoteRecord(id, { content });
  broadcastNotesState();
  return { ok: true, truncated };
});

ipcMain.handle('update-note-color', (event, id, color) => {
  if (!isValidNoteId(id)) {
    console.warn('[ipc] update-note-color: invalid id rejected');
    return;
  }
  if (!isValidColor(color)) {
    console.warn('[ipc] update-note-color: invalid color rejected:', color);
    return;
  }
  updateNoteRecord(id, { backgroundColor: color });
  broadcastNotesState();
});

ipcMain.handle('minimize-note', (event, id) => {
  if (!isValidNoteId(id)) return;
  const window = noteWindows.get(id);
  if (window && !window.isDestroyed()) {
    window.minimize();
  }
});

ipcMain.handle('toggle-always-on-top', (event, id) => {
  if (!isValidNoteId(id)) return false;
  const window = noteWindows.get(id);
  if (window && !window.isDestroyed()) {
    const isAlwaysOnTop = window.isAlwaysOnTop();
    window.setAlwaysOnTop(!isAlwaysOnTop);
    notePinState.set(id, !isAlwaysOnTop);
    broadcastNotesState();
    return !isAlwaysOnTop;
  }
  return false;
});

ipcMain.handle('focus-note', (event, id) => {
  if (!isValidNoteId(id)) return;
  const window = noteWindows.get(id);
  if (window && !window.isDestroyed()) {
    if (window.isMinimized()) window.restore();
    window.focus();
  }
});

// -----------------------------------------------------------------------
// IPC handlers — main window controls
// -----------------------------------------------------------------------
ipcMain.handle('main-window-minimize', () => {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.minimize();
});

ipcMain.handle('main-window-maximize', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  }
});

ipcMain.handle('main-window-close', () => {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.close();
});

// -----------------------------------------------------------------------
// IPC handlers — notes state (for main manager window)
// -----------------------------------------------------------------------
ipcMain.handle('request-notes-state', () => {
  return getNotesStateSnapshot();
});

// -----------------------------------------------------------------------
// IPC handlers — external links
// -----------------------------------------------------------------------
ipcMain.handle('open-external', async (event, url) => {
  try {
    const parsed = new URL(url);
    if (['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      await shell.openExternal(url);
    }
  } catch (e) {
    console.warn('[ipc] open-external: invalid URL rejected:', url);
  }
});

// -----------------------------------------------------------------------
// App lifecycle
// -----------------------------------------------------------------------
app.whenReady().then(() => {
  createMenu();
  if (process.platform === 'linux') {
    setTimeout(() => {
      createMainWindow();
      loadSavedNotes();
    }, 1000);
  } else {
    createMainWindow();
    loadSavedNotes();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (!mainWindow) {
    createMainWindow();
  }
  if (noteWindows.size === 0) {
    loadSavedNotes();
  }
});

app.on('before-quit', () => {
  saveAllNotes();
});

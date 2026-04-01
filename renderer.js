// Get DOM elements
const noteContainer = document.getElementById('noteContainer');
const noteTextarea = document.getElementById('noteTextarea');
const newBtn = document.getElementById('newBtn');
const pinBtn = document.getElementById('pinBtn');
const minBtn = document.getElementById('minBtn');
const closeBtn = document.getElementById('closeBtn');
const pinIndicator = document.getElementById('pinIndicator');
const colorOptions = document.querySelectorAll('.color-option');

// Valid hex color pattern — matches values allowed by the main process
const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

// Note state
let noteId = null;
let currentColor = '#ffeb3b';
let isPinned = false;
let saveTimeout = null;

// Initialize note
window.electronAPI.onLoadNote(data => {
  noteId = data.id;

  if (typeof data.content === 'string') {
    noteTextarea.value = data.content;
  }

  if (typeof data.backgroundColor === 'string' && HEX_COLOR_RE.test(data.backgroundColor)) {
    currentColor = data.backgroundColor;
    applyNoteColor(currentColor);
  }

  if (typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 72) {
    noteTextarea.style.fontSize = `${data.fontSize}px`;
  }
});

// Handle save requests from main process
window.electronAPI.onRequestSave(() => {
  saveNoteContent();
});

// Auto-save on content change — debounced to 1 second of inactivity
noteTextarea.addEventListener('input', () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveNoteContent();
  }, 1000);
});

// Save note content with error handling
function saveNoteContent() {
  if (!noteId) return;
  window.electronAPI.saveNoteContent(noteId, noteTextarea.value).catch(err => {
    console.error('[renderer] saveNoteContent failed:', err);
  });
}

// Control buttons
newBtn.addEventListener('click', () => {
  window.electronAPI.createNote().catch(err => {
    console.error('[renderer] createNote failed:', err);
  });
});

pinBtn.addEventListener('click', async () => {
  if (!noteId) return;
  try {
    isPinned = await window.electronAPI.toggleAlwaysOnTop(noteId);
    pinIndicator.classList.toggle('active', isPinned);
    pinBtn.style.opacity = isPinned ? '1' : '0.6';
  } catch (err) {
    console.error('[renderer] toggleAlwaysOnTop failed:', err);
  }
});

minBtn.addEventListener('click', () => {
  if (!noteId) return;
  window.electronAPI.minimizeNote(noteId).catch(err => {
    console.error('[renderer] minimizeNote failed:', err);
  });
});

closeBtn.addEventListener('click', () => {
  if (!noteId) return;
  // Save before closing
  saveNoteContent();
  window.electronAPI.closeNote(noteId).catch(err => {
    console.error('[renderer] closeNote failed:', err);
  });
});

// Color picker — validate color before applying or sending to main
colorOptions.forEach(option => {
  option.addEventListener('click', () => {
    const color = option.dataset.color;
    if (!color || !HEX_COLOR_RE.test(color)) {
      console.warn('[renderer] color-option clicked with invalid color:', color);
      return;
    }
    applyNoteColor(color);
    if (noteId) {
      window.electronAPI.updateNoteColor(noteId, color).catch(err => {
        console.error('[renderer] updateNoteColor failed:', err);
      });
    }
  });
});

// Apply note color to container and update text contrast
function applyNoteColor(color) {
  if (!color || !HEX_COLOR_RE.test(color)) return;
  currentColor = color;
  noteContainer.style.background = color;

  // Update active color indicator
  colorOptions.forEach(option => {
    option.classList.toggle('active', option.dataset.color === color);
  });

  // Adjust text color for readability
  const rgb = hexToRgb(color);
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  const textColor = brightness > 128 ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)';
  noteTextarea.style.color = textColor;
  const titleEl = document.querySelector('.note-title');
  if (titleEl) {
    titleEl.style.color = brightness > 128 ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)';
  }
}

// Convert hex to RGB — returns a safe fallback (mid-grey) on invalid input
function hexToRgb(hex) {
  if (!hex || !HEX_COLOR_RE.test(hex)) return { r: 128, g: 128, b: 128 };
  const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 128, g: 128, b: 128 };
  return { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) };
}

// Keyboard shortcuts — use both Cmd (macOS) and Ctrl (Win/Linux) for cross-platform support
document.addEventListener('keydown', e => {
  const mod = e.metaKey || e.ctrlKey;

  if (mod && e.key === 'n') {
    e.preventDefault();
    window.electronAPI.createNote().catch(err => console.error('[renderer] createNote failed:', err));
  }

  if (mod && e.key === 'w') {
    e.preventDefault();
    if (noteId) {
      saveNoteContent();
      window.electronAPI.closeNote(noteId).catch(err => console.error('[renderer] closeNote failed:', err));
    }
  }

  if (mod && e.key === 's') {
    e.preventDefault();
    saveNoteContent();
  }

  if (mod && e.key === 'm') {
    e.preventDefault();
    if (noteId) {
      window.electronAPI.minimizeNote(noteId).catch(err => console.error('[renderer] minimizeNote failed:', err));
    }
  }

  if (mod && e.key === 't') {
    e.preventDefault();
    pinBtn.click();
  }
});

// Prevent default drag/drop behavior on the note window
document.addEventListener('dragover', e => {
  e.preventDefault();
});
document.addEventListener('drop', e => {
  e.preventDefault();
});

// Focus textarea on load
window.addEventListener('load', () => {
  noteTextarea.focus();
});

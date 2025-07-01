// ─── Window Controls ────────────────────────────────────────────────────────
document.getElementById('main-minimize-btn').addEventListener('click', () => {
  window.electronAPI.mainWindowMinimize().catch(err => console.error('[main-renderer] minimize failed:', err));
});

document.getElementById('main-maximize-btn').addEventListener('click', () => {
  window.electronAPI.mainWindowMaximize().catch(err => console.error('[main-renderer] maximize failed:', err));
});

document.getElementById('main-close-btn').addEventListener('click', () => {
  window.electronAPI.mainWindowClose().catch(err => console.error('[main-renderer] close failed:', err));
});

// ─── New Note Button ─────────────────────────────────────────────────────────
document.getElementById('newNoteBtn').addEventListener('click', () => {
  window.electronAPI.createNote().catch(err => console.error('[main-renderer] createNote failed:', err));
});

// ─── About Modal ─────────────────────────────────────────────────────────────
function openAboutModal() {
  const overlay = document.getElementById('aboutOverlay');
  if (overlay) overlay.classList.add('active');
}

function closeAboutModal() {
  const overlay = document.getElementById('aboutOverlay');
  if (overlay) overlay.classList.remove('active');
}

document.getElementById('about-btn').addEventListener('click', openAboutModal);
document.getElementById('aboutCloseBtn').addEventListener('click', closeAboutModal);

document.getElementById('aboutOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeAboutModal();
});

document.getElementById('aboutGithubBtn').addEventListener('click', () => {
  const url = 'https://github.com/sanchez314c/modular-sticky';
  if (window.electronAPI && window.electronAPI.openExternal) {
    window.electronAPI.openExternal(url).catch(err => console.error('[main-renderer] openExternal failed:', err));
  }
});

// ─── Settings Modal ───────────────────────────────────────────────────────────
function openSettingsModal() {
  const overlay = document.getElementById('settingsOverlay');
  if (overlay) overlay.classList.add('active');
}

function closeSettingsModal() {
  const overlay = document.getElementById('settingsOverlay');
  if (overlay) overlay.classList.remove('active');
}

document.getElementById('settings-btn').addEventListener('click', openSettingsModal);
document.getElementById('settingsCloseBtn').addEventListener('click', closeSettingsModal);

document.getElementById('settingsOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeSettingsModal();
});

// ─── Escape closes any open modal ─────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeAboutModal();
    closeSettingsModal();
  }
});

// ─── Note State Sync ──────────────────────────────────────────────────────────
// Listen for note state updates broadcast from main process
window.electronAPI.onNotesStateUpdate(state => {
  updateNotesGrid(state);
  updateStats(state);
  updateStatusBar(state);
});

// Request initial state on load
window.electronAPI.requestNotesState().catch(err => console.error('[main-renderer] requestNotesState failed:', err));

// ─── Notes Grid ──────────────────────────────────────────────────────────────
function updateNotesGrid(state) {
  const grid = document.getElementById('notesGrid');
  const notes = state.notes || [];

  if (notes.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <div class="empty-state-text">No notes yet. Create your first note above.</div>
      </div>
    `;
    return;
  }

  grid.innerHTML = notes
    .map(note => {
      const previewText = note.content ? escapeHtml(note.content.substring(0, 120)) : '';
      const colorStrip = safeColor(note.backgroundColor);

      return `
      <div class="note-card" data-note-id="${escapeHtml(note.id)}">
        <div class="note-card-color-strip" style="background: ${colorStrip};"></div>
        <div class="${previewText ? 'note-card-preview' : 'note-card-preview note-card-empty'}">
          ${previewText || 'Empty note'}
        </div>
        <div class="note-card-footer">
          <div class="note-card-dot" style="background: ${colorStrip}; box-shadow: 0 0 6px ${colorStrip}40;"></div>
          <span class="note-card-label">${note.isPinned ? '📌 Pinned' : 'Note'}</span>
        </div>
      </div>
    `;
    })
    .join('');

  // Note cards — clicking focuses the window
  grid.querySelectorAll('.note-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.noteId;
      if (id && window.electronAPI.focusNote) {
        window.electronAPI.focusNote(id).catch(() => {});
      }
    });
  });
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function updateStats(state) {
  const notes = state.notes || [];
  const openCount = state.openCount || notes.length;
  const pinnedCount = notes.filter(n => n.isPinned).length;

  const elTotal = document.getElementById('stat-total');
  const elOpen = document.getElementById('stat-open');
  const elPinned = document.getElementById('stat-pinned');

  if (elTotal) elTotal.textContent = notes.length;
  if (elOpen) elOpen.textContent = openCount;
  if (elPinned) elPinned.textContent = pinnedCount;
}

// ─── Status Bar ───────────────────────────────────────────────────────────────
function updateStatusBar(state) {
  const notes = state.notes || [];
  const count = notes.length;

  const elText = document.getElementById('statusBarText');
  const elCount = document.getElementById('statusBarCount');

  if (elText) elText.textContent = 'Ready';
  if (elCount) elCount.textContent = `${count} note${count !== 1 ? 's' : ''}`;
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Validate hex color in the renderer — prevents CSS injection via IPC payload.
// Mirrors the same regex used in main.js and renderer.js.
const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;
const FALLBACK_COLOR = '#ffeb3b';

function safeColor(color) {
  return typeof color === 'string' && HEX_COLOR_RE.test(color) ? color : FALLBACK_COLOR;
}

// ─── Prevent drag/drop ────────────────────────────────────────────────────────
document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('drop', e => e.preventDefault());

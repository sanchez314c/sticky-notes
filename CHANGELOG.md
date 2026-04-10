# Changelog

## [2026-03-14 20:10] - Neo-Noir Glass Monitor Restyle

### Changed

- `main.html` - Applied complete Neo-Noir Glass Monitor design system
  - Added full canonical `:root` token block (60+ CSS variables: backgrounds, typography, accents, borders, gradients, shadows, glass, radius, spacing, transitions)
  - Added Settings gear button (flat SVG icon, gap: 2px with About, margin-right: 10px before window controls)
  - Bumped version display from v0.0.1 to v1.0.0 in status bar and About modal
  - Added Settings modal with app preferences panel (glass styling, layered shadows)
  - Added missing token vars: `--bg-sidebar`, `--bg-tertiary`, `--bg-modal`, `--text-accent`, `--text-inverse`, `--border-glow`, `--border-focus`, `--gradient-sidebar`, `--gradient-button`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-glow`, `--shadow-glow-strong`, `--space-*` tokens, `--radius-button`, `--radius-input`
  - All shadow tokens now use 2+ layered values (spec compliance)
  - Title bar: flat About (ⓘ) + Settings (⚙) icon group with gap:2px, separated from circular 28px window controls by margin-right:10px
  - Status bar left: `● Ready | N notes` pattern; right: `v1.0.0` only in teal
  - Hero card retains ambient radial-gradient mesh + dot pattern overlay
  - All cards use `var(--glass-border)` (rgba white shimmer) not `var(--border-subtle)`
  - All cards have `::before` 1px inner highlight gradient
  - All card hover states use translateY(-2px) + shadow escalation
  - Scrollbars invisible at rest, visible on parent hover (6px, transparent thumb)
  - body: `padding: 16px`, `background: transparent !important` — float gap preserved
  - app-container: `border-radius: 20px`, `overflow: hidden`
- `main-renderer.js` - Wired Settings modal open/close; Escape key closes both About and Settings modals
- `note.html` - Enhanced note windows with subtle Neo-Noir glass treatment
  - `border: 1px solid rgba(255,255,255,0.18)` — glass border shimmer on all notes
  - Layered 4-value box-shadow for deeper depth perception
  - Hover state: border brightens + shadow escalates
  - `::before` top-edge inner highlight gradient (stronger white for note color contexts)
  - `padding: 6px` on body — small float gap so rounded corners show against desktop
  - Pin indicator upgraded from emoji (📌) to SVG thumbtack icon
  - Shadow opacity increased from 0.18-0.25 to 0.22-0.32 for better contrast on bright note colors

## [2026-03-14 16:17] - Full Mode Repository Compliance Audit

### Fixed

- `main.js` - Injected Linux platform flags (`enable-transparent-visuals`, `disable-gpu-compositing`, `no-sandbox`) before `app.whenReady()`; confirmed no DevTools auto-open, no `--disable-gpu` flag
- `package.json` - `start` updated to `electron . --no-sandbox`; `dev` script added (`electron . --dev --no-sandbox`); author corrected to "J. Michaels"
- `run-source-linux.sh` - Rewritten with full port management template (DEV=63599, DEVTOOLS=55060, IPC=59493), `--dev` flag support, `npx electron` invocation
- `run-source-macos.sh` - Rewritten with port management template matching Linux
- `run-source-windows.bat` - Rewritten with port management template, `--dev` flag support
- `AGENTS.md` - Contact name corrected to "J. Michaels"
- `.gitignore` - Added `legacy/`, `._*`, `*.AppImage`, `*.deb`, `build-temp/`

### Added

- `.nvmrc` - Node version pinned to 24
- `tests/` directory with `.gitkeep`
- `legacy/` directory with `.gitkeep`
- `resources/icons/icon.iconset/` - Moved from `assets/icon.iconset/`

### Archived (moved to AI-Pre-Trash)

- `assets/` - Content was duplicate of `resources/icons/`; `icon.iconset` preserved in `resources/icons/`

### Generated Ports

- DEV: 63599, DEVTOOLS: 55060, IPC: 59493

## [2026-03-14] - Documentation Standardization to 27-File Standard

### Added

- `AGENTS.md` - Rewritten with accurate IPC channel table, real data schema, actual color values, build commands, and explicit list of unimplemented features (was AGENT.md with placeholder content)
- `VERSION_MAP.md` - File-by-file version and change tracking for the full repo
- `docs/README.md` - Documentation index listing all 15 docs/ files and root governance files
- `docs/LEARNINGS.md` - Engineering decisions, architecture rationale, technical debt notes

### Fixed

- `README.md` - Corrected wrong repo URL (`sticky-notes` -> `modular-sticky`), removed references to non-existent `src/` directory, `settings.json`, dark mode, search, and rich text; corrected product name to ModularSticky; updated screenshot paths to real `build-resources/` directory name
- `LICENSE` - Copyright corrected from "2024 StickyNotes Team" to "2026 Jason Paul Michaels"
- `SECURITY.md` - Contact email corrected from `security@stickynotes.app` to `sanchez314c@jasonpaulmichaels.co`; storage description corrected from "Electron's secure store mechanism" to accurate plain JSON file description; product name corrected to ModularSticky
- `AGENTS.md` - Renamed from `AGENT.md` (wrong name); content completely replaced with accurate technical guidance based on real code analysis

### Archived

- `docs/DOCUMENTATION_INDEX.md` - Replaced by `docs/README.md`
- `docs/CODE_OF_CONDUCT.md` - Duplicate of root `CODE_OF_CONDUCT.md`
- `docs/CONTRIBUTING.md` - Duplicate of root `CONTRIBUTING.md`
- `docs/SECURITY.md` - Duplicate of root `SECURITY.md`
- Root `TECHSTACK.md` - Duplicate of `docs/TECHSTACK.md`

---

## [2026-02-07 22:02:52] - Repository Compliance Fixes

### Added

- Created CLAUDE.md from AGENTS.md for consistency
- Added .gitkeep to protected empty folders (archive/, docs/, resources/, tests/, config/, logs/)
- Created resources/icons/ with placeholder icon where missing
- Created missing package.json for multiplicity

### Fixed

- Renamed build_resources/ to resources/ (standard naming)
- Removed OS junk files (.DS*Store, Thumbs.db, .*\*, Desktop.ini)
- Removed runtime artifacts (.pid files, logs) from presence-ai
- Added \*.pid to .gitignore in presence-ai

### Structure

- All protected folders now have .gitkeep to prevent deletion
- Standard resources/ structure enforced
- Documentation synced (CLAUDE.md created where missing)

---

# Changelog

All notable changes to StickyNotes will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Comprehensive documentation standardization
- New standardized file structure in `/docs/`
- Enhanced API documentation with detailed examples
- Complete architecture documentation
- Comprehensive troubleshooting guide
- Product requirements document (PRD)
- Quick start guide for new users
- Detailed workflow documentation

### Changed

- Moved `.serena/` directory to `/docs/archive/` with timestamp
- Archived non-standard documentation files
- Renamed `CLAUDE.md` to `AGENTS.md` for AI agent guidance
- Consolidated scattered documentation into standardized structure

### Fixed

- Documentation organization and accessibility
- Missing comprehensive guides for developers and users

### Documentation

- Added 13 new standardized documentation files
- Created archive directory with proper documentation
- Established clear documentation hierarchy

## [1.0.0] - 2025-10-31

### Added

- Initial release of StickyNotes desktop application
- Cross-platform support (macOS, Windows, Linux)
- Unlimited sticky notes creation
- Rich text editing capabilities
- 7 color options for note customization
- Always-on-top functionality
- Frameless window design
- Persistent local storage
- Drag and drop note positioning
- Resizable note windows
- Automatic note saving
- Dark/light theme support
- Keyboard shortcuts for common operations

### Features

- **Note Management**: Create, edit, delete, and organize notes
- **Customization**: Color coding, resizing, and positioning
- **Cross-Platform**: Native integration with all major desktop platforms
- **Security**: Local storage with no data collection
- **Performance**: Optimized for low memory usage and fast startup

### Technical

- Built with Electron for cross-platform compatibility
- JSON-based local storage system
- Secure IPC communication between processes
- Context isolation for enhanced security
- Responsive design adapting to different screen sizes

### Documentation

- Basic README with installation instructions
- Development setup guide
- Contributing guidelines
- Code of conduct
- Security policy

---

## Version History

### Development Phase

- **v0.1.0** - Initial prototype with basic note creation
- **v0.5.0** - Added color customization and window management
- **v0.8.0** - Implemented cross-platform compatibility
- **v0.9.0** - Beta testing and bug fixes
- **v1.0.0** - Production release with full feature set

### Future Roadmap

- **v1.1** - Search functionality and note categories
- **v1.2** - Rich text editing and templates
- **v1.3** - Cloud sync and collaboration features
- **v2.0** - Advanced features and mobile companion apps

---

## Release Notes Format

### Categories

- **Added**: New features and functionality
- **Changed**: Existing feature modifications
- **Deprecated**: Features marked for future removal
- **Removed**: Features removed in this release
- **Fixed**: Bug fixes and corrections
- **Security**: Security-related changes
- **Documentation**: Documentation updates and additions

### Version Numbers

- **Major**: Incompatible API changes
- **Minor**: New functionality in backward-compatible manner
- **Patch**: Backward-compatible bug fixes

---

## Migration Guide

### From v0.x to v1.0

- No data migration required
- All existing notes preserved
- Settings automatically migrated
- No breaking changes for users

### Future Migrations

- All migrations will be automatic
- Data backup before migration
- Rollback capability for failed migrations
- Clear migration instructions provided

---

## Support

For questions about specific releases or changes:

- Check the documentation in `/docs/`
- Review the FAQ for common questions
- Contact support at support@stickynotes.app
- Join our community at discord.gg/StickyNotes

---

_This changelog follows the [Keep a Changelog](https://keepachangelog.com/) format._

# Changelog

## [Unreleased] — 2026-03-14

### Security

- Added Content Security Policy meta tag to `note.html` (default-src 'self', no inline scripts, no external connections)
- Added UUID v4 regex validation on all IPC `id` parameters — rejects non-UUID strings before any processing
- Added strict `#RRGGBB` hex validation on all IPC `color` parameters — rejects arbitrary strings before CSS/storage application
- Set `sandbox: true` explicitly in BrowserWindow webPreferences for all note windows
- Added 1MB max content size guard on `save-note-content` IPC handler
- Ran `npm audit fix` — resolved 18 of 21 vulnerabilities in devDependencies (remaining 3 require breaking Electron downgrade and are build-tool-only, not in shipped app)

### Fixed (Data Safety — Critical)

- **Atomic disk writes**: `notes.json` now written via tmp-file + rename, preventing data corruption from mid-write crashes
- **Write race condition**: Concurrent IPC calls (save content + update color + move/resize) no longer clobber each other. All handlers now mutate a shared in-memory cache; a 200ms debounce coalesces writes into a single flush
- **Before-quit data loss**: `store.flushSync()` is now called on `before-quit` event, ensuring all pending debounced writes complete before the process exits
- **Corrupted notes.json recovery**: Parse failure no longer silently resets all notes to empty. Corrupted file is now copied to `notes.json.corrupted.<timestamp>` before any reset, preserving data for recovery

### Fixed (High)

- All `ipcRenderer.invoke()` calls in renderer now have `.catch()` handlers — failed saves no longer silently disappear
- `hexToRgb()` fallback changed from white `{255,255,255}` to mid-grey `{128,128,128}` — prevents invisible-text scenario on invalid color values
- Added `process.on('uncaughtException')` and `process.on('unhandledRejection')` handlers in main process

### Fixed (Medium)

- Duplicate IPC listener accumulation in preload: `onLoadNote` and `onRequestSave` now call `removeAllListeners` before each registration
- Move/resize events are now debounced (300ms) — prevents hundreds of disk writes per second during window dragging
- `applyNoteColor()` validates hex before applying to DOM
- `fontSize` from storage validated to range 8-72 before applying to CSS
- Stored window x/y positions are now clamped to current screen work area bounds (handles monitor configuration changes)

### Fixed (Low)

- Keyboard shortcuts now work on Windows and Linux — changed from `e.metaKey` only to `e.metaKey || e.ctrlKey`
- App menu accelerators now use platform-appropriate prefix (`Cmd` on macOS, `Ctrl` on Windows/Linux)

### Added

- `AUDIT_REPORT.md` — full forensic audit report with finding details and fix descriptions
- `changelog.md` — this file

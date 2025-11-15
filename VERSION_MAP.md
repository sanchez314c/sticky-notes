# VERSION_MAP.md

File-by-file version tracking for `modular-sticky`. Records which files changed in each version and why.

## Current Version: 0.0.1

### Source Files

| File          | Last Changed | Version | Notes           |
| ------------- | ------------ | ------- | --------------- |
| `main.js`     | 2025-10-31   | 0.0.1   | Initial release |
| `preload.js`  | 2025-10-31   | 0.0.1   | Initial release |
| `renderer.js` | 2025-10-31   | 0.0.1   | Initial release |
| `note.html`   | 2025-10-31   | 0.0.1   | Initial release |

### Config Files

| File            | Last Changed | Version | Notes                        |
| --------------- | ------------ | ------- | ---------------------------- |
| `package.json`  | 2025-10-31   | 0.0.1   | electron 37.4.0, uuid 11.1.0 |
| `tsconfig.json` | 2025-10-31   | 0.0.1   | Type-check only, no emit     |
| `.eslintrc.js`  | 2025-10-31   | 0.0.1   | ESLint config                |
| `.prettierrc`   | 2025-10-31   | 0.0.1   | Prettier config              |
| `.editorconfig` | 2025-10-31   | 0.0.1   | Editor config                |

### Documentation Files

| File                 | Last Changed | Version | Notes                                                        |
| -------------------- | ------------ | ------- | ------------------------------------------------------------ |
| `README.md`          | 2025-10-31   | 0.0.1   | Initial                                                      |
| `CHANGELOG.md`       | 2026-03-14   | 0.0.1   | Updated with doc standardization entries                     |
| `CONTRIBUTING.md`    | 2025-10-31   | 0.0.1   | Initial                                                      |
| `LICENSE`            | 2026-03-14   | 0.0.1   | Copyright corrected to "2026 Jason Paul Michaels"            |
| `CODE_OF_CONDUCT.md` | 2025-10-31   | 0.0.1   | Contributor Covenant v2.1                                    |
| `SECURITY.md`        | 2025-10-31   | 0.0.1   | Initial                                                      |
| `CLAUDE.md`          | 2025-10-31   | 0.0.1   | SWARM framework autonomous dev instructions                  |
| `AGENTS.md`          | 2026-03-14   | 0.0.1   | Rewritten with accurate IPC/schema/color docs (was AGENT.md) |
| `VERSION_MAP.md`     | 2026-03-14   | 0.0.1   | Created                                                      |

### Docs Directory

| File                      | Last Changed | Version | Notes                         |
| ------------------------- | ------------ | ------- | ----------------------------- |
| `docs/README.md`          | 2026-03-14   | 0.0.1   | Created (documentation index) |
| `docs/ARCHITECTURE.md`    | 2025-10-31   | 0.0.1   | Initial                       |
| `docs/INSTALLATION.md`    | 2025-10-31   | 0.0.1   | Initial                       |
| `docs/DEVELOPMENT.md`     | 2025-10-31   | 0.0.1   | Initial                       |
| `docs/API.md`             | 2025-10-31   | 0.0.1   | Initial                       |
| `docs/BUILD_COMPILE.md`   | 2025-10-31   | 0.0.1   | Initial                       |
| `docs/DEPLOYMENT.md`      | 2025-10-31   | 0.0.1   | Initial                       |
| `docs/FAQ.md`             | 2025-10-31   | 0.0.1   | Initial                       |
| `docs/TROUBLESHOOTING.md` | 2025-10-31   | 0.0.1   | Initial                       |
| `docs/TECHSTACK.md`       | 2025-10-31   | 0.0.1   | Initial                       |
| `docs/WORKFLOW.md`        | 2025-10-31   | 0.0.1   | Initial                       |
| `docs/QUICK_START.md`     | 2025-10-31   | 0.0.1   | Initial                       |
| `docs/LEARNINGS.md`       | 2026-03-14   | 0.0.1   | Created                       |
| `docs/PRD.md`             | 2025-10-31   | 0.0.1   | Initial                       |
| `docs/TODO.md`            | 2025-10-31   | 0.0.1   | Initial                       |

### GitHub Templates

| File                                        | Last Changed | Version | Notes                    |
| ------------------------------------------- | ------------ | ------- | ------------------------ |
| `.github/ISSUE_TEMPLATE/bug_report.md`      | 2025-10-31   | 0.0.1   | Initial                  |
| `.github/ISSUE_TEMPLATE/feature_request.md` | 2025-10-31   | 0.0.1   | Initial                  |
| `.github/PULL_REQUEST_TEMPLATE.md`          | 2025-10-31   | 0.0.1   | Initial                  |
| `.github/workflows/ci.yml`                  | 2025-10-31   | 0.0.1   | Node 18 on ubuntu-latest |

---

## Version History

### 0.0.1 (2025-10-31)

Initial release of modular-sticky. Cross-platform Electron sticky notes app with:

- 4 source files (main, preload, renderer, note.html)
- JSON file storage in `app.getPath('userData')/notes.json`
- 7 color swatches with automatic text contrast adjustment
- Frameless windows, one per note, cascade-positioned
- electron-builder distribution for macOS, Windows, Linux

### Files Changed Since 0.0.1 (doc standardization, 2026-03-14)

- `LICENSE` -- copyright corrected
- `AGENTS.md` -- renamed from `AGENT.md`, rewritten with accurate technical content
- `VERSION_MAP.md` -- created
- `docs/README.md` -- created
- `docs/LEARNINGS.md` -- created
- `CHANGELOG.md` -- updated with standardization entries
- `archive/` -- received: `docs/DOCUMENTATION_INDEX.md`, `docs/CODE_OF_CONDUCT.md`, `docs/CONTRIBUTING.md`, `docs/SECURITY.md`, root `TECHSTACK.md`

---

## Dependency Versions

| Package            | Version           | Role                                |
| ------------------ | ----------------- | ----------------------------------- |
| `electron`         | ^37.4.0 (dev)     | App runtime                         |
| `electron-builder` | ^26.0.12 (dev)    | Packaging and distribution          |
| `uuid`             | ^11.1.0 (runtime) | UUID v4 generation for note IDs     |
| `eslint`           | ^8.57.0 (dev)     | Linting                             |
| `prettier`         | ^3.0.0 (dev)      | Formatting                          |
| `typescript`       | ^5.0.0 (dev)      | Type checking only (no .ts sources) |
| `@types/node`      | ^20.0.0 (dev)     | Node type definitions for tsc       |

## Platform Build Targets

| Platform        | Targets                                  | Architectures         |
| --------------- | ---------------------------------------- | --------------------- |
| macOS           | dmg, zip, pkg                            | x64, arm64, universal |
| macOS App Store | mas                                      | x64, arm64            |
| Windows         | nsis, msi, zip, portable                 | x64, ia32, arm64      |
| Linux           | AppImage, deb, rpm, snap, tar.xz, tar.gz | x64, arm64, armv7l    |

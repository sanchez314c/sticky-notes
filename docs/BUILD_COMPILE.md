# Build & Compilation

Modular Sticky uses `electron-builder` to create distributable packages.

## Build Scripts

All commands are executed via npm:

### General
- `npm run dist`: Builds for the current OS architecture.
- `npm run pack`: Packages the application into a directory without creating distributable files (useful for fast verification).
- `npm run build-clean`: Cleans old dist folders and builds fresh artifacts.

### macOS
- `npm run dist:mac`: Builds standard `.dmg`, `.zip`, `.pkg`.
- `npm run dist:mac:all`: Builds for Intel (`x64`) and Apple Silicon (`arm64`).
- `npm run dist:mac:store`: Builds for Mac App Store (MAS).

### Windows
- `npm run dist:win`: Builds standard `.exe` (NSIS).
- `npm run dist:win:all`: Builds `x64`, `ia32`, and `arm64`.
- `npm run dist:win:msi`: Builds Windows Installer (`.msi`).
- `npm run dist:win:portable`: Builds a portable `.exe` requiring no installation.

### Linux
- `npm run dist:linux`: Builds `.AppImage`.
- `npm run dist:linux:all`: Builds `x64`, `arm64`, and `armv7l`.
- `npm run dist:linux:deb`: Builds Debian package (`.deb`).
- `npm run dist:linux:rpm`: Builds RPM package (`.rpm`).
- `npm run dist:linux:snap`: Builds Snap package.
- `npm run dist:linux:tar`: Builds `tar.xz` archive.

## Post-Install Dependencies
If you modify native dependencies, ensure you run:
```bash
npm run postinstall
```
This forces `electron-builder install-app-deps` to recompile native modules for the target Electron architecture rather than your local Node architecture.

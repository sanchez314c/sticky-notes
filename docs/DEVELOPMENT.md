# Development Guide

## Prerequisites
- Node.js (v20+ recommended)
- npm (v10+)
- Git

## Environment Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/sanchez314c/modular-sticky.git
   cd modular-sticky
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running Locally
To start the application in development mode (with `--dev` flag and Node environment):
```bash
npm run dev
```
Or use the provided platform scripts:
- Linux: `./run-source-linux.sh`
- macOS: `./run-source-macos.sh`
- Windows: `.\run-source-windows.bat`

## Code Quality Tools
- **Linting**: `npm run lint` (ESLint)
- **Formatting**: `npm run format` (Prettier)
- **Type Checking**: `npm run type-check` (TypeScript via JSDoc)
- **Bloat Check**: `npm run bloat-check`

## Directory Structure
- `/`: Main process (`main.js`), preload script, package configs.
- `/docs`: Documentation.
- `/scripts`: Utility scripts for building and cleanup.
- `/build-resources`: Assets required by `electron-builder` for packaging (icons).
- `/tests`: Local test suites.

## Context Isolation
`nodeIntegration` is `false`. If you need to access system resources from the UI, you must define an IPC channel in `main.js` and expose it via `preload.js`.

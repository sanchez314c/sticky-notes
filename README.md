# ModularSticky

A desktop sticky notes app built with Electron. Create multiple notes, color-code them, keep them on top of other windows, and they persist between sessions.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-37.4.0-47848F?logo=electron)](https://www.electronjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/Platform-macOS%20|%20Windows%20|%20Linux-lightgrey)](https://github.com/sanchez314c/modular-sticky/releases)

## Features

- Create as many notes as you want, each in its own moveable window
- 7 color options: yellow, orange, green, blue, pink, purple, white
- Notes auto-save as you type (1 second debounce)
- Always-on-top toggle per note
- Notes reopen where you left them after a restart
- Frameless windows with drag-to-move header
- Cross-platform: macOS, Windows, Linux

## Quick Start

```bash
git clone https://github.com/sanchez314c/modular-sticky.git
cd modular-sticky
npm install
npm start
```

Linux users may need:

```bash
sudo sysctl -w kernel.unprivileged_userns_clone=1
```

Or use the included script: `./run-source-linux.sh`

## Building

```bash
# Build for your current platform
npm run dist:current

# Platform-specific
npm run dist:mac
npm run dist:win
npm run dist:linux

# All platforms
npm run dist:all
```

Build output goes to `dist/`.

## Usage

- **New note**: Click the + button
- **Move note**: Drag the colored header bar
- **Change color**: Click any color swatch in the note
- **Always on top**: Click the pin button
- **Minimize**: Click the minimize button
- **Delete note**: Click the X button
- **Resize note**: Drag any edge or corner

## Where Notes Are Stored

Notes are saved as JSON in your OS user data directory:

- macOS: `~/Library/Application Support/ModularSticky/notes.json`
- Windows: `%APPDATA%\ModularSticky\notes.json`
- Linux: `~/.config/ModularSticky/notes.json`

## Project Structure

```
modular-sticky/
├── main.js          # Main process: windows, IPC, storage
├── preload.js       # Context bridge for renderer API
├── renderer.js      # UI logic, auto-save, color contrast
├── note.html        # Note window HTML template
├── package.json
├── build-resources/ # Icons for packaging
├── scripts/         # Build utilities
└── docs/            # Full documentation
```

## Development

```bash
npm run lint          # ESLint
npm run format        # Prettier
npm run type-check    # TypeScript (type check only, no compilation)
npm run bloat-check   # Analyze bundle size
```

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for full development guide.

## Documentation

Full docs in [docs/](docs/README.md):

- [Architecture](docs/ARCHITECTURE.md)
- [API / IPC Reference](docs/API.md)
- [Build & Compile](docs/BUILD_COMPILE.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [FAQ](docs/FAQ.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT -- see [LICENSE](LICENSE).

Copyright (c) 2026 Jason Paul Michaels

---

[Report a bug](https://github.com/sanchez314c/modular-sticky/issues) | [Request a feature](https://github.com/sanchez314c/modular-sticky/issues/new?labels=enhancement)

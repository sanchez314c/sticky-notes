# Installation Guide

## End Users

Pre-compiled binaries are available for macOS, Windows, and Linux via GitHub Releases.

### macOS (.dmg)
1. Download the `.dmg` file.
2. Double-click to mount.
3. Drag the `ModularSticky` application to your `Applications` folder.

### Windows (.exe / .msi)
1. Download the `.exe` (NSIS installer) or `.msi` file.
2. Double-click the installer and follow the prompts.
3. A shortcut will be placed on your desktop and Start Menu.

### Linux (AppImage / .deb / .rpm)
**AppImage (Universal):**
1. Download the `.AppImage` file.
2. Make it executable: `chmod +x ModularSticky*.AppImage`
3. Run it: `./ModularSticky*.AppImage`

**Debian/Ubuntu (.deb):**
```bash
sudo dpkg -i ModularSticky*.deb
sudo apt-get install -f # To resolve any missing dependencies
```

**Fedora/RHEL (.rpm):**
```bash
sudo rpm -i ModularSticky*.rpm
```

*Note: On Linux, ensure a compositor is running (e.g., Picom, Wayland) for window transparency to function correctly.*

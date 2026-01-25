# Deployment Guide

## GitHub Releases Pipeline

Deployment of Modular Sticky is primarily handled via GitHub Releases. The typical workflow is:

1. **Version Bump**: Update the `version` in `package.json`.
2. **Build Distribution**: Run the appropriate `electron-builder` target to generate the artifacts.
   - Example: `npm run dist:maximum` or OS-specific commands.
3. **Artifact Output**: Binaries, installers, and checksum files will be output to the `/dist` directory.
4. **Publish**: 
   - Ensure the `GH_TOKEN` environment variable is set.
   - Run `electron-builder` with `--publish always` or upload manually via the GitHub interface.
   - E.g., `npm run dist --publish always`.

## Update Mechanism

(Currently manual. To support auto-updates in the future, `electron-updater` must be integrated alongside code-signing infrastructure.)

## OS Specific Notes
- **macOS**: Gatekeeper requires code signing (`identity` config) and notarization for users outside the Mac App Store.
- **Windows**: SmartScreen warnings will appear until the installer builds reputation or is signed with an EV certificate.
- **Linux**: Snapcraft may require specific store credentials if publishing directly to the Snap Store.

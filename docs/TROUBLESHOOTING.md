# Troubleshooting

## Blank or Black Manager Window
- **Cause**: Hardware acceleration bugs in Electron, especially on Linux/NVIDIA.
- **Solution**: The app tries to gracefully handle this with `app.disableHardwareAcceleration()` under certain conditions. Run with `--disable-gpu` to test manually.

## Transparent Windows Render Opaque (Linux)
- **Cause**: No active compositor (e.g., Picom, Xcompmgr).
- **Solution**: Install and run a compositor. Ensure X11/Wayland supports RGBA visuals.

## Store Corruption on Startup
- **Symptoms**: App fails to start or notes don't load.
- **Cause**: System crashed mid-write.
- **Solution**: The app has an automatic fallback. It will rename `notes.json` to a corrupt backup file and create a fresh state. Check `userData/` for `notes.json.corrupt.*` to inspect lost data.

## 'electron-builder' Installation Fails (Native Modules)
- **Cause**: Node ABI mismatch between your local Node.js and the target Electron version.
- **Solution**: Delete `node_modules`, run `npm install`, then run `npm run postinstall` (which runs `electron-builder install-app-deps`).

## IPC "No handler registered" Errors
- **Cause**: A renderer tried to invoke a channel not registered in `main.js`.
- **Solution**: Verify `ipcMain.handle` or `ipcMain.on` is properly set up in `main.js` and exposed in `preload.js`.

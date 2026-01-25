# Frequently Asked Questions

## Why are my sticky notes disappearing?
If a note is placed off-screen or the coordinates become invalid, it may appear invisible. Minimizing and restoring from the Manager window often resets the bounds.

## Does it sync across my devices?
No. Modular Sticky is designed as an offline-first application. All data is stored locally in `app.getPath('userData')/notes.json` to maximize privacy.

## Why is the background transparent on Linux?
Linux transparency requires a compositor (e.g., Picom, Wayland with compositing). Without it, the application fallback is an opaque background.

## Can I use custom fonts?
Currently, fonts are hardcoded to a system-default stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`) to ensure consistent rendering across platforms.

## How do I reset my data?
You can delete the `notes.json` file located in the application's userData folder. 
- **macOS**: `~/Library/Application Support/ModularSticky/notes.json`
- **Windows**: `%APPDATA%\ModularSticky\notes.json`
- **Linux**: `~/.config/ModularSticky/notes.json`

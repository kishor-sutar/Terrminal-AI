# Converting to Electron Desktop Application

This guide explains how to run the AI Integrated Terminal as a native Windows/Mac/Linux desktop application.

## Prerequisites

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **Git** - [Download](https://git-scm.com/)

## Step-by-Step Setup

### 1. Export Project from Lovable

1. In Lovable, go to **Settings** → **Export** → **Download ZIP**
2. Extract the ZIP file to a folder on your computer

### 2. Update package.json

Replace your `package.json` with the contents of `electron-package.json`:

```bash
# On Windows (PowerShell)
Copy-Item electron-package.json package.json -Force

# On Mac/Linux
cp electron-package.json package.json
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run in Development Mode

```bash
npm run electron:dev
```

This will:
- Start the Vite dev server
- Launch Electron with hot-reload enabled

### 5. Build for Production

```bash
npm run electron:build
```

This creates:
- **Windows**: `.exe` installer in `release/` folder
- **Mac**: `.dmg` file in `release/` folder  
- **Linux**: `.AppImage` in `release/` folder

## Folder Structure

```
ai-integrated-terminal/
├── electron/
│   ├── main.js      # Electron main process
│   └── preload.js   # Secure API bridge
├── src/             # React application
├── dist/            # Built web files
└── release/         # Packaged executables
```

## Enabling Real Command Execution

To enable real shell command execution (instead of mock), update `src/hooks/useTerminal.ts`:

```typescript
// Add this at the top
const isElectron = window.electronAPI?.isElectron;

// In processInput function, replace mock execution with:
if (isElectron && result.safetyCheck.level === 'safe') {
  const execResult = await window.electronAPI.executeCommand(result.shellCommand);
  // Use execResult.output instead of mock output
}
```

## Security Notes

⚠️ **Important**: The safety validator still applies! Dangerous commands are blocked before reaching the shell.

- Commands are executed with user permissions
- 30-second timeout prevents hanging
- Output is limited to 1MB to prevent memory issues

## Troubleshooting

### "Cannot find module 'electron'"
```bash
npm install electron --save-dev
```

### White screen on launch
Check that `dist/` folder exists. Run `npm run build` first.

### Command execution not working
Ensure you're running the Electron app, not the browser version.

## Support

For issues, check the console (Ctrl+Shift+I in the app) for error messages.

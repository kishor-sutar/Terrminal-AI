/**
 * Electron Main Process
 * This file creates the native desktop window and handles system-level operations
 */
import dotenv from 'dotenv';
dotenv.config();

const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window with native look
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#0a0a0f',
    titleBarStyle: 'hiddenInset', // macOS style
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    icon: path.join(__dirname, '../public/favicon.ico')
  });

  // Load the app
  // In development, load from Vite dev server
  // In production, load the built files
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Create window when app is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Re-create window on macOS when dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/**
 * IPC Handlers for command execution
 * These allow the renderer process to execute shell commands safely
 */

// Execute a shell command
ipcMain.handle('execute-command', async (event, command) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    exec(command, { 
      timeout: 30000, // 30 second timeout
      maxBuffer: 1024 * 1024 // 1MB buffer
    }, (error, stdout, stderr) => {
      const executionTime = Date.now() - startTime;
      
      if (error) {
        resolve({
          success: false,
          output: stderr || error.message,
          executionTime,
          exitCode: error.code
        });
      } else {
        resolve({
          success: true,
          output: stdout,
          stderr: stderr,
          executionTime,
          exitCode: 0
        });
      }
    });
  });
});

// Get system information
ipcMain.handle('get-system-info', async () => {
  return {
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    electronVersion: process.versions.electron,
    homeDir: require('os').homedir(),
    currentDir: process.cwd()
  };
});

// Get default shell
ipcMain.handle('get-default-shell', async () => {
  if (process.platform === 'win32') {
    return process.env.COMSPEC || 'cmd.exe';
  }
  return process.env.SHELL || '/bin/bash';
});

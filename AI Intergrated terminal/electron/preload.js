/**
 * Electron Preload Script
 * This script runs before the renderer process and exposes safe APIs
 * using contextBridge for security
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Execute a shell command
   * @param {string} command - The command to execute
   * @returns {Promise<{success: boolean, output: string, executionTime: number}>}
   */
  executeCommand: (command) => ipcRenderer.invoke('execute-command', command),
  
  /**
   * Get system information
   * @returns {Promise<{platform: string, arch: string, homeDir: string}>}
   */
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  
  /**
   * Get the default shell for the current platform
   * @returns {Promise<string>}
   */
  getDefaultShell: () => ipcRenderer.invoke('get-default-shell'),
  
  /**
   * Check if running in Electron
   */
  isElectron: true,
  
  /**
   * Platform information
   */
  platform: process.platform
});

// Log that preload script has loaded
console.log('Electron preload script loaded successfully');

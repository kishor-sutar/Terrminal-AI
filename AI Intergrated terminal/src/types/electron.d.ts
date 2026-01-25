/**
 * TypeScript declarations for Electron API
 * This defines the shape of window.electronAPI exposed by preload.js
 * 
 * IMPORTANT: This file must be imported in files that use window.electronAPI
 * to ensure TypeScript recognizes the global type augmentation.
 */

export interface ElectronAPI {
  /**
   * Execute a shell command in the system terminal
   */
  executeCommand: (command: string) => Promise<{
    success: boolean;
    output: string;
    stderr?: string;
    executionTime: number;
    exitCode: number;
  }>;
  
  /**
   * Get system information
   */
  getSystemInfo: () => Promise<{
    platform: string;
    arch: string;
    nodeVersion: string;
    electronVersion: string;
    homeDir: string;
    currentDir: string;
  }>;
  
  /**
   * Get the default shell for the current platform
   */
  getDefaultShell: () => Promise<string>;
  
  /**
   * Check if running in Electron environment
   */
  isElectron: boolean;
  
  /**
   * Current platform (win32, darwin, linux)
   */
  platform: string;
}

declare global {
 interface Window {
    electronAPI?: {
      isElectron: boolean;
      runAgent: (input: string) => Promise<string>;
    };
  }
}

// This export is required for TypeScript to treat this as a module
// and properly augment the global Window interface
export {};

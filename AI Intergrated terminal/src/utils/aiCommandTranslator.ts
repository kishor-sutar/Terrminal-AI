// AI Command Translation - Mock/Pluggable AI Logic
// This module simulates AI translation for demo purposes
// Can be replaced with actual AI API calls (OpenAI, Claude, etc.)

import { AICommandTranslation } from '@/types/terminal';
import { validateCommand } from './safetyValidator';

// Mock AI command mappings for demonstration
const COMMAND_MAPPINGS: Record<string, { command: string; explanation: string }> = {
  // File operations
  'list files': { 
    command: 'ls -la', 
    explanation: 'Lists all files and directories in the current location, including hidden files, with detailed information like permissions, owner, size, and modification date.' 
  },
  'list all files': { 
    command: 'ls -la', 
    explanation: 'Displays a detailed listing of all files including hidden ones (those starting with .).' 
  },
  'show files': { 
    command: 'ls -la', 
    explanation: 'Shows all files in the current directory with full details.' 
  },
  'create folder': { 
    command: 'mkdir new_folder', 
    explanation: 'Creates a new directory called "new_folder" in the current location.' 
  },
  'make directory': { 
    command: 'mkdir new_directory', 
    explanation: 'Creates a new directory. Replace "new_directory" with your desired folder name.' 
  },
  'delete file': { 
    command: 'rm filename', 
    explanation: 'Removes the specified file. Replace "filename" with the actual file name. Use with caution!' 
  },
  'copy file': { 
    command: 'cp source destination', 
    explanation: 'Copies a file from source to destination. Replace with actual paths.' 
  },
  'move file': { 
    command: 'mv source destination', 
    explanation: 'Moves or renames a file from source to destination.' 
  },
  'find files': { 
    command: 'find . -name "*.txt"', 
    explanation: 'Searches for all .txt files in the current directory and subdirectories.' 
  },
  
  // System info
  'show disk space': { 
    command: 'df -h', 
    explanation: 'Displays disk space usage in human-readable format (GB, MB, etc.).' 
  },
  'check disk usage': { 
    command: 'du -sh *', 
    explanation: 'Shows the size of each file and folder in the current directory.' 
  },
  'show memory': { 
    command: 'free -h', 
    explanation: 'Displays RAM usage including total, used, and available memory.' 
  },
  'system info': { 
    command: 'uname -a', 
    explanation: 'Shows detailed system information including kernel version and architecture.' 
  },
  'current directory': { 
    command: 'pwd', 
    explanation: 'Prints the full path of the current working directory.' 
  },
  'where am i': { 
    command: 'pwd', 
    explanation: 'Shows your current location in the file system.' 
  },
  
  // Process management
  'running processes': { 
    command: 'ps aux', 
    explanation: 'Lists all running processes with detailed information.' 
  },
  'show processes': { 
    command: 'ps aux | head -20', 
    explanation: 'Displays the top 20 running processes.' 
  },
  'find process': { 
    command: 'ps aux | grep process_name', 
    explanation: 'Searches for a specific process. Replace "process_name" with what you\'re looking for.' 
  },
  
  // Network
  'check internet': { 
    command: 'ping -c 4 google.com', 
    explanation: 'Tests internet connectivity by sending 4 ping requests to Google.' 
  },
  'show ip': { 
    command: 'ip addr show', 
    explanation: 'Displays all network interfaces and their IP addresses.' 
  },
  'network connections': { 
    command: 'netstat -tuln', 
    explanation: 'Shows all active network connections and listening ports.' 
  },
  'download file': { 
    command: 'curl -O url', 
    explanation: 'Downloads a file from the specified URL.' 
  },
  
  // Git operations
  'git status': { 
    command: 'git status', 
    explanation: 'Shows the current state of your git repository including modified and staged files.' 
  },
  'git history': { 
    command: 'git log --oneline -10', 
    explanation: 'Displays the last 10 commits in a compact format.' 
  },
  'create branch': { 
    command: 'git checkout -b branch_name', 
    explanation: 'Creates a new git branch and switches to it.' 
  },
  
  // Text operations
  'search in files': { 
    command: 'grep -r "search_term" .', 
    explanation: 'Searches for text in all files recursively in the current directory.' 
  },
  'count lines': { 
    command: 'wc -l filename', 
    explanation: 'Counts the number of lines in a file.' 
  },
  'view file': { 
    command: 'cat filename', 
    explanation: 'Displays the contents of a file.' 
  },
  'edit file': { 
    command: 'nano filename', 
    explanation: 'Opens the file in the nano text editor.' 
  },

  // Date/Time
  'current time': { 
    command: 'date', 
    explanation: 'Displays the current date and time.' 
  },
  'calendar': { 
    command: 'cal', 
    explanation: 'Shows a calendar for the current month.' 
  },

  // User info
  'who am i': { 
    command: 'whoami', 
    explanation: 'Displays the current logged-in username.' 
  },
  'current user': { 
    command: 'whoami', 
    explanation: 'Shows which user account you are using.' 
  },

  // Clear
  'clear screen': { 
    command: 'clear', 
    explanation: 'Clears the terminal screen.' 
  },
  'clear': { 
    command: 'clear', 
    explanation: 'Clears the terminal display.' 
  },
};

/**
 * Translates natural language input to shell command
 * This is a mock implementation - replace with actual AI API for production
 */
export async function translateToCommand(
  naturalLanguage: string,
  safetyLevel: 'strict' | 'moderate' | 'permissive' = 'moderate'
): Promise<AICommandTranslation> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
  
  const normalizedInput = naturalLanguage.toLowerCase().trim();
  
  // Check for direct command matches
  for (const [key, value] of Object.entries(COMMAND_MAPPINGS)) {
    if (normalizedInput.includes(key) || key.includes(normalizedInput)) {
      const safetyCheck = validateCommand(value.command, safetyLevel);
      
      return{
        originalQuery: naturalLanguage,
        shellCommand: value.command,
        explanation: value.explanation,
        confidence: 0.95,
        safetyCheck,
      };
    }
  }
  
  // Fuzzy matching - find closest match
  const words = normalizedInput.split(' ');
  let bestMatch: { key: string; score: number } | null = null;
  
  for (const key of Object.keys(COMMAND_MAPPINGS)) {
    const keyWords = key.split(' ');
    let score = 0;
    for (const word of words) {
      if (keyWords.some(kw => kw.includes(word) || word.includes(kw))) {
        score++;
      }
    }
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { key, score };
    }
  }
  
  if (bestMatch && bestMatch.score >= 1) {
    const value = COMMAND_MAPPINGS[bestMatch.key];
    const safetyCheck = validateCommand(value.command, safetyLevel);
    
    return {
      originalQuery: naturalLanguage,
      shellCommand: value.command,
      explanation: value.explanation,
      confidence: 0.7 + (bestMatch.score * 0.1),
      alternatives: findAlternatives(normalizedInput),
      safetyCheck,
    };
  }
  
  // If no match found, return a help message
  const helpCommand = 'echo "Command not recognized. Try: list files, show disk space, git status"';
  const safetyCheck = validateCommand(helpCommand, safetyLevel);
  
  return {
    originalQuery: naturalLanguage,
    shellCommand: helpCommand,
    explanation: `I couldn't find a direct translation for "${naturalLanguage}". Here are some things I can help with: file operations, system info, process management, network commands, and git operations.`,
    confidence: 0.3,
    alternatives: ['list files', 'show disk space', 'running processes', 'git status'],
    safetyCheck,
  };
}

/**
 * Find alternative commands for a query
 */
function findAlternatives(query: string): string[] {
  const alternatives: string[] = [];
  const words = query.split(' ');
  
  for (const [key, value] of Object.entries(COMMAND_MAPPINGS)) {
    for (const word of words) {
      if (key.includes(word) && alternatives.length < 3) {
        alternatives.push(value.command);
        break;
      }
    }
  }
  
  return [...new Set(alternatives)];
}

/**
 * Get command suggestions based on partial input
 */
export function getCommandSuggestions(partialInput: string): string[] {
  const normalized = partialInput.toLowerCase().trim();
  if (normalized.length < 2) return [];
  
  const suggestions: string[] = [];
  
  for (const key of Object.keys(COMMAND_MAPPINGS)) {
    if (key.startsWith(normalized) || key.includes(normalized)) {
      suggestions.push(key);
    }
  }
  
  return suggestions.slice(0, 5);
}

/**
 * Generate AI explanation for command output or error
 */
export async function explainOutput(
  command: string,
  output: string,
  isError: boolean
): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (isError) {
    // Mock error explanations
    if (output.includes('permission denied')) {
      return 'This error means you don\'t have sufficient permissions to perform this operation. You may need to use sudo (with caution) or change file permissions.';
    }
    if (output.includes('not found')) {
      return 'The command or file was not found. Check that the name is spelled correctly and the file exists in the specified location.';
    }
    if (output.includes('No such file')) {
      return 'The specified file or directory doesn\'t exist. Verify the path and filename are correct.';
    }
    return `This command encountered an error. The output suggests: ${output.slice(0, 100)}...`;
  }
  
  return 'Command executed successfully. The output shows the expected results.';
}

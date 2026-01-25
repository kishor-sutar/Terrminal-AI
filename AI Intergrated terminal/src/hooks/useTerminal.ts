// Custom hook for terminal state management
// Supports both browser mock mode and real Electron execution
import { useState, useCallback, useRef } from 'react';
import { 
  CommandHistoryItem, 
  TerminalSettings, 
  Suggestion, 
  DEFAULT_SETTINGS,
  AICommandTranslation 
} from '@/types/terminal';
import { translateToCommand, getCommandSuggestions, explainOutput } from '@/utils/aiCommandTranslator';
import '@/types/electron.d';

// Check if running in Electron environment
const isElectron = typeof window !== 'undefined' && window.electronAPI?.isElectron === true;

// Simple ID generator
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export function useTerminal() {
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState<TerminalSettings>(DEFAULT_SETTINGS);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [currentTranslation, setCurrentTranslation] = useState<AICommandTranslation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const historyIndexRef = useRef(-1);

  // Execute command - uses Electron API if available, otherwise mock
  const executeCommand = async (command: string): Promise<{ output: string; isError: boolean; executionTime: number }> => {
    if (isElectron && window.electronAPI) {
      // Real execution in Electron
      try {
        const result = await window.electronAPI.executeCommand(command);
        return {
          output: result.success ? result.output : (result.stderr || result.output),
          isError: !result.success,
          executionTime: result.executionTime,
        };
      } catch (error) {
        return {
          output: `Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          isError: true,
          executionTime: 0,
        };
      }
    } else {
      // Mock execution for browser preview
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
      const mockOutput = generateMockOutput(command);
      return {
        output: mockOutput,
        isError: mockOutput.startsWith('Error:'),
        executionTime: Math.floor(Math.random() * 100) + 10,
      };
    }
  };

  // Process natural language input
  const processInput = useCallback(async (input: string) => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    setCurrentInput('');
    historyIndexRef.current = -1;
    
    try {
      // Translate natural language to shell command
      const translation = await translateToCommand(input, settings.safetyLevel);
      setCurrentTranslation(translation);
      
      // Check if command is blocked
      if (!translation.safetyCheck.isSafe) {
        const blockedItem: CommandHistoryItem = {
          id: generateId(),
          timestamp: new Date(),
          naturalLanguage: input,
          shellCommand: translation.shellCommand,
          output: `⚠️ Command blocked for safety:\n${translation.safetyCheck.blockedPatterns.join('\n')}\n\nSuggestions:\n${translation.safetyCheck.suggestions.join('\n')}`,
          status: 'blocked',
          aiExplanation: translation.explanation,
        };
        
        setCommandHistory(prev => [...prev, blockedItem]);
        setIsProcessing(false);
        return;
      }
      
      // Execute command (real in Electron, mock in browser)
      const { output, isError, executionTime } = await executeCommand(translation.shellCommand);
      
      // Get AI explanation for the output
      const explanation = await explainOutput(
        translation.shellCommand, 
        output, 
        isError
      );
      
      const historyItem: CommandHistoryItem = {
        id: generateId(),
        timestamp: new Date(),
        naturalLanguage: input,
        shellCommand: translation.shellCommand,
        output: output,
        status: isError ? 'error' : 'success',
        aiExplanation: explanation,
        executionTime: executionTime,
      };
      
      setCommandHistory(prev => [...prev, historyItem]);
      
    } catch (error) {
      const errorItem: CommandHistoryItem = {
        id: generateId(),
        timestamp: new Date(),
        naturalLanguage: input,
        shellCommand: '',
        output: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        status: 'error',
      };
      setCommandHistory(prev => [...prev, errorItem]);
    } finally {
      setIsProcessing(false);
      setCurrentTranslation(null);
    }
  }, [settings.safetyLevel]);

  // Update suggestions as user types
  const updateSuggestions = useCallback((input: string) => {
    setCurrentInput(input);
    
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }
    
    const commandSuggestions = getCommandSuggestions(input);
    const newSuggestions: Suggestion[] = commandSuggestions.map((cmd, index) => ({
      id: generateId(),
      command: cmd,
      description: `Suggested: ${cmd}`,
      frequency: 5 - index,
      category: 'ai-suggested' as const,
    }));
    
    setSuggestions(newSuggestions);
  }, []);

  // Navigate command history
  const navigateHistory = useCallback((direction: 'up' | 'down') => {
    if (commandHistory.length === 0) return;
    
    if (direction === 'up') {
      const newIndex = historyIndexRef.current < commandHistory.length - 1 
        ? historyIndexRef.current + 1 
        : historyIndexRef.current;
      historyIndexRef.current = newIndex;
      const item = commandHistory[commandHistory.length - 1 - newIndex];
      if (item) setCurrentInput(item.naturalLanguage);
    } else {
      const newIndex = historyIndexRef.current > 0 
        ? historyIndexRef.current - 1 
        : -1;
      historyIndexRef.current = newIndex;
      if (newIndex === -1) {
        setCurrentInput('');
      } else {
        const item = commandHistory[commandHistory.length - 1 - newIndex];
        if (item) setCurrentInput(item.naturalLanguage);
      }
    }
  }, [commandHistory]);

  // Clear terminal
  const clearTerminal = useCallback(() => {
    setCommandHistory([]);
    setCurrentInput('');
    setCurrentTranslation(null);
    historyIndexRef.current = -1;
  }, []);

  // Search history
  const searchHistory = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Filter history based on search
  const filteredHistory = searchQuery
    ? commandHistory.filter(item => 
        item.naturalLanguage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shellCommand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : commandHistory;

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<TerminalSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    commandHistory: filteredHistory,
    currentInput,
    isProcessing,
    settings,
    suggestions,
    currentTranslation,
    searchQuery,
    processInput,
    updateSuggestions,
    navigateHistory,
    clearTerminal,
    searchHistory,
    updateSettings,
    setCurrentInput,
  };
}

// Mock output generator for demonstration
function generateMockOutput(command: string): string {
  const outputs: Record<string, string> = {
    'ls -la': `total 48
drwxr-xr-x  12 user  staff   384 Jan 24 10:30 .
drwxr-xr-x   5 user  staff   160 Jan 24 09:15 ..
-rw-r--r--   1 user  staff   220 Jan 24 10:30 .gitignore
drwxr-xr-x   8 user  staff   256 Jan 24 10:28 .git
-rw-r--r--   1 user  staff  1234 Jan 24 10:25 README.md
drwxr-xr-x  10 user  staff   320 Jan 24 10:30 src
-rw-r--r--   1 user  staff   567 Jan 24 10:20 package.json
drwxr-xr-x   5 user  staff   160 Jan 24 10:15 node_modules`,
    'pwd': '/home/user/projects/ai-terminal',
    'whoami': 'user',
    'date': new Date().toString(),
    'df -h': `Filesystem      Size   Used  Avail Capacity  Mounted on
/dev/disk1s1   466Gi  234Gi  220Gi    52%    /
/dev/disk1s2   466Gi   12Gi  220Gi     6%    /System/Volumes/Data`,
    'free -h': `              total        used        free      shared  buff/cache   available
Mem:           16Gi       8.2Gi       2.1Gi       512Mi       5.7Gi       7.1Gi
Swap:         2.0Gi       256Mi       1.8Gi`,
    'ps aux | head -20': `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1 169936 13256 ?        Ss   09:00   0:02 /sbin/init
root         2  0.0  0.0      0     0 ?        S    09:00   0:00 [kthreadd]
user      1234  2.5  1.2 456789 98765 pts/0   Sl   09:15   1:23 node server.js
user      2345  0.5  0.8 234567 65432 pts/1   S    09:20   0:45 vim README.md`,
    'git status': `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
        modified:   src/App.tsx
        modified:   src/index.css

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        src/components/NewFeature.tsx

no changes added to commit`,
    'ping -c 4 google.com': `PING google.com (142.250.185.78): 56 data bytes
64 bytes from 142.250.185.78: icmp_seq=0 ttl=117 time=12.3 ms
64 bytes from 142.250.185.78: icmp_seq=1 ttl=117 time=11.8 ms
64 bytes from 142.250.185.78: icmp_seq=2 ttl=117 time=12.1 ms
64 bytes from 142.250.185.78: icmp_seq=3 ttl=117 time=11.9 ms

--- google.com ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 11.8/12.0/12.3/0.2 ms`,
    'clear': '',
    'uname -a': 'Linux ai-terminal 5.15.0-generic #1 SMP x86_64 GNU/Linux',
    'cal': `    January 2025
Su Mo Tu We Th Fr Sa
          1  2  3  4
 5  6  7  8  9 10 11
12 13 14 15 16 17 18
19 20 21 22 23 24 25
26 27 28 29 30 31`,
  };
  
  // Return matching output or generic success message
  for (const [key, output] of Object.entries(outputs)) {
    if (command.includes(key.split(' ')[0])) {
      return outputs[key] || output;
    }
  }
  
  // Check for exact matches
  if (outputs[command]) {
    return outputs[command];
  }
  
  // Default output
  return `Command executed: ${command}\n[Output would appear here in a real terminal]`;
}

// Terminal types and interfaces for AI Integrated Terminal

export interface CommandHistoryItem {
  id
  timestamp
  input
  naturalLanguage
  shellCommand
  output
  status
  aiExplanation?
  executionTime?
}


export interface SafetyValidation {
  isSafe: boolean;
  riskLevel: 'safe' | 'warning' | 'danger';
  blockedPatterns: string[];
  warnings: string[];
  suggestions: string[];
}

export interface AICommandTranslation {
  originalQuery: string;
  shellCommand: string;
  explanation: string;
  confidence: number;
  alternatives?: string[];
  safetyCheck: SafetyValidation;
}

export interface TerminalSettings {
  shellType: 'bash' | 'powershell' | 'zsh' | 'cmd';
  safetyLevel: 'strict' | 'moderate' | 'permissive';
  theme: 'dark' | 'darker' | 'midnight';
  fontSize: number;
  showAIPanel: boolean;
  showSuggestions: boolean;
  soundEffects: boolean;
  autoExecuteSafe: boolean;
}

export interface Suggestion {
  id: string;
  command: string;
  description: string;
  frequency: number;
  category: 'recent' | 'frequent' | 'ai-suggested';
}

export interface TerminalState {
  isProcessing: boolean;
  currentCommand: string;
  commandHistory: CommandHistoryItem[];
  suggestions: Suggestion[];
  settings: TerminalSettings;
}

export const DEFAULT_SETTINGS: TerminalSettings = {
  shellType: 'bash',
  safetyLevel: 'moderate',
  theme: 'dark',
  fontSize: 14,
  showAIPanel: true,
  showSuggestions: true,
  soundEffects: false,
  autoExecuteSafe: false,
};

// Dangerous command patterns for safety validation
export const DANGEROUS_PATTERNS = [
  { pattern: /rm\s+-rf\s+\//, description: 'Recursive force delete from root' },
  { pattern: /rm\s+-rf\s+\*/, description: 'Recursive force delete all' },
  { pattern: /sudo\s+rm/, description: 'Sudo remove command' },
  { pattern: /:\(\)\{\s*:\|:&\s*\};:/, description: 'Fork bomb' },
  { pattern: /mkfs\./, description: 'Format filesystem' },
  { pattern: /dd\s+if=.*of=\/dev\//, description: 'Direct disk write' },
  { pattern: />\s*\/dev\/sda/, description: 'Overwrite disk' },
  { pattern: /chmod\s+-R\s+777\s+\//, description: 'Dangerous permissions change' },
  { pattern: /curl.*\|\s*bash/, description: 'Pipe curl to bash' },
  { pattern: /wget.*\|\s*sh/, description: 'Pipe wget to shell' },
  { pattern: /shutdown/, description: 'System shutdown' },
  { pattern: /reboot/, description: 'System reboot' },
  { pattern: /init\s+0/, description: 'System halt' },
];

export const WARNING_PATTERNS = [
  { pattern: /sudo/, description: 'Elevated privileges required' },
  { pattern: /rm\s+-r/, description: 'Recursive deletion' },
  { pattern: /chmod/, description: 'Permission modification' },
  { pattern: /chown/, description: 'Ownership modification' },
  { pattern: /kill\s+-9/, description: 'Force kill process' },
  { pattern: /pkill/, description: 'Process termination' },
  { pattern: /mv\s+.*\//, description: 'Moving files to system directory' },
];

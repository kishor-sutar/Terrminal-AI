// Safety validation layer for command execution
import { SafetyValidation, DANGEROUS_PATTERNS, WARNING_PATTERNS } from '@/types/terminal';

/**
 * Validates a shell command for safety before execution
 * Implements multi-layer security checks
 */
export function validateCommand(command: string, safetyLevel: 'strict' | 'moderate' | 'permissive'): SafetyValidation {
  const blockedPatterns: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check for dangerous patterns
  for (const { pattern, description } of DANGEROUS_PATTERNS) {
    if (pattern.test(command)) {
      blockedPatterns.push(description);
    }
  }

  // Check for warning patterns
  for (const { pattern, description } of WARNING_PATTERNS) {
    if (pattern.test(command)) {
      warnings.push(description);
    }
  }

  // Determine risk level based on safety settings
  let isSafe = true;
  let riskLevel: 'safe' | 'warning' | 'danger' = 'safe';

  if (blockedPatterns.length > 0) {
    isSafe = false;
    riskLevel = 'danger';
    suggestions.push('This command contains dangerous operations that could harm your system.');
    suggestions.push('Consider using safer alternatives or consult documentation.');
  } else if (warnings.length > 0) {
    riskLevel = 'warning';
    
    if (safetyLevel === 'strict') {
      isSafe = false;
      suggestions.push('Strict safety mode blocks potentially risky commands.');
      suggestions.push('Switch to moderate mode if you trust this operation.');
    } else if (safetyLevel === 'moderate') {
      suggestions.push('This command requires elevated privileges or modifies system state.');
      suggestions.push('Proceed with caution and verify the command.');
    }
    // Permissive mode allows warnings
  }

  // Additional heuristic checks
  if (command.length > 500) {
    warnings.push('Command is unusually long');
    suggestions.push('Consider breaking this into smaller commands.');
  }

  if (/\$\(.*\)/.test(command) || /`.*`/.test(command)) {
    warnings.push('Contains command substitution');
    if (safetyLevel === 'strict') {
      suggestions.push('Command substitution can execute arbitrary code.');
    }
  }

  if (/>\s*\//.test(command) && !blockedPatterns.includes('Overwrite disk')) {
    warnings.push('Redirecting output to system path');
    suggestions.push('Verify the destination path is correct.');
  }

  return {
    isSafe,
    riskLevel,
    blockedPatterns,
    warnings,
    suggestions,
  };
}

/**
 * Sanitizes command for display (masks sensitive info)
 */
export function sanitizeForDisplay(command: string): string {
  // Mask potential passwords/tokens
  return command
    .replace(/password[=:]\s*\S+/gi, 'password=***')
    .replace(/token[=:]\s*\S+/gi, 'token=***')
    .replace(/api[_-]?key[=:]\s*\S+/gi, 'api_key=***')
    .replace(/secret[=:]\s*\S+/gi, 'secret=***');
}

/**
 * Get risk level color class
 */
export function getRiskLevelClass(riskLevel: 'safe' | 'warning' | 'danger'): string {
  switch (riskLevel) {
    case 'safe':
      return 'text-success';
    case 'warning':
      return 'text-warning';
    case 'danger':
      return 'text-destructive';
  }
}

// Terminal output display component
import { CommandHistoryItem } from '@/types/terminal';
import { CheckCircle, XCircle, AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TerminalOutputProps {
  history: CommandHistoryItem[];
  onSelectCommand?: (command: CommandHistoryItem) => void;
}

export function TerminalOutput({ history, onSelectCommand }: TerminalOutputProps) {
  const getStatusIcon = (status: CommandHistoryItem['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'blocked':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground animate-pulse" />;
    }
  };

  const getStatusClass = (status: CommandHistoryItem['status']) => {
    switch (status) {
      case 'success':
        return 'border-success/20';
      case 'error':
        return 'border-destructive/20';
      case 'blocked':
        return 'border-warning/20';
      default:
        return 'border-border';
    }
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <div className="text-5xl mb-4">🚀</div>
        <p className="text-lg font-medium">Welcome to AI Terminal</p>
        <p className="text-sm mt-2">Type a natural language command to get started</p>
        <div className="mt-6 text-xs space-y-1">
          <p>Try: <span className="text-primary">"list all files"</span></p>
          <p>Try: <span className="text-primary">"show disk space"</span></p>
          <p>Try: <span className="text-primary">"check internet connection"</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <div
          key={item.id}
          className={cn(
            "group rounded-lg border p-4 transition-all duration-200 hover:bg-secondary/30 cursor-pointer",
            getStatusClass(item.status)
          )}
          onClick={() => onSelectCommand?.(item)}
        >
          {/* Header with natural language input */}
          <div className="flex items-start gap-3 mb-3">
            <div className="flex items-center gap-2 text-terminal-prompt">
              <ChevronRight className="h-4 w-4" />
              <span className="text-sm font-mono">~</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-medium truncate">
                {item.naturalLanguage}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(item.timestamp).toLocaleTimeString()}
                {item.executionTime && (
                  <span className="ml-2">• {item.executionTime}ms</span>
                )}
              </p>
            </div>
            {getStatusIcon(item.status)}
          </div>

          {/* Translated shell command */}
          <div className="ml-7 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 border border-border">
              <span className="text-xs text-muted-foreground">$</span>
              <code className="text-sm font-mono text-terminal-command">
                {item.shellCommand}
              </code>
            </div>
          </div>

          {/* Output */}
          {item.output && (
            <div className="ml-7">
              <pre className={cn(
                "text-xs font-mono p-3 rounded-md overflow-x-auto bg-terminal-bg scrollbar-terminal",
                item.status === 'error' ? 'text-terminal-error' : 
                item.status === 'blocked' ? 'text-terminal-warning' : 
                'text-terminal-output'
              )}>
                {item.output}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

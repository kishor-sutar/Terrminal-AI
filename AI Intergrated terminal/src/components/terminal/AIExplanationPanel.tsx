// AI Explanation Panel - Shows detailed command info
import { forwardRef } from 'react';
import { CommandHistoryItem, AICommandTranslation } from '@/types/terminal';
import { getRiskLevelClass } from '@/utils/safetyValidator';
import { 
  Sparkles, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Copy,
  BookOpen,
  Lightbulb,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AIExplanationPanelProps {
  selectedCommand: CommandHistoryItem | null;
  currentTranslation: AICommandTranslation | null;
  isProcessing: boolean;
}

export const AIExplanationPanel = forwardRef<HTMLDivElement, AIExplanationPanelProps>(
  function AIExplanationPanel({ 
    selectedCommand, 
    currentTranslation,
    isProcessing 
  }, ref) {
    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    };

    // Show current translation while processing
    if (currentTranslation && isProcessing) {
      return (
        <div ref={ref} className="h-full flex flex-col bg-card border-l border-border">
          <div className="p-4 border-b border-border bg-gradient-ai">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gradient">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              AI Processing
            </h2>
          </div>
          
          <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-terminal">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-secondary rounded w-3/4"></div>
              <div className="h-4 bg-secondary rounded w-1/2"></div>
              <div className="h-20 bg-secondary rounded"></div>
            </div>
            
            <div className="mt-6 p-4 rounded-lg border-gradient">
              <p className="text-sm text-muted-foreground">
                Translating: "{currentTranslation.originalQuery}"
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="typing-indicator flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                </div>
                <span className="text-xs text-muted-foreground">Analyzing command...</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Show placeholder when no command selected
    if (!selectedCommand) {
      return (
        <div ref={ref} className="h-full flex flex-col bg-card border-l border-border">
          <div className="p-4 border-b border-border bg-gradient-ai">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gradient">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Assistant
            </h2>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 ai-glow">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Command Explainer</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Select a command from the history or enter a new command to see AI-powered explanations
            </p>
            
            <div className="mt-8 space-y-3 text-left w-full max-w-xs">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                <Shield className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Safety Analysis</p>
                  <p className="text-xs text-muted-foreground">Every command is checked for dangerous patterns</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                <Lightbulb className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Smart Suggestions</p>
                  <p className="text-xs text-muted-foreground">Get alternative commands and improvements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Show selected command details
    const safetyCheck = selectedCommand.status === 'blocked' ? {
      riskLevel: 'danger' as const,
      warnings: [],
      blockedPatterns: ['Command was blocked by safety system'],
      suggestions: ['Try a safer alternative'],
    } : {
      riskLevel: selectedCommand.status === 'error' ? 'warning' as const : 'safe' as const,
      warnings: [],
      blockedPatterns: [],
      suggestions: [],
    };

    return (
      <div ref={ref} className="h-full flex flex-col bg-card border-l border-border">
        {/* Header */}
        <div className="p-4 border-b border-border bg-gradient-ai">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gradient">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Explanation
          </h2>
        </div>
        
        <div className="flex-1 p-4 space-y-5 overflow-y-auto scrollbar-terminal">
          {/* Natural Language Query */}
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide">
              Your Request
            </label>
            <p className="mt-1 text-foreground font-medium">
              "{selectedCommand.naturalLanguage}"
            </p>
          </div>

          {/* Translated Command */}
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide">
              Shell Command
            </label>
            <div className="mt-1 flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-terminal-bg rounded-md font-mono text-sm text-terminal-command">
                $ {selectedCommand.shellCommand}
              </code>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={() => copyToClipboard(selectedCommand.shellCommand)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Safety Status */}
          <div className="p-3 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Shield className={cn("h-5 w-5", getRiskLevelClass(safetyCheck.riskLevel))} />
              <span className="font-medium capitalize">{safetyCheck.riskLevel} Command</span>
            </div>
            
            {safetyCheck.riskLevel === 'safe' && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-success" />
                This command passed all safety checks
              </p>
            )}
            
            {safetyCheck.riskLevel === 'warning' && (
              <div className="space-y-1">
                {safetyCheck.warnings.map((warning, i) => (
                  <p key={i} className="text-sm text-warning flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {warning}
                  </p>
                ))}
              </div>
            )}
            
            {safetyCheck.riskLevel === 'danger' && (
              <div className="space-y-1">
                {safetyCheck.blockedPatterns.map((pattern, i) => (
                  <p key={i} className="text-sm text-destructive flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    {pattern}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* AI Explanation */}
          {selectedCommand.aiExplanation && (
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <Lightbulb className="h-3 w-3" />
                What This Does
              </label>
              <p className="mt-1 text-sm text-foreground leading-relaxed">
                {selectedCommand.aiExplanation}
              </p>
            </div>
          )}

          {/* Execution Info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(selectedCommand.timestamp).toLocaleString()}
            </div>
            {selectedCommand.executionTime && (
              <div className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3" />
                {selectedCommand.executionTime}ms
              </div>
            )}
          </div>

          {/* Output Preview */}
          {selectedCommand.output && (
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide">
                Output
              </label>
              <pre className={cn(
                "mt-1 p-3 rounded-md font-mono text-xs overflow-x-auto bg-terminal-bg scrollbar-terminal max-h-40",
                selectedCommand.status === 'error' ? 'text-terminal-error' : 'text-terminal-output'
              )}>
                {selectedCommand.output}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }
);

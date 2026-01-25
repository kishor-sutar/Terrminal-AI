// Main terminal container component
import { useState, useRef, useEffect } from 'react';
import { useTerminal } from '@/hooks/useTerminal';
import { TerminalOutput } from './TerminalOutput';
import { TerminalInput } from './TerminalInput';
import { AIExplanationPanel } from './AIExplanationPanel';
import { Sidebar } from './Sidebar';
import { SettingsPanel } from './SettingsPanel';
import { HelpPanel } from './HelpPanel';
import { HistoryPanel } from './HistoryPanel';
import { CommandHistoryItem } from '@/types/terminal';
import { Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ActiveView = 'terminal' | 'history' | 'settings' | 'help';

export function TerminalContainer() {
  const {
    commandHistory,
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
  } = useTerminal();

  const [activeView, setActiveView] = useState<ActiveView>('terminal');
  const [selectedCommand, setSelectedCommand] = useState<CommandHistoryItem | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new commands are added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [commandHistory]);

  // Export history as JSON
  const exportHistory = () => {
    const data = JSON.stringify(commandHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terminal-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'settings':
        return <SettingsPanel settings={settings} onUpdateSettings={updateSettings} />;
      case 'help':
        return <HelpPanel />;
      case 'history':
        return (
          <HistoryPanel
            history={commandHistory}
            onSelectCommand={(cmd) => {
              setSelectedCommand(cmd);
              setActiveView('terminal');
            }}
            onClearHistory={clearTerminal}
            searchQuery={searchQuery}
            onSearch={searchHistory}
          />
        );
      case 'terminal':
      default:
        return (
          <div className="flex flex-1 min-h-0">
            {/* Main terminal area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Terminal header */}
              <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/70" />
                    <div className="w-3 h-3 rounded-full bg-warning/70" />
                    <div className="w-3 h-3 rounded-full bg-success/70" />
                  </div>
                  <span className="text-sm font-mono text-muted-foreground ml-2">
                    AI Terminal — {settings.shellType}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={exportHistory}
                    disabled={commandHistory.length === 0}
                    className="h-7 text-xs"
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Export
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearTerminal}
                    disabled={commandHistory.length === 0}
                    className="h-7 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>

              {/* Terminal output */}
              <div 
                ref={outputRef}
                className="flex-1 overflow-y-auto p-4 bg-terminal-bg scrollbar-terminal"
                style={{ fontSize: `${settings.fontSize}px` }}
              >
                <TerminalOutput 
                  history={commandHistory}
                  onSelectCommand={setSelectedCommand}
                />
              </div>

              {/* Terminal input */}
              <TerminalInput
                value={currentInput}
                onChange={updateSuggestions}
                onSubmit={processInput}
                onNavigateHistory={navigateHistory}
                suggestions={settings.showSuggestions ? suggestions : []}
                isProcessing={isProcessing}
              />
            </div>

            {/* AI Explanation Panel */}
            {settings.showAIPanel && (
              <div className="w-80 lg:w-96 hidden md:block">
                <AIExplanationPanel
                  selectedCommand={selectedCommand}
                  currentTranslation={currentTranslation}
                  isProcessing={isProcessing}
                />
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeItem={activeView}
        onItemClick={setActiveView}
        onSearch={searchHistory}
        searchQuery={searchQuery}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
}

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

type ActiveView = 'terminal' | 'history' | 'settings' | 'help';

export function TerminalContainer() {
  const {
    settings,
    commandHistory,
    currentInput,
    suggestions,
    isProcessing,
    currentTranslation,
    searchQuery,

    processInput,
    updateInput,
    updateSuggestions,
    navigateHistory,
    updateSettings,
    clearTerminal,
    searchHistory,
  } = useTerminal();

  const [activeView, setActiveView] = useState<ActiveView>('terminal');
  const [selectedCommand, setSelectedCommand] =
    useState<CommandHistoryItem | null>(null);

  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [commandHistory]);

  // Export history
  const exportHistory = () => {
    const data = JSON.stringify(commandHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `terminal-history-${new Date()
      .toISOString()
      .split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'settings':
        return (
          <SettingsPanel
            settings={settings}
            onUpdateSettings={updateSettings}
          />
        );

      case 'help':
        return <HelpPanel />;

      case 'history':
        return (
          <HistoryPanel
            history={commandHistory}
            searchQuery={searchQuery}
            onSearch={searchHistory}
            onClearHistory={clearTerminal}
            onSelectCommand={(cmd) => {
              setSelectedCommand(cmd);
              setActiveView('terminal');
            }}
          />
        );

      case 'terminal':
      default:
        return (
          <div className="flex flex-1 min-h-0">
            {/* Main terminal */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
                <span className="text-sm font-mono text-muted-foreground">
                  AI Terminal — {settings.shellType}
                </span>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={exportHistory}
                    disabled={commandHistory.length === 0}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearTerminal}
                    disabled={commandHistory.length === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>

              {/* Output */}
              <div
                ref={outputRef}
                className="flex-1 overflow-y-auto p-4 bg-terminal-bg"
                style={{ fontSize: `${settings.fontSize}px` }}
              >
                <TerminalOutput
                  history={commandHistory}
                  onSelectCommand={setSelectedCommand}
                />
              </div>

              {/* Input */}
              <TerminalInput
                value={currentInput}
                onChange={updateInput}
                onSubmit={processInput}
                onNavigateHistory={navigateHistory}
                suggestions={
                  settings.showSuggestions ? suggestions : []
                }
                isProcessing={isProcessing}
              />
            </div>

            {/* AI Panel */}
            {settings.showAIPanel && (
              <div className="w-96 hidden md:block">
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
      <Sidebar
        activeItem={activeView}
        onItemClick={setActiveView}
        onSearch={searchHistory}
        searchQuery={searchQuery}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
}

// History panel component for viewing and searching command history
import { useState } from 'react';
import { CommandHistoryItem } from '@/types/terminal';
import { 
  Clock, 
  Terminal, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Copy, 
  Trash2,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HistoryPanelProps {
  history: CommandHistoryItem[];
  onSelectCommand: (command: CommandHistoryItem) => void;
  onClearHistory: () => void;
  searchQuery: string;
  onSearch: (query: string) => void;
}

type FilterType = 'all' | 'success' | 'error' | 'blocked';

export function HistoryPanel({ 
  history, 
  onSelectCommand, 
  onClearHistory,
  searchQuery,
  onSearch 
}: HistoryPanelProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusIcon = (status: CommandHistoryItem['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'blocked':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Terminal className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date(date));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  // Group history by date
  const groupedHistory = filteredHistory.reduce((groups, item) => {
    const dateKey = formatDate(item.timestamp);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);
    return groups;
  }, {} as Record<string, CommandHistoryItem[]>);

  const filterButtons: { id: FilterType; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: history.length },
    { id: 'success', label: 'Success', count: history.filter(h => h.status === 'success').length },
    { id: 'error', label: 'Errors', count: history.filter(h => h.status === 'error').length },
    { id: 'blocked', label: 'Blocked', count: history.filter(h => h.status === 'blocked').length },
  ];

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-card-foreground">Command History</h2>
          <span className="text-sm text-muted-foreground">({filteredHistory.length} commands)</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearHistory}
          disabled={history.length === 0}
          className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Clear All
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="px-4 py-3 border-b border-border space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search commands..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-muted/50 text-foreground text-sm rounded-md border border-border focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1">
            {filterButtons.map(({ id, label, count }) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={cn(
                  "px-2 py-1 text-xs rounded-md transition-colors",
                  filter === id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-terminal">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Clock className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              {history.length === 0 
                ? "No commands yet. Start typing in the terminal!"
                : "No commands match your filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedHistory).reverse().map(([date, items]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground font-medium">{date}</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                
                <div className="space-y-2">
                  {items.reverse().map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectCommand(item)}
                      className="group p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {getStatusIcon(item.status)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground truncate">
                              {item.naturalLanguage}
                            </p>
                            <p className="text-xs font-mono text-primary/80 mt-1 truncate">
                              $ {item.shellCommand || '(no command)'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTime(item.timestamp)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(item.shellCommand, item.id);
                            }}
                            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Copy className={cn(
                              "h-3.5 w-3.5",
                              copiedId === item.id ? "text-success" : "text-muted-foreground"
                            )} />
                          </Button>
                        </div>
                      </div>
                      
                      {item.executionTime && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Execution time: {item.executionTime}ms
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

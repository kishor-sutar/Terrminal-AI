// Sidebar navigation component
import { useState } from 'react';
import { 
  Terminal, 
  History, 
  Settings, 
  Search,
  Sparkles,
  Shield,
  Keyboard,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = 'terminal' | 'history' | 'settings' | 'help';

interface SidebarProps {
  activeItem: NavItem;
  onItemClick: (item: NavItem) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function Sidebar({ activeItem, onItemClick, onSearch, searchQuery }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems: { id: NavItem; icon: typeof Terminal; label: string }[] = [
    { id: 'terminal', icon: Terminal, label: 'Terminal' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help' },
  ];

  return (
    <aside className={cn(
      "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center ai-glow">
            <Terminal className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-sidebar-foreground truncate">AI Terminal</h1>
              <p className="text-xs text-muted-foreground truncate">v1.0.0</p>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-3 border-b border-sidebar-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-sidebar-accent text-sidebar-foreground text-sm rounded-md border border-transparent focus:border-sidebar-ring focus:outline-none transition-colors"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onItemClick(id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              "hover:bg-sidebar-accent",
              activeItem === id 
                ? "bg-sidebar-accent text-sidebar-primary" 
                : "text-sidebar-foreground"
            )}
          >
            <Icon className={cn(
              "h-5 w-5 flex-shrink-0",
              activeItem === id && "text-sidebar-primary"
            )} />
            {!isCollapsed && (
              <span className="text-sm font-medium">{label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Features */}
      {!isCollapsed && (
        <div className="p-3 border-t border-sidebar-border space-y-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/50">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs text-sidebar-foreground">AI Powered</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/50">
            <Shield className="h-4 w-4 text-success" />
            <span className="text-xs text-sidebar-foreground">Safety First</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/50">
            <Keyboard className="h-4 w-4 text-warning" />
            <span className="text-xs text-sidebar-foreground">↑↓ History</span>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-3 border-t border-sidebar-border hover:bg-sidebar-accent transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="h-5 w-5 text-sidebar-foreground mx-auto" />
        ) : (
          <div className="flex items-center gap-2 text-sidebar-foreground">
            <ChevronLeft className="h-5 w-5" />
            <span className="text-xs">Collapse</span>
          </div>
        )}
      </button>
    </aside>
  );
}

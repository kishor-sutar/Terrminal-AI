// Help panel with documentation and examples
import { 
  BookOpen, 
  Terminal, 
  Sparkles, 
  Shield, 
  Lightbulb,
  Code,
  FolderOpen,
  Network,
  GitBranch,
  HardDrive
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function HelpPanel() {
  const commandCategories = [
    {
      icon: FolderOpen,
      title: 'File Operations',
      commands: [
        { nl: 'list files', shell: 'ls -la', desc: 'Show all files in directory' },
        { nl: 'create folder', shell: 'mkdir name', desc: 'Create a new directory' },
        { nl: 'copy file', shell: 'cp src dest', desc: 'Copy files' },
        { nl: 'move file', shell: 'mv src dest', desc: 'Move or rename files' },
        { nl: 'find files', shell: 'find . -name "*.txt"', desc: 'Search for files' },
      ],
    },
    {
      icon: HardDrive,
      title: 'System Info',
      commands: [
        { nl: 'show disk space', shell: 'df -h', desc: 'Display disk usage' },
        { nl: 'show memory', shell: 'free -h', desc: 'Show RAM usage' },
        { nl: 'system info', shell: 'uname -a', desc: 'System details' },
        { nl: 'running processes', shell: 'ps aux', desc: 'List all processes' },
      ],
    },
    {
      icon: Network,
      title: 'Network',
      commands: [
        { nl: 'check internet', shell: 'ping -c 4 google.com', desc: 'Test connectivity' },
        { nl: 'show ip', shell: 'ip addr show', desc: 'Display IP addresses' },
        { nl: 'network connections', shell: 'netstat -tuln', desc: 'Active connections' },
      ],
    },
    {
      icon: GitBranch,
      title: 'Git',
      commands: [
        { nl: 'git status', shell: 'git status', desc: 'Show repository status' },
        { nl: 'git history', shell: 'git log --oneline', desc: 'Show commit history' },
        { nl: 'create branch', shell: 'git checkout -b name', desc: 'Create new branch' },
      ],
    },
  ];

  return (
    <div className="p-6 space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Help & Documentation
        </h2>
        <p className="text-muted-foreground">
          Learn how to use the AI Integrated Terminal effectively
        </p>
      </div>

      {/* How it works */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          How It Works
        </h3>
        
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-lg font-bold text-primary">1</span>
            </div>
            <h4 className="font-medium mb-1">Type Naturally</h4>
            <p className="text-sm text-muted-foreground">
              Enter commands in plain English like "show me all files"
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-lg font-bold text-primary">2</span>
            </div>
            <h4 className="font-medium mb-1">AI Translates</h4>
            <p className="text-sm text-muted-foreground">
              Our AI converts your request to the correct shell command
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-lg font-bold text-primary">3</span>
            </div>
            <h4 className="font-medium mb-1">Safe Execution</h4>
            <p className="text-sm text-muted-foreground">
              Commands are validated for safety before running
            </p>
          </div>
        </div>
      </div>

      {/* Safety Info */}
      <div className="p-4 rounded-lg bg-gradient-ai border-gradient">
        <div className="flex items-start gap-3">
          <Shield className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium mb-1">Safety First</h4>
            <p className="text-sm text-muted-foreground mb-3">
              The terminal automatically blocks dangerous commands that could harm your system:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <code className="text-destructive">rm -rf /</code> - Recursive delete from root</li>
              <li>• <code className="text-destructive">sudo rm</code> - Elevated deletion</li>
              <li>• <code className="text-destructive">mkfs</code> - Filesystem formatting</li>
              <li>• <code className="text-destructive">dd if=... of=/dev/</code> - Direct disk writes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Command Reference */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Code className="h-5 w-5 text-accent" />
          Command Reference
        </h3>

        <Accordion type="multiple" className="w-full">
          {commandCategories.map((category) => (
            <AccordionItem key={category.title} value={category.title}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <category.icon className="h-4 w-4 text-primary" />
                  <span>{category.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {category.commands.map((cmd) => (
                    <div 
                      key={cmd.nl}
                      className="flex items-center gap-4 p-2 rounded bg-secondary/30"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          "{cmd.nl}"
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {cmd.desc}
                        </p>
                      </div>
                      <code className="px-2 py-1 bg-terminal-bg rounded text-xs font-mono text-terminal-command whitespace-nowrap">
                        {cmd.shell}
                      </code>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Tips */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-warning" />
          Pro Tips
        </h3>
        
        <div className="grid gap-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
            <span className="text-lg">⌨️</span>
            <div>
              <p className="text-sm font-medium">Use arrow keys</p>
              <p className="text-xs text-muted-foreground">Press ↑/↓ to navigate through your command history</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
            <span className="text-lg">💡</span>
            <div>
              <p className="text-sm font-medium">Tab autocomplete</p>
              <p className="text-xs text-muted-foreground">Press Tab to accept AI suggestions as you type</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
            <span className="text-lg">🔍</span>
            <div>
              <p className="text-sm font-medium">Search history</p>
              <p className="text-xs text-muted-foreground">Use the sidebar search to find previous commands quickly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-4 rounded-lg bg-secondary/30 border border-border text-center">
        <Terminal className="h-8 w-8 text-primary mx-auto mb-2" />
        <h4 className="font-medium">AI Integrated Terminal v1.0.0</h4>
        <p className="text-xs text-muted-foreground mt-1">
          A demonstration project for natural language terminal interaction
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Built with React, TypeScript, and Tailwind CSS
        </p>
      </div>
    </div>
  );
}

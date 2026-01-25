// Settings panel component
import { TerminalSettings } from '@/types/terminal';
import { 
  Monitor, 
  Shield, 
  Type, 
  Volume2, 
  Sparkles,
  Zap
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsPanelProps {
  settings: TerminalSettings;
  onUpdateSettings: (settings: Partial<TerminalSettings>) => void;
}

export function SettingsPanel({ settings, onUpdateSettings }: SettingsPanelProps) {
  return (
    <div className="p-6 space-y-8 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Settings</h2>
        <p className="text-muted-foreground">Customize your AI Terminal experience</p>
      </div>

      {/* Shell Configuration */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-foreground">
          <Monitor className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Shell Configuration</h3>
        </div>
        
        <div className="grid gap-4 pl-7">
          <div className="space-y-2">
            <Label htmlFor="shell-type">Shell Type</Label>
            <Select
              value={settings.shellType}
              onValueChange={(value) => onUpdateSettings({ shellType: value as TerminalSettings['shellType'] })}
            >
              <SelectTrigger id="shell-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bash">Bash (Linux/macOS)</SelectItem>
                <SelectItem value="zsh">Zsh (macOS)</SelectItem>
                <SelectItem value="powershell">PowerShell (Windows)</SelectItem>
                <SelectItem value="cmd">CMD (Windows)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Safety Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-foreground">
          <Shield className="h-5 w-5 text-success" />
          <h3 className="font-semibold">Safety Settings</h3>
        </div>
        
        <div className="grid gap-4 pl-7">
          <div className="space-y-2">
            <Label htmlFor="safety-level">Safety Level</Label>
            <Select
              value={settings.safetyLevel}
              onValueChange={(value) => onUpdateSettings({ safetyLevel: value as TerminalSettings['safetyLevel'] })}
            >
              <SelectTrigger id="safety-level" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strict">
                  <div className="flex flex-col">
                    <span>Strict</span>
                    <span className="text-xs text-muted-foreground">Blocks warnings and dangerous commands</span>
                  </div>
                </SelectItem>
                <SelectItem value="moderate">
                  <div className="flex flex-col">
                    <span>Moderate</span>
                    <span className="text-xs text-muted-foreground">Allows warnings, blocks dangerous commands</span>
                  </div>
                </SelectItem>
                <SelectItem value="permissive">
                  <div className="flex flex-col">
                    <span>Permissive</span>
                    <span className="text-xs text-muted-foreground">Only blocks most dangerous commands</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-execute">Auto-execute Safe Commands</Label>
              <p className="text-xs text-muted-foreground">
                Automatically run commands marked as safe
              </p>
            </div>
            <Switch
              id="auto-execute"
              checked={settings.autoExecuteSafe}
              onCheckedChange={(checked) => onUpdateSettings({ autoExecuteSafe: checked })}
            />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-foreground">
          <Type className="h-5 w-5 text-warning" />
          <h3 className="font-semibold">Appearance</h3>
        </div>
        
        <div className="grid gap-6 pl-7">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={settings.theme}
              onValueChange={(value) => onUpdateSettings({ theme: value as TerminalSettings['theme'] })}
            >
              <SelectTrigger id="theme" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="darker">Darker</SelectItem>
                <SelectItem value="midnight">Midnight</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Font Size</Label>
              <span className="text-sm text-muted-foreground">{settings.fontSize}px</span>
            </div>
            <Slider
              value={[settings.fontSize]}
              min={10}
              max={20}
              step={1}
              onValueChange={([value]) => onUpdateSettings({ fontSize: value })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* AI Features */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-foreground">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">AI Features</h3>
        </div>
        
        <div className="grid gap-4 pl-7">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ai-panel">Show AI Panel</Label>
              <p className="text-xs text-muted-foreground">
                Display command explanations sidebar
              </p>
            </div>
            <Switch
              id="ai-panel"
              checked={settings.showAIPanel}
              onCheckedChange={(checked) => onUpdateSettings({ showAIPanel: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="suggestions">Smart Suggestions</Label>
              <p className="text-xs text-muted-foreground">
                Show AI command suggestions while typing
              </p>
            </div>
            <Switch
              id="suggestions"
              checked={settings.showSuggestions}
              onCheckedChange={(checked) => onUpdateSettings({ showSuggestions: checked })}
            />
          </div>
        </div>
      </div>

      {/* Sound */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-foreground">
          <Volume2 className="h-5 w-5 text-accent" />
          <h3 className="font-semibold">Sound</h3>
        </div>
        
        <div className="grid gap-4 pl-7">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound-effects">Sound Effects</Label>
              <p className="text-xs text-muted-foreground">
                Play sounds for command execution
              </p>
            </div>
            <Switch
              id="sound-effects"
              checked={settings.soundEffects}
              onCheckedChange={(checked) => onUpdateSettings({ soundEffects: checked })}
            />
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="p-4 rounded-lg bg-secondary/50 border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-5 w-5 text-warning" />
          <h4 className="font-medium">Keyboard Shortcuts</h4>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Submit command</span>
            <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">Enter</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Previous command</span>
            <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">↑</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Next command</span>
            <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">↓</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Autocomplete</span>
            <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">Tab</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}

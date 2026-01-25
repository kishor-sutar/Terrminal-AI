// Natural language terminal input component
import { useState, useRef, useEffect, KeyboardEvent, forwardRef } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suggestion } from '@/types/terminal';
import { cn } from '@/lib/utils';

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onNavigateHistory: (direction: 'up' | 'down') => void;
  suggestions: Suggestion[];
  isProcessing: boolean;
  disabled?: boolean;
}

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  function TerminalInput({
    value,
    onChange,
    onSubmit,
    onNavigateHistory,
    suggestions,
    isProcessing,
    disabled,
  }, ref) {
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState(-1);

    useEffect(() => {
      setShowSuggestions(suggestions.length > 0 && value.length > 1);
      setSelectedSuggestion(-1);
    }, [suggestions, value]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
          onChange(suggestions[selectedSuggestion].command);
          setShowSuggestions(false);
        } else if (value.trim()) {
          onSubmit(value);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (showSuggestions && selectedSuggestion > 0) {
          setSelectedSuggestion(prev => prev - 1);
        } else if (showSuggestions && selectedSuggestion === 0) {
          setShowSuggestions(false);
          onNavigateHistory('up');
        } else {
          onNavigateHistory('up');
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (showSuggestions && selectedSuggestion < suggestions.length - 1) {
          setSelectedSuggestion(prev => prev + 1);
        } else {
          onNavigateHistory('down');
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      } else if (e.key === 'Tab' && suggestions.length > 0) {
        e.preventDefault();
        const suggestion = suggestions[selectedSuggestion >= 0 ? selectedSuggestion : 0];
        if (suggestion) {
          onChange(suggestion.command);
          setShowSuggestions(false);
        }
      }
    };

    const handleSubmit = () => {
      if (value.trim() && !isProcessing) {
        onSubmit(value);
      }
    };

    return (
      <div className="relative">
        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div className="absolute bottom-full left-0 right-0 mb-2 z-10 animate-slide-up">
            <div className="bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
              <div className="px-3 py-2 border-b border-border">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" />
                  AI Suggestions
                </span>
              </div>
              <ul className="py-1">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={suggestion.id}
                    className={cn(
                      "px-3 py-2 cursor-pointer transition-colors",
                      index === selectedSuggestion 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-secondary"
                    )}
                    onClick={() => {
                      onChange(suggestion.command);
                      setShowSuggestions(false);
                      inputRef.current?.focus();
                    }}
                  >
                    <span className="font-mono text-sm">{suggestion.command}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {suggestion.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Input container */}
        <div className="flex items-center gap-3 p-4 bg-card border-t border-border terminal-glow">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-mono hidden sm:inline">AI</span>
          </div>
          
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command in natural language... (e.g., 'list all files')"
              disabled={disabled || isProcessing}
              className={cn(
                "w-full bg-secondary/50 border border-border rounded-lg px-4 py-3",
                "text-foreground placeholder:text-muted-foreground",
                "font-mono text-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            />
            {isProcessing && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="typing-indicator flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!value.trim() || isProcessing || disabled}
            className="h-12 px-4 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    );
  }
);

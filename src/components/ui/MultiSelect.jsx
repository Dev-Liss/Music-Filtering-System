import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function MultiSelect({
  label,
  options,
  selected = [],
  onChange,
  placeholder = "Select...",
  className
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = (option) => {
    onChange(option);
  };

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block select-none">
          {label}
        </label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex min-h-[42px] w-full items-center justify-between rounded-lg border border-border bg-[#0d1527]/50 px-3 py-1.5 text-sm cursor-pointer transition-all focus-within:ring-2 focus-within:ring-[#00f59b] focus-within:border-transparent select-none",
          isOpen ? "border-[#00f59b] ring-1 ring-[#00f59b]" : "hover:border-muted-foreground/30 hover:bg-secondary/40"
        )}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          } else if (e.key === 'Escape') {
            setIsOpen(false);
          }
        }}
      >
        <div className="flex flex-wrap gap-1.5 items-center mr-2">
          {selected.length > 0 ? (
            selected.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 bg-secondary text-foreground text-xs py-0.5 pl-2.5 pr-1.5 rounded-md border border-border/80 hover:border-border transition-colors font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                {item}
                <button
                  type="button"
                  className="p-0.5 rounded-full hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(item);
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-muted-foreground text-sm select-none">{placeholder}</span>
          )}
        </div>
        <div className="text-muted-foreground shrink-0 ml-auto pl-1">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-lg border border-border/50 bg-[#0c1220] backdrop-blur-md shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="max-h-56 overflow-y-auto py-1.5 scrollbar-thin">
            {options.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <div
                  key={option}
                  onClick={() => handleToggle(option)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-sm cursor-pointer select-none transition-colors duration-150 mx-1 rounded-md mb-0.5 last:mb-0",
                    isSelected 
                      ? "bg-secondary/55 text-[#00f59b]" 
                      : "text-muted-foreground hover:bg-secondary/35 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-all",
                        isSelected
                          ? "border-[#00f59b] bg-[#00f59b]/15 text-[#00f59b]"
                          : "border-border bg-transparent text-transparent"
                      )}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

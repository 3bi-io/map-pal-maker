import { useState } from 'react';
import { Layers, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MAP_STYLES, type MapStyleId } from '@/lib/map-utils';
import { cn } from '@/lib/utils';

interface Props {
  activeStyle: MapStyleId;
  onStyleChange: (styleId: MapStyleId) => void;
  isMobile: boolean;
}

const MapStyleSwitcher = ({ activeStyle, onStyleChange, isMobile }: Props) => {
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="relative">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setOpen(!open)}
          className="gap-1.5 rounded-lg shadow-elevated bg-card/90 backdrop-blur-md border border-border/50 text-foreground hover:bg-card"
          aria-label="Map style"
        >
          <Layers className="w-4 h-4" />
          <span className="text-xs max-w-[60px] truncate">
            {MAP_STYLES.find(s => s.id === activeStyle)?.label}
          </span>
          <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
        </Button>
        {open && (
          <div className="absolute top-full left-0 mt-1.5 bg-card/95 backdrop-blur-md rounded-xl shadow-elevated border border-border/50 p-1.5 min-w-[140px] z-50 animate-scale-in">
            {MAP_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => { onStyleChange(style.id); setOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors text-left",
                  activeStyle === style.id
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <span className="text-sm">{style.icon}</span>
                <span>{style.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setOpen(!open)}
        className="gap-2 rounded-lg shadow-elevated bg-card/90 backdrop-blur-md border border-border/50 text-foreground hover:bg-card"
        aria-label="Map layers"
      >
        <Layers className="w-4 h-4" />
        <span className="text-sm">{MAP_STYLES.find(s => s.id === activeStyle)?.label}</span>
      </Button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-card/95 backdrop-blur-md rounded-xl shadow-elevated border border-border/50 p-2 z-50 animate-scale-in">
          <div className="grid grid-cols-3 gap-1.5 w-[260px]">
            {MAP_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => { onStyleChange(style.id); setOpen(false); }}
                className={cn(
                  "flex flex-col items-center gap-1 p-2.5 rounded-lg text-xs transition-all",
                  activeStyle === style.id
                    ? "bg-primary/15 text-primary ring-1 ring-primary/30 font-medium"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <span className="text-lg">{style.icon}</span>
                <span className="truncate w-full text-center">{style.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapStyleSwitcher;

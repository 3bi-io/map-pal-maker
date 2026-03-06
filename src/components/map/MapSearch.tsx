import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  place_name: string;
  center: [number, number];
}

interface Props {
  mapboxToken: string;
  onSelect: (lng: number, lat: number, name: string) => void;
  isMobile: boolean;
}

const MapSearch = ({ mapboxToken, onSelect, isMobile }: Props) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim() || !mapboxToken) { setResults([]); return; }
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${mapboxToken}&limit=5`
      );
      const data = await res.json();
      setResults(data.features?.map((f: any) => ({
        id: f.id,
        place_name: f.place_name,
        center: f.center,
      })) || []);
      setOpen(true);
    } catch {
      setResults([]);
    }
  }, [mapboxToken]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.length >= 2) {
      debounceRef.current = setTimeout(() => search(query), 300);
    } else {
      setResults([]);
      setOpen(false);
    }
    return () => clearTimeout(debounceRef.current);
  }, [query, search]);

  const handleSelect = (r: SearchResult) => {
    onSelect(r.center[0], r.center[1], r.place_name);
    setQuery(r.place_name.split(',')[0]);
    setOpen(false);
    if (isMobile) setExpanded(false);
  };

  if (isMobile && !expanded) {
    return (
      <button
        onClick={() => { setExpanded(true); setTimeout(() => inputRef.current?.focus(), 100); }}
        className="p-2.5 rounded-lg shadow-elevated bg-card/90 backdrop-blur-md border border-border/50"
        aria-label="Search location"
      >
        <Search className="w-4 h-4 text-foreground" />
      </button>
    );
  }

  return (
    <div className={cn("relative", isMobile ? "fixed top-[65px] left-3 right-3 z-40" : "")}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search location..."
          className="w-full h-9 pl-9 pr-8 rounded-lg bg-card/95 backdrop-blur-md border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-elevated"
          aria-label="Search locations"
        />
        {(query || (isMobile && expanded)) && (
          <button
            onClick={() => { setQuery(''); setResults([]); setOpen(false); if (isMobile) setExpanded(false); }}
            className="absolute right-2 p-1 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card/95 backdrop-blur-md rounded-xl shadow-elevated border border-border/50 overflow-hidden z-50">
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => handleSelect(r)}
              className="w-full text-left px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-colors border-b border-border/20 last:border-0"
            >
              <span className="line-clamp-1">{r.place_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapSearch;

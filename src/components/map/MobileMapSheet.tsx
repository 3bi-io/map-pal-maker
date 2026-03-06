import { useState } from 'react';
import { ChevronUp, ChevronDown, Route, Clock, Gauge, Mountain, Navigation as NavIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { formatTime } from '@/lib/tracker-utils';
import {
  totalDistance, formatDistance, calculateSpeeds, formatSpeed,
  elapsedTime, formatDuration, timeAgo,
} from '@/lib/map-utils';
import TimelinePlayback from './TimelinePlayback';
import type { LocationUpdate } from './types';

interface Props {
  id: string;
  locations: LocationUpdate[];
  lastUpdate: string | null;
  terrainEnabled: boolean;
  heatmapEnabled: boolean;
  onTerrainToggle: (v: boolean) => void;
  onHeatmapToggle: (v: boolean) => void;
  onTimelineChange: (index: number) => void;
}

const MobileMapSheet = ({
  id, locations, lastUpdate,
  terrainEnabled, heatmapEnabled,
  onTerrainToggle, onHeatmapToggle, onTimelineChange,
}: Props) => {
  const [expanded, setExpanded] = useState(false);

  const speeds = calculateSpeeds(locations);
  const avgSpeed = speeds.length > 1 ? speeds.slice(1).reduce((a, b) => a + b, 0) / (speeds.length - 1) : 0;
  const maxSpeed = Math.max(...speeds);
  const dist = totalDistance(locations);
  const elapsed = elapsedTime(locations);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-30 transition-transform duration-300 ease-out ${
        expanded ? 'translate-y-0' : 'translate-y-[calc(100%-5rem)]'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="bg-card/95 backdrop-blur-md rounded-t-2xl shadow-elevated border-t border-border/50">
        {/* Handle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex flex-col items-center pt-2 pb-1 touch-manipulation"
          aria-label={expanded ? 'Collapse panel' : 'Expand panel'}
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mb-2" />
          <div className="flex items-center gap-2 px-4 w-full">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className={`w-2 h-2 rounded-full shrink-0 ${locations.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
              <span className="font-medium text-sm truncate">
                {locations.length > 0
                  ? `${formatDistance(dist)} · ${locations.length} pts`
                  : 'Waiting for data...'}
              </span>
              {lastUpdate && (
                <span className="text-[10px] text-muted-foreground shrink-0">· {timeAgo(lastUpdate)}</span>
              )}
            </div>
            {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />}
          </div>
        </button>

        {/* Content */}
        <div className="px-4 pb-4 space-y-3 max-h-[55vh] overflow-auto scrollbar-thin">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-1.5">
            <div className="p-2 bg-muted rounded-xl text-center">
              <Route className="w-3 h-3 text-muted-foreground mx-auto mb-0.5" />
              <p className="text-[10px] text-muted-foreground">Dist</p>
              <p className="font-semibold text-xs">{formatDistance(dist)}</p>
            </div>
            <div className="p-2 bg-muted rounded-xl text-center">
              <Clock className="w-3 h-3 text-muted-foreground mx-auto mb-0.5" />
              <p className="text-[10px] text-muted-foreground">Time</p>
              <p className="font-semibold text-xs">{formatDuration(elapsed)}</p>
            </div>
            <div className="p-2 bg-muted rounded-xl text-center">
              <Gauge className="w-3 h-3 text-muted-foreground mx-auto mb-0.5" />
              <p className="text-[10px] text-muted-foreground">Avg</p>
              <p className="font-semibold text-xs">{formatSpeed(avgSpeed)}</p>
            </div>
            <div className="p-2 bg-muted rounded-xl text-center">
              <Gauge className="w-3 h-3 text-destructive mx-auto mb-0.5" />
              <p className="text-[10px] text-muted-foreground">Max</p>
              <p className="font-semibold text-xs">{formatSpeed(maxSpeed)}</p>
            </div>
          </div>

          {/* ID */}
          <div className="p-2.5 bg-muted rounded-xl">
            <p className="text-[10px] text-muted-foreground mb-0.5">Tracking ID</p>
            <p className="font-mono text-xs truncate">{id}</p>
          </div>

          {/* Toggles */}
          <div className="flex gap-2">
            <div className="flex items-center gap-2 flex-1 p-2 bg-muted rounded-xl">
              <Mountain className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs flex-1">3D</span>
              <Switch checked={terrainEnabled} onCheckedChange={onTerrainToggle} className="scale-75" aria-label="Toggle 3D terrain" />
            </div>
            <div className="flex items-center gap-2 flex-1 p-2 bg-muted rounded-xl">
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" />
              <span className="text-xs flex-1">Heat</span>
              <Switch checked={heatmapEnabled} onCheckedChange={onHeatmapToggle} className="scale-75" aria-label="Toggle heatmap" />
            </div>
          </div>

          {/* Timeline */}
          <TimelinePlayback locations={locations} onPositionChange={onTimelineChange} isMobile={true} />

          {/* Recent */}
          {locations.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-medium flex items-center gap-1.5">
                <NavIcon className="w-3 h-3" />
                Recent
              </h3>
              {locations.slice(-4).reverse().map((loc) => (
                <div key={loc.id} className="text-xs p-2 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">{formatTime(loc.created_at)}</span>
                  <p className="font-mono text-[10px]">{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMapSheet;

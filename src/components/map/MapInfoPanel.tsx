import { MapPin, Navigation as NavIcon, Route, Gauge, Clock, Mountain } from 'lucide-react';
import { Card } from '@/components/ui/card';
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

const MapInfoPanel = ({
  id, locations, lastUpdate,
  terrainEnabled, heatmapEnabled,
  onTerrainToggle, onHeatmapToggle, onTimelineChange,
}: Props) => {
  const speeds = calculateSpeeds(locations);
  const avgSpeed = speeds.length > 1 ? speeds.slice(1).reduce((a, b) => a + b, 0) / (speeds.length - 1) : 0;
  const maxSpeed = Math.max(...speeds);
  const dist = totalDistance(locations);
  const elapsed = elapsedTime(locations);

  return (
    <Card className="w-full lg:w-80 xl:w-88 p-4 space-y-4 shadow-elevated overflow-auto scrollbar-thin rounded-xl border-border/50">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold text-sm">Tracking Info</h2>
          <p className="text-[10px] text-muted-foreground font-mono truncate">{id}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-muted rounded-xl">
          <div className="flex items-center gap-1.5 mb-1">
            <Route className="w-3 h-3 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground">Distance</p>
          </div>
          <p className="font-semibold text-sm">{formatDistance(dist)}</p>
        </div>
        <div className="p-3 bg-muted rounded-xl">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground">Elapsed</p>
          </div>
          <p className="font-semibold text-sm">{formatDuration(elapsed)}</p>
        </div>
        <div className="p-3 bg-muted rounded-xl">
          <div className="flex items-center gap-1.5 mb-1">
            <Gauge className="w-3 h-3 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground">Avg Speed</p>
          </div>
          <p className="font-semibold text-sm">{formatSpeed(avgSpeed)}</p>
        </div>
        <div className="p-3 bg-muted rounded-xl">
          <div className="flex items-center gap-1.5 mb-1">
            <Gauge className="w-3 h-3 text-destructive" />
            <p className="text-[10px] text-muted-foreground">Max Speed</p>
          </div>
          <p className="font-semibold text-sm">{formatSpeed(maxSpeed)}</p>
        </div>
      </div>

      {/* Status */}
      <div className="p-3 bg-muted rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${locations.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
            <span className="text-sm font-medium">{locations.length > 0 ? 'Active' : 'Waiting...'}</span>
          </div>
          <span className="text-xs text-muted-foreground">{locations.length} pts</span>
        </div>
        {lastUpdate && (
          <p className="text-[10px] text-muted-foreground mt-1">Updated {timeAgo(lastUpdate)}</p>
        )}
      </div>

      {/* Toggles */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <Mountain className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs">3D Terrain</span>
          </div>
          <Switch checked={terrainEnabled} onCheckedChange={onTerrainToggle} aria-label="Toggle 3D terrain" />
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" />
            <span className="text-xs">Heatmap</span>
          </div>
          <Switch checked={heatmapEnabled} onCheckedChange={onHeatmapToggle} aria-label="Toggle heatmap" />
        </div>
      </div>

      {/* Timeline */}
      <TimelinePlayback locations={locations} onPositionChange={onTimelineChange} isMobile={false} />

      {/* Recent Updates */}
      {locations.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-medium flex items-center gap-2">
            <NavIcon className="w-3.5 h-3.5" />
            Recent Updates
          </h3>
          <div className="max-h-40 overflow-auto space-y-1.5 scrollbar-thin">
            {locations.slice(-5).reverse().map((loc) => (
              <div key={loc.id} className="text-xs p-2 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">{formatTime(loc.created_at)}</span>
                <p className="font-mono text-[10px]">{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default MapInfoPanel;

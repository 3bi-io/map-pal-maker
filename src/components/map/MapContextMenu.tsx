import { Copy, Ruler, MapPin } from 'lucide-react';
import type { MapContextMenuState } from './types';
import { toast } from 'sonner';

interface Props {
  state: MapContextMenuState;
  onClose: () => void;
  onMeasure: () => void;
  onDropPin: () => void;
}

const MapContextMenu = ({ state, onClose, onMeasure, onDropPin }: Props) => {
  if (!state.visible || !state.lngLat) return null;

  const copyCoords = async () => {
    const text = `${state.lngLat!.lat.toFixed(6)}, ${state.lngLat!.lng.toFixed(6)}`;
    await navigator.clipboard.writeText(text);
    toast.success('Coordinates copied');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 bg-card/95 backdrop-blur-md rounded-xl shadow-elevated border border-border/50 py-1 min-w-[180px] animate-scale-in"
        style={{ left: state.x, top: state.y }}
      >
        <div className="px-3 py-1.5 text-[10px] font-mono text-muted-foreground border-b border-border/30">
          {state.lngLat.lat.toFixed(6)}, {state.lngLat.lng.toFixed(6)}
        </div>
        <button
          onClick={copyCoords}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy Coordinates
        </button>
        <button
          onClick={() => { onMeasure(); onClose(); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
        >
          <Ruler className="w-3.5 h-3.5" />
          Measure Distance
        </button>
        <button
          onClick={() => { onDropPin(); onClose(); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
        >
          <MapPin className="w-3.5 h-3.5" />
          Drop Pin
        </button>
      </div>
    </>
  );
};

export default MapContextMenu;

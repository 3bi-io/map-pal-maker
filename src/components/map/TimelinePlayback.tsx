import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatTime } from '@/lib/tracker-utils';
import type { LocationUpdate } from './types';

interface Props {
  locations: LocationUpdate[];
  onPositionChange: (index: number) => void;
  isMobile: boolean;
}

const TimelinePlayback = ({ locations, onPositionChange, isMobile }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(locations.length - 1);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    setCurrentIndex(locations.length - 1);
  }, [locations.length]);

  const play = useCallback(() => {
    setPlaying(true);
    let idx = currentIndex < locations.length - 1 ? currentIndex : 0;
    intervalRef.current = setInterval(() => {
      idx++;
      if (idx >= locations.length) {
        clearInterval(intervalRef.current);
        setPlaying(false);
        idx = locations.length - 1;
      }
      setCurrentIndex(idx);
      onPositionChange(idx);
    }, 500);
  }, [currentIndex, locations.length, onPositionChange]);

  const pause = useCallback(() => {
    setPlaying(false);
    clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleSlider = (value: number[]) => {
    const idx = value[0];
    setCurrentIndex(idx);
    onPositionChange(idx);
    if (playing) pause();
  };

  const skipBack = () => {
    const idx = Math.max(0, currentIndex - 1);
    setCurrentIndex(idx);
    onPositionChange(idx);
  };

  const skipForward = () => {
    const idx = Math.min(locations.length - 1, currentIndex + 1);
    setCurrentIndex(idx);
    onPositionChange(idx);
  };

  if (locations.length < 2) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Timeline</span>
        {locations[currentIndex] && (
          <span className="text-[10px] text-muted-foreground font-mono">
            {formatTime(locations[currentIndex].created_at)}
          </span>
        )}
      </div>
      <Slider
        value={[currentIndex]}
        min={0}
        max={locations.length - 1}
        step={1}
        onValueChange={handleSlider}
        className="w-full"
        aria-label="Timeline position"
      />
      <div className={`flex items-center justify-center ${isMobile ? 'gap-1' : 'gap-2'}`}>
        <Button
          size="icon"
          variant="ghost"
          onClick={skipBack}
          disabled={currentIndex === 0}
          className="h-7 w-7"
          aria-label="Previous point"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={playing ? pause : play}
          className="h-8 w-8 rounded-full"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={skipForward}
          disabled={currentIndex === locations.length - 1}
          className="h-7 w-7"
          aria-label="Next point"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </Button>
        <span className="text-[10px] text-muted-foreground ml-2">
          {currentIndex + 1}/{locations.length}
        </span>
      </div>
    </div>
  );
};

export default TimelinePlayback;

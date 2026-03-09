import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { cn } from '@/lib/utils';

interface VideoBackgroundProps {
  src: string;
  className?: string;
  overlayClassName?: string;
}

const VideoBackground = ({ src, className, overlayClassName }: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {});
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <>
      <video
        ref={videoRef}
        className={cn('absolute inset-0 w-full h-full object-cover hidden sm:block', className)}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={cn('absolute inset-0 bg-background/50 dark:bg-background/60 [.oled_&]:bg-background/70', overlayClassName)} />
    </>
  );
};

export default VideoBackground;

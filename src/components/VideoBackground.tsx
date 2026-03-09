import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { cn } from '@/lib/utils';

interface VideoBackgroundProps {
  src: string;
  poster?: string;
  className?: string;
  overlayClassName?: string;
  parallaxSpeed?: number;
}

const VideoBackground = ({ src, poster, className, overlayClassName, parallaxSpeed = 0.4 }: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [prefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const handleScroll = useCallback(() => {
    if (prefersReducedMotion || !parallaxRef.current || !containerRef.current) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current!.getBoundingClientRect();
      const offset = rect.top * parallaxSpeed;
      parallaxRef.current!.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  }, [prefersReducedMotion, parallaxSpeed]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let hls: Hls | null = null;
    let safariHandler: (() => void) | null = null;

    const initVideo = () => {
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        safariHandler = () => video.play().catch(() => {});
        video.addEventListener('loadedmetadata', safariHandler);
      }
    };

    const destroyVideo = () => {
      if (hls) {
        hls.destroy();
        hls = null;
      }
      if (safariHandler) {
        video.removeEventListener('loadedmetadata', safariHandler);
        safariHandler = null;
      }
      video.pause();
      video.removeAttribute('src');
      video.load();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          initVideo();
        } else {
          destroyVideo();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      destroyVideo();
    };
  }, [src, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0" aria-hidden="true">
        <div className={cn('absolute inset-0 bg-background/50 dark:bg-background/60 [.oled_&]:bg-background/70', overlayClassName)} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div ref={parallaxRef} className="absolute -inset-[20%] will-change-transform">
        <video
          ref={videoRef}
          className={cn('absolute inset-0 w-full h-full object-cover', className)}
          autoPlay
          loop
          muted
          playsInline
          poster={poster}
          aria-hidden="true"
          role="presentation"
        />
      </div>
      <div className={cn('absolute inset-0 bg-background/50 dark:bg-background/60 [.oled_&]:bg-background/70', overlayClassName)} />
    </div>
  );
};

export default VideoBackground;

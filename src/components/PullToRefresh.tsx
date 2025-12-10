import { ReactNode, forwardRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  progress: number;
  shouldTrigger: boolean;
}

export const PullToRefreshIndicator = ({
  pullDistance,
  isRefreshing,
  progress,
  shouldTrigger,
}: PullToRefreshIndicatorProps) => {
  if (pullDistance === 0 && !isRefreshing) return null;

  return (
    <div
      className="flex justify-center items-center overflow-hidden transition-all duration-200"
      style={{ height: pullDistance }}
    >
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full bg-muted transition-all duration-200",
          shouldTrigger && "bg-primary/10",
          isRefreshing && "bg-primary/20"
        )}
        style={{
          transform: `scale(${0.5 + progress * 0.5}) rotate(${progress * 180}deg)`,
          opacity: Math.min(progress * 1.5, 1),
        }}
      >
        <RefreshCw
          className={cn(
            "w-5 h-5 text-muted-foreground transition-colors",
            shouldTrigger && "text-primary",
            isRefreshing && "animate-spin text-primary"
          )}
        />
      </div>
    </div>
  );
};

interface PullToRefreshContainerProps {
  children: ReactNode;
  className?: string;
}

export const PullToRefreshContainer = forwardRef<HTMLDivElement, PullToRefreshContainerProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-1 overflow-y-auto overscroll-none", className)}
      >
        {children}
      </div>
    );
  }
);

PullToRefreshContainer.displayName = 'PullToRefreshContainer';

import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setTimeout(() => setShowBanner(false), 2000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!navigator.onLine) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-[100] px-4 py-2 text-center text-sm font-medium transition-colors safe-area-top ${
        isOnline 
          ? 'bg-green-500 text-green-50' 
          : 'bg-destructive text-destructive-foreground'
      }`}
      role="alert"
      aria-live="assertive"
    >
      {isOnline ? (
        <span>Back online</span>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" aria-hidden="true" />
          <span>You're offline</span>
          <Button 
            size="sm" 
            variant="secondary" 
            className="h-6 px-2 text-xs"
            onClick={() => window.location.reload()}
            aria-label="Retry connection"
          >
            <RefreshCw className="w-3 h-3 mr-1" aria-hidden="true" />
            Retry
          </Button>
        </div>
      )}
    </div>
  );
};

export default OfflineIndicator;

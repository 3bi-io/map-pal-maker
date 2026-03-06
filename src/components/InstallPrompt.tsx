import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';

const InstallPrompt = () => {
  const { isInstallable, isInstalled, installApp } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
    
    const wasDismissed = sessionStorage.getItem('pwa-prompt-dismissed');
    if (wasDismissed) setDismissed(true);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setDismissed(true);
      if (navigator.vibrate) navigator.vibrate(50);
    }
  };

  if (isInstalled || dismissed) return null;
  if (!isInstallable && !isIOS) return null;

  return (
    <div className={`fixed left-4 right-4 md:left-auto md:right-4 md:w-96 z-40 animate-in slide-in-from-bottom-4 ${
      isMobile ? 'bottom-20' : 'bottom-4'
    }`}>
      <div className="bg-card border border-border rounded-xl shadow-elevated p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">Install TrackView</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isIOS 
                ? 'Tap Share then "Add to Home Screen" to install'
                : 'Install the app for quick access and offline tracking'
              }
            </p>
            <div className="flex gap-2 mt-3">
              {!isIOS && (
                <Button size="sm" onClick={handleInstall} className="gap-1.5">
                  <Download className="w-4 h-4" />
                  Install
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={handleDismiss}>
                {isIOS ? 'Got it' : 'Not now'}
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;

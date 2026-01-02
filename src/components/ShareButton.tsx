import { Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { isShareSupported, shareUrl, copyToClipboard } from '@/lib/tracker-utils';

interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onSuccess?: () => void;
}

const ShareButton = ({
  url,
  title,
  text,
  variant = 'outline',
  size = 'sm',
  className = '',
  onSuccess,
}: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const canShare = isShareSupported();

  const handleShare = async () => {
    if (canShare) {
      const success = await shareUrl(url, title, text);
      if (success) {
        onSuccess?.();
      }
    } else {
      const success = await copyToClipboard(url);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        onSuccess?.();
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={`gap-1 ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" />
          Copied!
        </>
      ) : canShare ? (
        <>
          <Share2 className="w-3 h-3" />
          Share
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          Copy Link
        </>
      )}
    </Button>
  );
};

export default ShareButton;

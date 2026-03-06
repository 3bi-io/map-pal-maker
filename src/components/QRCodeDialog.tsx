import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title: string;
}

const QRCodeDialog = ({ open, onOpenChange, url, title }: QRCodeDialogProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'Copied!',
      description: 'Link copied to clipboard.',
    });
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();

    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `${title}-qr-code.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const saveToPhotos = async () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();

    img.onload = async () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      try {
        const blob = await new Promise<Blob>((resolve) => 
          canvas.toBlob((b) => resolve(b!), 'image/png')
        );
        
        // Try share API for saving
        if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'qr-code.png', { type: 'image/png' })] })) {
          await navigator.share({
            files: [new File([blob], `${title}-qr-code.png`, { type: 'image/png' })],
            title: `${title} QR Code`,
          });
        } else {
          // Fallback to download
          downloadQRCode();
        }
      } catch {
        downloadQRCode();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const QRContent = () => (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="p-4 bg-white rounded-2xl shadow-card">
        <QRCodeSVG
          id="qr-code-svg"
          value={url}
          size={isMobile ? 240 : 200}
          level="H"
          includeMargin
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>
      
      <div className="w-full p-3 bg-muted rounded-xl">
        <p className="text-xs text-muted-foreground mb-1">Tracking URL</p>
        <p className="text-sm font-mono break-all">{url}</p>
      </div>

      <div className={`flex gap-3 w-full ${isMobile ? 'flex-col' : ''}`}>
        <Button
          variant="outline"
          className={`gap-2 ${isMobile ? 'w-full h-12' : 'flex-1'}`}
          onClick={copyToClipboard}
          aria-label="Copy tracking link"
        >
          <Copy className="w-4 h-4" />
          Copy Link
        </Button>
        {isMobile ? (
          <Button
            className="w-full gap-2 h-12"
            onClick={saveToPhotos}
            aria-label="Save QR code to photos"
          >
            <Image className="w-4 h-4" />
            Save to Photos
          </Button>
        ) : (
          <Button
            className="flex-1 gap-2"
            onClick={downloadQRCode}
            aria-label="Download QR code"
          >
            <Download className="w-4 h-4" />
            Download QR
          </Button>
        )}
      </div>
    </div>
  );

  // Mobile: use Drawer (bottom sheet)
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-8">
          <DrawerHeader className="text-center">
            <DrawerTitle>Share Tracker</DrawerTitle>
            <DrawerDescription>
              Scan this QR code or copy the link below.
            </DrawerDescription>
          </DrawerHeader>
          <QRContent />
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: use Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Tracker</DialogTitle>
          <DialogDescription>
            Scan this QR code to open the tracking page, or copy the link below.
          </DialogDescription>
        </DialogHeader>
        <QRContent />
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeDialog;

/**
 * Generates a unique tracking ID in format XXXX-XXXXXX
 */
export function generateTrackingId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const part1 = Array.from({ length: 4 }, () => 
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  const part2 = Array.from({ length: 6 }, () => 
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `${part1}-${part2}`;
}

/**
 * Formats a date string for display
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats a time string for display
 */
export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString();
}

/**
 * Generates a tracking URL for a given tracking ID
 */
export function getTrackingUrl(trackingId: string): string {
  return `${window.location.origin}/track/${trackingId}`;
}

/**
 * Generates a map URL for a given tracking ID
 */
export function getMapUrl(trackingId: string): string {
  return `${window.location.origin}/map/${trackingId}`;
}

/**
 * Copies text to clipboard with optional callback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Native share API support check and share function
 */
export async function shareUrl(url: string, title: string, text?: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({ url, title, text });
      return true;
    } catch (err) {
      // User cancelled or share failed
      if ((err as Error).name !== 'AbortError') {
        // Share failed silently
      }
      return false;
    }
  }
  // Fallback to clipboard
  return copyToClipboard(url);
}

/**
 * Check if native share is supported
 */
export function isShareSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

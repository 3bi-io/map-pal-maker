import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Copy, Trash2, ToggleLeft, ToggleRight, Clock, Map, QrCode, Pencil, Check, X, MoreVertical, RefreshCw } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { PullToRefreshIndicator, PullToRefreshContainer } from '@/components/PullToRefresh';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import QRCodeDialog from '@/components/QRCodeDialog';
import ShareButton from '@/components/ShareButton';
import TrackerCardSkeleton from '@/components/TrackerCardSkeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDate, getTrackingUrl } from '@/lib/tracker-utils';
import { useTrackers } from '@/hooks/useTrackers';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Tracker } from '@/hooks/useTrackers';

const Dashboard = () => {
  const [deleteTrackerId, setDeleteTrackerId] = useState<string | null>(null);
  const [qrTracker, setQrTracker] = useState<Tracker | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const {
    trackers,
    loading,
    lastRefresh,
    refetch,
    createTracker,
    toggleTracker,
    deleteTracker,
    renameTracker,
  } = useTrackers();

  const startEditing = (tracker: Tracker) => {
    setEditingId(tracker.id);
    setEditName(tracker.name);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveTrackerName = (trackerId: string) => {
    renameTracker(trackerId, editName);
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = () => {
    if (!deleteTrackerId) return;
    deleteTracker(deleteTrackerId);
    setDeleteTrackerId(null);
    if (navigator.vibrate) navigator.vibrate(30);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: `${label} copied to clipboard.` });
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleCreateTracker = () => {
    createTracker();
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const {
    containerRef,
    pullDistance,
    isRefreshing,
    progress,
    shouldTrigger,
  } = usePullToRefresh({ onRefresh: handleRefresh });

  return (
    <>
      <SEO
        title="Dashboard - TrackView"
        description="Manage your location trackers from your dashboard."
      />
      <Layout>
        <PullToRefreshContainer ref={containerRef} className="sm:overflow-visible">
          <PullToRefreshIndicator
            pullDistance={pullDistance}
            isRefreshing={isRefreshing}
            progress={progress}
            shouldTrigger={shouldTrigger}
          />
          <main className="container mx-auto px-4 py-6 sm:py-8" aria-label="Dashboard">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Trackers</h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Create and manage your location trackers
                  {lastRefresh && (
                    <span className="hidden sm:inline text-xs ml-2 text-muted-foreground/70">
                      · Updated {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </p>
              </div>
              {/* Desktop new tracker button */}
              <div className="hidden sm:flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetch()}
                  disabled={isRefreshing}
                  className="shadow-card"
                  aria-label="Refresh trackers"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
                <Button onClick={handleCreateTracker} className="gap-2 shadow-card">
                  <Plus className="w-4 h-4" />
                  New Tracker
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <TrackerCardSkeleton key={i} />
                ))}
              </div>
            ) : trackers.length === 0 ? (
              /* Enhanced empty state */
              <Card className="text-center py-16 sm:py-20 shadow-card rounded-xl">
                <CardContent>
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
                    <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">No trackers yet</h2>
                  <p className="text-muted-foreground mb-2 max-w-sm mx-auto">
                    Create your first tracker to start monitoring locations in real-time.
                  </p>
                  <p className="text-xs text-muted-foreground/70 mb-8">
                    Each tracker generates a unique link you can share with any device.
                  </p>
                  <Button onClick={handleCreateTracker} className="gap-2 h-12 px-6">
                    <Plus className="w-5 h-5" />
                    Create Your First Tracker
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {trackers.map((tracker) => (
                  <Card key={tracker.id} className="shadow-card hover:shadow-elevated transition-shadow rounded-xl">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          {editingId === tracker.id ? (
                            <div className="flex items-center gap-1">
                              <Input
                                ref={editInputRef}
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveTrackerName(tracker.id);
                                  if (e.key === 'Escape') cancelEditing();
                                }}
                                className="h-7 text-base font-semibold"
                                maxLength={50}
                                aria-label="Tracker name"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-primary"
                                onClick={() => saveTrackerName(tracker.id)}
                                aria-label="Save name"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground"
                                onClick={cancelEditing}
                                aria-label="Cancel editing"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <CardTitle
                              className="text-lg truncate cursor-pointer hover:text-primary transition-colors group flex items-center gap-1"
                              onClick={() => startEditing(tracker)}
                              title="Click to rename"
                            >
                              {tracker.name}
                              <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" aria-hidden="true" />
                            </CardTitle>
                          )}
                          <CardDescription className="font-mono text-xs">
                            {tracker.tracking_id}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-1">
                          {tracker.is_active ? (
                            <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Paused</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" aria-hidden="true" />
                          {tracker.location_count || 0} points
                        </div>
                        {tracker.last_update && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" aria-hidden="true" />
                            {formatDate(tracker.last_update)}
                          </div>
                        )}
                      </div>

                      {/* Desktop actions */}
                      <div className="hidden sm:flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQrTracker(tracker)}
                          className="gap-1"
                          aria-label={`QR Code for ${tracker.name}`}
                        >
                          <QrCode className="w-3 h-3" />
                          QR Code
                        </Button>

                        <ShareButton
                          url={getTrackingUrl(tracker.tracking_id)}
                          title={tracker.name}
                          text="Track location with this link"
                          onSuccess={() => toast({ title: 'Shared!', description: 'Tracking link shared.' })}
                        />
                        
                        <Link to={`/map/${tracker.tracking_id}`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Map className="w-3 h-3" />
                            View Map
                          </Button>
                        </Link>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTracker(tracker.id, tracker.is_active)}
                          className="gap-1"
                          aria-label={tracker.is_active ? 'Pause tracker' : 'Activate tracker'}
                        >
                          {tracker.is_active ? (
                            <>
                              <ToggleRight className="w-3 h-3" />
                              Pause
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-3 h-3" />
                              Activate
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTrackerId(tracker.id)}
                          className="text-destructive hover:text-destructive gap-1"
                          aria-label={`Delete ${tracker.name}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Mobile actions - 2-column grid */}
                      <div className="grid grid-cols-2 gap-2 sm:hidden">
                        <Link to={`/map/${tracker.tracking_id}`} className="col-span-2">
                          <Button variant="outline" size="sm" className="gap-1.5 w-full h-11">
                            <Map className="w-4 h-4" />
                            View Map
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQrTracker(tracker)}
                          className="gap-1.5 h-11"
                          aria-label="QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                          QR Code
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(getTrackingUrl(tracker.tracking_id), 'Tracking link')}
                          className="gap-1.5 h-11"
                          aria-label="Copy link"
                        >
                          <Copy className="w-4 h-4" />
                          Copy Link
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTracker(tracker.id, tracker.is_active)}
                          className="gap-1.5 h-11"
                          aria-label={tracker.is_active ? 'Pause' : 'Activate'}
                        >
                          {tracker.is_active ? (
                            <>
                              <ToggleRight className="w-4 h-4" />
                              Pause
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-4 h-4" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTrackerId(tracker.id)}
                          className="text-destructive hover:text-destructive gap-1.5 h-11"
                          aria-label="Delete tracker"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </PullToRefreshContainer>

        {/* Mobile FAB for new tracker */}
        {isMobile && !loading && trackers.length > 0 && (
          <button
            onClick={handleCreateTracker}
            className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-elevated flex items-center justify-center active:scale-95 transition-transform touch-manipulation"
            aria-label="Create new tracker"
            style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </Layout>

      <AlertDialog open={!!deleteTrackerId} onOpenChange={() => setDeleteTrackerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tracker?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this tracker and all its location history.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <QRCodeDialog
        open={!!qrTracker}
        onOpenChange={(open) => !open && setQrTracker(null)}
        url={qrTracker ? getTrackingUrl(qrTracker.tracking_id) : ''}
        title={qrTracker?.name || 'Tracker'}
      />
    </>
  );
};

export default Dashboard;

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
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: `${label} copied to clipboard.` });
  };

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

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
          <main className="container mx-auto px-4 py-6 sm:py-8">
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
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                disabled={isRefreshing}
                className="hidden sm:flex shadow-card"
                title="Refresh trackers"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button onClick={createTracker} className="gap-2 shadow-card flex-1 sm:flex-none">
                <Plus className="w-4 h-4" />
                New Tracker
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <TrackerCardSkeleton key={i} />
              ))}
            </div>
          ) : trackers.length === 0 ? (
            <Card className="text-center py-12 shadow-card">
              <CardContent>
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No trackers yet</h3>
                <p className="text-muted-foreground mb-6">Create your first tracker to start monitoring locations.</p>
                <Button onClick={createTracker} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Tracker
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trackers.map((tracker) => (
                <Card key={tracker.id} className="shadow-card hover:shadow-elevated transition-shadow">
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
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-primary"
                              onClick={() => saveTrackerName(tracker.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground"
                              onClick={cancelEditing}
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
                            <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
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
                        <MapPin className="w-4 h-4" />
                        {tracker.location_count || 0} points
                      </div>
                      {tracker.last_update && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
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
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Mobile actions */}
                    <div className="flex sm:hidden gap-2">
                      <Link to={`/map/${tracker.tracking_id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="gap-1 w-full">
                          <Map className="w-3 h-3" />
                          View Map
                        </Button>
                      </Link>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="px-2">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-popover">
                          <DropdownMenuItem onClick={() => setQrTracker(tracker)}>
                            <QrCode className="w-4 h-4 mr-2" />
                            Show QR Code
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copyToClipboard(
                            getTrackingUrl(tracker.tracking_id),
                            'Tracking link'
                          )}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleTracker(tracker.id, tracker.is_active)}>
                            {tracker.is_active ? (
                              <>
                                <ToggleRight className="w-4 h-4 mr-2" />
                                Pause Tracker
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-4 h-4 mr-2" />
                                Activate Tracker
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setDeleteTrackerId(tracker.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Tracker
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
        </PullToRefreshContainer>
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

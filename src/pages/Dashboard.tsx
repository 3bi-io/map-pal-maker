import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Plus, Copy, Trash2, ToggleLeft, ToggleRight, Clock, Map, QrCode, Pencil, Check, X, MoreVertical, RefreshCw } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { PullToRefreshIndicator, PullToRefreshContainer } from '@/components/PullToRefresh';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import QRCodeDialog from '@/components/QRCodeDialog';
import { useIsMobile } from '@/hooks/use-mobile';
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

interface Tracker {
  id: string;
  tracking_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  location_count?: number;
  last_update?: string;
}

const Dashboard = () => {
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTrackerId, setDeleteTrackerId] = useState<string | null>(null);
  const [qrTracker, setQrTracker] = useState<Tracker | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTrackers();
    }
  }, [user]);

  const fetchTrackers = async () => {
    try {
      const { data: trackersData, error } = await supabase
        .from('trackers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch location counts for each tracker
      const trackersWithStats = await Promise.all(
        (trackersData || []).map(async (tracker) => {
          const { count, data: locations } = await supabase
            .from('location_updates')
            .select('created_at', { count: 'exact', head: false })
            .eq('tracking_id', tracker.tracking_id)
            .order('created_at', { ascending: false })
            .limit(1);

          return {
            ...tracker,
            location_count: count || 0,
            last_update: locations?.[0]?.created_at,
          };
        })
      );

      setTrackers(trackersWithStats);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching trackers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load trackers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTrackingId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const createTracker = async () => {
    if (!user) return;

    const trackingId = generateTrackingId();
    
    try {
      const { error } = await supabase
        .from('trackers')
        .insert({
          tracking_id: trackingId,
          owner_id: user.id,
          name: `Tracker ${trackingId.slice(0, 4)}`,
        });

      if (error) throw error;

      toast({
        title: 'Tracker created!',
        description: 'Your new tracker is ready to use.',
      });

      fetchTrackers();
    } catch (error) {
      console.error('Error creating tracker:', error);
      toast({
        title: 'Error',
        description: 'Failed to create tracker',
        variant: 'destructive',
      });
    }
  };

  const toggleTracker = async (trackerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('trackers')
        .update({ is_active: !currentStatus })
        .eq('id', trackerId);

      if (error) throw error;

      setTrackers(trackers.map(t => 
        t.id === trackerId ? { ...t, is_active: !currentStatus } : t
      ));

      toast({
        title: currentStatus ? 'Tracker paused' : 'Tracker activated',
        description: currentStatus ? 'Location updates will be ignored.' : 'Now accepting location updates.',
      });
    } catch (error) {
      console.error('Error toggling tracker:', error);
      toast({
        title: 'Error',
        description: 'Failed to update tracker',
        variant: 'destructive',
      });
    }
  };

  const deleteTracker = async () => {
    if (!deleteTrackerId) return;

    try {
      const { error } = await supabase
        .from('trackers')
        .delete()
        .eq('id', deleteTrackerId);

      if (error) throw error;

      setTrackers(trackers.filter(t => t.id !== deleteTrackerId));
      
      toast({
        title: 'Tracker deleted',
        description: 'The tracker and all its data have been removed.',
      });
    } catch (error) {
      console.error('Error deleting tracker:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete tracker',
        variant: 'destructive',
      });
    } finally {
      setDeleteTrackerId(null);
    }
  };

  const startEditing = (tracker: Tracker) => {
    setEditingId(tracker.id);
    setEditName(tracker.name);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveTrackerName = async (trackerId: string) => {
    const trimmedName = editName.trim();
    if (!trimmedName) {
      toast({
        title: 'Error',
        description: 'Tracker name cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('trackers')
        .update({ name: trimmedName })
        .eq('id', trackerId);

      if (error) throw error;

      setTrackers(trackers.map(t => 
        t.id === trackerId ? { ...t, name: trimmedName } : t
      ));

      toast({
        title: 'Renamed',
        description: 'Tracker name updated successfully.',
      });
    } catch (error) {
      console.error('Error renaming tracker:', error);
      toast({
        title: 'Error',
        description: 'Failed to rename tracker',
        variant: 'destructive',
      });
    } finally {
      setEditingId(null);
      setEditName('');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  const isMobile = useIsMobile();

  const handleRefresh = useCallback(async () => {
    await fetchTrackers();
  }, []);

  const {
    containerRef,
    pullDistance,
    isRefreshing,
    progress,
    shouldTrigger,
  } = usePullToRefresh({ onRefresh: handleRefresh });

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-primary mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

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
                onClick={handleRefresh}
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

          {trackers.length === 0 ? (
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
                              className="h-7 w-7 text-green-600"
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

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(
                          `${window.location.origin}/track/${tracker.tracking_id}`,
                          'Tracking link'
                        )}
                        className="gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy Link
                      </Button>
                      
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

                    {/* Mobile actions - Dropdown */}
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
                            `${window.location.origin}/track/${tracker.tracking_id}`,
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
            <AlertDialogAction onClick={deleteTracker} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <QRCodeDialog
        open={!!qrTracker}
        onOpenChange={(open) => !open && setQrTracker(null)}
        url={qrTracker ? `${window.location.origin}/track/${qrTracker.tracking_id}` : ''}
        title={qrTracker?.name || 'Tracker'}
      />
    </>
  );
};

export default Dashboard;

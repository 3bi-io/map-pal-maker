import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Plus, Copy, ExternalLink, Trash2, ToggleLeft, ToggleRight, Clock, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
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

interface Tracker {
  id: string;
  tracking_id: string;
  name: string;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  location_count?: number;
  last_update?: string;
}

const Dashboard = () => {
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTrackerId, setDeleteTrackerId] = useState<string | null>(null);
  
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

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Dashboard - TrackView"
        description="Manage your location trackers from your dashboard."
      />
      <div className="min-h-screen bg-gradient-background">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Trackers</h1>
              <p className="text-muted-foreground">Create and manage your location trackers</p>
            </div>
            <Button onClick={createTracker} className="gap-2 shadow-card">
              <Plus className="w-4 h-4" />
              New Tracker
            </Button>
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trackers.map((tracker) => (
                <Card key={tracker.id} className="shadow-card hover:shadow-elevated transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{tracker.name}</CardTitle>
                        <CardDescription className="font-mono text-xs">
                          {tracker.tracking_id}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        {isExpired(tracker.expires_at) ? (
                          <Badge variant="destructive">Expired</Badge>
                        ) : tracker.is_active ? (
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

                    <div className="flex flex-wrap gap-2">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

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
    </>
  );
};

export default Dashboard;

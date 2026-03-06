import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { generateTrackingId } from '@/lib/tracker-utils';
import { useToast } from '@/hooks/use-toast';

export interface Tracker {
  id: string;
  tracking_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  owner_id: string;
  password_hash: string | null;
  location_count: number;
  last_update: string | null;
}

const fetchTrackerStats = async (userId: string): Promise<Tracker[]> => {
  const { data, error } = await supabase.rpc('get_tracker_stats', {
    p_owner_id: userId,
  });

  if (error) throw error;
  return (data || []).map((t: any) => ({
    ...t,
    location_count: Number(t.location_count) || 0,
  }));
};

export function useTrackers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: trackers = [],
    isLoading: loading,
    dataUpdatedAt,
    refetch,
  } = useQuery({
    queryKey: ['trackers', user?.id],
    queryFn: () => fetchTrackerStats(user!.id),
    enabled: !!user,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  const lastRefresh = dataUpdatedAt ? new Date(dataUpdatedAt) : null;

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      const trackingId = generateTrackingId();
      const { error } = await supabase.from('trackers').insert({
        tracking_id: trackingId,
        owner_id: user.id,
        name: `Tracker ${trackingId.slice(0, 4)}`,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackers', user?.id] });
      toast({ title: 'Tracker created!', description: 'Your new tracker is ready to use.' });
      if (navigator.vibrate) navigator.vibrate(50);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create tracker', variant: 'destructive' });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ trackerId, currentStatus }: { trackerId: string; currentStatus: boolean }) => {
      const { error } = await supabase
        .from('trackers')
        .update({ is_active: !currentStatus })
        .eq('id', trackerId);
      if (error) throw error;
      return { trackerId, newStatus: !currentStatus };
    },
    onSuccess: ({ newStatus }) => {
      queryClient.invalidateQueries({ queryKey: ['trackers', user?.id] });
      toast({
        title: newStatus ? 'Tracker activated' : 'Tracker paused',
        description: newStatus ? 'Now accepting location updates.' : 'Location updates will be ignored.',
      });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update tracker', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (trackerId: string) => {
      const { error } = await supabase.from('trackers').delete().eq('id', trackerId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackers', user?.id] });
      toast({ title: 'Tracker deleted', description: 'The tracker and all its data have been removed.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete tracker', variant: 'destructive' });
    },
  });

  const renameMutation = useMutation({
    mutationFn: async ({ trackerId, name }: { trackerId: string; name: string }) => {
      const trimmed = name.trim();
      if (!trimmed) throw new Error('Name cannot be empty');
      const { error } = await supabase.from('trackers').update({ name: trimmed }).eq('id', trackerId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackers', user?.id] });
      toast({ title: 'Renamed', description: 'Tracker name updated successfully.' });
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to rename tracker',
        variant: 'destructive',
      });
    },
  });

  return {
    trackers,
    loading,
    lastRefresh,
    refetch,
    createTracker: () => createMutation.mutate(),
    toggleTracker: (trackerId: string, currentStatus: boolean) =>
      toggleMutation.mutate({ trackerId, currentStatus }),
    deleteTracker: (trackerId: string) => deleteMutation.mutate(trackerId),
    renameTracker: (trackerId: string, name: string) =>
      renameMutation.mutate({ trackerId, name }),
  };
}

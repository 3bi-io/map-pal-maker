-- 1. Fix get_tracker_stats: add ownership check so users can only query their own data
CREATE OR REPLACE FUNCTION public.get_tracker_stats(p_owner_id uuid)
RETURNS TABLE(id uuid, tracking_id text, name text, is_active boolean, created_at timestamp with time zone, updated_at timestamp with time zone, password_hash text, owner_id uuid, location_count bigint, last_update timestamp with time zone)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Enforce caller can only query their own data
  IF p_owner_id <> auth.uid() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    t.id,
    t.tracking_id,
    t.name,
    t.is_active,
    t.created_at,
    t.updated_at,
    t.password_hash,
    t.owner_id,
    COALESCE(stats.cnt, 0) AS location_count,
    stats.last_update
  FROM public.trackers t
  LEFT JOIN LATERAL (
    SELECT 
      COUNT(*) AS cnt,
      MAX(lu.created_at) AS last_update
    FROM public.location_updates lu
    WHERE lu.tracking_id = t.tracking_id
  ) stats ON true
  WHERE t.owner_id = p_owner_id
  ORDER BY t.created_at DESC;
END;
$$;

-- 2. Add DELETE policy on location_updates so only tracker owners can delete
CREATE POLICY "Owners can delete their tracker locations"
ON public.location_updates
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.trackers
    WHERE trackers.tracking_id = location_updates.tracking_id
    AND trackers.owner_id = auth.uid()
  )
);
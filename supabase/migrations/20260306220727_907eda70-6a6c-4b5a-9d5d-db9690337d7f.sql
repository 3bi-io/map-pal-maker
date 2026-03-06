
CREATE OR REPLACE FUNCTION public.get_tracker_stats(p_owner_id uuid)
RETURNS TABLE(
  id uuid,
  tracking_id text,
  name text,
  is_active boolean,
  created_at timestamptz,
  updated_at timestamptz,
  password_hash text,
  owner_id uuid,
  location_count bigint,
  last_update timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

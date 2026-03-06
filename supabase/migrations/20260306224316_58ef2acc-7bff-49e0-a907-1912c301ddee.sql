-- 1. Create a security definer function for anonymous tracker status checks
CREATE OR REPLACE FUNCTION public.check_tracker_status(p_tracking_id text)
RETURNS TABLE(name text, is_active boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT t.name, t.is_active
  FROM public.trackers t
  WHERE t.tracking_id = p_tracking_id
  LIMIT 1;
$$;

-- 2. Drop overly permissive policies on location_updates
DROP POLICY IF EXISTS "Anyone can insert location updates" ON public.location_updates;
DROP POLICY IF EXISTS "Anyone can read location updates" ON public.location_updates;

-- 3. Drop overly permissive policy on trackers
DROP POLICY IF EXISTS "Anyone can check tracker status" ON public.trackers;
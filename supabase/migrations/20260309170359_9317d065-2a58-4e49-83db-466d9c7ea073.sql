-- 1. Create a SECURITY DEFINER helper to validate tracking_id
CREATE OR REPLACE FUNCTION public.is_tracker_active(p_tracking_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.trackers
    WHERE tracking_id = p_tracking_id AND is_active = true
  );
$$;

-- 2. Drop the broken policy
DROP POLICY IF EXISTS "Insert location for active trackers" ON public.location_updates;

-- 3. Recreate with the helper function
CREATE POLICY "Insert location for active trackers"
ON public.location_updates
FOR INSERT
TO public
WITH CHECK (public.is_tracker_active(tracking_id));
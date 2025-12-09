-- Use CASCADE to drop column and dependent policies
ALTER TABLE public.trackers DROP COLUMN IF EXISTS expires_at CASCADE;

-- Recreate RLS policy: "Anyone can check tracker status" without expiration check
DROP POLICY IF EXISTS "Anyone can check tracker status" ON public.trackers;
CREATE POLICY "Anyone can check tracker status"
ON public.trackers
FOR SELECT
USING (is_active = true);

-- Recreate RLS policy on location_updates without expiration check
DROP POLICY IF EXISTS "Insert location for active trackers" ON public.location_updates;
CREATE POLICY "Insert location for active trackers"
ON public.location_updates
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1
  FROM trackers
  WHERE trackers.tracking_id = location_updates.tracking_id
    AND trackers.is_active = true
));
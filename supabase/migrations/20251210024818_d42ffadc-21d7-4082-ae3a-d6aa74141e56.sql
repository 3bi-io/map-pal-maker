-- Drop the restrictive policy
DROP POLICY IF EXISTS "Anyone can check tracker status" ON public.trackers;

-- Recreate as PERMISSIVE policy (explicitly set)
CREATE POLICY "Anyone can check tracker status"
ON public.trackers
AS PERMISSIVE
FOR SELECT
TO public
USING (is_active = true);


## Fix: 401 on Location Insert from Public Tracking Links

### Root Cause

The INSERT policy on `location_updates` contains a subquery that checks the `trackers` table:

```sql
EXISTS (SELECT 1 FROM trackers WHERE trackers.tracking_id = location_updates.tracking_id AND trackers.is_active = true)
```

But the `trackers` table has its own RLS policy that only allows SELECT for `auth.uid() = owner_id`. When an **unauthenticated** user (anon role) hits this INSERT, the subquery on `trackers` returns zero rows (because RLS blocks anon from reading `trackers`), so the WITH CHECK fails, and Supabase returns 401.

### Fix

Replace the inline subquery in the INSERT policy with a `SECURITY DEFINER` function that bypasses RLS on the `trackers` table — the same pattern already used for `check_tracker_status`.

**Migration SQL:**

```sql
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
```

No frontend code changes needed — `TrackView.tsx` already does the insert correctly. This is purely a database-level fix.


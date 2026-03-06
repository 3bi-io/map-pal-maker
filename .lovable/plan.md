

## Comprehensive Refactoring Plan for TrackView

### Overview
After a thorough code review, I identified several bugs, performance issues, UX gaps, and architectural improvements needed across all pages and features. This plan is organized by priority and addresses mobile-first design, code quality, and best-practice patterns.

---

### 1. Critical Bug Fixes

**1.1 Fix Duplicate `generateTrackingId` in Dashboard**
- `Dashboard.tsx` (line 126-133) has a local function generating 8 random chars, while `tracker-utils.ts` generates `XXXX-XXXXXX` format
- Replace local version with the imported utility for consistency

**1.2 Fix Navigation Links to Deleted `/create` Route**
- `Navigation.tsx` (line 124) links non-authenticated users to `/create` which now redirects to `/dashboard`
- `MobileNav.tsx` (line 24) links to `/create` for non-authenticated users
- Update both to link directly to `/dashboard` or `/auth` as appropriate

**1.3 Fix Stale Closure in Dashboard Refresh**
- `handleRefresh` uses `useCallback` with empty deps but references `fetchTrackers`
- Auto-refresh interval (line 76-84) has same issue - `fetchTrackers` reference may be stale
- Wrap `fetchTrackers` in `useCallback` and update dependency arrays

**1.4 Fix MapView Race Condition**
- Map initialization (line 107, empty deps `[]`) references `locations` state which may be empty at init
- When theme changes, `setStyle` wipes custom layers (route path) without re-adding them after style load
- Add `map.on('style.load')` handler to restore path and markers after theme switch

**1.5 Fix Fake Structured Data**
- `Home.tsx` has a fabricated `aggregateRating` (4.8 stars, 127 reviews) in schema.org data
- Remove this to avoid search engine penalties

---

### 2. Performance Optimizations

**2.1 Eliminate N+1 Query in Dashboard**
- Currently fetches all trackers, then fires a separate query per tracker for location counts
- Replace with a single RPC call or use a Supabase database function to return tracker stats in one query
- Create a `get_tracker_stats` database function

**2.2 Add Location Update Throttling in TrackView**
- `watchPosition` fires on every GPS change with no throttle
- Add a minimum interval (e.g., 5 seconds) between database inserts to prevent flooding
- Use a ref to track last save timestamp

**2.3 Memoize Expensive Functions**
- Wrap `fetchTrackers`, `createTracker`, `toggleTracker`, `deleteTracker`, `saveTrackerName` in `useCallback` with proper deps
- Memoize `saveLocationToDatabase` in TrackView

---

### 3. Mobile-First UX Improvements

**3.1 Fix InstallPrompt Overlap with MobileNav**
- The PWA install banner (fixed bottom-4) overlaps with the mobile bottom nav bar (fixed bottom-0, h-16)
- Add `mb-20` or bottom offset when mobile nav is visible

**3.2 Improve Mobile Dashboard Card Actions**
- Current mobile dropdown works but the "View Map" button + dropdown feel cramped
- Add swipe-to-reveal actions as an enhancement, or enlarge touch targets

**3.3 Add Haptic Feedback**
- Use `navigator.vibrate()` on pull-to-refresh trigger and tracker creation on supported devices

**3.4 Improve TrackView Mobile Experience**
- Add a visual pulsing animation when actively tracking
- Show a persistent notification-style bar at top when tracking is active
- Add battery/data usage awareness messaging

**3.5 MapView Mobile Optimization**
- On mobile, make info panel collapsible (bottom sheet style) instead of side panel
- The current layout stacks vertically but the info card takes significant space
- Use a draggable bottom sheet pattern for the map info panel

---

### 4. Authentication and Security

**4.1 Add Forgot Password Flow**
- Add "Forgot Password?" link to Auth page
- Create `/reset-password` page that handles the recovery token
- Implement `supabase.auth.resetPasswordForEmail()` and `supabase.auth.updateUser()`

**4.2 Add Protected Route Wrapper**
- Create a `ProtectedRoute` component instead of manual redirect logic in Dashboard
- Reduces code duplication for any future authenticated pages

---

### 5. Code Architecture Improvements

**5.1 Extract Dashboard Logic into Custom Hook**
- Create `useTrackers` hook containing all tracker CRUD operations
- Moves state management out of the 586-line Dashboard component
- Makes operations reusable across pages

**5.2 Consistent Toast Usage**
- Dashboard uses `@/hooks/use-toast` (Radix toast)
- TrackView uses `sonner` (Sonner toast)
- Standardize on one toast system across the app

**5.3 Add React Query for Data Fetching**
- Replace manual `useState`/`useEffect` fetching with React Query (already installed)
- Provides automatic caching, background refetching, and stale-while-revalidate
- Eliminates need for manual auto-refresh interval

---

### 6. Database Changes

**6.1 Create `get_tracker_stats` Function**
```text
Returns trackers with location_count and last_update in a single query
instead of N+1 queries from the client.
```

---

### 7. Files Changed Summary

**Create:**
- `src/hooks/useTrackers.ts` - extracted tracker CRUD hook
- `src/components/ProtectedRoute.tsx` - auth guard wrapper
- `src/pages/ResetPassword.tsx` - password reset page
- Database migration for `get_tracker_stats` function

**Modify:**
- `src/pages/Dashboard.tsx` - use `useTrackers` hook, React Query, fix bugs
- `src/pages/MapView.tsx` - fix race condition, theme style.load handler, mobile bottom sheet
- `src/pages/TrackView.tsx` - add throttling, standardize toasts, tracking UX
- `src/pages/Home.tsx` - remove fake rating data
- `src/pages/Auth.tsx` - add forgot password link
- `src/components/Navigation.tsx` - fix dead `/create` link
- `src/components/MobileNav.tsx` - fix dead `/create` link, update nav items
- `src/components/InstallPrompt.tsx` - fix overlap with mobile nav
- `src/App.tsx` - add `/reset-password` route, use `ProtectedRoute`

---

### 8. Implementation Order

1. Bug fixes (navigation links, stale closures, fake data)
2. Database function for tracker stats
3. Extract `useTrackers` hook + React Query integration
4. MapView fixes (race condition, theme, mobile layout)
5. TrackView throttling and UX
6. Auth improvements (forgot password, protected routes)
7. Mobile UX polish (install prompt, haptics, bottom sheet)


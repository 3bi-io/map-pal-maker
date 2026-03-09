

## Rename App to MᴀᴘMᴇ.Lɪᴠᴇ & Update URL to https://mapme.live

### Scope

Replace all instances of "TrackView" (display name) with "MᴀᴘMᴇ.Lɪᴠᴇ" and all URL references from `trackview.lovable.app` / `geofollower.lovable.app` to `mapme.live` across the entire codebase.

**Note:** The component/file name `TrackView` in `src/pages/TrackView.tsx` and its import in `App.tsx` will remain unchanged — it's a code identifier for the tracking page, not a brand name.

### Files to Update

| File | Changes |
|------|---------|
| `index.html` | All meta tags: title, og:title, twitter:title, og:site_name, apple-mobile-web-app-title, canonical URL, og:url, twitter:url, structured data (Organization, WebSite, WebApplication names + URLs), author |
| `src/components/SEO.tsx` | Default prop values: title, canonical, ogImage URL, siteUrl constant, og:site_name |
| `src/pages/Home.tsx` | SEO title, canonical, structured data (all "TrackView" names + URLs) |
| `src/pages/Dashboard.tsx` | SEO title string |
| `src/pages/Auth.tsx` | SEO title, aria-label on logo link |
| `src/pages/MapView.tsx` | SEO title, canonical URL |
| `src/pages/TrackView.tsx` | SEO title strings (3 occurrences), canonical URL |
| `src/pages/ResetPassword.tsx` | SEO title + description strings (3 occurrences) |
| `src/pages/NotFound.tsx` | SEO title, description, canonical URL |
| `src/components/Navigation.tsx` | Logo text "TrackView" → "MᴀᴘMᴇ.Lɪᴠᴇ", subtitle, aria-label |
| `src/components/Layout.tsx` | Footer copyright text |
| `src/components/InstallPrompt.tsx` | "Install TrackView" heading text |
| `vite.config.ts` | PWA manifest name + short_name |
| `public/sitemap.xml` | All `<loc>` URLs to `https://mapme.live/...`, update lastmod dates |
| `public/robots.txt` | Sitemap URL to `https://mapme.live/sitemap.xml` |

### Details

- **Brand name**: `MᴀᴘMᴇ.Lɪᴠᴇ` (using Unicode small caps as provided)
- **Domain**: `https://mapme.live` everywhere URLs appear
- **Copyright**: `© 2024 MᴀᴘMᴇ.Lɪᴠᴇ`
- **PWA manifest**: name = "MapMe.Live", short_name = "MapMe"
- **Navigation subtitle**: keep "REAL-TIME TRACKING" or change to "LIVE TRACKING"
- No code logic changes — purely string/URL replacements


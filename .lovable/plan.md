

## Best-in-Class SEO Implementation Plan

Your SEO plan is comprehensive, but much of it (off-page link building, Google Search Console setup, content marketing cadence) happens outside the codebase. Here's what we can **actually implement in code** — the technical SEO, on-page optimization, and AI/AEO enhancements that will have the highest impact.

---

### What's Already Done (No Changes Needed)
- `react-helmet-async` with per-page SEO component
- Open Graph + Twitter Card meta tags
- Structured data (Organization, WebSite, WebApplication)
- `robots.txt` with sitemap reference
- `sitemap.xml` with core pages
- Preconnect/dns-prefetch for Mapbox
- PWA manifest with icons
- Mobile-responsive design
- HTTPS (handled by hosting)

---

### Phase 1: Technical SEO Fixes

**1. Fix duplicate/conflicting meta tags**
`index.html` and `SEO.tsx` both inject the same meta tags (title, description, OG, Twitter), causing duplicates in the DOM. Fix: strip SEO-related meta from `index.html`, keep only the bare minimum (charset, viewport, favicon). Let `react-helmet-async` handle all SEO tags dynamically per page.

**2. Fix inconsistent theme-color**
`index.html` uses `#0ea5e9`, `SEO.tsx` uses `#6366f1`. Standardize to `#0ea5e9` (matches the primary brand color in CSS).

**3. Add missing `robots` meta tag to SEO component**
Add `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />` to `SEO.tsx` defaults (currently only in `index.html`).

**4. Add per-page SEO to Dashboard and MapView**
`Dashboard.tsx` and `MapView.tsx` use `<SEO>` but with defaults. Add specific titles, descriptions, and canonical URLs for each.

---

### Phase 2: Structured Data Enhancements (AEO/GEO)

**5. Add FAQ schema to Home page**
Add a `FAQPage` structured data block with 4-5 common questions (e.g., "How does MapMe.Live work?", "Is it free?", "Is my location data secure?"). This directly targets AI answer engines and Google's "People Also Ask."

**6. Add HowTo schema to Home page**
Add a `HowTo` structured data block for "How to track a device location" — step-by-step (Create account → Generate link → Share → Monitor). Targets featured snippets and voice search.

**7. Add Speakable schema**
Add `speakable` property to the WebApplication schema pointing to the hero section text — helps voice assistants cite your content.

**8. Add BreadcrumbList to all pages**
Currently only on Home. Add breadcrumbs to Auth (`Home > Sign In`), Dashboard (`Home > Dashboard`), and NotFound pages.

---

### Phase 3: On-Page Content & Accessibility

**9. Add semantic HTML landmarks to Home page**
Wrap the hero in `<header>`, features in `<section>` with `aria-labelledby`, CTA in `<aside>`. Add `id` attributes to headings for anchor linking and table-of-contents potential.

**10. Add visible FAQ section to Home page**
Render the FAQ content visually (not just in schema) using an accordion component. This serves both users and AI crawlers — real content that matches the structured data.

**11. Add a "How It Works" section to Home page**
3-step visual guide matching the HowTo schema. Improves dwell time and provides extractable content for AI engines.

**12. Improve footer with semantic links**
Add links to key pages, a brief site description, and social proof text. Footers are crawled for site authority signals.

---

### Phase 4: Performance & Core Web Vitals

**13. Add `loading="lazy"` to non-critical images**
Logo icon in auth/reset pages should lazy-load. Feature card icons are already SVG (fine).

**14. Add `fetchpriority="high"` to LCP image**
The navbar logo is above the fold — mark it for priority loading.

**15. Add `<link rel="preload">` for critical assets**
Preload the logo icon font and primary CSS in `index.html` to improve LCP.

---

### Summary of File Changes

| File | Changes |
|------|---------|
| `index.html` | Strip duplicate SEO meta tags, keep only charset/viewport/favicon/preloads |
| `src/components/SEO.tsx` | Add `robots` meta, fix `theme-color`, add `apple-mobile-web-app-title` |
| `src/pages/Home.tsx` | Add FAQ accordion section, "How It Works" section, enhanced structured data (FAQ, HowTo, Speakable), semantic landmarks |
| `src/pages/Dashboard.tsx` | Add specific SEO title/description/canonical |
| `src/pages/MapView.tsx` | Add specific SEO title/description |
| `src/pages/Auth.tsx` | Add BreadcrumbList structured data |
| `src/pages/NotFound.tsx` | Add BreadcrumbList structured data |
| `src/components/Layout.tsx` | Enhance footer with site description, nav links, copyright |
| `src/components/Logo.tsx` | Add `fetchpriority="high"` to navbar context |

This covers all the code-implementable items from your plan. Off-page work (backlinks, Google Business Profile, Search Console setup, content cadence) should be done outside Lovable.


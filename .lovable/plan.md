

## Footer Link Audit

Here's the current state of every footer link:

| Link | Route | Status |
|------|-------|--------|
| Dashboard | `/dashboard` | Exists (protected) |
| Map View | `/map` | **Broken** — route is `/map/:id`, bare `/map` hits 404 |
| Pricing | `/#` | **Missing page** |
| About | `/#` | **Missing page** |
| Blog | `/#` | **Missing page** |
| Contact | `/#` | **Missing page** |
| Documentation | `/#` | **Missing page** |
| API Reference | `/#` | **Missing page** |
| Status | `/#` | **Missing page** |
| Privacy Policy | `/privacy` | Exists |
| Terms of Service | `/terms` | Exists |
| Cookie Policy | `/privacy` | Points to Privacy — **needs own section or page** |

**9 links are dead or placeholder.** Here's the recommended plan:

---

## Plan: Build Missing Pages

### 1. Pricing Page (`/pricing`)
Single-page with 3-tier pricing cards (Free / Pro / Enterprise). Free tier highlighted as current offering. Feature comparison table. CTA buttons linking to `/auth`. FAQ accordion at bottom.

### 2. About Page (`/about`)
Company mission/vision section, team placeholder (founder bio area), product timeline, and a "Why we built this" narrative block. Reuse Layout with footer.

### 3. Blog Page (`/blog`)
Static placeholder page with 3-4 hardcoded sample blog post cards (thumbnail, title, excerpt, date). Each card links to a detail stub. Since there's no CMS, these are illustrative — a "Coming Soon" badge or static content is appropriate.

### 4. Contact Page (`/contact`)
Contact form (name, email, subject, message) using react-hook-form + zod validation. Toast on submit. Side panel with email address, response time, and social links. No backend needed — just client-side toast confirmation.

### 5. Documentation Page (`/docs`)
Sidebar-navigated docs layout with sections: Getting Started, Creating a Tracker, Sharing Links, Map Dashboard, Privacy & Security. All static markdown-style content rendered as styled HTML.

### 6. API Reference Page (`/api`)
Static page showcasing the API surface (even if illustrative): endpoint tables, code snippet blocks for REST calls, authentication section. Styled with code blocks and tables.

### 7. Status Page (`/status`)
Simple page showing system status with green/yellow/red indicators for: API, Dashboard, Tracking Service, Map Service. All hardcoded as "Operational" with uptime percentages. Clean and minimal.

### 8. Cookie Policy
Either a dedicated `/cookies` page or anchor-link to a "Cookies" section within the existing Privacy Policy page. Recommend a separate lightweight page for best practice.

### 9. Fix "Map View" Footer Link
Change `/map` to either remove it (it requires a tracker ID) or redirect to `/dashboard` with a toast explaining "Select a tracker to view its map."

---

## Implementation Approach

- **Shared pattern**: Each page uses `<Layout showFooter>` + `<SEO>` with breadcrumb structured data, matching the existing Privacy/Terms pattern.
- **7 new page files** in `src/pages/`: `Pricing.tsx`, `About.tsx`, `Blog.tsx`, `Contact.tsx`, `Docs.tsx`, `ApiReference.tsx`, `Status.tsx`, `CookiePolicy.tsx`
- **Update `App.tsx`** with 8 new routes
- **Update `Footer.tsx`** links to point to real routes
- **Update `Navigation.tsx`** mobile menu to optionally include key links
- All pages are static/client-side only — no backend changes needed
- Consistent styling: `container mx-auto px-4 py-16 max-w-4xl` with scroll animations

### Priority Order
High: Pricing, About, Contact, Cookie Policy (user-facing trust pages)
Medium: Docs, Status (credibility pages)
Low: Blog, API Reference (content marketing — fine as "coming soon")

This is roughly 8 implementation steps. I'd recommend tackling them in 2-3 batches to keep changes manageable.


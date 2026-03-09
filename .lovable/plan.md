

## Hero Background Image — Findings & Plan

### Current State
The hero section uses **only CSS radial gradients** for its background (lines 87-93 of `HeroSection.tsx`). The file `public/images/hero-bg.jpg` exists but is **never referenced** anywhere in the codebase — it's dead weight.

The uploaded screenshot confirms what users currently see: a dark gradient background with no image. This is consistent across all devices since it's pure CSS.

### Two Options

**Option A — Remove the unused image (recommended if CSS-only is intentional)**
Delete `public/images/hero-bg.jpg` to reduce bundle size. The current CSS gradient approach works reliably across all devices and themes with zero loading overhead.

**Option B — Wire up the background image**
Add `hero-bg.jpg` as a background behind the gradient overlay. This would require:
1. Add the image as a background on the hero `<header>` element with `bg-cover bg-center`
2. Layer the existing gradient overlays on top for text readability
3. Add a fallback background color for slow connections
4. Ensure the image works across light/dark/OLED themes (may need per-theme opacity tuning)

### Recommendation
The current CSS-only approach is **already visible and consistent** across all devices and themes — no image loading delays, no broken images, no CORS issues. Unless there's a specific photo you want in the hero, **Option A** (delete the unused file) is the cleanest path.

### Files changed
- **Option A**: Delete `public/images/hero-bg.jpg`
- **Option B**: Edit `src/components/landing/HeroSection.tsx` to add background image with overlay


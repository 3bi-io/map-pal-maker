

## Remove Image Fallback, Video on All Devices

### Current State
- Video element has `hidden sm:block` — no video on mobile
- HeroSection has separate static image + overlay divs for mobile (lines 59-66)
- Reduced-motion fallback renders poster as static image

### What Changes

**`src/components/VideoBackground.tsx`**
- Remove `hidden sm:block` from the video element so it plays on all screen sizes
- Keep `poster` prop but only as a loading placeholder (shows while HLS initializes), not as a permanent fallback
- Reduced-motion path: render a solid overlay only (no image), since we're removing image backgrounds entirely

**`src/components/landing/HeroSection.tsx`**
- Delete the mobile static image fallback div (lines 59-64) and its overlay (lines 65-66)
- Remove the `poster` prop reference to `/images/hero-bg.jpg` — the poster can stay as a brief loading frame or be removed entirely
- Everything else stays the same

### Advisory

**Trade-off to be aware of**: HLS video on mobile uses more data and battery than a static image. The previous mobile fallback was intentional for performance. By removing it, all mobile users will stream video. The HLS adaptive bitrate will select lower quality on slower connections, but it's still heavier than an image. If this is acceptable, proceed.

| File | Change |
|------|--------|
| `src/components/VideoBackground.tsx` | Remove `hidden sm:block`, simplify reduced-motion to overlay-only |
| `src/components/landing/HeroSection.tsx` | Remove mobile image fallback divs |


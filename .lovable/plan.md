

## Best Practices Refactor: VideoBackground & HeroSection

### Issues Found

1. **No `prefers-reduced-motion` support** — Users with motion sensitivity preferences get autoplay video with no opt-out. This is a WCAG requirement.
2. **No `IntersectionObserver`** — Video loads and plays even when off-screen, wasting bandwidth and CPU.
3. **Safari event listener leak** — The `loadedmetadata` listener is never cleaned up in the Safari fallback path.
4. **Missing accessibility attributes** — Video element lacks `aria-hidden="true"` (it's decorative) and `role="presentation"`.
5. **Mobile fallback overlay missing** — The static image fallback div on mobile has no overlay for text readability; the `VideoBackground` overlay only covers the video (which is `hidden` on mobile).
6. **Content not explicitly z-indexed** — The hero content container relies on DOM order rather than explicit `relative z-10`, which could break with layout changes.
7. **No `poster` frame** — Desktop users see a blank/black flash before the HLS stream loads.

### Plan

**File: `src/components/VideoBackground.tsx`**
- Add `IntersectionObserver`: only initialize HLS / start playback when the video enters the viewport; pause + destroy HLS when it leaves.
- Respect `prefers-reduced-motion: reduce` — if the user prefers reduced motion, skip video entirely (render nothing, let the fallback image show).
- Clean up Safari `loadedmetadata` listener on unmount.
- Add `aria-hidden="true"` to the `<video>` element since it's purely decorative.
- Accept an optional `poster` prop for a static frame before stream loads.

**File: `src/components/landing/HeroSection.tsx`**
- Move the overlay out of `VideoBackground` responsibility for mobile: ensure the overlay div covers both the video AND the static fallback (it should be a sibling that's always rendered, not inside VideoBackground).
- Add `relative z-10` to the content container for explicit stacking.
- Add `poster` prop pointing to `/images/hero-bg.jpg` so desktop users see a frame immediately.

### Summary of Changes

| File | Changes |
|------|---------|
| `src/components/VideoBackground.tsx` | IntersectionObserver, reduced-motion check, Safari cleanup, aria-hidden, poster prop |
| `src/components/landing/HeroSection.tsx` | Explicit z-index on content, unified overlay covering both video and static fallback |


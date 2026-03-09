

## Using HLS Video Backgrounds in MapMe.Live

You want to extract the video background technique from the spec and apply it to your existing pages. Here's how to approach this.

### What to Build

A reusable `VideoBackground` component that uses `hls.js` to stream an HLS video as a full-section background. You can then drop it into any page section (e.g., the Hero on the landing page, or any other section).

### Implementation Plan

**1. Install `hls.js`**

Add the `hls.js` package for HLS video streaming support.

**2. Create `src/components/VideoBackground.tsx`**

A reusable component that:
- Accepts a `src` (HLS `.m3u8` URL) and optional `className`
- Uses `hls.js` to load and attach the stream to a `<video>` element
- Falls back to native HLS for Safari
- Renders an absolutely-positioned, full-coverage `<video>` with `autoPlay`, `loop`, `muted`, `playsInline`, `object-cover`
- Includes a semi-transparent overlay div on top of the video for text readability (using your existing theme variables like `bg-background/50`)

**3. Drop into HeroSection (or any section)**

Replace the current static `hero-bg.jpg` background in `HeroSection.tsx` with the `VideoBackground` component. The existing content structure stays the same — it already uses `relative z-10` positioning that will layer correctly over the video.

### Example Usage

```tsx
<section className="relative overflow-hidden">
  <VideoBackground src="https://stream.mux.com/YOUR_VIDEO.m3u8" />
  <div className="relative z-10">
    {/* existing content */}
  </div>
</section>
```

### Considerations

- **Performance**: HLS streams are adaptive bitrate, so they handle varying bandwidth well. The video is muted and autoplays without user interaction (browser-compliant).
- **Mobile**: Consider hiding or replacing the video with a static image on mobile (`hidden sm:block` on the video, keep the existing `hero-bg.jpg` as fallback) since autoplay video can be heavy on mobile data.
- **Overlay opacity**: You can tune the overlay darkness per-section. Your current hero already has `bg-background/50` which works well.
- **Multiple videos**: Each section can use a different `.m3u8` URL. Only visible sections should load — you could add an IntersectionObserver to start/stop playback when sections enter/leave the viewport.

### Files Changed

| File | Change |
|------|--------|
| `package.json` | Add `hls.js` |
| `src/components/VideoBackground.tsx` | New reusable component |
| `src/components/landing/HeroSection.tsx` | Replace static bg image with `VideoBackground` |


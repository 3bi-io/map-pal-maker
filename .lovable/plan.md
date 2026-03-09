

## Add Video Backgrounds to Features, How It Works & CTA Sections

### Advisory

You currently have one Mux HLS stream (`JNJEOYI6B3EffB9f5ZhpGbuxzc6gSyJcXaCBbCgZKRg`). Using the same stream on all four sections simultaneously will work — the `IntersectionObserver` in `VideoBackground` ensures only visible sections load/play. However, to use *different* streams you'll need to upload additional videos to Mux and get their playback IDs.

For now, I'll wire all three sections with the same stream URL. You can swap each `src` independently later.

### Changes

**`src/components/landing/FeaturesSection.tsx`**
- Add `relative overflow-hidden` to the `<section>` wrapper
- Insert `<VideoBackground>` as the first child with a heavier overlay (`bg-background/70`) so feature cards remain readable
- Add `relative z-10` to the content container

**`src/components/landing/HowItWorksSection.tsx`**
- Add `relative overflow-hidden` to the `<section>` wrapper
- Insert `<VideoBackground>` with overlay
- Add `relative z-10` to content container
- Step circles already have `bg-background` so they'll stay opaque

**`src/components/landing/CTASection.tsx`**
- Replace the CSS radial-gradient glow div with `<VideoBackground>`
- Add `relative z-10` to content container
- Use a slightly lighter overlay to keep the CTA visually distinct

All three use the existing `VideoBackground` component with `IntersectionObserver` — no new dependencies, no performance concern from multiple instances.

| File | Change |
|------|--------|
| `FeaturesSection.tsx` | Add VideoBackground + positioning |
| `HowItWorksSection.tsx` | Add VideoBackground + positioning |
| `CTASection.tsx` | Replace glow div with VideoBackground |


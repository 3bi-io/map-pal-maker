

## Refactor Mobile Hero — Best-in-Class

Looking at the screenshot and current code, the mobile hero needs these upgrades to feel premium and native-app-quality:

### Changes to `src/components/landing/HeroSection.tsx`

1. **Full-viewport hero on mobile** — Use `min-h-[calc(100dvh-4rem)]` (minus nav height) with flex centering so the hero fills the entire screen on first load, creating an immersive feel.

2. **Staggered entrance animations** — Add CSS keyframe-driven fade-up animations to the badge, heading, description, buttons, and trust line with incremental delays (100ms apart) for a polished reveal sequence.

3. **Better mobile typography** — Bump heading from `text-3xl` to `text-4xl` on mobile for more visual impact. Increase description line height for readability.

4. **Full-width CTA buttons** — Make both buttons `w-full` on mobile (already partially done but the Link wrapper constrains width). Wrap the Link in a `w-full` container on mobile.

5. **Scroll indicator** — Add a subtle animated chevron/arrow at the bottom of the hero on mobile to signal scrollable content below.

6. **Trust line polish** — Style the trust line items as individual pills/badges instead of a single text block for a more premium look.

### Changes to `src/index.css`

- Add `@keyframes fadeInUp` animation for the staggered entrance effect.

### Files

| File | Change |
|------|--------|
| `src/components/landing/HeroSection.tsx` | Full-viewport mobile, staggered animations, scroll indicator, trust pills, full-width CTAs |
| `src/index.css` | Add `fadeInUp` keyframe |


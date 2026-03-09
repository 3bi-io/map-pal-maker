

## Logo Quality Issues and Fix Plan

### Problems Identified

After reviewing both logo assets:

1. **Excessive whitespace**: Both `logo-light.png` and `logo-dark.png` have large transparent padding around the actual artwork. When rendered at `h-9` (36px) in the navbar, most of that height is wasted on empty space, making the visible logo tiny.

2. **Dark mode logo text is nearly invisible**: The `logo-dark.png` variant uses thin outlined/stroked text with no fill. On dark or OLED backgrounds, these outlines are extremely hard to read. The icon portion looks fine, but the "MapMe.Live" text is essentially invisible.

3. **Missing `object-contain` and `w-auto`**: The `<img>` tag only sets height via className but doesn't ensure the aspect ratio is preserved cleanly or that width adapts.

### Plan

**1. Crop both logo assets**

Use a canvas-based approach (or manual re-export) to trim transparent pixels from all four sides of both PNGs. This ensures the `h-9`/`h-10` constraint in the navbar maps to the actual visible content, not empty space.

- Overwrite `src/assets/logo-light.png` with a tightly cropped version
- Overwrite `src/assets/logo-dark.png` with a tightly cropped version

Since Lovable cannot run image processing scripts, the approach will be to create a small in-browser utility using an offscreen `<canvas>` to auto-detect the bounding box of non-transparent pixels and re-export cropped PNGs. The cropped images will then replace the originals.

**2. Fix the dark mode logo**

The dark variant's outlined text is fundamentally a design issue — the source asset has hollow letterforms. Two options:

- **Option A (recommended)**: Use the same `logo-light.png` icon portion but render the "MapMe.Live" text in white using CSS. This means splitting the logo into icon + text, where the icon image is shared and text color adapts via Tailwind classes.
- **Option B**: Keep both images but add a CSS `brightness` / `invert` filter to make the dark logo text more visible — though this risks distorting the icon colors.

**Recommended approach (Option A):**
- Extract just the map pin icon from the logo (crop text portion out) and save as `src/assets/logo-icon.png`
- Update `Logo.tsx` to render: `<img>` (icon) + `<span>` ("MapMe.Live") where the span uses `text-foreground` so it automatically adapts to light/dark/OLED
- This eliminates the need for two separate full logo images entirely

**3. Update `Logo.tsx` for best practices**

```tsx
// Add object-contain and w-auto for proper scaling
<img
  src={iconSrc}
  alt=""  // decorative, text is separate
  className={cn("object-contain w-auto", sizeClass)}
  draggable={false}
/>
<span className="font-bold text-foreground tracking-tight">
  MapMe.Live
</span>
```

- `object-contain` prevents stretching
- `w-auto` lets width flow naturally from height
- Decorative `alt=""` on the icon since the text is rendered as a real DOM element (better for accessibility and SEO)
- Text color inherits from theme automatically — no need for two image variants

**4. Sizing by context**

| Context | Icon height | Text size |
|---------|-------------|-----------|
| Navbar | `h-8 sm:h-9` | `text-lg sm:text-xl` |
| Auth page | `h-14` | `text-3xl` |
| Mobile nav (if used) | `h-7` | `text-base` |

### Summary

The core fix is: stop relying on two full-logo PNGs (one of which has invisible text). Instead, use a single cropped icon image + CSS text that automatically adapts color per theme. This is the industry best practice — real text scales better, is accessible, searchable, and theme-aware without needing multiple image assets.


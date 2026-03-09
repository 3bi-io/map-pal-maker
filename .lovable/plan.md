

## Use Uploaded Logo Images for App Branding

### Analysis

The user provided two logo variants:
- **`2B86B49B...png`** — Dark text version (for light mode)
- **`IMG_5184.png`** — Light/outlined text version (for dark mode)

Currently, the app uses a Lucide `MapPin` icon inside a gradient circle as the logo in multiple places. We'll replace these with the actual logo images, switching between variants based on theme.

### Plan

**1. Copy logo assets to `src/assets/`**

- `user-uploads://2B86B49B-50EE-44E2-8009-4A6437CA846B.png` → `src/assets/logo-light.png` (dark text, used on light backgrounds)
- `user-uploads://IMG_5184.png` → `src/assets/logo-dark.png` (light text, used on dark backgrounds)

**2. Create a reusable `Logo` component** (`src/components/Logo.tsx`)

- Imports both logo images
- Uses `useTheme()` to pick the correct variant (`light` theme → `logo-light.png`, `dark`/`oled` → `logo-dark.png`)
- Accepts `className` prop for sizing flexibility
- Renders an `<img>` with proper alt text

**3. Update logo usage across the app**

Replace the current MapPin-in-gradient-circle pattern with the `<Logo>` component in these locations:

| File | Location | Current | New |
|------|----------|---------|-----|
| `Navigation.tsx` | Navbar logo (line 74-76) | MapPin in gradient circle + text | `<Logo>` image only (logo already contains text) |
| `Auth.tsx` | Login page header (line 162-164) | MapPin in gradient circle | `<Logo>` centered |
| `ResetPassword.tsx` | Two occurrences (lines 85-87, 133-135) | MapPin in gradient circle | `<Logo>` centered |

**Not changed** (these are contextual icons, not brand logos):
- `Home.tsx` feature cards — decorative icons
- `MapInfoPanel.tsx` — map marker indicator
- `InstallPrompt.tsx` — app install icon
- `ProtectedRoute.tsx` — loading spinner
- `TrackView.tsx` — status indicator

**4. Sizing considerations**

- Navbar: logo image ~36-40px height, no separate text needed (logo contains "MapMe.Live" text)
- Auth/Reset pages: logo image ~80px height, centered above the form
- The subtitle "LIVE TRACKING" below the nav logo will be removed since the logo image is self-contained


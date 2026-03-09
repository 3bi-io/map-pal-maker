

## Replace Logo Icon with New Image

The user uploaded a new map pin icon (blue/cyan gradient with orbital ring and sparkle) to replace the current `logo-icon.png`.

### Plan

1. **Copy the uploaded image** to `src/assets/logo-icon.png`, replacing the existing icon
2. **No code changes needed** — `Logo.tsx` already imports from `@/assets/logo-icon.png` and renders it with CSS text, so the new image will automatically appear in all contexts (navbar, auth, reset password) across all themes


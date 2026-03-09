

## Add Google Sign-In to Auth Page

### Changes

**`src/pages/Auth.tsx`**
- Add a "Sign in with Google" button below the form submit button (or above, separated by an "or" divider)
- The button calls `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/dashboard' } })`
- Add a visual divider ("or continue with") between the OAuth button and the email/password form
- Use a Google icon (SVG inline) for the button

### Layout
```text
┌─────────────────────────┐
│  [Logo]                 │
│  Welcome Back           │
│                         │
│  [Sign in with Google]  │
│                         │
│  ── or continue with ── │
│                         │
│  Email: [___________]   │
│  Password: [________]   │
│  [Sign In]              │
│                         │
│  Don't have an account? │
└─────────────────────────┘
```

The Google button appears in all states (login, signup) but not in forgot-password mode. No backend changes needed since Google auth is already configured in Supabase.




# Custom Auth Email Templates for MᴀᴘMᴇ.Lɪᴠᴇ

## Context

You have RESEND_API_KEY already in Supabase secrets. The project uses Supabase Auth with email/password sign-in and password reset. The app brand uses a blue primary color (`hsl(205, 95%, 52%)`) with white foreground and has logo assets available.

## Approach

Since this project is connected to an external Supabase project (not Lovable Cloud), I will use the **Lovable managed auth email template system** via `scaffold_auth_email_templates`. This scaffolds all 6 auth email types using React Email components and deploys them as an edge function.

## What Gets Created

Six email templates, all branded to match MᴀᴘMᴇ.Lɪᴠᴇ:

| Template | Purpose |
|---|---|
| **signup** | Email verification after account creation |
| **recovery** | Password reset link |
| **magic-link** | Passwordless login |
| **invite** | User invitation |
| **email-change** | Confirm email address change |
| **reauthentication** | OTP code for sensitive actions |

## Brand Styling Applied

- **Button color**: `hsl(205, 95%, 52%)` (primary blue) with white text
- **Border radius**: `0.75rem`
- **Heading color**: `hsl(222, 47%, 11%)` (foreground)
- **Body text**: `hsl(215, 16%, 47%)` (muted-foreground)
- **Logo**: Upload `logo-icon.png` to a storage bucket and include at the top of each template
- **Tone**: Match the app's direct, clean language ("Welcome to MᴀᴘMᴇ.Lɪᴠᴇ", "Get Started", etc.)
- **Email body background**: White (`#ffffff`) per best practice

## Prerequisites

A custom sender domain is required for custom auth emails to work. If no email domain is configured yet, the scaffold tool will indicate this and we will set one up via the email setup dialog.

## Steps

1. **Scaffold** all 6 auth email templates via `scaffold_auth_email_templates`
2. **Create storage bucket** `email-assets` and upload `logo-icon.png`
3. **Brand each template** with MᴀᴘMᴇ.Lɪᴠᴇ colors, logo, and copy
4. **Deploy** the `auth-email-hook` edge function
5. **Verify** activation status and provide email settings link

## Important Note

Before proceeding, you need a **custom sender domain** configured (e.g., `notify@yourdomain.com`). If you do not have one set up yet, we will start with the email domain setup dialog. Do you already have a sender domain configured, or should we set one up first?


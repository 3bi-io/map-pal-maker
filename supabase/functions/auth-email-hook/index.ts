import { render } from "npm:@react-email/components@0.0.22";

import SignupEmail from "../_shared/email-templates/signup.tsx";
import RecoveryEmail from "../_shared/email-templates/recovery.tsx";
import MagicLinkEmail from "../_shared/email-templates/magic-link.tsx";
import InviteEmail from "../_shared/email-templates/invite.tsx";
import EmailChangeEmail from "../_shared/email-templates/email-change.tsx";
import ReauthenticationEmail from "../_shared/email-templates/reauthentication.tsx";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://yglllvordvxufsfdatqq.supabase.co";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

    const payload = await req.json();

    // Support both Supabase Auth hook format AND direct test format
    let emailType: string;
    let recipient: string;
    let siteUrl: string;
    let confirmationUrl: string;
    let token: string | undefined;
    let newEmail: string | undefined;

    if (payload.user && payload.email_data) {
      // --- Supabase Auth Hook payload ---
      const { user, email_data } = payload;
      recipient = user.email;
      emailType = email_data.email_action_type;
      siteUrl = email_data.site_url || "https://mapme.live";
      token = email_data.token;
      newEmail = user.new_email;

      // Build the confirmation URL from token_hash
      const tokenHash = email_data.token_hash;
      const redirectTo = email_data.redirect_to || siteUrl;
      const typeParam = emailType === "email_change" ? "email_change" : emailType;
      confirmationUrl = `${SUPABASE_URL}/auth/v1/verify?token=${tokenHash}&type=${typeParam}&redirect_to=${encodeURIComponent(redirectTo)}`;
    } else {
      // --- Direct test format ---
      emailType = payload.type;
      recipient = payload.email;
      siteUrl = payload.site_url || "https://mapme.live";
      confirmationUrl = payload.confirmation_url || "";
      token = payload.token;
      newEmail = payload.new_email;
    }

    const siteName = "MᴀᴘMᴇ.Lɪᴠᴇ";
    const fromAddress = "MᴀᴘMᴇ.Lɪᴠᴇ <noreply@notifications.3bi.io>";

    const templateMap: Record<string, { subject: string; component: JSX.Element }> = {
      signup: {
        subject: `Welcome to ${siteName} — confirm your email`,
        component: SignupEmail({ siteName, siteUrl, recipient, confirmationUrl }),
      },
      recovery: {
        subject: `Reset your ${siteName} password`,
        component: RecoveryEmail({ siteName, siteUrl, recipient, confirmationUrl }),
      },
      magiclink: {
        subject: `Sign in to ${siteName}`,
        component: MagicLinkEmail({ siteName, siteUrl, recipient, confirmationUrl }),
      },
      invite: {
        subject: `You're invited to ${siteName}`,
        component: InviteEmail({ siteName, siteUrl, recipient, confirmationUrl }),
      },
      email_change: {
        subject: `Confirm your email change on ${siteName}`,
        component: EmailChangeEmail({ siteName, siteUrl, recipient, confirmationUrl, newEmail }),
      },
      reauthentication: {
        subject: `Your ${siteName} verification code`,
        component: ReauthenticationEmail({ siteName, siteUrl, recipient, token: token || "" }),
      },
    };

    const template = templateMap[emailType];
    if (!template) {
      console.error(`Unknown email type: ${emailType}`, JSON.stringify(payload));
      return new Response(JSON.stringify({ error: `Unknown email type: ${emailType}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const html = await render(template.component);

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [recipient],
        subject: template.subject,
        html,
      }),
    });

    const resendBody = await resendRes.text();

    if (!resendRes.ok) {
      console.error("Resend error:", resendBody);
      return new Response(JSON.stringify({ error: "Failed to send email", details: resendBody }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Email sent [${emailType}] to ${recipient}:`, resendBody);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Auth email hook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

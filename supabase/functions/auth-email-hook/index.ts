import { Webhook } from "@lovable.dev/webhooks-js";
import { sendEmail } from "@lovable.dev/email-js";
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const webhook = new Webhook(apiKey);
    const payload = await webhook.verify(req);

    const {
      type,
      email: recipient,
      site_url: siteUrl,
      confirmation_url: confirmationUrl,
      token,
      new_email: newEmail,
      callback_url: callbackUrl,
    } = payload as Record<string, string>;

    const siteName = "MᴀᴘMᴇ.Lɪᴠᴇ";

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
        component: ReauthenticationEmail({ siteName, siteUrl, recipient, token }),
      },
    };

    const template = templateMap[type];
    if (!template) {
      return new Response(JSON.stringify({ error: `Unknown email type: ${type}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const html = await render(template.component);

    await sendEmail(
      {
        to: recipient,
        subject: template.subject,
        html,
      },
      {
        apiKey,
        callbackUrl,
      }
    );

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

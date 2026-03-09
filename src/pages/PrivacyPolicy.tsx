import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

const PrivacyPolicy = () => {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mapme.live/" },
      { "@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": "https://mapme.live/privacy" }
    ]
  };

  return (
    <Layout showFooter>
      <SEO
        title="Privacy Policy — MᴀᴘMᴇ.Lɪᴠᴇ"
        description="Learn how MᴀᴘMᴇ.Lɪᴠᴇ collects, uses, and protects your personal and location data. Your privacy matters."
        canonical="https://mapme.live/privacy"
        noindex={false}
        structuredData={breadcrumbData}
      />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: March 9, 2026</p>

        <div className="prose-custom space-y-8 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">1. Information We Collect</h2>
            <p className="leading-relaxed text-muted-foreground">When you use MᴀᴘMᴇ.Lɪᴠᴇ, we may collect the following information:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Account information:</strong> Email address when you create an account.</li>
              <li><strong className="text-foreground">Location data:</strong> GPS coordinates submitted through tracking links you create or share.</li>
              <li><strong className="text-foreground">Device information:</strong> Browser type, device type, and IP address for security and analytics.</li>
              <li><strong className="text-foreground">Usage data:</strong> How you interact with the platform, including pages visited and features used.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Provide and maintain the location tracking service.</li>
              <li>Authenticate your account and protect against unauthorized access.</li>
              <li>Display real-time location data on maps you create.</li>
              <li>Improve and optimize our platform's performance.</li>
              <li>Send service-related notifications (e.g., password resets).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">3. Data Storage & Security</h2>
            <p className="leading-relaxed text-muted-foreground">
              Your data is stored securely using Supabase with row-level security policies. Location data is associated only with
              tracking links you create and is accessible only to the tracker owner. We use encryption in transit (HTTPS/TLS)
              and enforce strict access controls to prevent unauthorized data access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">4. Data Sharing</h2>
            <p className="leading-relaxed text-muted-foreground">
              We do <strong className="text-foreground">not</strong> sell, rent, or share your personal data with third parties for marketing purposes.
              Location data is shared only with the tracker owner who created the tracking link. We may share data if required by law
              or to protect the safety of our users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">5. Your Rights</h2>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Access:</strong> You can view all data associated with your account from the Dashboard.</li>
              <li><strong className="text-foreground">Deletion:</strong> You can delete individual trackers and their location history at any time.</li>
              <li><strong className="text-foreground">Portability:</strong> You may request an export of your data by contacting us.</li>
              <li><strong className="text-foreground">Opt-out:</strong> You can deactivate trackers to stop collecting location data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">6. Cookies & Local Storage</h2>
            <p className="leading-relaxed text-muted-foreground">
              We use local storage to maintain your session and theme preferences. We do not use third-party tracking cookies.
              Mapbox may set cookies for map tile caching as part of its standard service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">7. Changes to This Policy</h2>
            <p className="leading-relaxed text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify registered users of significant changes via email.
              Continued use of the platform after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">8. Contact</h2>
            <p className="leading-relaxed text-muted-foreground">
              If you have questions about this Privacy Policy, please reach out through the platform or contact us at the email
              address associated with your account settings.
            </p>
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default PrivacyPolicy;

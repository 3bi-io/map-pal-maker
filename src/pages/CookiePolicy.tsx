import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

const CookiePolicy = () => {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mapme.live/" },
      { "@type": "ListItem", position: 2, name: "Cookie Policy", item: "https://mapme.live/cookies" },
    ],
  };

  return (
    <Layout showFooter>
      <SEO
        title="Cookie Policy — MᴀᴘMᴇ.Lɪᴠᴇ"
        description="Learn how MᴀᴘMᴇ.Lɪᴠᴇ uses cookies and similar technologies to improve your experience."
        canonical="https://mapme.live/cookies"
        structuredData={breadcrumbData}
      />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: March 9, 2026</p>

        <div className="space-y-8 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">1. What Are Cookies</h2>
            <p className="leading-relaxed text-muted-foreground">
              Cookies are small text files stored on your device when you visit a website. They help sites remember your preferences and improve your experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">2. How We Use Cookies</h2>
            <p className="leading-relaxed text-muted-foreground mb-3">We use the following types of cookies:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Essential cookies:</strong> Required for authentication, security, and core functionality. Cannot be disabled.</li>
              <li><strong className="text-foreground">Preference cookies:</strong> Remember your settings such as theme (light/dark mode) and language preferences.</li>
              <li><strong className="text-foreground">Analytics cookies:</strong> Help us understand how visitors interact with our platform so we can improve the user experience. All data is anonymized.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">3. Third-Party Cookies</h2>
            <p className="leading-relaxed text-muted-foreground">
              We use Supabase for authentication and Mapbox for map rendering. These services may set their own cookies. We recommend reviewing their respective privacy policies for details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">4. Managing Cookies</h2>
            <p className="leading-relaxed text-muted-foreground">
              You can control and delete cookies through your browser settings. Note that disabling essential cookies may prevent you from using certain features of MᴀᴘMᴇ.Lɪᴠᴇ. Most browsers allow you to:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground mt-2">
              <li>View and delete individual cookies</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies from specific sites</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">5. Cookie Consent</h2>
            <p className="leading-relaxed text-muted-foreground">
              When you first visit MᴀᴘMᴇ.Lɪᴠᴇ, we display a cookie consent banner. You can accept all cookies or manage your preferences. You can change your cookie preferences at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">6. Contact Us</h2>
            <p className="leading-relaxed text-muted-foreground">
              If you have questions about our use of cookies, please contact us at{" "}
              <a href="mailto:support@mapme.live" className="text-primary hover:underline">support@mapme.live</a>.
            </p>
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default CookiePolicy;

import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

const TermsOfService = () => {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mapme.live/" },
      { "@type": "ListItem", "position": 2, "name": "Terms of Service", "item": "https://mapme.live/terms" }
    ]
  };

  return (
    <Layout showFooter>
      <SEO
        title="Terms of Service — MᴀᴘMᴇ.Lɪᴠᴇ"
        description="Read the Terms of Service for MᴀᴘMᴇ.Lɪᴠᴇ, the real-time location tracking platform. Understand your rights and responsibilities."
        canonical="https://mapme.live/terms"
        noindex={false}
        structuredData={breadcrumbData}
      />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: March 9, 2026</p>

        <div className="space-y-8 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">1. Acceptance of Terms</h2>
            <p className="leading-relaxed text-muted-foreground">
              By accessing or using MᴀᴘMᴇ.Lɪᴠᴇ ("the Service"), you agree to be bound by these Terms of Service.
              If you do not agree, you may not use the Service. We reserve the right to update these terms at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">2. Description of Service</h2>
            <p className="leading-relaxed text-muted-foreground">
              MᴀᴘMᴇ.Lɪᴠᴇ provides real-time GPS location tracking through unique shareable links. Users can create
              tracking sessions, share links with consenting parties, and monitor locations on interactive maps. The Service
              is provided "as is" without guarantees of uptime or accuracy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">3. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>You must provide a valid email address to create an account.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must not share your account or use another person's account without permission.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">4. Acceptable Use</h2>
            <p className="leading-relaxed text-muted-foreground mb-2">You agree <strong className="text-foreground">not</strong> to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Track any person without their explicit, informed consent.</li>
              <li>Stalk, harass, or intimidate any individual.</li>
              <li>Violate any applicable local, state, national, or international law.</li>
              <li>Attempt to gain unauthorized access to other users' data or accounts.</li>
              <li>Reverse-engineer, decompile, or disassemble any part of the Service.</li>
              <li>Use automated tools to scrape or overload the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">5. Consent & Location Data</h2>
            <p className="leading-relaxed text-muted-foreground">
              Tracking links require the tracked party's browser to grant location permission. By sharing a tracking link,
              you represent that the recipient has given informed consent to share their location. MᴀᴘMᴇ.Lɪᴠᴇ is not
              responsible for misuse of tracking links by users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">6. Intellectual Property</h2>
            <p className="leading-relaxed text-muted-foreground">
              All content, trademarks, and code comprising the Service are owned by MᴀᴘMᴇ.Lɪᴠᴇ. You may not copy,
              modify, distribute, or create derivative works from the Service without explicit written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">7. Limitation of Liability</h2>
            <p className="leading-relaxed text-muted-foreground">
              To the maximum extent permitted by law, MᴀᴘMᴇ.Lɪᴠᴇ shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising from your use of the Service. This includes but is not
              limited to loss of data, loss of profits, or damages resulting from inaccurate location data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">8. Termination</h2>
            <p className="leading-relaxed text-muted-foreground">
              We may terminate or suspend your access to the Service immediately, without prior notice, for conduct that
              we determine violates these Terms or is harmful to other users, us, or third parties. Upon termination,
              your right to use the Service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">9. Governing Law</h2>
            <p className="leading-relaxed text-muted-foreground">
              These Terms shall be governed by and construed in accordance with applicable laws, without regard to
              conflict of law principles. Any disputes shall be resolved through binding arbitration or in the courts
              of competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">10. Contact</h2>
            <p className="leading-relaxed text-muted-foreground">
              For questions about these Terms, please contact us through the platform or at the email address
              associated with your account settings.
            </p>
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default TermsOfService;

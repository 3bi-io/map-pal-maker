import SEO from "@/components/SEO";
import Layout from "@/components/Layout";
import HeroSection from "@/components/landing/HeroSection";
import ValuePropBanner from "@/components/landing/ValuePropBanner";
import FeaturesSection from "@/components/landing/FeaturesSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "MᴀᴘMᴇ.Lɪᴠᴇ",
      url: "https://mapme.live",
      logo: "https://mapme.live/og-image.png",
      description: "Real-time location tracking and monitoring platform",
    },
    {
      "@type": "WebSite",
      name: "MᴀᴘMᴇ.Lɪᴠᴇ",
      url: "https://mapme.live",
    },
    {
      "@type": "WebApplication",
      name: "MᴀᴘMᴇ.Lɪᴠᴇ",
      url: "https://mapme.live/",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How does MᴀᴘMᴇ.Lɪᴠᴇ work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "MᴀᴘMᴇ.Lɪᴠᴇ generates a unique tracking link you can share with any device. When opened, the link requests location permission and sends real-time GPS coordinates to your dashboard.",
          },
        },
        {
          "@type": "Question",
          name: "Is MᴀᴘMᴇ.Lɪᴠᴇ free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. MᴀᴘMᴇ.Lɪᴠᴇ is completely free for personal use.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mapme.live" },
      ],
    },
  ],
};

const Home = () => {
  return (
    <>
      <SEO
        title="MᴀᴘMᴇ.Lɪᴠᴇ - Real-Time Location Tracking & GPS Monitoring"
        description="Generate unique tracking links and monitor device locations in real-time. Free location tracking with live map visualization and secure sharing."
        keywords="location tracking, GPS tracking, real-time tracking, location sharing, device tracking, map tracking, live location"
        canonical="https://mapme.live/"
        structuredData={structuredData}
      />
      <Layout showFooter={false}>
        <main>
          <HeroSection />
          <FeaturesSection />
          <UseCasesSection />
          <HowItWorksSection />
          <FAQSection />
          <CTASection />
        </main>
        <Footer />
      </Layout>
    </>
  );
};

export default Home;

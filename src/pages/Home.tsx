import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MapPin, Link2, Map, Shield, UserPlus, Share2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "How does MᴀᴘMᴇ.Lɪᴠᴇ work?",
    answer:
      "MᴀᴘMᴇ.Lɪᴠᴇ generates a unique tracking link you can share with any device. When opened, the link requests location permission and sends real-time GPS coordinates to your dashboard, displayed on an interactive map.",
  },
  {
    question: "Is MᴀᴘMᴇ.Lɪᴠᴇ free to use?",
    answer:
      "Yes. MᴀᴘMᴇ.Lɪᴠᴇ is completely free. Create an account, generate tracking links, and monitor locations at no cost.",
  },
  {
    question: "Is my location data secure?",
    answer:
      "Absolutely. All data is encrypted in transit and at rest. Only authenticated tracker owners can view location data. You can pause or delete trackers at any time.",
  },
  {
    question: "What devices are supported?",
    answer:
      "Any device with a modern web browser and GPS capability — smartphones, tablets, and laptops on iOS, Android, Windows, macOS, and Linux.",
  },
  {
    question: "Do tracked users need to install an app?",
    answer:
      "No. Tracked users simply open the shared link in their browser — no app download required. The browser's built-in Geolocation API handles everything.",
  },
];

const howItWorksSteps = [
  {
    icon: UserPlus,
    title: "Create an Account",
    description: "Sign up for free in seconds with just your email address.",
  },
  {
    icon: Share2,
    title: "Generate & Share a Link",
    description:
      "Create a unique tracking link and share it via text, email, or QR code.",
  },
  {
    icon: Eye,
    title: "Monitor in Real-Time",
    description:
      "View live GPS locations on an interactive map from your dashboard.",
  },
];

const Home = () => {
  const { user } = useAuth();

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
        potentialAction: {
          "@type": "SearchAction",
          target: "https://mapme.live/map/{search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebApplication",
        name: "MᴀᴘMᴇ.Lɪᴠᴇ",
        url: "https://mapme.live/",
        applicationCategory: "UtilityApplication",
        operatingSystem: "Web Browser",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "127",
        },
        featureList: [
          "Generate unique tracking links",
          "Real-time location monitoring",
          "Interactive map visualization",
          "QR code sharing",
          "Secure location sharing",
        ],
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["#hero-heading", "#hero-description"],
        },
      },
      {
        "@type": "HowTo",
        name: "How to Track a Device Location with MᴀᴘMᴇ.Lɪᴠᴇ",
        description:
          "Learn how to track any device's GPS location in real-time using MᴀᴘMᴇ.Lɪᴠᴇ in three simple steps.",
        step: howItWorksSteps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.title,
          text: s.description,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://mapme.live" },
        ],
      },
    ],
  };

  const features = [
    {
      icon: Link2,
      title: "Generate Tracking Links",
      description:
        "Create unique tracking links instantly that can be shared with any device to monitor location.",
    },
    {
      icon: Map,
      title: "Real-time Map View",
      description:
        "View tracked locations on an interactive map with live updates and location history.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Full control over your trackers with authentication, expiration, and pause controls.",
    },
  ];

  return (
    <>
      <SEO
        title="MᴀᴘMᴇ.Lɪᴠᴇ - Real-Time Location Tracking & GPS Monitoring"
        description="Generate unique tracking links and monitor device locations in real-time. Free location tracking with live map visualization, secure sharing, and terminal integration."
        keywords="location tracking, GPS tracking, real-time tracking, location sharing, device tracking, map tracking, live location, tracking link"
        canonical="https://mapme.live/"
        structuredData={structuredData}
      />
      <Layout showFooter>
        <main>
          {/* Hero Section */}
          <header className="relative py-16 sm:py-24 md:py-36 text-center space-y-5 sm:space-y-8 px-4 overflow-hidden">
            {/* Hero background image */}
            <div
              className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
              aria-hidden="true"
            >
              {/* Light mode: heavier overlay for readability; Dark/OLED: light overlay to let the image shine */}
              <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background dark:from-background/20 dark:via-background/5 dark:to-background/60" />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm text-primary font-medium">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              Location Tracking Made Simple
            </div>

            <h1
              id="hero-heading"
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground max-w-4xl mx-auto leading-tight"
            >
              Track Locations in Real-Time
            </h1>

            <p
              id="hero-description"
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2"
            >
              Generate unique tracking links and monitor device locations with
              ease. Perfect for development, testing, and location-based
              applications.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 px-2">
              {user ? (
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="gap-2 text-base sm:text-lg px-6 sm:px-8 shadow-elevated w-full sm:w-auto h-12 sm:h-auto"
                  >
                    <MapPin className="w-5 h-5" aria-hidden="true" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="gap-2 text-base sm:text-lg px-6 sm:px-8 shadow-elevated w-full sm:w-auto h-12 sm:h-auto"
                    >
                      <MapPin className="w-5 h-5" aria-hidden="true" />
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/auth" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2 text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto h-12 sm:h-auto"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </header>

          <div className="container mx-auto px-4">
          {/* Features Section */}
          <section
            className="py-10 sm:py-20 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto"
            aria-labelledby="features-heading"
          >
            <h2 id="features-heading" className="sr-only">
              Features
            </h2>
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-5 sm:p-6 space-y-3 sm:space-y-4 shadow-card hover:shadow-elevated transition-shadow rounded-xl"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <feature.icon
                    className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </section>

          {/* How It Works Section */}
          <section
            className="py-10 sm:py-20 max-w-4xl mx-auto"
            aria-labelledby="how-it-works-heading"
          >
            <h2
              id="how-it-works-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12"
            >
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto relative">
                    <step.icon
                      className="w-6 h-6 text-primary"
                      aria-hidden="true"
                    />
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section
            className="py-10 sm:py-20 max-w-3xl mx-auto"
            aria-labelledby="faq-heading"
          >
            <h2
              id="faq-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12"
            >
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left text-base sm:text-lg">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* CTA Section */}
          <aside
            className="py-10 sm:py-20 text-center px-2"
            aria-label="Call to action"
          >
            <Card className="max-w-3xl mx-auto p-6 sm:p-12 shadow-elevated bg-gradient-primary text-primary-foreground rounded-xl">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Ready to Start Tracking?
              </h2>
              <p className="text-sm sm:text-lg opacity-90 mb-5 sm:mb-8">
                Create your first tracking link in seconds and start monitoring
                locations.
              </p>
              <Link
                to={user ? "/dashboard" : "/auth"}
                className="inline-block w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto h-12 sm:h-auto"
                >
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                  {user ? "Go to Dashboard" : "Get Started Now"}
                </Button>
              </Link>
            </Card>
          </aside>
          </div>
        </main>
      </Layout>
    </>
  );
};

export default Home;

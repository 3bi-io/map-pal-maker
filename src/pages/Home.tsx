import { Link } from "react-router-dom";
import { MapPin, Link2, Map, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {
  const { user } = useAuth();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "MᴀᴘMᴇ.Lɪᴠᴇ",
        "url": "https://mapme.live",
        "logo": "https://mapme.live/og-image.png",
        "description": "Real-time location tracking and monitoring platform"
      },
      {
        "@type": "WebSite",
        "name": "MᴀᴘMᴇ.Lɪᴠᴇ",
        "url": "https://mapme.live"
      },
      {
        "@type": "WebApplication",
        "name": "MᴀᴘMᴇ.Lɪᴠᴇ",
        "url": "https://mapme.live",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Generate unique tracking links",
          "Real-time location monitoring",
          "Interactive map visualization",
          "Secure location sharing"
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://mapme.live"
          }
        ]
      }
    ]
  };

  const features = [{
    icon: Link2,
    title: "Generate Tracking Links",
    description: "Create unique tracking links instantly that can be shared with any device to monitor location."
  }, {
    icon: Map,
    title: "Real-time Map View",
    description: "View tracked locations on an interactive map with live updates and location history."
  }, {
    icon: Shield,
    title: "Secure & Private",
    description: "Full control over your trackers with authentication, expiration, and pause controls."
  }];

  return (
    <>
      <SEO
        title="TrackView - Real-Time Location Tracking & GPS Monitoring"
        description="Generate unique tracking links and monitor device locations in real-time. Free location tracking with live map visualization, secure sharing, and terminal integration."
        keywords="location tracking, GPS tracking, real-time tracking, location sharing, device tracking, map tracking, live location, tracking link"
        canonical="https://trackview.lovable.app/"
        structuredData={structuredData}
      />
      <Layout showFooter>
        <main className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="py-10 sm:py-20 md:py-32 text-center space-y-5 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm text-primary font-medium">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              Location Tracking Made Simple
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
              Track Locations in Real-Time
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Generate unique tracking links and monitor device locations with ease. Perfect for development, testing, and location-based applications.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 px-2">
              {user ? (
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" className="gap-2 text-base sm:text-lg px-6 sm:px-8 shadow-elevated w-full sm:w-auto h-12 sm:h-auto">
                    <MapPin className="w-5 h-5" aria-hidden="true" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth" className="w-full sm:w-auto">
                    <Button size="lg" className="gap-2 text-base sm:text-lg px-6 sm:px-8 shadow-elevated w-full sm:w-auto h-12 sm:h-auto">
                      <MapPin className="w-5 h-5" aria-hidden="true" />
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/auth" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="gap-2 text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto h-12 sm:h-auto">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </section>

          {/* Features Section */}
          <section className="py-10 sm:py-20 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto" aria-label="Features">
            {features.map((feature, index) => (
              <Card key={index} className="p-5 sm:p-6 space-y-3 sm:space-y-4 shadow-card hover:shadow-elevated transition-shadow rounded-xl">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" aria-hidden="true" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold">{feature.title}</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </section>

          {/* CTA Section */}
          <section className="py-10 sm:py-20 text-center px-2" aria-label="Call to action">
            <Card className="max-w-3xl mx-auto p-6 sm:p-12 shadow-elevated bg-gradient-primary text-primary-foreground rounded-xl">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Ready to Start Tracking?
              </h2>
              <p className="text-sm sm:text-lg opacity-90 mb-5 sm:mb-8">
                Create your first tracking link in seconds and start monitoring locations.
              </p>
              <Link to={user ? "/dashboard" : "/auth"} className="inline-block w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="gap-2 text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto h-12 sm:h-auto">
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                  {user ? "Go to Dashboard" : "Get Started Now"}
                </Button>
              </Link>
            </Card>
          </section>
        </main>
      </Layout>
    </>
  );
};

export default Home;

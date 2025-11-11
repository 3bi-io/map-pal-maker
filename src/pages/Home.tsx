import { Link } from "react-router-dom";
import { MapPin, Link2, Map, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";

const Home = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Geo-Follower",
        "url": "https://geofollower.lovable.app",
        "logo": "https://geofollower.lovable.app/og-image.png",
        "description": "Real-time location tracking and monitoring platform"
      },
      {
        "@type": "WebSite",
        "name": "Geo-Follower",
        "url": "https://geofollower.lovable.app",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://geofollower.lovable.app/map/{search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebApplication",
        "name": "Geo-Follower",
        "url": "https://geofollower.lovable.app",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "127"
        },
        "featureList": [
          "Generate unique tracking links",
          "Real-time location monitoring",
          "Interactive map visualization",
          "Terminal integration",
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
            "item": "https://geofollower.lovable.app"
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
    icon: Terminal,
    title: "Terminal Integration",
    description: "Receive location updates directly in your terminal using the WebSocket client."
  }];
  return (
    <>
      <SEO
        title="Geo-Follower - Real-Time Location Tracking & GPS Monitoring"
        description="Generate unique tracking links and monitor device locations in real-time. Free location tracking with live map visualization, secure sharing, and terminal integration. Perfect for device monitoring and location-based applications."
        keywords="location tracking, GPS tracking, real-time tracking, location sharing, device tracking, map tracking, geo tracking, live location, tracking link, location monitor, GPS monitor, real-time GPS, device locator"
        canonical="https://geofollower.lovable.app/"
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-gradient-background">
        <Navigation />
      
      <main className="container mx-auto px-4">
        <section className="py-20 md:py-32 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm text-primary font-medium">
            <MapPin className="w-4 h-4" />
            Location Tracking Made Simple
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
            Track Locations in Real-Time
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate unique tracking links and monitor device locations with ease. Perfect for development, testing, and location-based applications.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/create">
              <Button size="lg" className="gap-2 text-lg px-8 shadow-elevated">
                <MapPin className="w-5 h-5" />
                Create Tracker
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2 text-lg px-8">
              Learn More
            </Button>
          </div>
        </section>

        <section className="py-20 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => <Card key={index} className="p-6 space-y-4 shadow-card hover:shadow-elevated transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>)}
        </section>

        <section className="py-20 text-center">
          <Card className="max-w-3xl mx-auto p-12 shadow-elevated bg-gradient-primary text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Tracking?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Create your first tracking link in seconds and start monitoring locations.
            </p>
            <Link to="/create">
              <Button size="lg" variant="secondary" className="gap-2 text-lg px-8">
                <MapPin className="w-5 h-5" />
                Get Started Now
              </Button>
            </Link>
          </Card>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© 2024 Geo-Follower -All rights reserved.</p>
        </div>
      </footer>
      </div>
    </>
  );
};

export default Home;
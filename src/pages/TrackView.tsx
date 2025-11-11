import { useParams } from "react-router-dom";
import { MapPin, CheckCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SEO from "@/components/SEO";

const TrackView = () => {
  const { id } = useParams();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://geofollower.lovable.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Track Device",
        "item": `https://geofollower.lovable.app/track/${id}`
      }
    ]
  };

  const handleStartTracking = () => {
    toast.success("Location tracking started!");
  };

  return (
    <>
      <SEO
        title={`Enable Location Tracking - Tracker ${id} | Geo-Follower`}
        description={`Start sharing your real-time location for tracking ID ${id}. Secure location tracking with live updates, WebSocket connection, and the ability to stop anytime.`}
        keywords="enable location tracking, start GPS tracking, share location, device tracking, real-time location sharing"
        canonical={`https://geofollower.lovable.app/track/${id}`}
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-gradient-background">
        <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center shadow-elevated">
              <MapPin className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground pt-4">
              Enable Location Tracking
            </h1>
            <p className="text-muted-foreground">
              Tracking ID: <span className="font-mono text-primary">{id}</span>
            </p>
          </div>

          <Card className="p-8 shadow-elevated space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Real-time Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    Your location will be shared in real-time with the tracking service.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Secure Connection</h3>
                  <p className="text-sm text-muted-foreground">
                    All location data is transmitted securely via WebSocket connection.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Stop Anytime</h3>
                  <p className="text-sm text-muted-foreground">
                    You can stop sharing your location at any time by closing this page.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full gap-2"
              onClick={handleStartTracking}
            >
              <MapPin className="w-5 h-5" />
              Start Tracking
            </Button>
          </Card>
        </div>
      </main>
      </div>
    </>
  );
};

export default TrackView;

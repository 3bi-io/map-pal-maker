import { useState } from "react";
import { Copy, MapPin, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";

const CreateTracker = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Create a Location Tracking Link",
    "description": "Step-by-step guide to generate a unique tracking link for real-time location monitoring",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Generate Tracking ID",
        "text": "Click the button to generate a unique tracking ID for your device",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "Copy Tracking Link",
        "text": "Copy the generated tracking link and share it with the device you want to track",
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": "View on Map",
        "text": "Use the map link to view real-time location updates on an interactive map",
        "position": 3
      }
    ]
  };

  const [trackingId, setTrackingId] = useState(generateTrackingId());

  function generateTrackingId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    const part2 = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return `${part1}-${part2}`;
  }

  const trackingLink = `${window.location.origin}/track/${trackingId}`;
  const mapLink = `${window.location.origin}/map/${trackingId}`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleNewId = () => {
    setTrackingId(generateTrackingId());
    toast.success("New tracking ID generated!");
  };

  return (
    <>
      <SEO
        title="Create Location Tracker - Generate Tracking Link | Geo-Follower"
        description="Generate a unique tracking link instantly. Create secure tracking IDs for real-time device location monitoring. Free location tracker with live map updates and terminal integration."
        keywords="create tracking link, generate tracker, location tracking link, GPS tracker link, device tracking ID, tracking link generator, location monitor setup"
        canonical="https://geofollower.lovable.app/create"
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-gradient-background">
        <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Create Location Tracker
            </h1>
            <p className="text-lg text-muted-foreground">
              Generate a unique tracking link that can be shared to monitor a device's location.
            </p>
          </div>

          <Card className="p-6 md:p-8 shadow-elevated space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Your Tracking Link</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Share this link with the device you want to track. When opened, it will begin sending location updates.
              </p>
              
              <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                <code className="flex-1 text-sm break-all">{trackingLink}</code>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copyToClipboard(trackingLink, "Tracking link")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Tracking ID:</p>
                  <p className="text-lg font-mono text-primary">{trackingId}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNewId}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  New ID
                </Button>
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-lg">
                <MapPin className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">View on Map</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Use this link to view the tracked location on a map:
                  </p>
                  <code className="text-xs break-all">{mapLink}</code>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                For the terminal client, run the provided Node.js server and it will receive location updates automatically.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => copyToClipboard(trackingLink, "Link")}
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={() => window.open(mapLink, "_blank")}
                >
                  View Map
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 md:p-8 shadow-card bg-secondary/5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">ℹ</span>
              </div>
              <h3 className="text-lg font-semibold">Terminal Tracking Client</h3>
            </div>
            
            <p className="text-sm text-muted-foreground">
              To receive location updates in your terminal, you'll need to run the WebSocket server included in the project.
            </p>

            <div className="bg-secondary text-secondary-foreground rounded-lg p-4 font-mono text-sm space-y-2">
              <div># 1. Navigate to the server directory</div>
              <div>cd src/server</div>
              <div className="pt-2"># 2. Install WebSocket dependency (if not already installed)</div>
              <div>npm install ws</div>
              <div className="pt-2"># 3. Run the server</div>
              <div>node server.js</div>
            </div>
          </Card>
        </div>
      </main>
      </div>
    </>
  );
};

export default CreateTracker;

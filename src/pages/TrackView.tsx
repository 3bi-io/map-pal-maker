import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { MapPin, CheckCircle, Loader2, XCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

type TrackingStatus = "idle" | "requesting" | "tracking" | "error";

const TrackView = () => {
  const { id } = useParams();
  const [status, setStatus] = useState<TrackingStatus>("idle");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [watchId, setWatchId] = useState<number | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  
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

  const saveLocationToDatabase = async (latitude: number, longitude: number, accuracy: number | null) => {
    if (!id) return;
    
    const { error } = await supabase
      .from('location_updates')
      .insert({
        tracking_id: id,
        latitude,
        longitude,
        accuracy
      });

    if (error) {
      console.error('Failed to save location:', error);
    } else {
      setUpdateCount(prev => prev + 1);
      console.log(`[${new Date().toISOString()}] Location saved to database`);
    }
  };

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setStatus("idle");
    setLocation(null);
    toast.info("Location tracking stopped");
  }, [watchId]);

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const handleStartTracking = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      setErrorMessage("Geolocation is not supported by your browser");
      toast.error("Geolocation not supported");
      return;
    }

    setStatus("requesting");

    const geoWatchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setStatus("tracking");
        
        // Save to database
        saveLocationToDatabase(latitude, longitude, accuracy);
        
        console.log(`[${new Date().toISOString()}] Location update:`, {
          trackingId: id,
          lat: latitude,
          lng: longitude,
          accuracy
        });
      },
      (error) => {
        setStatus("error");
        let message = "Unable to retrieve location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location permission denied. Please allow location access and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable";
            break;
          case error.TIMEOUT:
            message = "Location request timed out";
            break;
        }
        
        setErrorMessage(message);
        toast.error(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );

    setWatchId(geoWatchId);
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
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-elevated ${
              status === "tracking" ? "bg-green-500" : 
              status === "error" ? "bg-destructive" : 
              "bg-gradient-primary"
            }`}>
              {status === "requesting" ? (
                <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
              ) : status === "error" ? (
                <XCircle className="w-10 h-10 text-destructive-foreground" />
              ) : (
                <MapPin className="w-10 h-10 text-primary-foreground" />
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground pt-4">
              {status === "tracking" ? "Tracking Active" : 
               status === "error" ? "Tracking Error" : 
               "Enable Location Tracking"}
            </h1>
            <p className="text-muted-foreground">
              Tracking ID: <span className="font-mono text-primary">{id}</span>
            </p>
          </div>

          <Card className="p-8 shadow-elevated space-y-6">
            {status === "tracking" && location && (
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                  Currently sharing location ({updateCount} updates sent):
                </p>
                <p className="font-mono text-sm">
                  Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-sm text-destructive">{errorMessage}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Real-time Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    Your location will be saved and shared in real-time.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Secure Storage</h3>
                  <p className="text-sm text-muted-foreground">
                    All location data is stored securely in the cloud.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Stop Anytime</h3>
                  <p className="text-sm text-muted-foreground">
                    You can stop sharing your location at any time by clicking the stop button.
                  </p>
                </div>
              </div>
            </div>

            {status === "tracking" ? (
              <Button 
                size="lg" 
                variant="destructive"
                className="w-full gap-2"
                onClick={stopTracking}
              >
                <XCircle className="w-5 h-5" />
                Stop Tracking
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="w-full gap-2"
                onClick={handleStartTracking}
                disabled={status === "requesting"}
              >
                {status === "requesting" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Requesting Permission...
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5" />
                    {status === "error" ? "Try Again" : "Start Tracking"}
                  </>
                )}
              </Button>
            )}
          </Card>
        </div>
      </main>
      </div>
    </>
  );
};

export default TrackView;
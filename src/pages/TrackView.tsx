import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, CheckCircle, Loader2, XCircle, AlertTriangle } from "lucide-react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

type TrackingStatus = "idle" | "requesting" | "tracking" | "error" | "invalid";

const THROTTLE_MS = 5000;

const TrackView = () => {
  const { id } = useParams();
  const [status, setStatus] = useState<TrackingStatus>("idle");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [watchId, setWatchId] = useState<number | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [trackerInfo, setTrackerInfo] = useState<{ name: string; is_active: boolean } | null>(null);
  const [checkingTracker, setCheckingTracker] = useState(true);
  const lastSaveRef = useRef<number>(0);
  const { toast } = useToast();

  // Check if tracker exists and is active
  useEffect(() => {
    const checkTracker = async () => {
      if (!id) {
        setStatus("invalid");
        setCheckingTracker(false);
        return;
      }

      const { data, error } = await supabase
        .from('trackers')
        .select('name, is_active')
        .eq('tracking_id', id)
        .maybeSingle();

      if (error || !data) {
        setStatus("invalid");
        setErrorMessage("This tracking link is invalid.");
      } else if (!data.is_active) {
        setStatus("invalid");
        setErrorMessage("This tracker has been paused by its owner.");
      } else {
        setTrackerInfo({ name: data.name, is_active: data.is_active });
      }
      
      setCheckingTracker(false);
    };

    checkTracker();
  }, [id]);

  const saveLocationToDatabase = useCallback(async (latitude: number, longitude: number, accuracy: number | null) => {
    if (!id) return;

    const now = Date.now();
    if (now - lastSaveRef.current < THROTTLE_MS) return;
    lastSaveRef.current = now;
    
    const { error } = await supabase
      .from('location_updates')
      .insert({ tracking_id: id, latitude, longitude, accuracy });

    if (error) {
      if (error.message?.includes('violates row-level security')) {
        setStatus("error");
        setErrorMessage("This tracker has been paused or deleted.");
        stopTracking();
      }
    } else {
      setUpdateCount(prev => prev + 1);
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setStatus("idle");
    setLocation(null);
    toast({ title: "Tracking stopped", description: "Location tracking has been stopped." });
  }, [watchId, toast]);

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
      toast({ title: "Not supported", description: "Geolocation not supported", variant: "destructive" });
      return;
    }

    setStatus("requesting");
    if (navigator.vibrate) navigator.vibrate(30);

    const geoWatchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setStatus("tracking");
        saveLocationToDatabase(latitude, longitude, accuracy);
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
        toast({ title: "Location error", description: message, variant: "destructive" });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );

    setWatchId(geoWatchId);
    toast({ title: "Tracking started!", description: "Your location is being shared." });
  };

  if (checkingTracker) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin mb-4" />
            <p className="text-muted-foreground">Verifying tracker...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (status === "invalid") {
    return (
      <>
        <SEO title="Invalid Tracker | TrackView" description="This tracking link is invalid or has expired." />
        <Layout>
          <main className="container mx-auto px-4 py-8 sm:py-12">
            <div className="max-w-md mx-auto text-center space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-destructive" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Invalid Tracker</h1>
              <p className="text-muted-foreground">{errorMessage}</p>
              <Link to="/">
                <Button>Go to Home</Button>
              </Link>
            </div>
          </main>
        </Layout>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`Enable Location Tracking - ${trackerInfo?.name || 'Tracker'} | TrackView`}
        description={`Start sharing your real-time location for tracking ID ${id}.`}
        canonical={`https://trackview.lovable.app/track/${id}`}
      />
      <Layout>
        <main className="container mx-auto px-4 py-8 sm:py-12">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full flex items-center justify-center shadow-elevated ${
                status === "tracking" ? "bg-green-500" : 
                status === "error" ? "bg-destructive" : 
                "bg-gradient-primary"
              }`}>
                {status === "requesting" ? (
                  <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground animate-spin" />
                ) : status === "error" ? (
                  <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-destructive-foreground" />
                ) : status === "tracking" ? (
                  <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground animate-pulse" />
                ) : (
                  <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground pt-4">
                {status === "tracking" ? "Tracking Active" : 
                 status === "error" ? "Tracking Error" : 
                 "Enable Location Tracking"}
              </h1>
              {trackerInfo && (
                <p className="text-base sm:text-lg text-muted-foreground">{trackerInfo.name}</p>
              )}
              <p className="text-muted-foreground text-sm">
                Tracking ID: <span className="font-mono text-primary">{id}</span>
              </p>
            </div>

            {/* Active tracking banner */}
            {status === "tracking" && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Actively sharing your location · {updateCount} updates sent
                </p>
              </div>
            )}

            <Card className="p-6 sm:p-8 shadow-elevated space-y-6">
              {status === "tracking" && location && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Current Position</p>
                  <p className="font-mono text-sm">
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
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
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Real-time Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Your location will be saved and shared in real-time.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Secure Storage</h3>
                    <p className="text-sm text-muted-foreground">
                      All location data is stored securely in the cloud.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Stop Anytime</h3>
                    <p className="text-sm text-muted-foreground">
                      You can stop sharing your location at any time.
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
      </Layout>
    </>
  );
};

export default TrackView;

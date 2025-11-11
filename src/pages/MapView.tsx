import { useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import SEO from "@/components/SEO";

const MapView = () => {
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
        "name": "Map View",
        "item": `https://geofollower.lovable.app/map/${id}`
      }
    ]
  };
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      if (!mapContainer.current) return;

      try {
        // Fetch Mapbox token from edge function
        const response = await fetch(
          `https://yglllvordvxufsfdatqq.supabase.co/functions/v1/get-mapbox-token`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch Mapbox token');
        }

        const { token } = await response.json();
        mapboxgl.accessToken = token;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [-74.5, 40],
          zoom: 9,
        });

        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          "top-right"
        );

        setLoading(false);
      } catch (err) {
        console.error('Map initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize map');
        setLoading(false);
      }
    };

    initMap();

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <>
      <SEO
        title={`Location Map View - Tracker ${id} | Geo-Follower`}
        description={`View real-time location updates for tracking ID ${id} on an interactive map. Monitor device location with live GPS tracking and location history visualization.`}
        keywords="location map, GPS map view, real-time map tracking, live location map, device location map, tracking map view"
        canonical={`https://geofollower.lovable.app/map/${id}`}
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-gradient-background">
        <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Location Map
            </h1>
            <p className="text-muted-foreground">
              Tracking ID: <span className="font-mono text-primary">{id}</span>
            </p>
          </div>

          {loading ? (
            <Card className="p-8 shadow-elevated">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <p className="text-muted-foreground">Loading map...</p>
              </div>
            </Card>
          ) : error ? (
            <Card className="p-8 shadow-elevated">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-destructive" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Error Loading Map</h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-4 shadow-elevated">
              <div ref={mapContainer} className="w-full h-[600px] rounded-lg" />
            </Card>
          )}
        </div>
      </main>
      </div>
    </>
  );
};

export default MapView;

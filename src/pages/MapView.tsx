import { useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MapView = () => {
  const { id } = useParams();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [tokenSubmitted, setTokenSubmitted] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !tokenSubmitted || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
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

    return () => {
      map.current?.remove();
    };
  }, [tokenSubmitted, mapboxToken]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setTokenSubmitted(true);
    }
  };

  return (
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

          {!tokenSubmitted ? (
            <Card className="p-8 shadow-elevated">
              <div className="space-y-4 max-w-md mx-auto">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Enter Mapbox Token</h3>
                  <p className="text-sm text-muted-foreground">
                    Get your free token at{" "}
                    <a
                      href="https://mapbox.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      mapbox.com
                    </a>
                  </p>
                </div>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="pk.eyJ1..."
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTokenSubmit()}
                  />
                  <Button onClick={handleTokenSubmit} className="w-full">
                    Load Map
                  </Button>
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
  );
};

export default MapView;

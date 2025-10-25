import { useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";

const MapView = () => {
  const { id } = useParams();

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

          <Card className="p-8 shadow-elevated">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Map View</h3>
                  <p className="text-muted-foreground">
                    Interactive map integration would be displayed here.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Connect to a mapping service like Mapbox or Google Maps to view real-time location data.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MapView;

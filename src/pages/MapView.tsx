import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { MapPin, Loader2, AlertCircle, Navigation as NavIcon } from 'lucide-react';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';

interface LocationUpdate {
  id: string;
  tracking_id: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  created_at: string;
}

const MapView = () => {
  const { id } = useParams();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<LocationUpdate[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://trackview.lovable.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Map View",
        "item": `https://trackview.lovable.app/map/${id}`
      }
    ]
  };

  // Fetch initial locations and set up realtime subscription
  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error: fetchError } = await supabase
        .from('location_updates')
        .select('*')
        .eq('tracking_id', id)
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Error fetching locations:', fetchError);
      } else if (data) {
        setLocations(data);
        if (data.length > 0) {
          setLastUpdate(data[data.length - 1].created_at);
        }
      }
    };

    fetchLocations();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('location-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'location_updates',
          filter: `tracking_id=eq.${id}`
        },
        (payload) => {
          const newLocation = payload.new as LocationUpdate;
          setLocations(prev => [...prev, newLocation]);
          setLastUpdate(newLocation.created_at);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      if (!mapContainer.current) return;

      try {
        const { data, error: funcError } = await supabase.functions.invoke('get-mapbox-token');
        
        if (funcError || !data?.token) {
          throw new Error('Failed to fetch Mapbox token');
        }

        mapboxgl.accessToken = data.token;

        const latestLocation = locations.length > 0 ? locations[locations.length - 1] : null;
        const center: [number, number] = latestLocation 
          ? [latestLocation.longitude, latestLocation.latitude] 
          : [-74.5, 40];

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center,
          zoom: latestLocation ? 15 : 3,
          pitch: 45,
        });

        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          'top-right'
        );

        map.current.on('load', () => {
          setLoading(false);
          
          if (locations.length > 1 && map.current) {
            addPathToMap();
          }

          if (latestLocation && map.current) {
            addMarker(latestLocation.longitude, latestLocation.latitude);
          }
        });

      } catch (err) {
        console.error('Map initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load map');
        setLoading(false);
      }
    };

    initMap();

    return () => {
      marker.current?.remove();
      map.current?.remove();
    };
  }, []);

  // Update map when locations change
  useEffect(() => {
    if (!map.current || locations.length === 0 || loading) return;

    const latestLocation = locations[locations.length - 1];
    
    if (marker.current) {
      marker.current.setLngLat([latestLocation.longitude, latestLocation.latitude]);
    } else {
      addMarker(latestLocation.longitude, latestLocation.latitude);
    }

    if (locations.length > 1) {
      addPathToMap();
    }

    map.current.flyTo({
      center: [latestLocation.longitude, latestLocation.latitude],
      zoom: 15,
      duration: 1000
    });
  }, [locations, loading]);

  const addMarker = (lng: number, lat: number) => {
    if (!map.current) return;

    const el = document.createElement('div');
    el.className = 'w-8 h-8 bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center';
    el.style.cssText = 'width: 32px; height: 32px; background: #3b82f6; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3);';

    marker.current = new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .addTo(map.current);
  };

  const addPathToMap = () => {
    if (!map.current || locations.length < 2) return;

    const coordinates = locations.map(loc => [loc.longitude, loc.latitude]);

    if (map.current.getSource('route')) {
      (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates
        }
      });
    } else {
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates
          }
        }
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  return (
    <>
      <SEO
        title={`Live Map - Tracking ${id} | TrackView`}
        description={`View real-time location updates on an interactive map for tracking ID ${id}. Monitor device movement with live GPS tracking, path visualization, and location history.`}
        keywords="live map tracking, GPS map view, real-time location map, device tracker map, location monitoring, tracking visualization"
        canonical={`https://trackview.lovable.app/map/${id}`}
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-gradient-background flex flex-col">
        <Navigation />
        
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
            {/* Map Container */}
            <div className="flex-1 relative rounded-xl overflow-hidden shadow-elevated min-h-[400px]">
              {loading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                  <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Loading map...</p>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="absolute inset-0 bg-background flex items-center justify-center z-10">
                  <Card className="p-8 max-w-md text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
                    <h2 className="text-xl font-semibold">Map Error</h2>
                    <p className="text-muted-foreground">{error}</p>
                  </Card>
                </div>
              )}

              <div ref={mapContainer} className="absolute inset-0" />
            </div>

            {/* Info Panel */}
            <Card className="w-full lg:w-80 p-6 space-y-6 shadow-elevated overflow-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-semibold">Tracking Info</h2>
                  <p className="text-xs text-muted-foreground font-mono">{id}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${locations.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                    <span className="font-medium">
                      {locations.length > 0 ? 'Active' : 'Waiting for data...'}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Location Points</p>
                  <p className="font-medium text-2xl">{locations.length}</p>
                </div>

                {lastUpdate && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Last Update</p>
                    <p className="font-medium">{formatTime(lastUpdate)}</p>
                  </div>
                )}

                {locations.length > 0 && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Latest Position</p>
                    <p className="font-mono text-xs">
                      {locations[locations.length - 1].latitude.toFixed(6)},
                      {locations[locations.length - 1].longitude.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>

              {locations.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <NavIcon className="w-4 h-4" />
                    Recent Updates
                  </h3>
                  <div className="max-h-48 overflow-auto space-y-2">
                    {locations.slice(-5).reverse().map((loc) => (
                      <div key={loc.id} className="text-xs p-2 bg-muted/50 rounded">
                        <span className="text-muted-foreground">
                          {formatTime(loc.created_at)}
                        </span>
                        <p className="font-mono">
                          {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </>
  );
};

export default MapView;
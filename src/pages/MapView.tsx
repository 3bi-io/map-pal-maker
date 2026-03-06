import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, AlertCircle, Navigation as NavIcon, Crosshair, ChevronUp, ChevronDown } from 'lucide-react';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/hooks/useTheme';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatTime } from '@/lib/tracker-utils';

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
  const locationsRef = useRef<LocationUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<LocationUpdate[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(false);
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Keep ref in sync
  useEffect(() => {
    locationsRef.current = locations;
  }, [locations]);

  const getMapStyle = useCallback(() => {
    return theme === 'dark' || theme === 'oled'
      ? 'mapbox://styles/mapbox/dark-v11'
      : 'mapbox://styles/mapbox/light-v11';
  }, [theme]);

  const addMarker = useCallback((lng: number, lat: number) => {
    if (!map.current) return;
    const el = document.createElement('div');
    el.style.cssText = 'width: 32px; height: 32px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3);';
    el.className = 'bg-primary';
    el.style.background = 'hsl(var(--primary))';

    marker.current = new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .addTo(map.current);
  }, []);

  const addPathToMap = useCallback(() => {
    if (!map.current || locationsRef.current.length < 2) return;
    const coordinates = locationsRef.current.map(loc => [loc.longitude, loc.latitude]);

    if (map.current.getSource('route')) {
      (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates }
      });
    } else {
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates }
        }
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': 'hsl(var(--primary))', 'line-width': 4, 'line-opacity': 0.8 }
      });
    }
  }, []);

  const restoreMapLayers = useCallback(() => {
    if (!map.current) return;
    if (locationsRef.current.length > 1) {
      if (map.current.getLayer('route')) map.current.removeLayer('route');
      if (map.current.getSource('route')) map.current.removeSource('route');
      addPathToMap();
    }
  }, [addPathToMap]);

  // Fetch locations + realtime
  useEffect(() => {
    if (!id) return;

    const fetchLocations = async () => {
      const { data, error: fetchError } = await supabase
        .from('location_updates')
        .select('*')
        .eq('tracking_id', id)
        .order('created_at', { ascending: true });

      if (!fetchError && data) {
        setLocations(data);
        if (data.length > 0) setLastUpdate(data[data.length - 1].created_at);
      }
    };

    fetchLocations();

    const channel = supabase
      .channel(`location-updates-${id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'location_updates', filter: `tracking_id=eq.${id}` },
        (payload) => {
          const newLocation = payload.new as LocationUpdate;
          setLocations(prev => [...prev, newLocation]);
          setLastUpdate(newLocation.created_at);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      if (!mapContainer.current) return;

      try {
        const { data, error: funcError } = await supabase.functions.invoke('get-mapbox-token');
        if (funcError || !data?.token) throw new Error('Failed to fetch Mapbox token');

        mapboxgl.accessToken = data.token;
        const locs = locationsRef.current;
        const latestLocation = locs.length > 0 ? locs[locs.length - 1] : null;
        const center: [number, number] = latestLocation
          ? [latestLocation.longitude, latestLocation.latitude]
          : [-74.5, 40];

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: getMapStyle(),
          center,
          zoom: latestLocation ? 15 : 3,
          pitch: 45,
        });

        map.current.addControl(
          new mapboxgl.NavigationControl({ visualizePitch: true }), 
          isMobile ? 'top-left' : 'top-right'
        );

        map.current.on('load', () => {
          setLoading(false);
          if (locationsRef.current.length > 1) addPathToMap();
          if (latestLocation) addMarker(latestLocation.longitude, latestLocation.latitude);
        });

        map.current.on('style.load', () => {
          restoreMapLayers();
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load map');
        setLoading(false);
      }
    };

    initMap();
    return () => {
      marker.current?.remove();
      map.current?.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Theme change -> set style
  useEffect(() => {
    if (map.current && !loading) {
      map.current.setStyle(getMapStyle());
    }
  }, [theme, loading, getMapStyle]);

  // Update map when locations change
  useEffect(() => {
    if (!map.current || locations.length === 0 || loading) return;

    const latestLocation = locations[locations.length - 1];

    if (marker.current) {
      marker.current.setLngLat([latestLocation.longitude, latestLocation.latitude]);
    } else {
      addMarker(latestLocation.longitude, latestLocation.latitude);
    }

    if (locations.length > 1) addPathToMap();

    map.current.flyTo({
      center: [latestLocation.longitude, latestLocation.latitude],
      zoom: 15,
      duration: 1000
    });
  }, [locations, loading, addMarker, addPathToMap]);

  const centerOnLatest = () => {
    if (!map.current || locations.length === 0) return;
    const latest = locations[locations.length - 1];
    map.current.flyTo({ center: [latest.longitude, latest.latitude], zoom: 15, duration: 1000 });
  };

  // Mobile bottom sheet info panel
  const MobileInfoPanel = () => (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-30 transition-transform duration-300 ease-out ${
        bottomSheetExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-4.5rem)]'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="bg-card/95 backdrop-blur-md rounded-t-2xl shadow-elevated border-t">
        {/* Handle bar */}
        <button
          onClick={() => setBottomSheetExpanded(!bottomSheetExpanded)}
          className="w-full flex flex-col items-center pt-2 pb-1 touch-manipulation"
          aria-label={bottomSheetExpanded ? 'Collapse info panel' : 'Expand info panel'}
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mb-2" />
          <div className="flex items-center gap-2 px-4 w-full">
            <div className="flex items-center gap-2 flex-1">
              <div className={`w-2 h-2 rounded-full ${locations.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
              <span className="font-medium text-sm">
                {locations.length > 0 ? `${locations.length} points` : 'Waiting...'}
              </span>
              {lastUpdate && (
                <span className="text-xs text-muted-foreground">· {formatTime(lastUpdate)}</span>
              )}
            </div>
            {bottomSheetExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Expanded content */}
        <div className="px-4 pb-4 space-y-3 max-h-[50vh] overflow-auto scrollbar-thin">
          <div className="p-3 bg-muted rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Tracking ID</p>
            <p className="font-mono text-xs">{id}</p>
          </div>

          {locations.length > 0 && (
            <div className="p-3 bg-muted rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">Latest Position</p>
              <p className="font-mono text-xs">
                {locations[locations.length - 1].latitude.toFixed(6)},
                {locations[locations.length - 1].longitude.toFixed(6)}
              </p>
            </div>
          )}

          {locations.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium flex items-center gap-2">
                <NavIcon className="w-3 h-3" />
                Recent Updates
              </h3>
              <div className="space-y-1.5">
                {locations.slice(-5).reverse().map((loc) => (
                  <div key={loc.id} className="text-xs p-2 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">{formatTime(loc.created_at)}</span>
                    <p className="font-mono">{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SEO
        title={`Live Map - Tracking ${id} | TrackView`}
        description={`View real-time location updates on an interactive map for tracking ID ${id}.`}
        canonical={`https://trackview.lovable.app/map/${id}`}
      />
      <Layout showMobileNav={false}>
        <main className={`flex-1 ${isMobile ? '' : 'container mx-auto px-2 sm:px-4 py-2 sm:py-4'}`}>
          <div className={`flex flex-col lg:flex-row gap-2 sm:gap-4 ${
            isMobile 
              ? 'h-[100dvh] fixed inset-0 top-[57px]' 
              : 'h-[calc(100vh-8rem)] lg:h-[calc(100vh-10rem)]'
          }`}>
            {/* Map */}
            <div className={`flex-1 relative ${isMobile ? '' : 'rounded-xl'} overflow-hidden shadow-elevated min-h-[250px]`}>
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
                  <Card className="p-8 max-w-md text-center space-y-4 mx-4 rounded-xl">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
                    <h2 className="text-xl font-semibold">Map Error</h2>
                    <p className="text-muted-foreground">{error}</p>
                  </Card>
                </div>
              )}

              <div ref={mapContainer} className="absolute inset-0" />
              
              {/* Map Controls */}
              {!loading && !error && locations.length > 0 && (
                <div className={`absolute z-10 flex gap-2 ${
                  isMobile ? 'bottom-20 right-4' : 'bottom-4 left-4'
                }`}>
                  <Button 
                    size="sm" 
                    onClick={centerOnLatest} 
                    className="gap-2 shadow-lg rounded-full"
                    aria-label="Center on latest location"
                  >
                    <Crosshair className="w-4 h-4" />
                    {!isMobile && <span>Center</span>}
                  </Button>
                </div>
              )}
            </div>

            {/* Desktop Info Panel */}
            {!isMobile && (
              <Card className="w-full lg:w-72 xl:w-80 p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-elevated overflow-auto scrollbar-thin rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Tracking Info</h2>
                    <p className="text-xs text-muted-foreground font-mono">{id}</p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="p-3 sm:p-4 bg-muted rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${locations.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                      <span className="font-medium">
                        {locations.length > 0 ? 'Active' : 'Waiting for data...'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 bg-muted rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Location Points</p>
                    <p className="font-medium text-2xl">{locations.length}</p>
                  </div>

                  {lastUpdate && (
                    <div className="p-3 sm:p-4 bg-muted rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Last Update</p>
                      <p className="font-medium">{formatTime(lastUpdate)}</p>
                    </div>
                  )}

                  {locations.length > 0 && (
                    <div className="p-3 sm:p-4 bg-muted rounded-xl">
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
                        <div key={loc.id} className="text-xs p-2 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">{formatTime(loc.created_at)}</span>
                          <p className="font-mono">{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Mobile bottom sheet */}
          {isMobile && !loading && !error && <MobileInfoPanel />}
        </main>
      </Layout>
    </>
  );
};

export default MapView;

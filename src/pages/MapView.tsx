import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Crosshair, Loader2, AlertCircle, Maximize, Minimize,
  Mountain, Compass,
} from 'lucide-react';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/hooks/useTheme';
import { useIsMobile } from '@/hooks/use-mobile';
import { MAP_STYLES, type MapStyleId, speedColor, calculateSpeed, haversineDistance, formatDistance } from '@/lib/map-utils';
import type { LocationUpdate, MapContextMenuState, MeasurePoint } from '@/components/map/types';

import MapStyleSwitcher from '@/components/map/MapStyleSwitcher';
import MapSearch from '@/components/map/MapSearch';
import MapContextMenu from '@/components/map/MapContextMenu';
import MapInfoPanel from '@/components/map/MapInfoPanel';
import MobileMapSheet from '@/components/map/MobileMapSheet';

const MapView = () => {
  const { id } = useParams();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const measureMarkersRef = useRef<MeasurePoint[]>([]);
  const searchMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const locationsRef = useRef<LocationUpdate[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<LocationUpdate[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyleId>('dark-v11');
  const [terrainEnabled, setTerrainEnabled] = useState(false);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapboxToken, setMapboxToken] = useState('');
  const [contextMenu, setContextMenu] = useState<MapContextMenuState>({ visible: false, x: 0, y: 0, lngLat: null });
  const [measuring, setMeasuring] = useState(false);

  const { theme } = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => { locationsRef.current = locations; }, [locations]);

  // Set default style based on app theme
  useEffect(() => {
    if (theme === 'dark' || theme === 'oled') setMapStyle('dark-v11');
    else setMapStyle('light-v11');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Data fetching ───
  useEffect(() => {
    if (!id) return;
    const fetchLocations = async () => {
      const { data } = await supabase
        .from('location_updates')
        .select('*')
        .eq('tracking_id', id)
        .order('created_at', { ascending: true });
      if (data) {
        setLocations(data);
        if (data.length > 0) setLastUpdate(data[data.length - 1].created_at);
      }
    };
    fetchLocations();

    const channel = supabase
      .channel(`loc-${id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'location_updates',
        filter: `tracking_id=eq.${id}`,
      }, (payload) => {
        const loc = payload.new as LocationUpdate;
        setLocations(prev => [...prev, loc]);
        setLastUpdate(loc.created_at);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  // ─── Build visualization layers ───
  const buildVisualization = useCallback((locs: LocationUpdate[]) => {
    if (!map.current) return;
    const m = map.current;

    // Clean old markers
    markersRef.current.forEach(mk => mk.remove());
    markersRef.current = [];

    if (locs.length === 0) return;

    // Speed-colored line segments
    if (locs.length > 1) {
      const segments: GeoJSON.Feature[] = [];
      for (let i = 1; i < locs.length; i++) {
        const speed = calculateSpeed(locs[i - 1], locs[i]);
        segments.push({
          type: 'Feature',
          properties: { color: speedColor(speed) },
          geometry: {
            type: 'LineString',
            coordinates: [
              [locs[i - 1].longitude, locs[i - 1].latitude],
              [locs[i].longitude, locs[i].latitude],
            ],
          },
        });
      }

      const routeData: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: segments };

      if (m.getSource('route-segments')) {
        (m.getSource('route-segments') as mapboxgl.GeoJSONSource).setData(routeData);
      } else {
        m.addSource('route-segments', { type: 'geojson', data: routeData });
        m.addLayer({
          id: 'route-segments',
          type: 'line',
          source: 'route-segments',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': ['get', 'color'],
            'line-width': 4,
            'line-opacity': 0.85,
          },
        });

        // Animated dashed overlay (marching ants)
        m.addLayer({
          id: 'route-ants',
          type: 'line',
          source: 'route-segments',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': 'rgba(255,255,255,0.6)',
            'line-width': 2,
            'line-dasharray': [0, 4, 3],
          },
        });
      }

      // Waypoint dots
      const waypointData: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: locs.map((loc, i) => ({
          type: 'Feature' as const,
          properties: {
            index: i,
            timestamp: loc.created_at,
            speed: i > 0 ? calculateSpeed(locs[i - 1], loc).toFixed(1) : '0',
            lat: loc.latitude.toFixed(5),
            lng: loc.longitude.toFixed(5),
          },
          geometry: { type: 'Point' as const, coordinates: [loc.longitude, loc.latitude] },
        })),
      };

      if (m.getSource('waypoints')) {
        (m.getSource('waypoints') as mapboxgl.GeoJSONSource).setData(waypointData);
      } else {
        m.addSource('waypoints', { type: 'geojson', data: waypointData });
        m.addLayer({
          id: 'waypoints',
          type: 'circle',
          source: 'waypoints',
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 2, 14, 5],
            'circle-color': 'hsl(205, 95%, 52%)',
            'circle-stroke-width': 1.5,
            'circle-stroke-color': 'white',
            'circle-opacity': 0.7,
          },
        });

        // Hover tooltips
        m.on('mouseenter', 'waypoints', (e) => {
          m.getCanvas().style.cursor = 'pointer';
          if (e.features?.[0]) {
            const p = e.features[0].properties!;
            const coords = (e.features[0].geometry as GeoJSON.Point).coordinates.slice() as [number, number];
            popupRef.current?.remove();
            popupRef.current = new mapboxgl.Popup({ closeButton: false, className: 'map-tooltip', offset: 12 })
              .setLngLat(coords)
              .setHTML(`
                <div style="font-size:11px;line-height:1.4;padding:4px 0">
                  <div style="font-weight:600">${new Date(p.timestamp).toLocaleTimeString()}</div>
                  <div style="opacity:0.7">Speed: ${p.speed} km/h</div>
                  <div style="opacity:0.7;font-family:monospace;font-size:10px">${p.lat}, ${p.lng}</div>
                </div>
              `)
              .addTo(m);
          }
        });
        m.on('mouseleave', 'waypoints', () => {
          m.getCanvas().style.cursor = '';
          popupRef.current?.remove();
        });
      }
    }

    // Heatmap layer
    if (locs.length > 1) {
      const heatData: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: locs.map(loc => ({
          type: 'Feature' as const,
          properties: {},
          geometry: { type: 'Point' as const, coordinates: [loc.longitude, loc.latitude] },
        })),
      };

      if (m.getSource('heatmap-data')) {
        (m.getSource('heatmap-data') as mapboxgl.GeoJSONSource).setData(heatData);
      } else {
        m.addSource('heatmap-data', { type: 'geojson', data: heatData });
        m.addLayer({
          id: 'heatmap-layer',
          type: 'heatmap',
          source: 'heatmap-data',
          paint: {
            'heatmap-weight': 1,
            'heatmap-intensity': 1,
            'heatmap-radius': 20,
            'heatmap-opacity': 0,
            'heatmap-color': [
              'interpolate', ['linear'], ['heatmap-density'],
              0, 'rgba(0,0,0,0)',
              0.2, 'rgba(0,255,0,0.3)',
              0.5, 'rgba(255,255,0,0.5)',
              0.8, 'rgba(255,128,0,0.7)',
              1, 'rgba(255,0,0,0.8)',
            ],
          },
        });
      }
    }

    // Start marker (green)
    const startEl = document.createElement('div');
    startEl.style.cssText = 'width:16px;height:16px;border-radius:50%;background:#22c55e;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);';
    const startMarker = new mapboxgl.Marker(startEl).setLngLat([locs[0].longitude, locs[0].latitude]).addTo(m);
    markersRef.current.push(startMarker);

    // End marker (pulsing blue)
    const last = locs[locs.length - 1];
    const endEl = document.createElement('div');
    endEl.innerHTML = `
      <div style="position:relative;width:32px;height:32px;">
        <div style="position:absolute;inset:0;border-radius:50%;background:hsl(205,95%,52%);opacity:0.3;animation:pulse 2s infinite;"></div>
        <div style="position:absolute;inset:4px;border-radius:50%;background:hsl(205,95%,52%);border:3px solid white;box-shadow:0 2px 12px rgba(0,0,0,0.3);"></div>
      </div>
    `;
    const endMarker = new mapboxgl.Marker(endEl).setLngLat([last.longitude, last.latitude]).addTo(m);
    markersRef.current.push(endMarker);
  }, []);

  // ─── Terrain toggle ───
  const toggleTerrain = useCallback((enabled: boolean) => {
    setTerrainEnabled(enabled);
    if (!map.current) return;
    const m = map.current;
    if (enabled) {
      if (!m.getSource('mapbox-dem')) {
        m.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14,
        });
      }
      m.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
      // Sky layer
      if (!m.getLayer('sky')) {
        m.addLayer({
          id: 'sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0, 0],
            'sky-atmosphere-sun-intensity': 15,
          },
        });
      }
      m.easeTo({ pitch: 60, duration: 1000 });
    } else {
      m.setTerrain(null);
      if (m.getLayer('sky')) m.removeLayer('sky');
      m.easeTo({ pitch: 0, duration: 1000 });
    }
  }, []);

  // ─── Heatmap toggle ───
  const toggleHeatmap = useCallback((enabled: boolean) => {
    setHeatmapEnabled(enabled);
    if (!map.current) return;
    if (map.current.getLayer('heatmap-layer')) {
      map.current.setPaintProperty('heatmap-layer', 'heatmap-opacity', enabled ? 0.7 : 0);
    }
  }, []);

  // ─── Map init ───
  useEffect(() => {
    const initMap = async () => {
      if (!mapContainer.current) return;
      try {
        const { data, error: funcError } = await supabase.functions.invoke('get-mapbox-token');
        if (funcError || !data?.token) throw new Error('Failed to fetch Mapbox token');

        mapboxgl.accessToken = data.token;
        setMapboxToken(data.token);

        const locs = locationsRef.current;
        const latest = locs.length > 0 ? locs[locs.length - 1] : null;
        const center: [number, number] = latest ? [latest.longitude, latest.latitude] : [-74.5, 40];
        const styleUrl = MAP_STYLES.find(s => s.id === mapStyle)?.url || MAP_STYLES[4].url;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: styleUrl,
          center,
          zoom: latest ? 15 : 3,
          pitch: 45,
        });

        const m = map.current;

        // Controls
        m.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
        m.addControl(new mapboxgl.ScaleControl({ maxWidth: isMobile ? 80 : 120, unit: 'metric' }), 'bottom-left');
        m.addControl(new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
          showUserHeading: true,
        }), 'bottom-right');

        m.on('load', () => {
          setLoading(false);
          buildVisualization(locationsRef.current);
        });

        m.on('style.load', () => {
          buildVisualization(locationsRef.current);
          if (terrainEnabled) toggleTerrain(true);
          if (heatmapEnabled) toggleHeatmap(true);
        });

        // Context menu (right-click)
        m.on('contextmenu', (e) => {
          e.preventDefault();
          const point = m.project(e.lngLat);
          setContextMenu({
            visible: true,
            x: Math.min(point.x + mapContainer.current!.getBoundingClientRect().left, window.innerWidth - 200),
            y: Math.min(point.y + mapContainer.current!.getBoundingClientRect().top, window.innerHeight - 160),
            lngLat: e.lngLat,
          });
        });

        // Animate marching ants
        let dashOffset = 0;
        const animateAnts = () => {
          dashOffset = (dashOffset + 1) % 7;
          if (m.getLayer('route-ants')) {
            m.setPaintProperty('route-ants', 'line-dasharray', [dashOffset, 4, 3]);
          }
          requestAnimationFrame(animateAnts);
        };
        animateAnts();

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load map');
        setLoading(false);
      }
    };

    initMap();
    return () => {
      markersRef.current.forEach(mk => mk.remove());
      measureMarkersRef.current.forEach(mp => mp.marker.remove());
      searchMarkerRef.current?.remove();
      popupRef.current?.remove();
      map.current?.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Style change ───
  const handleStyleChange = useCallback((styleId: MapStyleId) => {
    setMapStyle(styleId);
    const url = MAP_STYLES.find(s => s.id === styleId)?.url;
    if (map.current && url) map.current.setStyle(url);
  }, []);

  // ─── Update on new locations ───
  useEffect(() => {
    if (!map.current || locations.length === 0 || loading) return;
    buildVisualization(locations);
    const last = locations[locations.length - 1];
    map.current.flyTo({ center: [last.longitude, last.latitude], zoom: 15, duration: 1000 });
  }, [locations, loading, buildVisualization]);

  // ─── Timeline playback ───
  const handleTimelineChange = useCallback((index: number) => {
    if (!map.current || locations.length === 0) return;
    const loc = locations[index];
    // Move end marker to timeline position
    if (markersRef.current.length >= 2) {
      markersRef.current[markersRef.current.length - 1].setLngLat([loc.longitude, loc.latitude]);
    }
    map.current.easeTo({ center: [loc.longitude, loc.latitude], duration: 300 });
  }, [locations]);

  // ─── Actions ───
  const centerOnLatest = () => {
    if (!map.current || locations.length === 0) return;
    const l = locations[locations.length - 1];
    map.current.flyTo({ center: [l.longitude, l.latitude], zoom: 15, duration: 1000 });
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await mapContainer.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const resetNorth = () => {
    map.current?.easeTo({ bearing: 0, pitch: 0, duration: 600 });
  };

  const handleSearchSelect = (lng: number, lat: number, name: string) => {
    searchMarkerRef.current?.remove();
    if (!map.current) return;
    const el = document.createElement('div');
    el.style.cssText = 'width:20px;height:20px;border-radius:50%;background:hsl(0,84%,60%);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;';
    searchMarkerRef.current = new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup({ offset: 12 }).setText(name))
      .addTo(map.current);
    map.current.flyTo({ center: [lng, lat], zoom: 14, duration: 1200 });
  };

  const handleMeasure = () => {
    setMeasuring(true);
    if (!map.current) return;
    const m = map.current;
    m.getCanvas().style.cursor = 'crosshair';

    const clickHandler = (e: mapboxgl.MapMouseEvent) => {
      const lngLat: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      const el = document.createElement('div');
      el.style.cssText = 'width:12px;height:12px;border-radius:50%;background:hsl(0,84%,60%);border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);';
      const mk = new mapboxgl.Marker(el).setLngLat(lngLat).addTo(m);
      const pts = measureMarkersRef.current;
      pts.push({ lngLat, marker: mk });

      if (pts.length >= 2) {
        const p1 = pts[pts.length - 2].lngLat;
        const p2 = pts[pts.length - 1].lngLat;
        const dist = haversineDistance(p1[1], p1[0], p2[1], p2[0]);

        // Draw line
        const lineId = `measure-${pts.length}`;
        m.addSource(lineId, {
          type: 'geojson',
          data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [p1, p2] } },
        });
        m.addLayer({
          id: lineId,
          type: 'line',
          source: lineId,
          paint: { 'line-color': '#ef4444', 'line-width': 2, 'line-dasharray': [4, 2] },
        });

        // Distance label
        const midLng = (p1[0] + p2[0]) / 2;
        const midLat = (p1[1] + p2[1]) / 2;
        new mapboxgl.Popup({ closeButton: true, className: 'measure-popup' })
          .setLngLat([midLng, midLat])
          .setText(formatDistance(dist))
          .addTo(m);
      }
    };

    const dblClickHandler = () => {
      m.off('click', clickHandler);
      m.off('dblclick', dblClickHandler);
      m.getCanvas().style.cursor = '';
      setMeasuring(false);
    };

    m.on('click', clickHandler);
    m.on('dblclick', dblClickHandler);
  };

  const handleDropPin = () => {
    if (!map.current || !contextMenu.lngLat) return;
    const { lng, lat } = contextMenu.lngLat;
    const el = document.createElement('div');
    el.style.cssText = 'width:16px;height:16px;border-radius:50%;background:hsl(280,80%,60%);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;';
    new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup({ offset: 12 }).setText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`))
      .addTo(map.current);
  };

  return (
    <>
      <SEO
        title={`Live Map - Tracking ${id} | MᴀᴘMᴇ.Lɪᴠᴇ`}
        description={`View real-time GPS location tracking on an interactive map for tracker ${id}. Live updates, movement history, and speed data.`}
        canonical={`https://mapme.live/map/${id}`}
        noindex
        canonical={`https://mapme.live/map/${id}`}
      />
      <Layout showMobileNav={false}>
        <main className={`flex-1 ${isMobile ? '' : 'container mx-auto px-2 sm:px-4 py-2 sm:py-4'}`}>
          <div className={`flex flex-col lg:flex-row gap-2 sm:gap-4 ${
            isMobile
              ? 'h-[100dvh] fixed inset-0 top-[57px]'
              : 'h-[calc(100vh-8rem)] lg:h-[calc(100vh-10rem)]'
          }`}>
            {/* Map Container */}
            <div className={`flex-1 relative ${isMobile ? '' : 'rounded-xl'} overflow-hidden shadow-elevated min-h-[250px]`}>
              {/* Loading */}
              {loading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                  <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Loading map...</p>
                  </div>
                </div>
              )}

              {/* Error */}
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

              {/* ─── Map Overlays ─── */}
              {!loading && !error && (
                <>
                  {/* Top-left: Style Switcher + Search */}
                  <div className={`absolute top-3 left-3 z-20 flex flex-col gap-2 ${isMobile ? '' : ''}`}>
                    <MapStyleSwitcher activeStyle={mapStyle} onStyleChange={handleStyleChange} isMobile={isMobile} />
                    <MapSearch mapboxToken={mapboxToken} onSelect={handleSearchSelect} isMobile={isMobile} />
                  </div>

                  {/* Bottom controls */}
                  <div className={`absolute z-20 flex gap-2 ${
                    isMobile ? 'bottom-24 right-3' : 'bottom-4 left-4'
                  }`}>
                    {locations.length > 0 && (
                      <Button
                        size="icon"
                        onClick={centerOnLatest}
                        className="shadow-elevated rounded-full bg-card/90 backdrop-blur-md border border-border/50 text-foreground hover:bg-card h-10 w-10"
                        aria-label="Center on latest location"
                      >
                        <Crosshair className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      onClick={resetNorth}
                      className="shadow-elevated rounded-full bg-card/90 backdrop-blur-md border border-border/50 text-foreground hover:bg-card h-10 w-10"
                      aria-label="Reset north"
                    >
                      <Compass className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={toggleFullscreen}
                      className="shadow-elevated rounded-full bg-card/90 backdrop-blur-md border border-border/50 text-foreground hover:bg-card h-10 w-10"
                      aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                    >
                      {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </Button>
                    {terrainEnabled && (
                      <Button
                        size="icon"
                        onClick={() => toggleTerrain(false)}
                        className="shadow-elevated rounded-full bg-primary text-primary-foreground h-10 w-10"
                        aria-label="Disable 3D terrain"
                      >
                        <Mountain className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Measuring indicator */}
                  {measuring && (
                    <div className="absolute top-3 right-3 z-20 px-3 py-1.5 bg-destructive text-destructive-foreground text-xs rounded-full font-medium shadow-elevated animate-pulse">
                      Measuring... double-click to finish
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Desktop Info Panel */}
            {!isMobile && (
              <MapInfoPanel
                id={id || ''}
                locations={locations}
                lastUpdate={lastUpdate}
                terrainEnabled={terrainEnabled}
                heatmapEnabled={heatmapEnabled}
                onTerrainToggle={toggleTerrain}
                onHeatmapToggle={toggleHeatmap}
                onTimelineChange={handleTimelineChange}
              />
            )}
          </div>

          {/* Mobile bottom sheet */}
          {isMobile && !loading && !error && (
            <MobileMapSheet
              id={id || ''}
              locations={locations}
              lastUpdate={lastUpdate}
              terrainEnabled={terrainEnabled}
              heatmapEnabled={heatmapEnabled}
              onTerrainToggle={toggleTerrain}
              onHeatmapToggle={toggleHeatmap}
              onTimelineChange={handleTimelineChange}
            />
          )}
        </main>
      </Layout>

      {/* Context Menu */}
      <MapContextMenu
        state={contextMenu}
        onClose={() => setContextMenu(prev => ({ ...prev, visible: false }))}
        onMeasure={handleMeasure}
        onDropPin={handleDropPin}
      />
    </>
  );
};

export default MapView;

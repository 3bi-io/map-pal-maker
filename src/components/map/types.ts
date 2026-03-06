export interface LocationUpdate {
  id: string;
  tracking_id: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  created_at: string;
}

export interface MapContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  lngLat: { lng: number; lat: number } | null;
}

export interface MeasurePoint {
  lngLat: [number, number];
  marker: mapboxgl.Marker;
}

import type { LocationUpdate } from '@/components/map/types';

/**
 * Haversine distance between two lat/lng points in meters
 */
export function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Speed between two location points in km/h
 */
export function calculateSpeed(loc1: LocationUpdate, loc2: LocationUpdate): number {
  const dist = haversineDistance(loc1.latitude, loc1.longitude, loc2.latitude, loc2.longitude);
  const timeDiff = (new Date(loc2.created_at).getTime() - new Date(loc1.created_at).getTime()) / 1000;
  if (timeDiff <= 0) return 0;
  return (dist / timeDiff) * 3.6; // m/s -> km/h
}

/**
 * Total distance across all location points in meters
 */
export function totalDistance(locations: LocationUpdate[]): number {
  let total = 0;
  for (let i = 1; i < locations.length; i++) {
    total += haversineDistance(
      locations[i - 1].latitude, locations[i - 1].longitude,
      locations[i].latitude, locations[i].longitude
    );
  }
  return total;
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

/**
 * Format speed for display
 */
export function formatSpeed(kmh: number): string {
  return `${kmh.toFixed(1)} km/h`;
}

/**
 * Get color for speed value (green=slow, yellow=med, red=fast)
 */
export function speedColor(speed: number): string {
  if (speed < 5) return '#22c55e';   // green
  if (speed < 20) return '#eab308';  // yellow
  if (speed < 50) return '#f97316';  // orange
  return '#ef4444';                   // red
}

/**
 * Calculate all speeds between consecutive points
 */
export function calculateSpeeds(locations: LocationUpdate[]): number[] {
  const speeds: number[] = [0];
  for (let i = 1; i < locations.length; i++) {
    speeds.push(calculateSpeed(locations[i - 1], locations[i]));
  }
  return speeds;
}

/**
 * Total elapsed time in seconds
 */
export function elapsedTime(locations: LocationUpdate[]): number {
  if (locations.length < 2) return 0;
  return (
    new Date(locations[locations.length - 1].created_at).getTime() -
    new Date(locations[0].created_at).getTime()
  ) / 1000;
}

/**
 * Format seconds to human-readable duration
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

/**
 * Relative time ago string
 */
export function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export const MAP_STYLES = [
  { id: 'streets-v12', label: 'Streets', icon: '🗺️', url: 'mapbox://styles/mapbox/streets-v12' },
  { id: 'satellite-v9', label: 'Satellite', icon: '🛰️', url: 'mapbox://styles/mapbox/satellite-v9' },
  { id: 'satellite-streets-v12', label: 'Sat Streets', icon: '🌍', url: 'mapbox://styles/mapbox/satellite-streets-v12' },
  { id: 'outdoors-v12', label: 'Outdoors', icon: '⛰️', url: 'mapbox://styles/mapbox/outdoors-v12' },
  { id: 'dark-v11', label: 'Dark', icon: '🌙', url: 'mapbox://styles/mapbox/dark-v11' },
  { id: 'light-v11', label: 'Light', icon: '☀️', url: 'mapbox://styles/mapbox/light-v11' },
] as const;

export type MapStyleId = typeof MAP_STYLES[number]['id'];

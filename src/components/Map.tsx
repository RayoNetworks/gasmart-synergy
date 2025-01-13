import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    coordinates: [number, number];
    title: string;
  }>;
  drawGeofence?: boolean;
}

const Map = ({ center = [0, 0], zoom = 2, markers = [], drawGeofence = false }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState(localStorage.getItem('mapbox-token') || '');
  const { toast } = useToast();

  const initializeMap = () => {
    if (!mapContainer.current || !token) return;

    try {
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add markers if provided
      markers.forEach(marker => {
        new mapboxgl.Marker()
          .setLngLat(marker.coordinates)
          .setPopup(new mapboxgl.Popup().setHTML(marker.title))
          .addTo(map.current!);
      });

      toast({
        title: "Map initialized successfully",
        description: "The map is now ready to use",
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        variant: "destructive",
        title: "Error initializing map",
        description: "Please check your Mapbox token",
      });
    }
  };

  useEffect(() => {
    if (token) {
      initializeMap();
    }
    
    return () => {
      map.current?.remove();
    };
  }, [token]);

  const handleTokenSubmit = () => {
    localStorage.setItem('mapbox-token', token);
    initializeMap();
  };

  if (!token) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Enter your Mapbox public token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Button onClick={handleTokenSubmit}>Set Token</Button>
        </div>
        <p className="text-sm text-muted-foreground">
          To get your Mapbox public token, visit mapbox.com and find it in the Tokens section of your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className="w-full h-[600px] rounded-lg shadow-lg" />
  );
};

export default Map;
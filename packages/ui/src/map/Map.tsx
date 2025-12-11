'use client';

import dynamic from 'next/dynamic';
import React, { ReactNode, useEffect, useState, useRef, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });

interface MapProps {
  center?: [number, number];
  zoom?: number;
  bounds?: [[number, number], [number, number]];
  children?: ReactNode;
  onMapInstanceReady?: (mapInstance: any) => void;
}

const Map: React.FC<MapProps> = ({ center, zoom, bounds, children, onMapInstanceReady }) => {
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    setIsClient(true);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      mapRef.current = null;
    };
  }, []);

  const handleMapCreated = useCallback((mapInstance: any) => {
    if (mapInstance && !mapRef.current) {
      mapRef.current = mapInstance;
      onMapInstanceReady?.(mapInstance);

      const container = mapInstance.getContainer();
      if (container && container.parentElement) {
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }

        resizeObserverRef.current = new ResizeObserver(() => {
          if (container.parentElement) {
            mapInstance.invalidateSize();
            setTimeout(() => {
              if (bounds && container.parentElement) {
                mapInstance.fitBounds(bounds, { padding: [0, 0], animate: true, duration: 0.5 });
              }
            }, 50);
          }
        });
        resizeObserverRef.current.observe(container);
      }
    }
  }, [bounds, onMapInstanceReady]);

  if (!isClient) return null;

  return (
    <MapContainer
      center={bounds ? undefined : center || [32.8300, -96.7900]}
      zoom={bounds ? undefined : zoom || 12}
      bounds={bounds}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={true}
      ref={(mapInstance: any) => handleMapCreated(mapInstance)}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
};

export default Map;

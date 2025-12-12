'use client';

import dynamic from 'next/dynamic';
import React, { ReactNode, useEffect, useState, useRef, useCallback } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Loader from '../common/loader';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });

interface MapProps {
  center?: [number, number];
  zoom?: number;
  bounds?: [[number, number], [number, number]];
  children?: ReactNode;
  onMapInstanceReady?: (mapInstance: LeafletMap) => void;
}

const Map: React.FC<MapProps> = ({ center, zoom, bounds, children, onMapInstanceReady }) => {
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<LeafletMap | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

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

  const handleMapCreated = useCallback((mapOrEvent: any) => {
    if (!mapOrEvent || mapRef.current) return;

    // react-leaflet may call whenReady with an event; extract the map instance
    const mapInstance = (mapOrEvent && mapOrEvent.target) ? mapOrEvent.target : mapOrEvent;
    if (!mapInstance) return;

    // Ensure we store the actual Leaflet map instance
    mapRef.current = mapInstance as LeafletMap;
    onMapInstanceReady?.(mapInstance as LeafletMap);

    // Try to get the Leaflet container DOM node from the wrapper instead
    const container = wrapperRef.current?.querySelector('.leaflet-container') as HTMLElement | null;
    if (!container || !container.parentElement) return;

    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }

    let fitBoundsTimer: number | null = null;
    const debouncedFitBounds = () => {
      if (fitBoundsTimer) window.clearTimeout(fitBoundsTimer);
      fitBoundsTimer = window.setTimeout(() => {
        if (bounds && mapRef.current && typeof (mapRef.current as any).fitBounds === 'function') {
          try {
            (mapRef.current as any).fitBounds(bounds, { padding: [0, 0], animate: true, duration: 0.5 });
          } catch (e) {
            // ignore
          }
        }
        fitBoundsTimer = null;
      }, 150);
    };

    resizeObserverRef.current = new ResizeObserver(() => {
      if (mapRef.current) {
        try { (mapRef.current as any).invalidateSize(); } catch (e) { /* ignore */ }
      }
      debouncedFitBounds();
    });

    resizeObserverRef.current.observe(container);
  }, [bounds, onMapInstanceReady]);

  if (!isClient) return null;

  return (
    <div ref={wrapperRef} className="relative w-full h-full">
      {!isMapLoaded && <Loader />}
      <MapContainer
        center={bounds ? undefined : center || [32.8300, -96.7900]}
        zoom={bounds ? undefined : zoom || 12}
        bounds={bounds}
        style={{ width: '100%', height: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
        whenReady={handleMapCreated as unknown as () => void}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{
            load: () => { setIsMapLoaded(true); },
          }}
        />
        {children}
      </MapContainer>
    </div>
  );
};

export default Map;

'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState, useMemo } from 'react';
import type { Icon } from 'leaflet';
import PopupContent from './PopupContent';

const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface POICoordinate {
  lat: number;
  lng: number;
}

interface POIProps {
  coordinates: POICoordinate;
  title?: string;
  description?: string;
  iconUrl?: string;
  eventType?: string;
  expectedEndTime?: string;
  affectedDirection?: string;
  details?: string[];
  fullDescription?: string;
}

// Map event types to icon files
const getIconForEventType = (eventType?: string): string => {
  const typeMap: Record<string, string> = {
    'Construction': '/icons/Construction.webp',
    'Accident': '/icons/Accident.webp',
    'Closure': '/icons/Closure.webp',
    'Damage': '/icons/Damage.webp',
    'Low Bridge': '/icons/Low-Bridge.webp',
    'Hero Unit': '/icons/Hero-Units.webp',
    'Emergency Services': '/icons/First-Responder.webp',
  };

  return typeMap[eventType || ''] || '/icons/Accident.webp';
};

// Module-level icon cache to avoid repeated leaflet imports and icon creation
const iconCache = new Map<string, Icon>();
let leafletModule: typeof import('leaflet') | null = null;

const getOrCreateIcon = async (iconUrl: string): Promise<Icon> => {
  const cached = iconCache.get(iconUrl);
  if (cached) return cached;

  if (!leafletModule) {
    leafletModule = await import('leaflet');
  }
  const L = leafletModule as any;
  const icon = L.icon({
    iconUrl,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
  iconCache.set(iconUrl, icon);
  return icon;
};

const POI: React.FC<POIProps> = ({
  coordinates,
  title,
  description,
  iconUrl,
  eventType,
  expectedEndTime,
  affectedDirection,
  details,
  fullDescription,
}) => {
  const [customIcon, setCustomIcon] = useState<Icon | null>(null);

  const resolvedIconUrl = useMemo(
    () => iconUrl || getIconForEventType(eventType),
    [iconUrl, eventType]
  );

  useEffect(() => {
    let cancelled = false;
    getOrCreateIcon(resolvedIconUrl).then((icon) => {
      if (cancelled) return;
      // Avoid setting state if the icon is identical to current to prevent unnecessary re-renders
      setCustomIcon((prev) => (prev === icon ? prev : icon));
    });
    return () => { cancelled = true; };
  }, [resolvedIconUrl]);

  if (!customIcon) return null;

  return (
    <Marker position={[coordinates.lat, coordinates.lng]} icon={customIcon}>
      <Popup
        // leave space at top for UI controls (px)
        autoPanPaddingTopLeft={[0, 80] as any}
        // small overall padding fallback
        autoPanPadding={[12, 12] as any}
        className="leaflet-popup-theme"
      >
        <PopupContent
          title={title || eventType}
          expectedEndTime={expectedEndTime}
          affectedDirection={affectedDirection}
          details={details}
          description={fullDescription || description}
        />
      </Popup>
    </Marker>
  );
};

export default POI;

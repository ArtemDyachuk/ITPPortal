'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import type { Icon } from 'leaflet';
import styles from './POI.module.css';

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

// Create custom marker icons with image URLs
const createCustomIcon = async (iconUrl: string): Promise<Icon> => {
  const leaflet = await import('leaflet');
  const L = leaflet.default || leaflet;
  return L.icon({
    iconUrl,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
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

  useEffect(() => {
    const loadIcon = async () => {
      const resolvedIconUrl = iconUrl || getIconForEventType(eventType);
      const icon = await createCustomIcon(resolvedIconUrl);
      setCustomIcon(icon);
    };
    loadIcon();
  }, [iconUrl, eventType]);

  if (!customIcon) return null;

  const popupContent = (
    <div style={{ maxWidth: '320px', minWidth: '250px', fontFamily: 'Arial, sans-serif' }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{title || eventType}</h3>
      {expectedEndTime && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>Expected to end on</div>
          <div style={{ background: '#e3f2fd', color: '#1976d2', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', fontSize: '14px' }}>
            {expectedEndTime}
          </div>
        </div>
      )}
      {affectedDirection && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>Affected Direction</div>
          <div style={{ background: '#fff3e0', color: '#f57c00', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', fontSize: '14px' }}>
            {affectedDirection}
          </div>
        </div>
      )}
      {details && details.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          {details.map((detail, index) => (
            <div key={index} style={{ marginBottom: '4px' }}>• {detail}</div>
          ))}
        </div>
      )}
      {fullDescription && (
        <div style={{ marginTop: '10px', color: '#555' }}>{fullDescription}</div>
      )}
      {description && !fullDescription && (
        <div style={{ marginTop: '10px', color: '#555' }}>{description}</div>
      )}
    </div>
  );

  return (
    <Marker position={[coordinates.lat, coordinates.lng]} icon={customIcon}>
      <Popup>{popupContent}</Popup>
    </Marker>
  );
};

export default POI;

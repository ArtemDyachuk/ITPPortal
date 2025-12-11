'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface PolylineCoordinate {
  lat: number;
  lng: number;
}

interface OSMPolylineProps {
  path: PolylineCoordinate[];
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWeight?: number;
  title?: string;
  expectedEndTime?: string;
  affectedDirection?: string;
  details?: string[];
  fullDescription?: string;
}

const OSMPolyline: React.FC<OSMPolylineProps> = ({
  path,
  strokeColor,
  strokeOpacity = 0.9,
  strokeWeight = 8,
  title,
  expectedEndTime,
  affectedDirection,
  details,
  fullDescription,
}) => {
  // Convert Google Maps format [lat, lng] to Leaflet format
  const leafletPath = path.map((point) => [point.lat, point.lng] as [number, number]);

  const color = strokeColor || '#FF0000';
  const pathOptions = {
    color,
    weight: strokeWeight,
    opacity: strokeOpacity,
  };

  const popupContent = (
    <div style={{ maxWidth: '320px', minWidth: '250px', fontFamily: 'Arial, sans-serif' }}>
      {title && <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{title}</h3>}
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
    </div>
  );

  return (
    <Polyline positions={leafletPath} pathOptions={pathOptions}>
      <Popup>{popupContent}</Popup>
    </Polyline>
  );
};

export default OSMPolyline;

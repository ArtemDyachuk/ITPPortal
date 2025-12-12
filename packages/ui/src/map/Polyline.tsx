'use client';

import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
import PopupContent from './PopupContent';

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
  // Memoize path conversion to avoid recomputing on every render
  const leafletPath = useMemo(
    () => path.map((point) => [point.lat, point.lng] as [number, number]),
    [path]
  );

  const pathOptions = useMemo(
    () => ({
      color: strokeColor || '#FF0000',
      weight: strokeWeight,
      opacity: strokeOpacity,
    }),
    [strokeColor, strokeWeight, strokeOpacity]
  );

  return (
    <Polyline positions={leafletPath} pathOptions={pathOptions}>
      <Popup autoPanPaddingTopLeft={[0, 80] as any} autoPanPadding={[12, 12] as any} className="leaflet-popup-theme">
        <PopupContent
          title={title}
          expectedEndTime={expectedEndTime}
          affectedDirection={affectedDirection}
          details={details}
          description={fullDescription}
        />
      </Popup>
    </Polyline>
  );
};

export default OSMPolyline;

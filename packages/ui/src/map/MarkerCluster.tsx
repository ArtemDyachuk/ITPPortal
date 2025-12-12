'use client';

import dynamic from 'next/dynamic';
import React, { ReactNode } from 'react';
import './MarkerCluster.css';

// Dynamically import MarkerClusterGroup to avoid SSR issues
const MarkerClusterGroup = dynamic(
  () => import('react-leaflet-cluster'),
  { ssr: false }
);

interface MarkerClusterProps {
  children: ReactNode;
  maxClusterRadius?: number;
  disableClusteringAtZoom?: number;
}

const MarkerCluster: React.FC<MarkerClusterProps> = ({
  children,
  maxClusterRadius = 40, // Less aggressive - only cluster when very close
  disableClusteringAtZoom = 15, // Show individual markers at zoom 15+
}) => {
  return (
    <MarkerClusterGroup
      maxClusterRadius={maxClusterRadius}
      spiderfyOnMaxZoom={false}
      showCoverageOnHover={false}
      zoomToBoundsOnClick={true}
      removeOutsideVisibleBounds={true}
      animate={false}
      disableClusteringAtZoom={disableClusteringAtZoom}
      chunkedLoading={true}
    >
      {children}
    </MarkerClusterGroup>
  );
};

export default MarkerCluster;
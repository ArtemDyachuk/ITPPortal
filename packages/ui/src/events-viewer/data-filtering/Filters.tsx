'use client';

import React, { useState, useEffect } from 'react';
import DesktopFilters from './filters/DesktopFilters';
import MobileFilters from './filters/MobileFilters';
import MapOverlayButton from './components/modals/MapOverlayButton';

interface FiltersProps {
  enabledServices?: Record<string, boolean>;
  onServiceChange?: (services: Record<string, boolean>) => void;
  statusFilters?: Record<string, boolean>;
  onStatusFilterChange?: (filters: Record<string, boolean>) => void;
  sourceFilters?: Record<string, boolean>;
  onSourceFilterChange?: (filters: Record<string, boolean>) => void;
}

export type { FiltersProps };

const Filters = (props: FiltersProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Use matchMedia for more efficient and accurate viewport matching
    const mq = window.matchMedia('(max-width: 767.98px)');
    const onChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(typeof event.matches === 'boolean' ? event.matches : mq.matches);
    };

    setIsMobile(mq.matches);

    // Use modern API only (keep it lean; drop deprecated addListener fallback)
    mq.addEventListener('change', onChange as EventListener);
    return () => mq.removeEventListener('change', onChange as EventListener);
  }, []);

  if (isMobile) {
    return (
      <>
        <MapOverlayButton title="Filters" onClick={() => setIsModalOpen(true)} position="top-right-inline" />
        <MobileFilters
          {...props}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  return <DesktopFilters {...props} />;
};

export default React.memo(Filters);

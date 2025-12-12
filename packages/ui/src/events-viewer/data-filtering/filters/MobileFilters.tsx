'use client';

import { useState } from 'react';
import Modal from '../../../common/modal';
import ServicesFilter from '../components/filters/ServicesFilter';
import StatusFilter from '../components/filters/StatusFilter';
import { useFiltersState } from '../hooks/useFiltersState';

interface MobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  enabledServices?: Record<string, boolean>;
  onServiceChange?: (services: Record<string, boolean>) => void;
  statusFilters?: Record<string, boolean>;
  onStatusFilterChange?: (filters: Record<string, boolean>) => void;
}

export default function MobileFilters({
  isOpen,
  onClose,
  enabledServices: initialEnabledServices,
  onServiceChange,
  statusFilters: initialStatusFilters,
  onStatusFilterChange
}: MobileFiltersProps) {
  const [servicesExpanded, setServicesExpanded] = useState(true);
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  const { services, enabledServices, handleServiceChange, filters, handleFilterChange } = useFiltersState(
    initialEnabledServices,
    onServiceChange,
    initialStatusFilters,
    onStatusFilterChange
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filters">
      <div className="w-[300px] max-h-[80vh] overflow-y-auto">
        <ServicesFilter
          services={services}
          values={enabledServices}
          onChange={handleServiceChange}
          expanded={servicesExpanded}
          onToggleExpanded={() => setServicesExpanded((s) => !s)}
          showToggle={false}
        />

        <StatusFilter
          filters={filters}
          onChange={handleFilterChange}
          expanded={filtersExpanded}
          onToggleExpanded={() => setFiltersExpanded((s) => !s)}
          showToggle={false}
        />
      </div>
    </Modal>
  );
}

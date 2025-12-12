'use client';

import { useEffect, useMemo, useState } from 'react';
import dataSourcesData from '@repo/ui/data/dataSources.json';
import ServicesFilter from '../components/filters/ServicesFilter';
import StatusFilter from '../components/filters/StatusFilter';
import SourcesFilter from '../components/filters/SourcesFilter';
import { useFiltersState } from '../hooks/useFiltersState';

interface DataSource {
  id: string;
  name: string;
  category: string;
}

interface DesktopFiltersProps {
  enabledServices?: Record<string, boolean>;
  onServiceChange?: (services: Record<string, boolean>) => void;
  statusFilters?: Record<string, boolean>;
  onStatusFilterChange?: (filters: Record<string, boolean>) => void;
  sourceFilters?: Record<string, boolean>;
  onSourceFilterChange?: (filters: Record<string, boolean>) => void;
}

export type { DesktopFiltersProps };

export default function DesktopFilters({ 
  enabledServices: initialEnabledServices, 
  onServiceChange, 
  statusFilters: initialStatusFilters, 
  onStatusFilterChange, 
  sourceFilters: initialSourceFilters, 
  onSourceFilterChange 
}: DesktopFiltersProps) {
  const [servicesExpanded, setServicesExpanded] = useState(true);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [sourcesExpanded, setSourcesExpanded] = useState(true);

  const { services, enabledServices, handleServiceChange, filters, handleFilterChange } = useFiltersState(
    initialEnabledServices,
    onServiceChange,
    initialStatusFilters,
    onStatusFilterChange
  );

  const dataSources = useMemo(
    () => [...(dataSourcesData as DataSource[])].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  const [sourceFilters, setSourceFilters] = useState<Record<string, boolean>>(
    initialSourceFilters ||
      dataSources.reduce((acc, source) => {
        acc[source.id] = true;
        return acc;
      }, {} as Record<string, boolean>)
  );

  // Sync source filters from parent when provided
  useEffect(() => {
    if (initialSourceFilters) {
      setSourceFilters(initialSourceFilters);
    }
  }, [initialSourceFilters]);

  function handleSourceFilterChange(key: string) {
    const next = { ...sourceFilters, [key]: !sourceFilters[key] };
    setSourceFilters(next);
    onSourceFilterChange?.(next);
  }
  // Parent callbacks are invoked directly from handlers above — no mount-guard needed
  const toggleServicesExpanded = () => setServicesExpanded((s) => !s);
  const toggleFiltersExpanded = () => setFiltersExpanded((s) => !s);
  const toggleSourcesExpanded = () => setSourcesExpanded((s) => !s);

  return (
    <div className="w-[250px] min-w-[250px] h-full bg-white dark:bg-slate-800 overflow-y-auto text-sm flex flex-col border-r border-gray-200 dark:border-slate-700">
      <div className="flex-1">
        <ServicesFilter
          services={services}
          values={enabledServices}
          onChange={handleServiceChange}
          expanded={servicesExpanded}
          onToggleExpanded={toggleServicesExpanded}
        />

        <StatusFilter
          filters={filters}
          onChange={handleFilterChange}
          expanded={filtersExpanded}
          onToggleExpanded={toggleFiltersExpanded}
        />
      </div>

      <SourcesFilter
        title="Agencies"
        sources={dataSources}
        values={sourceFilters}
        onChange={handleSourceFilterChange}
        expanded={sourcesExpanded}
        onToggleExpanded={toggleSourcesExpanded}
      />
    </div>
  );
}

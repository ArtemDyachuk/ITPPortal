import { useEffect, useMemo, useState } from 'react';
import servicesData from '@repo/ui/data/services.json';

interface Service {
  id: string;
  type: string;
  name: string;
}

export function useFiltersState(
  initialEnabledServices?: Record<string, boolean>,
  onServiceChange?: (services: Record<string, boolean>) => void,
  initialStatusFilters?: Record<string, boolean>,
  onStatusFilterChange?: (filters: Record<string, boolean>) => void
) {
  const services = useMemo(
    () => [...(servicesData as Service[])].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const [enabledServices, setEnabledServices] = useState<Record<string, boolean>>(
    initialEnabledServices ||
      services.reduce((acc, service) => {
        acc[service.id] = true;
        return acc;
      }, {} as Record<string, boolean>)
  );

  useEffect(() => {
    if (initialEnabledServices) {
      setEnabledServices(initialEnabledServices);
    }
  }, [initialEnabledServices]);

  function handleServiceChange(serviceId: string) {
    const next = { ...enabledServices, [serviceId]: !enabledServices[serviceId] };
    setEnabledServices(next);
    onServiceChange?.(next);
  }

  const [filters, setFilters] = useState<Record<string, boolean>>(
    initialStatusFilters || {
      active: true,
      scheduled: true,
    }
  );

  useEffect(() => {
    if (initialStatusFilters) {
      setFilters(initialStatusFilters);
    }
  }, [initialStatusFilters]);

  function handleFilterChange(key: string) {
    const next = { ...filters, [key]: !filters[key] };
    setFilters(next);
    onStatusFilterChange?.(next);
  }

  return {
    services,
    enabledServices,
    handleServiceChange,
    filters,
    handleFilterChange,
  };
}

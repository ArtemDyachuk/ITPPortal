'use client';

import { useEffect, useMemo, useState } from 'react';
import servicesData from '@repo/ui/data/services.json';
import dataSourcesData from '@repo/ui/data/dataSources.json';
import SourceSection from './SourceSection';

interface Service {
  id: string;
  type: string;
  name: string;
}

interface DataSource {
  id: string;
  name: string;
  category: string;
}

interface FilterPanelProps {
  enabledServices?: Record<string, boolean>;
  onServiceChange?: (services: Record<string, boolean>) => void;
  statusFilters?: Record<string, boolean>;
  onStatusFilterChange?: (filters: Record<string, boolean>) => void;
  sourceFilters?: Record<string, boolean>;
  onSourceFilterChange?: (filters: Record<string, boolean>) => void;
}

export default function FilterPanel({ enabledServices: initialEnabledServices, onServiceChange, statusFilters: initialStatusFilters, onStatusFilterChange, sourceFilters: initialSourceFilters, onSourceFilterChange }: FilterPanelProps) {
  const [servicesExpanded, setServicesExpanded] = useState(true);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [sourcesExpanded, setSourcesExpanded] = useState(true);
  // Initialize services state from data
  const services = useMemo(
    () => [...(servicesData as Service[])].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );
  const [enabledServices, setEnabledServices] = useState<Record<string, boolean>>(
    initialEnabledServices || services.reduce((acc, service) => {
      acc[service.id] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  // Keep enabledServices in sync when parent provides updates
  useEffect(() => {
    if (initialEnabledServices) {
      setEnabledServices(initialEnabledServices);
    }
  }, [initialEnabledServices]);

  const handleServiceChange = (serviceId: string) => {
    const updated = { ...enabledServices, [serviceId]: !enabledServices[serviceId] };
    setEnabledServices(updated);
    onServiceChange?.(updated);
  };

  const [filters, setFilters] = useState<Record<string, boolean>>(
    initialStatusFilters || {
      active: true,
      scheduled: true,
    }
  );

  // Sync status filters from parent when provided
  useEffect(() => {
    if (initialStatusFilters) {
      setFilters(initialStatusFilters);
    }
  }, [initialStatusFilters]);

  const handleFilterChange = (key: string) => {
    const updated = { ...filters, [key]: !filters[key] };
    setFilters(updated);
    onStatusFilterChange?.(updated);
  };

  const dataSources = [...(dataSourcesData as DataSource[])].sort((a, b) => a.name.localeCompare(b.name));

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

  const handleSourceFilterChange = (key: string) => {
    const updated = { ...sourceFilters, [key]: !sourceFilters[key] };
    setSourceFilters(updated);
    onSourceFilterChange?.(updated);
  };

  const styles = {
    container: {
      width: '250px',
      minWidth: '250px',
      height: '100%',
      backgroundColor: '#ffffff',
      overflowY: 'auto' as const,
      fontSize: '14px',
      display: 'flex',
      flexDirection: 'column' as const,
      borderRight: '1px solid #e5e7eb',
    } as React.CSSProperties,
    topSections: {
      flex: 1,
    } as React.CSSProperties,
    section: {
      borderBottom: '1px solid #e5e7eb',
    } as React.CSSProperties,
    sectionHeader: {
      padding: '14px 16px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      fontWeight: 500,
      fontSize: '14px',
      color: '#1f2937',
    } as React.CSSProperties,
    sectionContent: {
      backgroundColor: '#ffffff',
      padding: '4px 0',
    } as React.CSSProperties,
    searchWrapper: {
      padding: '4px 16px 8px',
      borderBottom: '1px solid #e5e7eb',
    } as React.CSSProperties,
    searchInput: {
      width: '100%',
      padding: '8px 10px',
      borderRadius: '6px',
      border: '1px solid #d1d5db',
      fontSize: '13px',
      backgroundColor: '#f9fafb',
    } as React.CSSProperties,
    noResults: {
      padding: '10px 16px',
      fontSize: '13px',
      color: '#6b7280',
    } as React.CSSProperties,
    filterItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px 16px',
      cursor: 'pointer',
      transition: 'background-color 0.15s',
    } as React.CSSProperties,
    checkbox: {
      width: '16px',
      height: '16px',
      marginRight: '10px',
      cursor: 'pointer',
      accentColor: '#3b82f6',
    } as React.CSSProperties,
    label: {
      cursor: 'pointer',
      fontSize: '14px',
      color: '#374151',
      userSelect: 'none' as const,
    } as React.CSSProperties,
    toggleSwitch: {
      position: 'relative' as const,
      width: '40px',
      height: '20px',
      backgroundColor: '#d1d5db',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    } as React.CSSProperties,
    toggleSwitchActive: {
      backgroundColor: '#10b981',
    } as React.CSSProperties,
    toggleKnob: {
      position: 'absolute' as const,
      top: '2px',
      left: '2px',
      width: '16px',
      height: '16px',
      backgroundColor: 'white',
      borderRadius: '50%',
      transition: 'transform 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    } as React.CSSProperties,
    toggleKnobActive: {
      transform: 'translateX(20px)',
    } as React.CSSProperties,
    arrow: {
      fontSize: '12px',
      color: '#9ca3af',
    } as React.CSSProperties,
  };

  const ToggleSwitch = ({ checked, onChange }: { checked?: boolean; onChange: () => void }) => {
    const isChecked = checked ?? false;
    return (
      <div 
        style={{
          ...styles.toggleSwitch,
          ...(isChecked ? styles.toggleSwitchActive : {}),
        }}
        onClick={onChange}
      >
        <div style={{
          ...styles.toggleKnob,
          ...(isChecked ? styles.toggleKnobActive : {}),
        }} />
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.topSections}>
        {/* Services Section */}
        <div style={styles.section}>
          <div 
            style={styles.sectionHeader}
            onClick={() => setServicesExpanded(!servicesExpanded)}
          >
            <span>Services</span>
            <span style={styles.arrow}>{servicesExpanded ? '▼' : '▶'}</span>
          </div>
          {servicesExpanded && (
            <div style={styles.sectionContent}>
              {services.map((service) => (
                <div key={service.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px' }}>
                  <span style={styles.label}>{service.name}</span>
                  <ToggleSwitch checked={enabledServices[service.id]} onChange={() => handleServiceChange(service.id)} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filters Section */}
        <div style={styles.section}>
          <div 
            style={styles.sectionHeader}
            onClick={() => setFiltersExpanded(!filtersExpanded)}
          >
            <span>Filters</span>
            <span style={styles.arrow}>{filtersExpanded ? '▼' : '▶'}</span>
          </div>
          {filtersExpanded && (
            <div style={styles.sectionContent}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px' }}>
                <span style={styles.label}>Active</span>
                <ToggleSwitch checked={filters.active} onChange={() => handleFilterChange('active')} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px' }}>
                <span style={styles.label}>Scheduled</span>
                <ToggleSwitch checked={filters.scheduled} onChange={() => handleFilterChange('scheduled')} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', opacity: 0.5, cursor: 'not-allowed' }}>
                <span style={styles.label}>With Backups</span>
                <ToggleSwitch checked={filters.withBackups} onChange={() => {}} />
              </div>
            </div>
          )}
        </div>
      </div>

      <SourceSection
        title="Agencies"
        sources={dataSources}
        values={sourceFilters}
        onChange={handleSourceFilterChange}
        expanded={sourcesExpanded}
        onToggleExpanded={() => setSourcesExpanded(!sourcesExpanded)}
      />
    </div>
  );
}

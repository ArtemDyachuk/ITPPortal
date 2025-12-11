"use client"

import { useState, useMemo, useRef } from 'react';
import { Map, OSMPolyline, POI } from '@repo/ui/map';
import { CriticalEventsTable, CollapsiblePanel, type CriticalEvent, type CriticalEventsTableConfig } from '@repo/ui/events-viewer';
import { FilterPanel } from '@repo/ui/events-viewer';
import criticalEventsData from '@repo/ui/data/criticalEvents.json';
import eventsData from '@repo/ui/data/events.json';
import servicesData from '@repo/ui/data/services.json';
import dataSourcesData from '@repo/ui/data/dataSources.json';

interface Service {
  id: string;
  type: string;
  name: string;
}

interface MapEvent {
  id: string;
  type: string;
  name: string;
  description: string;
  road: string;
  city: string;
  severity: string;
  workType?: string;
  affectedLanes: string;
  startDate: string;
  endDate: string;
  path: { lat: number; lng: number }[];
  centerPoint: { lat: number; lng: number };
  clearance?: string;
  restrictions?: string;
  unitNumber?: string;
  unitsOnScene?: string;
  dataSourceId?: string;
}

export default function EventsMapPage() {
  // Map events from JSON
  const mapEvents = eventsData as MapEvent[];

  // Ref for map instance to trigger resize
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  
  // Status filter states (Active, Scheduled)
  const [statusFilters, setStatusFilters] = useState({
    active: true,
    scheduled: true,
  });
  
  // Service filter state
  const services = servicesData as Service[];
  const [enabledServices, setEnabledServices] = useState<Record<string, boolean>>(
    services.reduce((acc, service) => {
      acc[service.id] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  // Source filter state
  const dataSources = dataSourcesData as { id: string; name: string; category: string }[];
  const [sourceFilters, setSourceFilters] = useState<Record<string, boolean>>(
    dataSources.reduce((acc, source) => {
      acc[source.id] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const dataSourceCategoryMap = useMemo(() => {
    return dataSources.reduce((acc, source) => {
      acc[source.id] = source.category;
      return acc;
    }, {} as Record<string, string>);
  }, [dataSources]);

  const resolveIconUrl = (dataSourceId?: string) => {
    if (!dataSourceId) return undefined;
    const category = dataSourceCategoryMap[dataSourceId];
    if (category === 'logistics') return '/icons/Delivery.webp';
    if (category === 'utility') return '/icons/Utility.webp';
    return undefined;
  };

  // Get unique event types from data
  const uniqueEventTypes = useMemo(() => {
    const types = new Set((criticalEventsData as CriticalEvent[]).map(event => event.type));
    return Array.from(types).sort();
  }, []);

  // Helper function to determine event status based on date
  const getEventStatus = (startDate: string, endDate: string): 'active' | 'scheduled' => {
    const today = new Date('2025-12-11'); // Using the context date
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (today < start) {
      return 'scheduled';
    }
    if (today > end) {
      return 'active'; // Past event
    }
    return 'active';
  };

  // Filter map events based on enabled services
  const filteredMapEvents = useMemo(() => {
    return mapEvents.filter(event => {
      const dataSourceId = event.dataSourceId;

      // Source filter (data provider) – primary authority
      if (dataSourceId && sourceFilters[dataSourceId] === false) {
        return false;
      }

      // Service filter (refinement)
      const dataSourceCategory = dataSourceId ? dataSourceCategoryMap[dataSourceId] : undefined;
      const categoryService = dataSourceCategory ? services.find(s => s.type === dataSourceCategory) : undefined;
      const typeService = services.find(s => s.type === event.type);
      const matchingService = categoryService || typeService;
      if (matchingService && !enabledServices[matchingService.id]) {
        return false;
      }
      
      // Status filter (Active/Scheduled)
      const eventStatus = getEventStatus(event.startDate, event.endDate);
      if (!statusFilters.active && eventStatus === 'active') {
        return false;
      }
      if (!statusFilters.scheduled && eventStatus === 'scheduled') {
        return false;
      }
      
      return true;
    });
  }, [mapEvents, services, enabledServices, statusFilters, sourceFilters, dataSourceCategoryMap]);

  // Calculate map bounds to fit filtered events using Leaflet's bounds
  const mapBounds = useMemo(() => {
    if (filteredMapEvents.length === 0) {
      return undefined;
    }

    // Get all points from filtered event paths
    const allPoints = filteredMapEvents.flatMap(event => event.path);
    
    // Calculate bounds
    const lats = allPoints.map(p => p.lat);
    const lngs = allPoints.map(p => p.lng);
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    // Add small padding (5%)
    const latPadding = (maxLat - minLat) * 0.05;
    const lngPadding = (maxLng - minLng) * 0.05;
    
    // Return bounds in Leaflet format [[south, west], [north, east]]
    return [
      [minLat - latPadding, minLng - lngPadding],
      [maxLat + latPadding, maxLng + lngPadding]
    ] as [[number, number], [number, number]];
  }, [filteredMapEvents]);

  // Filter critical events based on enabled services + search/type/severity
  const filteredEvents = useMemo(() => {
    return (criticalEventsData as CriticalEvent[]).filter(event => {
      const dataSourceId = event.dataSourceId;

      // Source filter (data provider) – primary authority
      if (dataSourceId && sourceFilters[dataSourceId] === false) {
        return false;
      }

      // Service filter: match event.type to services.type, then check toggle by id
      const dataSourceCategory = dataSourceId ? dataSourceCategoryMap[dataSourceId] : undefined;
      const categoryService = dataSourceCategory ? services.find(s => s.type === dataSourceCategory) : undefined;
      const typeService = services.find(s => s.type === event.type);
      const matchingService = categoryService || typeService;
      if (matchingService && !enabledServices[matchingService.id]) {
        return false;
      }
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (event.city || '').toLowerCase().includes(searchLower) ||
        (event.coordinates || '').toLowerCase().includes(searchLower) ||
        (event.description || '').toLowerCase().includes(searchLower) ||
        (event.type || '').toLowerCase().includes(searchLower) ||
        (event.time || '').toLowerCase().includes(searchLower);

      // Type filter
      const matchesType = selectedType === '' || event.type === selectedType;

      // Severity filter
      let matchesSeverity = true;
      if (selectedSeverity === 'All') {
        matchesSeverity = true;
      } else if (selectedSeverity === 'Critical') {
        matchesSeverity = event.severity === 'Critical';
      } else if (selectedSeverity === 'Warnings') {
        matchesSeverity = event.severity === 'Warning';
      }

      return matchesSearch && matchesType && matchesSeverity;
    });
  }, [searchTerm, selectedType, selectedSeverity, services, enabledServices, sourceFilters, dataSourceCategoryMap]);

  // Handle filter changes from CollapsiblePanel
  const handleFilterChange = (filters: { search: string; type: string; severity: string }) => {
    setSearchTerm(filters.search);
    setSelectedType(filters.type);
    setSelectedSeverity(filters.severity);
  };

  // Handle panel expansion/collapse - trigger map resize
  const handlePanelExpandChange = (expanded: boolean) => {
    setIsPanelExpanded(expanded);
    // Trigger map resize and reposition after a small delay to allow layout to settle
    if (mapInstanceRef.current) {
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          // Refit bounds if available
          if (mapBounds) {
            mapInstanceRef.current.fitBounds(mapBounds, { padding: [0, 0], animate: true, duration: 0.5 }); // Match Map.tsx for closer fit
          }
        }
      }, 100);
    }
  };

  // Table configuration
  const eventsTableConfig: CriticalEventsTableConfig = {
    title: 'Critical Events',
    columns: [
      { 
        key: 'time', 
        label: 'Time', 
        width: '120px',
        sortable: true 
      },
      { 
        key: 'coordinates', 
        label: 'Location', 
        width: '140px',
        sortable: true 
      },
      { 
        key: 'city', 
        label: 'City', 
        width: '90px',
        sortable: true 
      },
      { 
        key: 'count', 
        label: 'Count', 
        width: '70px',
        sortable: true 
      },
      { 
        key: 'type', 
        label: 'Type', 
        width: '110px',
        sortable: true 
      },
      { 
        key: 'severity', 
        label: 'Severity', 
        width: '100px',
        sortable: true 
      },
    ],
    emptyMessage: 'No critical events at this time',
    onRowClick: (event: CriticalEvent) => {
      console.log('Clicked event:', event);
    },
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
      width: '100%',
    } as React.CSSProperties,
    mainContent: {
      display: 'flex',
      height: '100%',
      width: '100%',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#f9fafb',
    } as React.CSSProperties,
    filterColumn: {
      width: '250px',
      minWidth: '250px',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    } as React.CSSProperties,
    contentWrapper: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      gap: 0,
    } as React.CSSProperties,
    mapColumn: {
      flex: isPanelExpanded ? 0.3 : 0.7,
      overflow: 'hidden' as const,
      borderRadius: '0.5rem 0.5rem 0 0',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'flex 0.3s ease-in-out',
    } as React.CSSProperties,
    eventsColumn: {
      flex: isPanelExpanded ? 0.7 : 0.3,
      overflow: 'hidden' as const,
      borderRadius: '0 0 0.5rem 0.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'flex 0.3s ease-in-out',
    } as React.CSSProperties,
  };

  return (
    <div style={styles.container}>
      {/* Main Content - Filters and Map/Events */}
      <main style={styles.mainContent}>
        {/* Filter Panel - Fixed Width */}
        <div style={styles.filterColumn}>
          <FilterPanel 
            enabledServices={enabledServices} 
            onServiceChange={setEnabledServices}
            statusFilters={statusFilters}
            onStatusFilterChange={(filters) => setStatusFilters(filters as { active: boolean; scheduled: boolean })}
            sourceFilters={sourceFilters}
            onSourceFilterChange={setSourceFilters}
          />
        </div>
        
        {/* Content Wrapper - Map and Events */}
        <div style={styles.contentWrapper}>
          {/* Map - 70% initially, 30% when expanded */}
          <div style={styles.mapColumn}>
            <Map 
              bounds={mapBounds}
              onMapInstanceReady={(mapInstance) => {
                mapInstanceRef.current = mapInstance;
              }}
            >
              {filteredMapEvents.map((event) => (
                <div key={event.id}>
                  {/* POI marker at start of event path */}
                  <POI 
                    coordinates={event.path[0]!}
                    eventType={event.type}
                    title={event.name}
                    iconUrl={resolveIconUrl(event.dataSourceId)}
                    expectedEndTime={event.endDate}
                    affectedDirection={event.affectedLanes}
                    details={[
                      `- Type: ${event.type}`,
                      event.workType ? `- Work Type: ${event.workType}` : '',
                      event.clearance ? `- Clearance: ${event.clearance}` : '',
                      event.unitNumber ? `- Unit: ${event.unitNumber}` : '',
                      event.unitsOnScene ? `- Units: ${event.unitsOnScene}` : ''
                    ].filter(Boolean)}
                    fullDescription={event.description}
                  />
                  {/* Polyline for event path with same POI data */}
                  <OSMPolyline
                    path={event.path}
                    strokeColor={event.severity === 'Critical' ? '#FF0000' : '#FFA500'}
                    strokeOpacity={0.9}
                    strokeWeight={8}
                    title={event.name}
                    expectedEndTime={event.endDate}
                    affectedDirection={event.affectedLanes}
                    details={[
                      `- Type: ${event.type}`,
                      event.workType ? `- Work Type: ${event.workType}` : '',
                      event.clearance ? `- Clearance: ${event.clearance}` : '',
                      event.unitNumber ? `- Unit: ${event.unitNumber}` : '',
                      event.unitsOnScene ? `- Units: ${event.unitsOnScene}` : ''
                    ].filter(Boolean)}
                    fullDescription={event.description}
                  />
                </div>
              ))}
            </Map>
          </div>

          {/* Events - 30% initially, 70% when expanded */}
          <div style={styles.eventsColumn}>
            <CollapsiblePanel
              title="Critical Events"
              initialExpanded={isPanelExpanded}
              onExpandChange={handlePanelExpandChange}
              onFilterChange={handleFilterChange}
              eventTypes={uniqueEventTypes}
            >
              <CriticalEventsTable
                events={filteredEvents}
                config={eventsTableConfig}
                isCompact={false}
              />
            </CollapsiblePanel>
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

// Main container component for displaying critical events

import { useState, useEffect } from 'react';
import DropdownArrowIcon from '../../icons/DropdownArrowIcon';
import { CriticalEvent, CriticalEventsTableConfig } from '../types';
import PanelHeader from './PanelHeader';
import EventsTable from './EventsTable';
import PanelFooter from './PanelFooter';

interface CriticalEventsProps {
  events: CriticalEvent[];
  config: CriticalEventsTableConfig;
  isCompact?: boolean;
  onSeeOnMapClick?: (event: CriticalEvent) => void;
  // Filter props for PanelHeader
  search: string;
  eventType: string;
  severity: string;
  eventTypes: string[];
  onSearchChange: (value: string) => void;
  onEventTypeChange: (value: string) => void;
  onSeverityChange: (value: string) => void;
  // Collapsible props
  initialExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

export default function CriticalEvents({
  events,
  config,
  isCompact = false,
  onSeeOnMapClick,
  search,
  eventType,
  severity,
  eventTypes,
  onSearchChange,
  onEventTypeChange,
  onSeverityChange,
  initialExpanded = false,
  onExpandChange,
}: CriticalEventsProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Calculate pagination
  const totalPages = Math.ceil(events.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEvents = events.slice(startIndex, endIndex);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 overflow-visible shadow-lg pt-4 relative z-40">
      {/* Border line with centered arrow */}
      <div
        className="relative h-0.5 flex items-center justify-center z-5"
        style={{ borderBottom: '1px solid #d4d4d4' }}
      >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <button
            className="flex items-center justify-center w-8 h-7 bg-white dark:bg-slate-700 border-none rounded-full cursor-pointer transition-all duration-300 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-500 dark:text-gray-400 text-lg p-0 flex-shrink-0 m-0"
            onClick={handleToggle}
            aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
          >
            <DropdownArrowIcon size={14} className="text-gray-500 dark:text-gray-400" color="#6b7280" direction={isExpanded ? 'up' : 'down'} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col h-full">
        <PanelHeader
          title={config.title || 'Critical Events'}
          search={search}
          eventType={eventType}
          severity={severity}
          eventTypes={eventTypes}
          onSearchChange={onSearchChange}
          onEventTypeChange={onEventTypeChange}
          onSeverityChange={onSeverityChange}
        />
        <EventsTable
          events={paginatedEvents}
          config={config}
          isCompact={isCompact}
          onSeeOnMapClick={onSeeOnMapClick}
        />
        <PanelFooter
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalEvents={events.length}
          startIndex={startIndex}
          endIndex={Math.min(endIndex, events.length)}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}
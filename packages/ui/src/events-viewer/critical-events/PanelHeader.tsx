'use client';

import React from 'react';
import DesktopFilters from './components/filters/DesktopFilters';
import MobileFilters from './components/filters/MobileFilters';

export interface FilterState {
  search: string;
  type: string;
  severity: string;
}

interface PanelHeaderProps {
  title: string;
  search: string;
  eventType: string;
  severity: string;
  eventTypes: string[];
  onSearchChange: (value: string) => void;
  onEventTypeChange: (value: string) => void;
  onSeverityChange: (value: string) => void;
  isExpanded?: boolean;
}

export default function PanelHeader({
  title,
  search,
  eventType,
  severity,
  eventTypes,
  onSearchChange,
  onEventTypeChange,
  onSeverityChange,
  isExpanded,
}: PanelHeaderProps) {

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="flex items-center justify-between gap-1 p-3 border-b border-gray-200 dark:border-slate-700 relative">
      <div className="flex-0">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white m-0 whitespace-nowrap">{title}</h2>
      </div>
      {/* Desktop filters (visible on md and up) */}
      <div className="hidden md:flex items-center gap-1">
        <DesktopFilters
          search={search}
          eventType={eventType}
          severity={severity}
          eventTypes={eventTypes}
          onSearchChange={handleSearchChange}
          onEventTypeChange={onEventTypeChange}
          onSeverityChange={onSeverityChange}
        />
      </div>
      {/* Mobile filters (visible below md) */}
      <div className="block md:hidden">
        <MobileFilters
          search={search}
          eventType={eventType}
          severity={severity}
          eventTypes={eventTypes}
          onSearchChange={handleSearchChange}
          onEventTypeChange={onEventTypeChange}
          onSeverityChange={onSeverityChange}
          isExpanded={isExpanded}
        />
      </div>
    </div>
  );
}

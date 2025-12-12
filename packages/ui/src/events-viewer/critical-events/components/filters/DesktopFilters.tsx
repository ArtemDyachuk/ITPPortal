'use client';

import React from 'react';

interface DesktopFiltersProps {
  search: string;
  eventType: string;
  severity: string;
  eventTypes: string[];
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEventTypeChange: (value: string) => void;
  onSeverityChange: (value: string) => void;
}

export default function DesktopFilters({
  search,
  eventType,
  severity,
  eventTypes,
  onSearchChange,
  onEventTypeChange,
  onSeverityChange,
}: DesktopFiltersProps) {
  return (
    <>
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={onSearchChange}
        className="px-2 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 w-24"
      />

      <select
        value={eventType}
        onChange={(e) => onEventTypeChange(e.target.value)}
        className="px-2 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 min-w-[90px]"
      >
        <option value="">All Types</option>
        {eventTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <button
        className={`${severity === 'All' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'} px-3 py-1 text-sm rounded-md font-medium whitespace-nowrap`}
        onClick={() => onSeverityChange('All')}
      >
        All
      </button>
      <button
        className={`${severity === 'Critical' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'} px-3 py-1 text-sm rounded-md font-medium whitespace-nowrap`}
        onClick={() => onSeverityChange('Critical')}
      >
        Critical
      </button>
      <button
        className={`${severity === 'Warnings' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'} px-3 py-1 text-sm rounded-md font-medium whitespace-nowrap`}
        onClick={() => onSeverityChange('Warnings')}
      >
        Warnings
      </button>
    </>
  );
}

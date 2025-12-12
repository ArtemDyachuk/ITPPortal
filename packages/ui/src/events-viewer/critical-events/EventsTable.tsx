'use client';

import React, { useState, useMemo } from 'react';
import { CriticalEvent, CriticalEventsTableConfig } from '../types';
import EventDetailsModal from './components/modals/EventDetailsModal';
import MobileEventCard from './components/MobileEventCard';

interface CriticalEventsTableProps {
  events: CriticalEvent[];
  config: CriticalEventsTableConfig;
  isCompact?: boolean;
  onSeeOnMapClick?: (event: CriticalEvent) => void;
}

const getSeverityColor = (severity: string): string => {
  const colors: Record<string, string> = {
    Critical: '#dc2626',
    Warning: '#eab308',
    Info: '#3fa2ff',
  };
  return colors[severity] || '#6b7280';
};

// Column definitions: key, label, sortable
const COLUMNS: { key: string; label: string; sortable: boolean }[] = [
  { key: 'time', label: 'Time', sortable: true },
  { key: 'location', label: 'Location', sortable: false },
  { key: 'city', label: 'City', sortable: true },
  { key: 'count', label: 'Count', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'severity', label: 'Severity', sortable: true },
  { key: 'details', label: 'Details', sortable: false },
];

export default function EventsTable({
  events,
  config,
  isCompact = false,
  onSeeOnMapClick,
}: CriticalEventsTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedEvent, setSelectedEvent] = useState<CriticalEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedEvents = useMemo(() => {
    if (!sortKey) return events;
    return [...events].sort((a, b) => {
      const aVal = (a as any)[sortKey];
      const bVal = (b as any)[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [events, sortKey, sortDir]);

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
        {config.emptyMessage || 'No events to display'}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 overflow-hidden">
      {/* Desktop Table (visible on md and up) */}
      <div className="hidden md:block flex-1 overflow-auto">
        <table className={`w-full table-fixed border-collapse ${isCompact ? 'text-xs' : 'text-sm'}`}>
          <thead className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`text-left font-semibold text-gray-700 dark:text-gray-300 px-4 py-2 ${col.sortable ? 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-slate-700' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedEvents.map((event) => (
              <tr
                key={event.id}
                className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer"
                onClick={() => config.onRowClick?.(event)}
              >
                {COLUMNS.map((col) => (
                  <td key={col.key} className={`text-gray-700 dark:text-gray-300 ${isCompact ? 'px-2 py-1' : 'px-4 py-2'}`}>
                    {col.key === 'details' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                          setIsModalOpen(true);
                        }}
                        className="px-2 py-1 text-xs bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700"
                      >
                        Details
                      </button>
                    ) : col.key === 'severity' ? (
                      <span
                        className="inline-block px-2 py-0.5 text-xs font-bold text-white rounded"
                        style={{ backgroundColor: getSeverityColor((event as any)[col.key]) }}
                      >
                        {(event as any)[col.key]}
                      </span>
                    ) : col.key === 'location' ? (
                      (() => {
                        // Prefer `location` but fall back to `coordinates` string
                        const raw = (event as any)[col.key] ?? (event as any).coordinates;
                        if (raw == null) return null;
                        if (typeof raw === 'string') return raw;
                        if (Array.isArray(raw) && raw.length >= 2) {
                          return `${raw[0]}, ${raw[1]}`;
                        }
                        if (typeof raw === 'object') {
                          // Attempt to extract lat/lng if provided as object
                          const lat = (raw.lat ?? raw.latitude ?? raw.lat_deg ?? raw.latDegrees);
                          const lng = (raw.lng ?? raw.lon ?? raw.longitude ?? raw.lng_deg ?? raw.lonDegrees);
                          if (lat != null && lng != null) {
                            const fmt = (n: any) => (typeof n === 'number' ? n.toFixed(6) : String(n));
                            return `${fmt(lat)}, ${fmt(lng)}`;
                          }
                          try {
                            return JSON.stringify(raw);
                          } catch (e) {
                            return null;
                          }
                        }
                        return String(raw);
                      })()
                    ) : (
                      (event as any)[col.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (visible below md) */}
      <div className="block md:hidden flex-1 overflow-y-auto py-3 bg-gray-50 dark:bg-slate-900">
        {sortedEvents.map((event) => (
          <MobileEventCard
            key={event.id}
            event={event}
            onDetailsClick={() => {
              setSelectedEvent(event);
              setIsModalOpen(true);
            }}
            onSeeOnMapClick={onSeeOnMapClick}
          />
        ))}
      </div>

      {/* Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
}

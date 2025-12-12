'use client';

import { CriticalEvent } from '../../types';

interface MobileEventCardProps {
  event: CriticalEvent;
  onDetailsClick: (event: CriticalEvent) => void;
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

export default function MobileEventCard({
  event,
  onDetailsClick,
  onSeeOnMapClick,
}: MobileEventCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 mb-3 overflow-hidden shadow-sm">
      <div className="p-3">
        {/* Top row: Time/Count | Type + Severity | City/Map */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{event.time}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">Count: {event.count}</span>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-center">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{event.type}</span>
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: getSeverityColor(event.severity) }}
              title={event.severity}
            />
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{event.city}</span>
            {onSeeOnMapClick && (
              <button
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline p-0"
                onClick={() => onSeeOnMapClick(event)}
                type="button"
              >
                See on map
              </button>
            )}
          </div>
        </div>

        {/* Bottom row: Coordinates | Details button */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-slate-700">
          <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{event.coordinates}</span>
          <button
            className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
            onClick={() => onDetailsClick(event)}
            type="button"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { ToggleSwitch } from '../../../../common/toggle';

interface StatusFilterProps {
  filters: Record<string, boolean>;
  onChange: (key: string) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
  showHeader?: boolean;
  showToggle?: boolean;
}

const StatusFilter = ({ filters, onChange, expanded, onToggleExpanded, showHeader = true, showToggle = true }: StatusFilterProps) => {
  const shouldShowContent = showHeader ? expanded : true;

  return (
    <div className="border-b border-gray-200 dark:border-slate-700">
      {showHeader && (
        <div
          className={`px-4 py-3 flex justify-between items-center bg-white dark:bg-slate-800 font-medium text-sm text-gray-800 dark:text-gray-200 ${showToggle ? 'cursor-pointer' : ''}`}
          onClick={showToggle ? onToggleExpanded : undefined}
        >
          <span>Filters</span>
          {showToggle && <span className="text-sm text-gray-400 dark:text-gray-500">{expanded ? '▼' : '▶'}</span>}
        </div>
      )}

      {shouldShowContent && (
        <div className="bg-white dark:bg-slate-800">
          <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
            <ToggleSwitch checked={filters.active} onChange={() => onChange('active')} />
          </div>

          <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <span className="text-sm text-gray-700 dark:text-gray-300">Scheduled</span>
            <ToggleSwitch checked={filters.scheduled} onChange={() => onChange('scheduled')} />
          </div>

          <div className="flex items-center justify-between px-4 py-2 opacity-50 cursor-not-allowed">
            <span className="text-sm text-gray-700 dark:text-gray-300">With Backups</span>
            <ToggleSwitch checked={Boolean(filters.withBackups)} onChange={() => onChange('withBackups')} disabled />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(StatusFilter);

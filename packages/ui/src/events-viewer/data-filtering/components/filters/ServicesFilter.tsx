import React from 'react';
import { ToggleSwitch } from '../../../../common/toggle';

interface Service {
  id: string;
  type: string;
  name: string;
}

interface ServicesFilterProps {
  services: Service[];
  values: Record<string, boolean>;
  onChange: (id: string) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
  showHeader?: boolean;
  showToggle?: boolean;
}

const ServicesFilter = ({ services, values, onChange, expanded, onToggleExpanded, showHeader = true, showToggle = true }: ServicesFilterProps) => {
  const shouldShowContent = showHeader ? expanded : true;

  return (
    <div className="border-b border-gray-200 dark:border-slate-700">
      {showHeader && (
        <div
          className={`px-4 py-3 flex justify-between items-center bg-white dark:bg-slate-800 font-medium text-sm text-gray-800 dark:text-gray-200 ${showToggle ? 'cursor-pointer' : ''}`}
          onClick={showToggle ? onToggleExpanded : undefined}
        >
          <span>Services</span>
          {showToggle && <span className="text-xs text-gray-400 dark:text-gray-500">{expanded ? '▼' : '▶'}</span>}
        </div>
      )}

      {shouldShowContent && (
        <div className="bg-white dark:bg-slate-800">
          {services.map((service) => (
            <div
              key={service.id}
              role="button"
              tabIndex={0}
              onClick={() => onChange(service.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(service.id); } }}
              className="flex items-center justify-between px-4 py-2 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300 select-none">{service.name}</span>
              <ToggleSwitch checked={Boolean(values[service.id])} onChange={() => onChange(service.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(ServicesFilter);

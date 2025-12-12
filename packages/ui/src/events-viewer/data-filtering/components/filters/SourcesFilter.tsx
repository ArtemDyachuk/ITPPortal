import React, { useMemo, useState } from 'react';

interface DataSource {
  id: string;
  name: string;
  category: string;
}

interface SourcesFilterProps {
  title: string;
  sources: DataSource[];
  values: Record<string, boolean>;
  onChange: (id: string) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
  showHeader?: boolean;
  showToggle?: boolean;
}

const SourcesFilter = ({ title, sources, values, onChange, expanded, onToggleExpanded, showHeader = true, showToggle = true }: SourcesFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSources = useMemo(() => {
    if (!searchTerm.trim()) return sources;
    const normalized = searchTerm.trim().toLowerCase();
    return sources.filter((s) =>
      s.name.toLowerCase().includes(normalized) || s.category.toLowerCase().includes(normalized)
    );
  }, [sources, searchTerm]);

  const shouldShowContent = showHeader ? expanded : true;

  return (
    <div className="border-b border-gray-200 dark:border-slate-700">
      {showHeader && (
        <div
          className={`p-3.5 px-4 ${showToggle ? 'cursor-pointer' : ''} flex justify-between items-center bg-white dark:bg-slate-800 font-medium text-sm text-gray-800 dark:text-gray-200`}
          onClick={showToggle ? onToggleExpanded : undefined}
        >
          <span>{title}</span>
          {showToggle && <span className="text-xs text-gray-400 dark:text-gray-500">{expanded ? '▼' : '▶'}</span>}
        </div>
      )}

      {shouldShowContent && (
        <div className="bg-white dark:bg-slate-800 py-1 max-h-[50vh] overflow-y-auto">
          <div className="p-2.5 px-4 pb-1 border-b border-gray-200 dark:border-slate-700">
            <input
              type="search"
              placeholder="Filter sources"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              aria-label="Search sources"
            />
          </div>
          {filteredSources.length === 0 ? (
            <div className="p-3 px-4 text-sm text-gray-500 dark:text-gray-400">No matching sources</div>
          ) : (
            filteredSources.map((source) => (
              <div
                key={source.id}
                role="button"
                tabIndex={0}
                onClick={() => onChange(source.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(source.id); } }}
                className="flex items-start justify-between p-2.5 px-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 font-semibold select-none leading-tight">{source.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 select-none leading-tight mt-0.5 capitalize">{source.category}</div>
                </div>
                <input
                  type="checkbox"
                  checked={values[source.id] ?? false}
                  onChange={(e) => { e.stopPropagation(); onChange(source.id); }}
                  aria-label={`Toggle ${source.name}`}
                  className="w-4 h-4 ml-3 cursor-pointer accent-blue-500 flex-shrink-0"
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(SourcesFilter);

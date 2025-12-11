import React, { useEffect, useMemo, useRef, useState } from 'react';

interface DataSource {
  id: string;
  name: string;
  category: string;
}

interface SourceSectionProps {
  title: string;
  sources: DataSource[];
  values: Record<string, boolean>;
  onChange: (id: string) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
}

export default function SourceSection({ title, sources, values, onChange, expanded, onToggleExpanded }: SourceSectionProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [maxHeightLimit, setMaxHeightLimit] = useState(() => {
    if (typeof window !== 'undefined') {
      return Math.max(window.innerHeight - 220, 0);
    }
    return 0;
  });

  const filteredSources = useMemo(() => {
    if (!searchTerm.trim()) {
      return sources;
    }
    const normalized = searchTerm.trim().toLowerCase();
    return sources.filter((source) =>
      source.name.toLowerCase().includes(normalized) || source.category.toLowerCase().includes(normalized),
    );
  }, [sources, searchTerm]);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [filteredSources]);

  useEffect(() => {
    if (expanded && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [expanded, filteredSources]);

  useEffect(() => {
    const updateMaxHeight = () => {
      setMaxHeightLimit(Math.max(window.innerHeight - 220, 0));
    };

    updateMaxHeight();
    window.addEventListener('resize', updateMaxHeight);
    return () => window.removeEventListener('resize', updateMaxHeight);
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const effectiveContentHeight = maxHeightLimit > 0 ? Math.min(contentHeight, maxHeightLimit) : contentHeight;

  return (
    <div className="border-b border-gray-200">
      <div
        className="p-3.5 px-4 cursor-pointer flex justify-between items-center bg-white font-medium text-sm text-gray-800"
        onClick={onToggleExpanded}
      >
        <span>{title}</span>
        <span className="text-xs text-gray-400">{expanded ? '▼' : '▶'}</span>
      </div>
      <div
        ref={contentRef}
        className="bg-white py-1 overflow-hidden"
        style={{
          maxHeight: expanded ? (hasMounted ? `${effectiveContentHeight}px` : 'none') : '0px',
          opacity: expanded ? 1 : 0,
          pointerEvents: expanded ? 'auto' : 'none',
          transition: hasMounted ? 'max-height 0.25s ease, opacity 0.2s ease' : 'none',
          willChange: 'max-height, opacity',
        }}
        aria-hidden={!expanded}
      >
        <div className="p-2.5 px-4 pb-1 border-b border-gray-200">
          <input
            type="search"
            placeholder="Filter sources"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-50"
            aria-label="Search sources"
          />
        </div>
        {filteredSources.length === 0 ? (
          <div className="p-3 px-4 text-sm text-gray-500">No matching sources</div>
        ) : (
          filteredSources.map((source) => (
            <div key={source.id} className="flex items-start justify-between p-2.5 px-4 cursor-pointer transition-colors duration-150">
              <div>
                <div className="cursor-pointer text-sm text-gray-700 font-semibold select-none leading-tight">{source.name}</div>
                <div className="text-xs text-gray-500 select-none leading-tight mt-0.5 capitalize">{source.category}</div>
              </div>
              <input
                type="checkbox"
                checked={values[source.id] ?? false}
                onChange={() => onChange(source.id)}
                className="w-4 h-4 ml-3 cursor-pointer accent-blue-500 flex-shrink-0"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

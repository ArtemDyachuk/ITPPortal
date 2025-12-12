'use client';

import { useEffect, useMemo, useState } from 'react';
import Modal from '../../../../common/modal';
import SourcesFilter from '../filters/SourcesFilter';
import dataSourcesData from '@repo/ui/data/dataSources.json';

interface DataSource {
  id: string;
  name: string;
  category: string;
}

interface SourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceFilters?: Record<string, boolean>;
  onSourceFilterChange?: (filters: Record<string, boolean>) => void;
}

export default function SourcesModal({ isOpen, onClose, sourceFilters: initialSourceFilters, onSourceFilterChange }: SourcesModalProps) {
  const [sourcesExpanded, setSourcesExpanded] = useState(true);

  const dataSources = useMemo(
    () => [...(dataSourcesData as DataSource[])].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const [sourceFilters, setSourceFilters] = useState<Record<string, boolean>>(
    initialSourceFilters ||
      dataSources.reduce((acc, source) => {
        acc[source.id] = true;
        return acc;
      }, {} as Record<string, boolean>)
  );

  useEffect(() => {
    if (initialSourceFilters) {
      setSourceFilters(initialSourceFilters);
    }
  }, [initialSourceFilters]);

  const handleSourceFilterChange = (key: string) => {
    const updated = { ...sourceFilters, [key]: !sourceFilters[key] };
    setSourceFilters(updated);
    onSourceFilterChange?.(updated);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Data Sources">
      <div className="w-[300px] max-h-[80vh] overflow-y-auto">
        <SourcesFilter
          title="Agencies"
          sources={dataSources}
          values={sourceFilters}
          onChange={handleSourceFilterChange}
          expanded={sourcesExpanded}
          onToggleExpanded={() => setSourcesExpanded(!sourcesExpanded)}
          showHeader={false}
        />
      </div>
    </Modal>
  );
}

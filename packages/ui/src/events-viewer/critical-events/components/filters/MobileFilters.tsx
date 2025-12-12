'use client';

import React, { useState, useEffect, useRef } from 'react';
import FiltersIcon from '../../../../icons/FiltersIcon';
import { createPortal } from 'react-dom';

interface MobileFiltersProps {
  search: string;
  eventType: string;
  severity: string;
  eventTypes: string[];
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEventTypeChange: (value: string) => void;
  onSeverityChange: (value: string) => void;
  isExpanded?: boolean;
}

export default function MobileFilters({
  search,
  eventType,
  severity,
  eventTypes,
  onSearchChange,
  onEventTypeChange,
  onSeverityChange,
  isExpanded,
}: MobileFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const [portalStyle, setPortalStyle] = useState<React.CSSProperties | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideButton = dropdownRef.current && dropdownRef.current.contains(target);
      const clickedInsidePortal = portalRef.current && portalRef.current.contains(target);

      if (!clickedInsideButton && !clickedInsidePortal) {
        setIsFiltersOpen(false);
      }
    };

    if (isFiltersOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFiltersOpen]);

  useEffect(() => {
    if (!isFiltersOpen) {
      setPortalStyle(null);
      return;
    }

    const btnRect = dropdownRef.current?.getBoundingClientRect();
    if (!btnRect) return;

    const dropdownWidth = Math.min(280, window.innerWidth - 16);
    const left = Math.min(Math.max(8, btnRect.left), window.innerWidth - dropdownWidth - 8);
    const top = btnRect.bottom + 8;

    setPortalStyle({ position: 'absolute', left, top, width: dropdownWidth, zIndex: 1000 });

    const id = window.setTimeout(() => {
      const portalEl = portalRef.current;
      if (!portalEl) return;
      const pRect = portalEl.getBoundingClientRect();
      const needed = pRect.height + 12;
      const spaceBelow = window.innerHeight - btnRect.bottom;
      const spaceAbove = btnRect.top;

      if (spaceBelow < needed && spaceAbove > spaceBelow) {
        const newTop = Math.max(8, btnRect.top - pRect.height - 8);
        setPortalStyle((s) => ({ ...(s || {}), top: newTop }));
      }
    }, 0);

    return () => window.clearTimeout(id);
  }, [isFiltersOpen, isExpanded]);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (search) count++;
    if (eventType) count++;
    if (severity !== 'All') count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 transition-colors ${isFiltersOpen ? 'bg-gray-100 dark:bg-slate-600' : ''}`}
        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
      >
        <FiltersIcon size={16} strokeWidth={2} color="#4B5563" />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-4 bg-indigo-600 text-white text-xs font-semibold rounded-full px-1">{activeFiltersCount}</span>
        )}
      </button>

      {isFiltersOpen && portalStyle && typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={(el) => { portalRef.current = el; }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden"
            style={{ position: 'absolute', left: portalStyle.left, top: portalStyle.top, width: portalStyle.width, zIndex: portalStyle.zIndex }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 m-0">Filters</h4>
              <button className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded" onClick={() => setIsFiltersOpen(false)}>✕</button>
            </div>

            <div className="p-4 flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Search</label>
                <input
                  type="text"
                  placeholder="Search events..."
                  value={search}
                  onChange={onSearchChange}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md w-full bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Event Type</label>
                <select value={eventType} onChange={(e) => onEventTypeChange(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md w-full bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100">
                  <option value="">All Types</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Severity</label>
                <div className="flex gap-2 flex-wrap">
                  <button className={`flex-1 px-3 py-2 text-sm rounded-md font-medium ${severity === 'All' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'}`} onClick={() => onSeverityChange('All')}>All</button>
                  <button className={`flex-1 px-3 py-2 text-sm rounded-md font-medium ${severity === 'Critical' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'}`} onClick={() => onSeverityChange('Critical')}>Critical</button>
                  <button className={`flex-1 px-3 py-2 text-sm rounded-md font-medium ${severity === 'Warnings' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'}`} onClick={() => onSeverityChange('Warnings')}>Warnings</button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

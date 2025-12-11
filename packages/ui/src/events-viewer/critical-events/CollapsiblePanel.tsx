'use client';

import React, { useState, useEffect } from 'react';
import { CollapsiblePanelConfig } from '../types';

interface CollapsiblePanelProps extends CollapsiblePanelConfig {
  children: React.ReactNode;
  onFilterChange?: (filters: FilterState) => void;
  eventTypes?: string[];
}

interface FilterState {
  search: string;
  type: string;
  severity: string;
}

export default function CollapsiblePanel({
  title,
  initialExpanded = false,
  onExpandChange,
  onFilterChange,
  eventTypes = [],
  children,
}: CollapsiblePanelProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [search, setSearch] = useState('');
  const [eventType, setEventType] = useState('');
  const [severity, setSeverity] = useState('All');

  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);

  useEffect(() => {
    onFilterChange?.({ search, type: eventType, severity });
  }, [search, eventType, severity, onFilterChange]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      overflow: 'visible',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
      paddingTop: '1rem',
    } as React.CSSProperties,
    headerTopBorder: {
      position: 'relative' as const,
      height: '2px',
      backgroundColor: '#d1d5db',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 5,
    } as React.CSSProperties,
    arrowContainer: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 20,
    } as React.CSSProperties,
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.5rem',
      padding: '0.6rem 1.5rem',
      borderBottom: '1px solid #e5e7eb',
      position: 'relative' as const,
    } as React.CSSProperties,
    titleContainer: {
      flex: 0,
    } as React.CSSProperties,
    title: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#111827',
      margin: 0,
      whiteSpace: 'nowrap',
    } as React.CSSProperties,
    filterGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    } as React.CSSProperties,
    searchInput: {
      padding: '0.35rem 0.5rem',
      fontSize: '0.8rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      backgroundColor: 'white',
      color: '#374151',
      width: '100px',
    } as React.CSSProperties,
    toggleButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '2rem',
      height: '1.75rem',
      backgroundColor: 'white',
      border: 'none',
      borderRadius: '20%',
      cursor: 'pointer',
      transition: 'transform 0.3s ease-in-out, background-color 0.2s',
      transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
      color: '#6b7280',
      fontSize: '1rem',
      padding: 0,
      flexShrink: 0,
      margin: 0,
    } as React.CSSProperties,
    headerBottom: {
      display: 'none',
    } as React.CSSProperties,
    filterSelect: {
      padding: '0.35rem 0.5rem',
      fontSize: '0.8rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      backgroundColor: 'white',
      color: '#374151',
      cursor: 'pointer',
      minWidth: '90px',
    } as React.CSSProperties,
    statusButton: (isActive: boolean) => ({
      padding: '0.35rem 0.75rem',
      fontSize: '0.8rem',
      border: 'none',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s',
      backgroundColor: isActive ? '#4f46e5' : '#e5e7eb',
      color: isActive ? 'white' : '#374151',
      whiteSpace: 'nowrap',
    } as React.CSSProperties),
    content: {
      flex: 1,
      overflow: 'hidden' as const,
    } as React.CSSProperties,
  };

  return (
    <div style={styles.container}>
      {/* Border line with centered arrow */}
      <div style={styles.headerTopBorder}>
        <div style={styles.arrowContainer}>
          <button
            style={styles.toggleButton}
            onClick={handleToggle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
            aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
          >
            ▲
          </button>
        </div>
      </div>

      {/* Top Header - Title on left, all filters on right */}
      <div style={styles.headerTop}>
        <div style={styles.titleContainer}>
          <h2 style={styles.title}>{title}</h2>
        </div>
        <div style={styles.filterGroup}>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Types</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Status buttons */}
          <button
            style={styles.statusButton(severity === 'All')}
            onClick={() => setSeverity('All')}
          >
            All
          </button>
          <button
            style={styles.statusButton(severity === 'Critical')}
            onClick={() => setSeverity('Critical')}
          >
            Critical
          </button>
          <button
            style={styles.statusButton(severity === 'Warnings')}
            onClick={() => setSeverity('Warnings')}
          >
            Warnings
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>{children}</div>
    </div>
  );
}

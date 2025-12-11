'use client';

import React, { useState } from 'react';
import { CriticalEvent, CriticalEventsTableConfig } from '../types';
import EventDetailsModal from './EventDetailsModal';

interface CriticalEventsTableProps {
  events: CriticalEvent[];
  config: CriticalEventsTableConfig;
  isCompact?: boolean;
}

const getSeverityColor = (severity: string): string => {
  const colors: Record<string, string> = {
    Critical: '#dc2626',
    Warning: '#eab308',
    Info: '#3b82f6',
  };
  return colors[severity] || '#6b7280';
};

export default function CriticalEventsTable({
  events,
  config,
  isCompact = false,
}: CriticalEventsTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CriticalEvent;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<CriticalEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const handleSort = (key: keyof CriticalEvent) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedEvents = () => {
    if (!sortConfig) return events;

    return [...events].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc'
        ? (aValue as any) - (bValue as any)
        : (bValue as any) - (aValue as any);
    });
  };

  const sortedEvents = getSortedEvents();

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    } as React.CSSProperties,
    header: {
      padding: isCompact ? '0.75rem 1rem' : '1rem 1.5rem',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb',
    } as React.CSSProperties,
    title: {
      fontSize: isCompact ? '0.875rem' : '1rem',
      fontWeight: 'bold',
      color: '#111827',
      margin: 0,
    } as React.CSSProperties,
    tableWrapper: {
      flex: 1,
      overflowY: 'auto' as const,
      overflowX: 'hidden' as const,
    } as React.CSSProperties,
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      fontSize: isCompact ? '0.75rem' : '0.875rem',
    } as React.CSSProperties,
    thead: {
      position: 'sticky' as const,
      top: 0,
      backgroundColor: '#f3f4f6',
      borderBottom: '2px solid #e5e7eb',
      zIndex: 10,
    } as React.CSSProperties,
    th: {
      padding: isCompact ? '0.5rem 0.75rem' : '0.75rem 1rem',
      textAlign: 'left' as const,
      fontWeight: 'bold',
      color: '#374151',
      cursor: 'pointer' as const,
      userSelect: 'none' as const,
      whiteSpace: 'nowrap' as const,
      transition: 'background-color 0.2s',
    } as React.CSSProperties,
    thHover: {
      backgroundColor: '#e5e7eb',
    } as React.CSSProperties,
    tr: {
      borderBottom: '1px solid #e5e7eb',
      transition: 'background-color 0.2s',
    } as React.CSSProperties,
    trHover: {
      backgroundColor: '#f9fafb',
    } as React.CSSProperties,
    td: {
      padding: isCompact ? '0.5rem 0.75rem' : '0.75rem 1rem',
      color: '#374151',
    } as React.CSSProperties,
    severityBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isCompact ? '0.25rem 0.5rem' : '0.375rem 0.75rem',
      borderRadius: '0.375rem',
      fontSize: isCompact ? '0.625rem' : '0.75rem',
      fontWeight: 'bold',
      color: 'white',
    } as React.CSSProperties,
    emptyState: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '200px',
      color: '#9ca3af',
      fontSize: '0.875rem',
    } as React.CSSProperties,
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 1.5rem',
      borderTop: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb',
      fontSize: '0.875rem',
      color: '#6b7280',
    } as React.CSSProperties,
    footerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    } as React.CSSProperties,
    pageSelect: {
      padding: '0.375rem 0.5rem',
      fontSize: '0.875rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      backgroundColor: 'white',
      cursor: 'pointer',
    } as React.CSSProperties,
    footerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    } as React.CSSProperties,
    paginationButton: (disabled: boolean) => ({
      padding: '0.375rem 0.75rem',
      fontSize: '0.875rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      backgroundColor: disabled ? '#f3f4f6' : 'white',
      cursor: disabled ? 'not-allowed' : 'pointer',
      color: disabled ? '#9ca3af' : '#374151',
      transition: 'all 0.2s',
    } as React.CSSProperties),
  };

  // Calculate pagination
  const totalPages = Math.ceil(events.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEvents = events.slice(startIndex, endIndex);

  if (events.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>{config.title || 'Critical Events'}</h3>
        </div>
        <div style={styles.emptyState}>
          {config.emptyMessage || 'No events to display'}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              {config.columns.map((column) => (
                <th
                  key={String(column.key)}
                  style={{
                    ...styles.th,
                    width: column.width,
                  }}
                  onClick={() => column.sortable && handleSort(column.key)}
                  onMouseEnter={(e) =>
                    column.sortable &&
                    (e.currentTarget.style.backgroundColor = '#e5e7eb')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '#f3f4f6')
                  }
                >
                  {column.label}
                  {sortConfig?.key === column.key && (
                    <span style={{ marginLeft: '0.25rem' }}>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
              {/* Details Column Header */}
              <th style={{ ...styles.th, width: '80px' }}>
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedEvents.map((event) => (
              <tr
                key={event.id}
                style={styles.tr}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  if (config.onRowClick) {
                    e.currentTarget.style.cursor = 'pointer';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => config.onRowClick?.(event)}
              >
                {config.columns.map((column) => (
                  <td key={String(column.key)} style={styles.td}>
                    {column.render ? (
                      column.render(event[column.key], event)
                    ) : column.key === 'severity' ? (
                      <span
                        style={{
                          ...styles.severityBadge,
                          backgroundColor: getSeverityColor(
                            event[column.key] as string
                          ),
                        }}
                      >
                        {event[column.key] as string}
                      </span>
                    ) : (
                      (event[column.key] as React.ReactNode)
                    )}
                  </td>
                ))}
                {/* Details Button Column */}
                <td style={styles.td}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                      setIsModalOpen(true);
                    }}
                    style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.8rem',
                      backgroundColor: '#4f46e5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#4338ca';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#4f46e5';
                    }}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

      {/* Footer with pagination */}
      <div style={styles.footer}>
        <div style={styles.footerLeft}>
          <span>
            Showing {events.length === 0 ? 0 : startIndex + 1} to{' '}
            {Math.min(endIndex, events.length)} of {events.length} events
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={styles.pageSelect}
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        <div style={styles.footerRight}>
          <button
            style={styles.paginationButton(currentPage === 1)}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            ← Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            style={styles.paginationButton(currentPage === totalPages)}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

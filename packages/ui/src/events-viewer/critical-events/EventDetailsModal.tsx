'use client';

import React from 'react';
import { Map, POI } from '../../map';
import { CriticalEvent } from '../types';

interface EventDetailsModalProps {
  event: CriticalEvent;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventDetailsModal({
  event,
  isOpen,
  onClose,
}: EventDetailsModalProps) {
  if (!isOpen) return null;

  // Parse coordinates - handle string format "lat, lng"
  const coords = event.coordinates
    .split(',')
    .map((c) => parseFloat(c.trim()))
    .filter((c) => !isNaN(c));

  const mapCenter: [number, number] =
    coords.length === 2 ? ([coords[0], coords[1]] as [number, number]) : [32.7767, -96.797]; // Default to Dallas

  const getSeverityColor = (severity: string): string => {
    const colors: Record<string, string> = {
      Critical: '#dc2626',
      Warning: '#eab308',
      Info: '#3b82f6',
    };
    return colors[severity] || '#6b7280';
  };

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    } as React.CSSProperties,
    modal: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
      width: '90%',
      maxWidth: '900px',
      height: '600px',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
    } as React.CSSProperties,
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 1.5rem',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb',
    } as React.CSSProperties,
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    } as React.CSSProperties,
    headerTitle: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#6b7280',
      margin: 0,
    } as React.CSSProperties,
    eventName: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#111827',
      margin: 0,
    } as React.CSSProperties,
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#6b7280',
      padding: 0,
      width: '2rem',
      height: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'color 0.2s',
    } as React.CSSProperties,
    content: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
      gap: 0,
    } as React.CSSProperties,
    leftColumn: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1.5rem',
    } as React.CSSProperties,
    rightColumn: {
      flex: 1,
      borderLeft: '1px solid #e5e7eb',
      overflow: 'hidden',
    } as React.CSSProperties,
    section: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.75rem',
    } as React.CSSProperties,
    sectionTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#111827',
      margin: 0,
    } as React.CSSProperties,
    sectionContent: {
      display: 'flex',
      gap: '1rem',
    } as React.CSSProperties,
    column: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.75rem',
    } as React.CSSProperties,
    infoItem: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.25rem',
    } as React.CSSProperties,
    infoLabel: {
      fontSize: '0.75rem',
      fontWeight: '500',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    } as React.CSSProperties,
    infoValue: {
      fontSize: '0.9rem',
      fontWeight: '500',
      color: '#111827',
    } as React.CSSProperties,
    severityBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.35rem 0.75rem',
      borderRadius: '0.375rem',
      fontSize: '0.8rem',
      fontWeight: '500',
      color: 'white',
      width: 'fit-content',
    } as React.CSSProperties,
    description: {
      fontSize: '0.9rem',
      color: '#374151',
      lineHeight: '1.5',
    } as React.CSSProperties,
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div>
              <h3 style={styles.headerTitle}>Details</h3>
              <h2 style={styles.eventName}>{event.type}</h2>
            </div>
          </div>
          <button
            style={styles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#111827';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Left Column */}
          <div style={styles.leftColumn}>
            {/* Section 1: Event Details Grid */}
            <div style={styles.section}>
              <div style={styles.sectionContent}>
                {/* Left Sub-column */}
                <div style={styles.column}>
                  <div style={styles.infoItem}>
                    <label style={styles.infoLabel}>Date</label>
                    <span style={styles.infoValue}>{event.time}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <label style={styles.infoLabel}>City</label>
                    <span style={styles.infoValue}>{event.city}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <label style={styles.infoLabel}>Coordinates</label>
                    <span style={styles.infoValue}>{event.coordinates}</span>
                  </div>
                </div>

                {/* Right Sub-column */}
                <div style={styles.column}>
                  <div style={styles.infoItem}>
                    <label style={styles.infoLabel}>Severity</label>
                    <div
                      style={{
                        ...styles.severityBadge,
                        backgroundColor: getSeverityColor(event.severity),
                      }}
                    >
                      {event.severity}
                    </div>
                  </div>
                  <div style={styles.infoItem}>
                    <label style={styles.infoLabel}>Type</label>
                    <span style={styles.infoValue}>{event.type}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <label style={styles.infoLabel}>Count</label>
                    <span style={styles.infoValue}>{event.count}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Expected End & Affected Direction */}
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Event Status</h4>
              <div style={styles.sectionContent}>
                <div style={styles.column}>
                  <div style={styles.infoItem}>
                    <label style={styles.infoLabel}>Expected to end on</label>
                    <span style={{ ...styles.infoValue, color: '#10b981' }}>
                      {event.expectedEndTime}
                    </span>
                  </div>
                </div>
                <div style={styles.column}>
                  <div style={styles.infoItem}>
                    <label style={styles.infoLabel}>Affected Direction</label>
                    <span
                      style={{
                        ...styles.infoValue,
                        backgroundColor: '#1f2937',
                        color: 'white',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '0.375rem',
                        width: 'fit-content',
                        fontSize: '0.85rem',
                      }}
                    >
                      {event.affectedDirection}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Description */}
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Description</h4>
              <p style={styles.description}>{event.description}</p>
            </div>
          </div>

          {/* Right Column - Map */}
          <div style={styles.rightColumn}>
            <Map center={mapCenter} zoom={16}>
              <POI
                coordinates={{ lat: mapCenter[0], lng: mapCenter[1] }}
                title={event.type}
                description={event.city}
                eventType={event.type}
                expectedEndTime={event.expectedEndTime}
                affectedDirection={event.affectedDirection}
              />
            </Map>
          </div>
        </div>
      </div>
    </div>
  );
}

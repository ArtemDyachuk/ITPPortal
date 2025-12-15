"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Map, POI } from '../../../../map';
import { CriticalEvent } from '../../../types';

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
  // avoid rendering on server / before mount
  const [mounted, setMounted] = useState(false);
  const portalElRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const el = document.createElement('div');
    el.setAttribute('data-portal', 'event-details-modal');
    document.body.appendChild(el);
    portalElRef.current = el;

    return () => {
      setMounted(false);
      if (portalElRef.current && portalElRef.current.parentNode) {
        portalElRef.current.parentNode.removeChild(portalElRef.current);
      }
      portalElRef.current = null;
    };
  }, []);

  if (!isOpen || !mounted) return null;

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
      Info: '#3fa2ff',
    };
    return colors[severity] || '#6b7280';
  };

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center z-[99999] bg-gray-50/40 dark:bg-slate-950/60 backdrop-blur-[2px]"
      onClick={onClose}
      // Add Safari-compatible backdrop filter
      style={{ WebkitBackdropFilter: 'blur(2px)', backdropFilter: 'blur(2px)' }}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 m-0">Details</h3>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white m-0">{event.type}</h2>
            </div>
          </div>
          <button
            className="bg-none border-none text-xl cursor-pointer text-gray-500 dark:text-gray-400 p-0 w-8 h-8 flex items-center justify-center rounded hover:text-gray-900 dark:hover:text-white transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden min-h-0 md:grid md:grid-cols-2 md:gap-0">
          {/* Left Column */}
          <div className="p-6 overflow-y-auto flex flex-col gap-6 min-h-0">
            {/* Section 1: Event Details Grid */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                {/* Left Sub-column */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date</label>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{event.time}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">City</label>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{event.city}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Coordinates</label>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{event.coordinates}</span>
                  </div>
                </div>

                {/* Right Sub-column */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Severity</label>
                    <div className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-xs font-medium text-white w-fit`} style={{ backgroundColor: getSeverityColor(event.severity) }}>
                      {event.severity}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Type</label>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{event.type}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Count</label>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{event.count}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Expected End & Affected Direction */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white m-0">Event Status</h4>
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Expected to end on</label>
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{event.expectedEndTime}</span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Affected Direction</label>
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-800 dark:bg-slate-700 text-white w-fit">
                      {event.affectedDirection}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Description */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white m-0">Description</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{event.description}</p>
            </div>
          </div>

          {/* Right Column - Map (stacked on mobile) */}
          <div className="border-t md:border-t-0 md:border-l border-gray-200 dark:border-slate-700 overflow-hidden h-72 md:h-auto min-h-0">
            <div className="h-full w-full min-h-0">
              <Map center={mapCenter} zoom={16}>
                <POI
                  coordinates={{ lat: mapCenter[0], lng: mapCenter[1] }}
                  title={event.type}
                  description={""}
                  eventType={event.type}
                  expectedEndTime={event.expectedEndTime}
                  affectedDirection={event.affectedDirection}
                />
              </Map>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, portalElRef.current ?? document.body);
}

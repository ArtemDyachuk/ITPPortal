'use client';

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  icon?: ReactNode;
}

export default function Modal({ isOpen, onClose, children, title, icon }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-lg p-5 max-w-[90vw] max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              {icon && <span className="inline-flex items-center">{icon}</span>}
              <h2 className="m-0 text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="bg-transparent border-0 text-2xl cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
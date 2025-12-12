import React from 'react';
import FiltersIcon from '../../../../icons/FiltersIcon';

interface MapOverlayButtonProps {
  title: string;
  onClick: () => void;
  position?: 'top-right' | 'top-left' | 'top-right-offset' | 'top-right-inline';
  icon?: React.ReactNode;
}

export default function MapOverlayButton({ title, onClick, position = 'top-right', icon }: MapOverlayButtonProps) {
  const positionClass =
    position === 'top-left' ? 'top-2.5 left-2.5' :
    position === 'top-right-offset' ? 'top-[60px] right-2.5' :
    position === 'top-right-inline' ? 'top-2.5 right-[70px]' :
    'top-2.5 right-2.5';

  return (
    <button
      onClick={onClick}
      aria-label={title}
      className={`absolute z-10 p-2 bg-blue-500 text-white border-0 rounded-md cursor-pointer text-sm font-medium shadow-sm flex items-center justify-center ${positionClass}`}
    >
      {icon || <FiltersIcon size={16} className="text-white" />}
    </button>
  );
}

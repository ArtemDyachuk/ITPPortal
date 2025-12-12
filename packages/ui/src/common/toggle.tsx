"use client";

import React from 'react';

interface ToggleProps {
  checked?: boolean;
  onChange: () => void;
  disabled?: boolean;
  className?: string;
}

export const ToggleSwitch = React.memo(({ checked = false, onChange, disabled = false, className = '' }: ToggleProps) => {
  const isChecked = Boolean(checked);

  return (
    <button
      type="button"
      aria-pressed={isChecked}
      onClick={disabled ? undefined : onChange}
      className={`relative w-10 h-5 rounded-full transition-colors ${isChecked ? 'bg-emerald-500 dark:bg-emerald-600' : 'bg-gray-300 dark:bg-slate-600'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white dark:bg-gray-100 rounded-full shadow transform transition-transform ${isChecked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
});

ToggleSwitch.displayName = 'ToggleSwitch';

export default ToggleSwitch;

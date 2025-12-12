'use client';

import React from 'react';

interface PopupContentProps {
  title?: string;
  expectedEndTime?: string;
  affectedDirection?: string;
  details?: string[];
  description?: string;
}

const PopupContent: React.FC<PopupContentProps> = ({
  title,
  expectedEndTime,
  affectedDirection,
  details,
  description,
}) => {
  return (
    <div className="max-w-xs min-w-[250px] font-sans bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 p-3 rounded-lg shadow-sm">
      {title && (
        <h3 className="m-0 mb-2.5 text-gray-800 dark:text-gray-200 font-semibold">{title}</h3>
      )}
      {(expectedEndTime || affectedDirection) && (
        <div className="mb-2 flex items-start justify-between gap-3 w-full">
          {expectedEndTime && (
            <div className="flex flex-col flex-1 min-w-0">
              <div className="text-xs text-gray-500 dark:text-gray-400">Expected to end on</div>
              <div className="bg-green-600 dark:bg-green-700 text-white px-2 py-1 rounded inline-block text-sm font-medium truncate">
                {expectedEndTime}
              </div>
            </div>
          )}
          {affectedDirection && (
            <div className="flex flex-col flex-1 min-w-0">
              <div className="text-xs text-gray-500 dark:text-gray-400">Affected Direction</div>
              <div className="bg-slate-700 dark:bg-slate-600 text-white px-2 py-1 rounded inline-block text-sm font-medium truncate text-right">
                {affectedDirection}
              </div>
            </div>
          )}
        </div>
      )}
      {details && details.length > 0 && (
        <ul className="mb-2.5 list-disc list-inside">
          {details.map((detail, index) => {
            const cleaned = detail.replace(/^\s*(?:[-•\u2022]\s*)+/, '');
            return (
              <li key={index} className="text-gray-700 dark:text-gray-300 leading-tight">{cleaned}</li>
            );
          })}
        </ul>
      )}
      {description && (
        <div className="mt-2.5 text-gray-600 dark:text-gray-400">{description}</div>
      )}
    </div>
  );
};

export default PopupContent;

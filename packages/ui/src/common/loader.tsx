"use client";

import React from "react";

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = "Loading map..." }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-[999]">
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-[42px] h-[42px] border-[5px] border-gray-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"
        />
        <div className="text-gray-700 dark:text-gray-300 text-[13px]">{message}</div>
      </div>
    </div>
  );
};

export default Loader;

"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
}

export const Button = ({ children, className = "", appName }: ButtonProps) => {
  const baseStyles = "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors";
  
  return (
    <button
      className={`${baseStyles} ${className}`}
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
};

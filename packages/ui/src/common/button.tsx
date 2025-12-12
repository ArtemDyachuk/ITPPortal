"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: "primary" | "secondary";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", variant = "primary", ...props }, ref) => {
    const base = "px-4 py-2 rounded-lg transition-colors inline-flex items-center justify-center";
    const variantClass =
      variant === "primary"
        ? "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800"
        : "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600";

    return (
      <button ref={ref} className={`${base} ${variantClass} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

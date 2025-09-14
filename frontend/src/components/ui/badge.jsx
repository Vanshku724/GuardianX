// src/components/ui/badge.jsx
import React from "react";
import clsx from "clsx";

export function Badge({ children, variant = "default", className }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium",
        {
          "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200":
            variant === "default",
          "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100":
            variant === "success",
          "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100":
            variant === "destructive",
          "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100":
            variant === "info",
        },
        className
      )}
    >
      {children}
    </span>
  );
}

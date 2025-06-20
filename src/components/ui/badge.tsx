import * as React from "react";

export function Badge({ children, className = "", ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-200 text-gray-800 ${className}`} {...props}>
      {children}
    </span>
  );
} 
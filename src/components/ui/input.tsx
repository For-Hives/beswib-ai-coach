import * as React from "react";

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`border px-3 py-2 rounded ${className}`} {...props} />;
} 
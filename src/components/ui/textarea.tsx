import * as React from "react";

export function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`border rounded px-3 py-2 ${className}`} {...props} />;
} 
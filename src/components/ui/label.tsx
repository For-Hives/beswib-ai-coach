import * as React from "react";

export function Label({ children, htmlFor, className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label htmlFor={htmlFor} className={`font-medium ${className}`} {...props}>{children}</label>;
} 
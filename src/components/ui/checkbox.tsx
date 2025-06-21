import * as React from "react";

export function Checkbox({ checked, onCheckedChange, className = "", ...props }: { checked?: boolean; onCheckedChange?: (checked: boolean) => void; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={e => onCheckedChange && onCheckedChange(e.target.checked)}
      className={`form-checkbox ${className}`}
      {...props}
    />
  );
} 
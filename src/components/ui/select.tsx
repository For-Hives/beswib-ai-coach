import * as React from "react";

export function Select({ value, onValueChange, children }: { value: string; onValueChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={e => onValueChange(e.target.value)}
      className="w-full border rounded px-3 py-2"
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SelectValue({ placeholder }: { placeholder: string }) {
  return <option value="" disabled hidden>{placeholder}</option>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
} 
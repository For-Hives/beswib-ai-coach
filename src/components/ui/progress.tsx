import * as React from "react";

export function Progress({ value = 0, className = "", ...props }: { value?: number; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`w-full bg-gray-200 rounded h-3 ${className}`} {...props}>
      <div
        className="bg-blue-600 h-3 rounded"
        style={{ width: `${value}%`, transition: "width 0.3s" }}
      />
    </div>
  );
} 
import * as React from "react";

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  return <div className="relative inline-block">{children}</div>;
}

export function DropdownMenuTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function DropdownMenuContent({ children, align, className = "" }: { children: React.ReactNode; align?: string; className?: string }) {
  return <div className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 ${className}`}>{children}</div>;
}

export function DropdownMenuItem({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" {...props}>{children}</div>;
} 
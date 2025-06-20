import * as React from "react";

export function Sidebar({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <nav className={`bg-white min-h-screen w-64 ${className}`} {...props}>{children}</nav>;
}

export function SidebarContent({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props}>{children}</div>;
}

export function SidebarGroup({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props}>{children}</div>;
}

export function SidebarGroupContent({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props}>{children}</div>;
}

export function SidebarMenu({ children, className = "", ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={className} {...props}>{children}</ul>;
}

export function SidebarMenuItem({ children, className = "", ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li className={className} {...props}>{children}</li>;
}

export function SidebarMenuButton({ children, asChild, isActive, className = "", ...props }: any) {
  return (
    <button className={`text-left w-full px-2 py-1 rounded ${isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function SidebarHeader({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`border-b ${className}`} {...props}>{children}</div>;
}

export function SidebarTrigger({ ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={"mr-2 p-2 rounded bg-gray-200 hover:bg-gray-300 "+(props.className||"")}>☰</button>;
} 
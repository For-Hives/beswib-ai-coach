import * as React from "react";
import { useState, useRef, useEffect } from "react";

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen(!isOpen);

  // Ferme le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fournit l'état et la fonction de bascule aux enfants
  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isOpen, toggle } as React.Attributes & { isOpen: boolean, toggle: () => void });
        }
        return child;
      })}
    </div>
  );
}

export function DropdownMenuTrigger({ children, toggle }: { children: React.ReactNode, toggle?: () => void }) {
  return <div onClick={toggle}>{children}</div>;
}

export function DropdownMenuContent({ children, align, className = "", isOpen }: { children: React.ReactNode; align?: string; className?: string, isOpen?: boolean }) {
  if (!isOpen) return null;
  
  return (
    <div className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 ${className}`}>
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" {...props}>{children}</div>;
} 
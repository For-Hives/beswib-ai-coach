import * as React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "icon";
};

const variantClasses: Record<string, string> = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-900",
  link: "bg-transparent underline text-blue-600 hover:text-blue-700 px-0 h-auto",
};

const sizeClasses: Record<string, string> = {
  default: "py-2 px-4 text-base",
  icon: "p-2 h-8 w-8 flex items-center justify-center",
};

export function Button({
  children,
  className = "",
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded transition font-medium ${variantClasses[variant] || ""} ${sizeClasses[size] || ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 
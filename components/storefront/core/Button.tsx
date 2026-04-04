"use client";

import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  style,
  ...rest
}: Props) {
  const sizeClasses = {
    sm: "px-2 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: "var(--b-color)", color: "#fff" },
    secondary: { backgroundColor: "var(--s-color)", color: "#fff" },
    outline: {
      backgroundColor: "transparent",
      color: "var(--p-color)",
      border: "2px solid var(--p-color)",
    },
  };

  return (
    <button
      className={`font-bold transition-opacity hover:opacity-90 cursor-pointer ${sizeClasses[size]} ${className}`}
      style={{
        borderRadius: "var(--radius)",
        ...variantStyles[variant],
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

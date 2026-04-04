"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps {
  label: string;
  href: string;
  variant: "primary" | "outline" | "ghost";
  size: "sm" | "md" | "lg";
  align: "right" | "center" | "left" | "full";
  radius: "none" | "sm" | "md" | "lg" | "full";
  bgColor: string;
  textColor: string;
  marginTop: number;
  marginBottom: number;
}

const RADIUS_MAP: Record<ButtonProps["radius"], string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export const Button = ({
  label,
  href,
  variant,
  size,
  align,
  radius,
  bgColor,
  textColor,
  marginTop,
  marginBottom,
}: ButtonProps) => {
  const isExternal = href.startsWith("http");

  const variantClasses = {
    primary: !bgColor
      ? "bg-[var(--b-color)] text-white hover:opacity-90"
      : "hover:opacity-90",
    outline: !bgColor
      ? "border border-[var(--p-color)] text-[var(--p-color)] hover:bg-[var(--p-color)] hover:text-white"
      : "border hover:opacity-90",
    ghost: !bgColor
      ? "text-[var(--p-color)] hover:bg-[var(--p-color)]/10"
      : "hover:opacity-80",
  }[variant];

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }[size];

  const alignClasses = {
    right: "justify-end",
    center: "justify-center",
    left: "justify-start",
    full: "w-full",
  }[align];

  const btnStyle: React.CSSProperties = {
    backgroundColor: bgColor || undefined,
    color: textColor || undefined,
    marginTop: marginTop > 0 ? `${marginTop}px` : undefined,
    marginBottom: marginBottom > 0 ? `${marginBottom}px` : undefined,
  };

  const buttonContent = (
    <span
      className={cn(
        "inline-flex items-center transition-all duration-200 font-medium cursor-pointer",
        variantClasses,
        sizeClasses,
        RADIUS_MAP[radius] ?? RADIUS_MAP.md,
        align === "full" && "w-full justify-center",
      )}
      style={
        bgColor
          ? { backgroundColor: bgColor, color: textColor || undefined }
          : undefined
      }
    >
      {label}
    </span>
  );

  return (
    <div className={cn("flex", alignClasses)} style={btnStyle}>
      {isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(align === "full" && "w-full")}
        >
          {buttonContent}
        </a>
      ) : (
        <Link href={href} className={cn(align === "full" && "w-full")}>
          {buttonContent}
        </Link>
      )}
    </div>
  );
};

Button.defaultProps = {
  label: "اضغط هنا",
  href: "#",
  variant: "primary",
  size: "md",
  align: "center",
  radius: "md",
  bgColor: "",
  textColor: "",
  marginTop: 0,
  marginBottom: 0,
};

export default Button;

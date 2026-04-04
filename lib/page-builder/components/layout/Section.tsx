import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionProps {
  backgroundColor: "transparent" | "light" | "dark" | "primary" | "custom";
  customBgColor: string;
  paddingY: "none" | "sm" | "md" | "lg" | "xl";
  paddingX: "none" | "sm" | "md" | "lg";
  maxWidth: "sm" | "md" | "lg" | "xl" | "full";
  marginTop: number;
  marginBottom: number;
  children?: ReactNode;
}

export const Section = ({
  backgroundColor,
  customBgColor,
  paddingY,
  paddingX,
  maxWidth,
  marginTop,
  marginBottom,
  children,
}: SectionProps) => {
  const bgClass = {
    transparent: "bg-transparent",
    light: "bg-[var(--color-bg,#f8fafc)]",
    dark: "bg-[var(--s-color)]",
    primary: "bg-[var(--p-color)]",
    custom: "",
  }[backgroundColor];

  const paddingYClass = {
    none: "py-0",
    sm: "py-4",
    md: "py-8",
    lg: "py-16",
    xl: "py-24",
  }[paddingY];

  const paddingXClass = {
    none: "px-0",
    sm: "px-4",
    md: "px-8",
    lg: "px-16",
  }[paddingX];

  const maxWidthClass = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  }[maxWidth];

  const sectionStyle: React.CSSProperties = {
    backgroundColor:
      backgroundColor === "custom" && customBgColor ? customBgColor : undefined,
    marginTop: marginTop > 0 ? `${marginTop}px` : undefined,
    marginBottom: marginBottom > 0 ? `${marginBottom}px` : undefined,
  };

  return (
    <section className={cn(bgClass, paddingYClass)} style={sectionStyle}>
      <div className={cn(maxWidthClass, "mx-auto", paddingXClass)}>
        {children}
      </div>
    </section>
  );
};

Section.defaultProps = {
  backgroundColor: "transparent",
  customBgColor: "",
  paddingY: "md",
  paddingX: "sm",
  maxWidth: "xl",
  marginTop: 0,
  marginBottom: 0,
};

export default Section;

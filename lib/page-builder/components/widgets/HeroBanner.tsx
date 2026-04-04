"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface HeroBannerProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  backgroundColor: "primary" | "dark" | "light" | "custom";
  customBgColor: string;
  overlayOpacity: "none" | "light" | "medium" | "dark";
  textColor: "white" | "dark";
  buttonLabel: string;
  buttonHref: string;
  showButton: boolean;
  buttonRadius: "none" | "sm" | "md" | "lg" | "full";
  buttonBgColor: string;
  buttonTextColor: string;
  minHeight: "sm" | "md" | "lg" | "full";
  contentAlign: "right" | "center" | "left";
  titleSize: "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  subtitleSize: "sm" | "base" | "lg" | "xl";
  paddingTop: number;
  paddingBottom: number;
  paddingX: number;
  marginTop: number;
  marginBottom: number;
}

const BTN_RADIUS: Record<HeroBannerProps["buttonRadius"], string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

const TITLE_SIZE: Record<HeroBannerProps["titleSize"], string> = {
  xl: "text-xl md:text-2xl",
  "2xl": "text-2xl md:text-3xl",
  "3xl": "text-3xl md:text-4xl",
  "4xl": "text-4xl md:text-5xl",
  "5xl": "text-5xl md:text-6xl",
  "6xl": "text-6xl md:text-7xl",
};

const SUBTITLE_SIZE: Record<HeroBannerProps["subtitleSize"], string> = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg md:text-xl",
  xl: "text-xl md:text-2xl",
};

export const HeroBanner = ({
  title,
  subtitle,
  backgroundImage,
  backgroundColor,
  customBgColor,
  overlayOpacity,
  textColor,
  buttonLabel,
  buttonHref,
  showButton,
  buttonRadius,
  buttonBgColor,
  buttonTextColor,
  minHeight,
  contentAlign,
  titleSize,
  subtitleSize,
  paddingTop,
  paddingBottom,
  paddingX,
  marginTop,
  marginBottom,
}: HeroBannerProps) => {
  const minHeightClass = {
    sm: "min-h-64",
    md: "min-h-96",
    lg: "min-h-[500px]",
    full: "min-h-screen",
  }[minHeight];

  const bgColorClass = {
    primary: "bg-[var(--p-color)]",
    dark: "bg-[var(--s-color)]",
    light: "bg-[var(--color-bg,#f8fafc)]",
    custom: "",
  }[backgroundColor];

  const overlayOpacityValue = {
    none: 0,
    light: 0.2,
    medium: 0.5,
    dark: 0.7,
  }[overlayOpacity];

  const textColorClass =
    textColor === "white" ? "text-white" : "text-[var(--t-color)]";
  const headingColorClass =
    textColor === "white" ? "text-white" : "text-[var(--h-color)]";

  const alignClass = {
    right: "text-right items-end",
    center: "text-center items-center",
    left: "text-left items-start",
  }[contentAlign];

  const sectionStyle: React.CSSProperties = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundColor:
      backgroundColor === "custom" && customBgColor ? customBgColor : undefined,
    paddingTop: paddingTop > 0 ? `${paddingTop}px` : undefined,
    paddingBottom: paddingBottom > 0 ? `${paddingBottom}px` : undefined,
    paddingLeft: paddingX > 0 ? `${paddingX}px` : undefined,
    paddingRight: paddingX > 0 ? `${paddingX}px` : undefined,
    marginTop: marginTop > 0 ? `${marginTop}px` : undefined,
    marginBottom: marginBottom > 0 ? `${marginBottom}px` : undefined,
  };

  const btnStyle: React.CSSProperties = {
    backgroundColor: buttonBgColor || undefined,
    color: buttonTextColor || undefined,
  };

  return (
    <section
      className={cn(
        "relative w-full flex flex-col justify-center bg-cover bg-center overflow-hidden",
        paddingTop === 0 && paddingBottom === 0 && "py-12",
        paddingX === 0 && "px-6",
        minHeightClass,
        bgColorClass,
      )}
      style={sectionStyle}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black pointer-events-none"
        style={{ opacity: overlayOpacityValue }}
      />

      {/* Content */}
      <div
        className={cn(
          "relative z-10 w-full container flex flex-col gap-6",
          alignClass,
        )}
      >
        <h1
          className={cn(
            "font-bold leading-tight",
            TITLE_SIZE[titleSize] ?? TITLE_SIZE["4xl"],
            headingColorClass,
          )}
        >
          {title}
        </h1>
        <p
          className={cn(
            "max-w-2xl opacity-90",
            SUBTITLE_SIZE[subtitleSize] ?? SUBTITLE_SIZE.lg,
            textColorClass,
          )}
        >
          {subtitle}
        </p>

        {showButton && (
          <a
            href={buttonHref}
            className={cn(
              "inline-flex items-center px-8 py-4 font-bold hover:scale-105 transition-transform duration-200 shadow-lg",
              !buttonBgColor && "bg-[var(--b-color)] text-white",
              BTN_RADIUS[buttonRadius] ?? BTN_RADIUS.full,
            )}
            style={btnStyle}
          >
            {buttonLabel}
          </a>
        )}
      </div>
    </section>
  );
};

HeroBanner.defaultProps = {
  title: "عنوان رئيسي جذاب",
  subtitle: "وصف مختصر يشرح ما تقدمه",
  backgroundImage: "https://placehold.co/1400x600/0f172a/ffffff?text=Hero",
  backgroundColor: "dark",
  customBgColor: "",
  overlayOpacity: "medium",
  textColor: "white",
  buttonLabel: "اكتشف الآن",
  buttonHref: "#",
  showButton: true,
  buttonRadius: "full",
  buttonBgColor: "",
  buttonTextColor: "",
  minHeight: "md",
  contentAlign: "center",
  titleSize: "4xl",
  subtitleSize: "lg",
  paddingTop: 0,
  paddingBottom: 0,
  paddingX: 0,
  marginTop: 0,
  marginBottom: 0,
};

export default HeroBanner;

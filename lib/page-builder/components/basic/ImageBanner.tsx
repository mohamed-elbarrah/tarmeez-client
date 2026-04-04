"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ImageBannerProps {
  src: string;
  alt: string;
  linkHref: string;
  height: "sm" | "md" | "lg" | "full" | "custom";
  customHeight: number;
  objectFit: "cover" | "contain";
  radius: "none" | "sm" | "md" | "lg" | "xl";
  paddingTop: number;
  paddingBottom: number;
  paddingX: number;
  marginTop: number;
  marginBottom: number;
}

const HEIGHT_CLASS: Record<
  Exclude<ImageBannerProps["height"], "custom">,
  string
> = {
  sm: "h-48",
  md: "h-64",
  lg: "h-96",
  full: "h-screen",
};

const RADIUS_CLASS: Record<ImageBannerProps["radius"], string> = {
  none: "rounded-none",
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-3xl",
};

export const ImageBanner = ({
  src,
  alt,
  linkHref,
  height,
  customHeight,
  objectFit,
  radius,
  paddingTop,
  paddingBottom,
  paddingX,
  marginTop,
  marginBottom,
}: ImageBannerProps) => {
  const heightClass =
    height === "custom" ? "" : (HEIGHT_CLASS[height] ?? HEIGHT_CLASS.md);
  const radiusClass = RADIUS_CLASS[radius] ?? RADIUS_CLASS.none;

  const wrapStyle: React.CSSProperties = {
    height:
      height === "custom" && customHeight > 0 ? `${customHeight}px` : undefined,
    paddingTop: paddingTop > 0 ? `${paddingTop}px` : undefined,
    paddingBottom: paddingBottom > 0 ? `${paddingBottom}px` : undefined,
    paddingLeft: paddingX > 0 ? `${paddingX}px` : undefined,
    paddingRight: paddingX > 0 ? `${paddingX}px` : undefined,
    marginTop: marginTop > 0 ? `${marginTop}px` : undefined,
    marginBottom: marginBottom > 0 ? `${marginBottom}px` : undefined,
  };

  const img = (
    <img
      src={src}
      alt={alt}
      className={cn("w-full h-full", `object-${objectFit}`)}
      loading="lazy"
    />
  );

  return (
    <div
      className={cn("w-full overflow-hidden", heightClass, radiusClass)}
      style={wrapStyle}
    >
      {linkHref ? (
        <a
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  );
};

ImageBanner.defaultProps = {
  src: "https://placehold.co/1200x400/e0f2fe/0284c7?text=Image",
  alt: "",
  linkHref: "",
  height: "md",
  customHeight: 300,
  objectFit: "cover",
  radius: "none",
  paddingTop: 0,
  paddingBottom: 0,
  paddingX: 0,
  marginTop: 0,
  marginBottom: 0,
};

export default ImageBanner;

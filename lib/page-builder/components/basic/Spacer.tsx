"use client";

import React from "react";

export interface SpacerProps {
  size: "sm" | "md" | "lg" | "xl" | "custom";
  customSize: number;
}

export const Spacer = ({ size, customSize }: SpacerProps) => {
  if (size === "custom") {
    return (
      <div style={{ height: customSize > 0 ? `${customSize}px` : "32px" }} />
    );
  }
  const heightClass = {
    sm: "h-4",
    md: "h-8",
    lg: "h-16",
    xl: "h-24",
  }[size];

  return <div className={heightClass} />;
};

Spacer.defaultProps = {
  size: "md",
  customSize: 40,
};

export default Spacer;

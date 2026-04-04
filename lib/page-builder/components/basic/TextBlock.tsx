"use client";

import React from "react";

export interface TextBlockProps {
  content: string;
  align: "right" | "center" | "left";
  size: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  color: "heading" | "text" | "primary";
  fontWeight: "normal" | "medium" | "semibold" | "bold" | "black";
  lineHeight: "tight" | "normal" | "relaxed" | "loose";
  paddingTop: number;
  paddingBottom: number;
  paddingX: number;
  marginTop: number;
  marginBottom: number;
}

export const TextBlock = ({
  content,
  align,
  size,
  color,
  fontWeight,
  lineHeight,
  paddingTop,
  paddingBottom,
  paddingX,
  marginTop,
  marginBottom,
}: TextBlockProps) => {
  const colorValue = {
    heading: "var(--h-color)",
    text: "var(--t-color)",
    primary: "var(--p-color)",
  }[color];

  const fontSize = {
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
  }[size];

  const fontWeightValue = {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    black: "900",
  }[fontWeight];

  const lineHeightValue = {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
    loose: "2",
  }[lineHeight];

  return (
    <div
      style={{
        color: colorValue,
        textAlign: align as any,
        fontSize,
        fontWeight: fontWeightValue,
        lineHeight: lineHeightValue,
        whiteSpace: "pre-wrap",
        paddingTop: paddingTop > 0 ? `${paddingTop}px` : undefined,
        paddingBottom: paddingBottom > 0 ? `${paddingBottom}px` : undefined,
        paddingLeft: paddingX > 0 ? `${paddingX}px` : undefined,
        paddingRight: paddingX > 0 ? `${paddingX}px` : undefined,
        marginTop: marginTop > 0 ? `${marginTop}px` : undefined,
        marginBottom: marginBottom > 0 ? `${marginBottom}px` : undefined,
      }}
      className="w-full"
    >
      {content}
    </div>
  );
};

TextBlock.defaultProps = {
  content: "أضف نصك هنا",
  align: "right",
  size: "base",
  color: "text",
  fontWeight: "normal",
  lineHeight: "normal",
  paddingTop: 0,
  paddingBottom: 0,
  paddingX: 0,
  marginTop: 0,
  marginBottom: 0,
};

export default TextBlock;

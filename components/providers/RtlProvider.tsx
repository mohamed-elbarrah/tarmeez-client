"use client";

import { DirectionProvider } from "@radix-ui/react-direction";

export default function RtlProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DirectionProvider dir="rtl">{children}</DirectionProvider>;
}

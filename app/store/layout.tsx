"use client";

import Layout from "@/components/pages/storefront/StorefrontLayout";

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

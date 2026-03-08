"use client";

import Layout from "@/components/pages/merchant/MerchantLayout";

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

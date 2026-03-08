"use client";

import Layout from "@/components/pages/superadmin/SuperAdminLayout";

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

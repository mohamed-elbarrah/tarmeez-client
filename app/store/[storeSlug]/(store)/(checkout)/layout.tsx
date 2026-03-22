import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/api/stores";
import { resolveTokens } from "@/lib/themes/store/default/config";
import { ShieldCheck } from "lucide-react";

export default async function CheckoutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const store = await getStoreBySlug(storeSlug);

  if (!store) {
    notFound();
  }

  const theme = resolveTokens(store);

  const cssVars = {
    "--p-color": theme.primary,
    "--s-color": theme.secondary,
    "--a-color": theme.accent,
    "--b-color": theme.buttonColor,
    "--t-color": theme.textColor,
    "--h-color": theme.headingColor,
    "--radius": theme.borderRadius,
    fontFamily: theme.fontFamily,
    color: theme.textColor,
    backgroundColor: "#ffffff",
  } as React.CSSProperties;

  return (
    <div style={cssVars} dir="rtl" className="store-root light min-h-screen">
      <main>{children}</main>
    </div>
  );
}

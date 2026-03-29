import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/api/stores";
import { ThemeEngine } from "@/lib/themes/engine";
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

  const engine = new ThemeEngine(store, store.theme ?? null);
  const theme = engine.getComputedConfig();

  const cssVars = {
    ...engine.getStyleObject(),
    color: theme.textColor,
    backgroundColor: "#ffffff",
  } as React.CSSProperties;

  return (
    <div style={cssVars} dir="rtl" className="store-root light min-h-screen">
      <main>{children}</main>
    </div>
  );
}

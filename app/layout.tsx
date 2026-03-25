import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import StoreProvider from "@/components/providers/StoreProvider";
import RtlProvider from "@/components/providers/RtlProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "منصة ترميز",
  description:
    "منصة موجهة للتجار مع أدوات تسويقية قوية لزيادة المبيعات وإدارة المتاجر بكفاءة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={cairo.variable}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <RtlProvider>
            <StoreProvider>{children}</StoreProvider>
            <Toaster position="top-center" richColors dir="rtl" />
          </RtlProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

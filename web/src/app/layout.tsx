import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";

import "@/styles/globals.css";
import { ConfigProvider } from "@/lib/config-provider";
import { AuthProvider } from "@/lib/auth-provider";
import { Toaster } from "@/components/ui/toast";

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  weight: ["100", "200", "300", "400", "500"],
  subsets: ["latin"],
});

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_NAME || "Data Smart Solutions";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: "Empowering businesses with intelligent data analytics and AI-driven insights.",
  metadataBase: new URL(DOMAIN),
  openGraph: {
    title: SITE_NAME,
    description: "Unlock the potential of your data with AI and advanced analytics.",
    url: DOMAIN,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  verification: {
    google: "6RtdRZO-ICCRHWbaTQ3QfxMbnFp-7uVEV_ZyU__CG8Q",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={josefin.className}>
        <ConfigProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}

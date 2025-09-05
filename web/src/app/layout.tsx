import type { Metadata } from "next";
import { Inter, Josefin_Sans, Lato, Montserrat, Poppins, Roboto, Rubik, Ubuntu, Ubuntu_Condensed, Ubuntu_Sans, Ubuntu_Sans_Mono } from "next/font/google";

import "@/styles/globals.css";

// const lato = Lato({
//   variable: "--font-lato",
//   subsets: ["latin"],
//   display: "swap",
//   weight: ["100", "300", "400", "700", "900"],
// });

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  weight: ["100", "200", "300", "400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Data Smart Solutions",
  description: "Empowering businesses with intelligent data analytics and AI-driven insights.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN as any),
  openGraph: {
    title: "Data Smart Solutions",
    description: "Unlock the potential of your data with AI and advanced analytics.",
    url: process.env.NEXT_PUBLIC_DOMAIN as any,
    siteName: "Data Smart Solutions",
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
      <body className={josefin.className}>{children}</body>
    </html>
  );
}

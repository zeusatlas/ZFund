import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "ZFund",
  description: "Community fundraising for Ghana. Explore USSD giving, campaigns in Ghana cedis, and tools for hosts and organisations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-GH"
      className={`${manrope.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className={`${manrope.className} min-h-full flex flex-col font-sans`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

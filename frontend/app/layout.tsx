import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
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
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className={`${outfit.className} min-h-full flex flex-col font-sans`}>
        {children}
      </body>
    </html>
  );
}

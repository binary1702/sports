import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter_Tight } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "2026 US Open - Binary 1702",
  description: "An interactive visual story of Alexander Zverev's path to the 2026 US Open championship.",
  openGraph: {
    title: "2026 US Open - Binary 1702",
    description: "An interactive visual story of Alexander Zverev's path to the 2026 US Open championship.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${interTight.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SectionNav } from "@/components/ui/SectionNav";
import { DemoModeIndicator } from "@/components/shared/DemoModeIndicator";
import { getModeFromEnv } from "@/lib/mode.server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Claude in the Loop",
  description:
    "From Curiosity to Conviction — an interactive experience exploring how Claude Code changes who can build software.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mode = getModeFromEnv();

  return (
    <html lang="en" className="dark snap-y snap-mandatory motion-reduce:snap-none">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ScrollProgress />
        <SectionNav />
        <DemoModeIndicator mode={mode} />
        {children}
      </body>
    </html>
  );
}

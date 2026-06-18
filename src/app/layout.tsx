import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Atmosphere from "@/components/three/Atmosphere";
import CursorGlow from "@/components/fx/CursorGlow";
import ScrollProgress from "@/components/fx/ScrollProgress";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Lavanya S // Senior QA Automation Engineer",
  description:
    "Portfolio of Lavanya S — Senior QA Automation & Manual Engineer with 10+ years of experience in Banking, Telecom, and Salesforce. Expert in Selenium, Playwright, Azure DevOps, and AI-powered testing.",
  keywords: [
    "QA Automation Engineer",
    "Selenium",
    "Playwright",
    "Software Testing",
    "Azure DevOps",
    "Lavanya S",
    "Atlanta GA",
  ],
  openGraph: {
    title: "Lavanya S | Senior QA Automation Engineer",
    description: "10+ years of QA expertise across Banking, Telecom & Salesforce.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} scroll-smooth`}
    >
      <body className="font-sans antialiased text-[#f2ebdc] relative">
        {/* ---- Living atmosphere: full-screen fluid shader + flow particles ---- */}
        <Atmosphere />
        {/* Ultra-faint grid for depth + structure (sits over the shader) */}
        <div className="pointer-events-none fixed inset-0 z-[1] bg-grid opacity-[0.07] mask-fade-b" />

        <CursorGlow />
        <ScrollProgress />
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

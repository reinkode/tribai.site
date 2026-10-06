import type { Metadata, Viewport } from "next";
import { Orbitron, Josefin_Sans, Bitter, JetBrains_Mono } from "next/font/google";
import { LanguageProvider } from "@/lib/language";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import SiteChromeGate from "@/components/SiteChromeGate";
import "./globals.css";

const display = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const sans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const serif = Bitter({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tribai.site"),
  title: "TribAI LLC — Intelligence, Engineered",
  description:
    "TribAI builds custom software, implements artificial intelligence, grows social media presence and cultivates communities for the businesses of tomorrow.",
  keywords: [
    "TribAI",
    "artificial intelligence",
    "software development",
    "AI implementation",
    "social media growth",
    "community building",
  ],
  openGraph: {
    title: "TribAI LLC — Intelligence, Engineered",
    description:
      "Custom software, applied AI, social growth and thriving communities. The convergence of solid business and intelligent technology.",
    url: "https://tribai.site",
    siteName: "TribAI",
    images: ["/logo.png"],
    type: "website",
  },
  icons: { icon: "/icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#060309",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-void">
      <body
        className={`${display.variable} ${sans.variable} ${serif.variable} ${mono.variable} bg-noise`}
      >
        <LanguageProvider>
          <SiteChromeGate>
            <Navbar />
          </SiteChromeGate>
          {children}
          <SiteChromeGate>
            <Footer />
          </SiteChromeGate>
          <SiteChromeGate>
            <ChatWidget />
          </SiteChromeGate>
        </LanguageProvider>
      </body>
    </html>
  );
}

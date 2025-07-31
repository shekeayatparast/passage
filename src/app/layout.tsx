import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Passage Panel - Cloudflare Workers",
  description: "Modern Passage Panel management interface for Cloudflare Workers with multi-protocol support.",
  keywords: ["Passage", "Cloudflare Workers", "VLESS", "VMESS", "Trojan", "Shadowsocks", "VPN"],
  authors: [{ name: "NajiDevs Team" }],
  openGraph: {
    title: "Passage Panel - Cloudflare Workers",
    description: "Modern Passage Panel management interface for Cloudflare Workers",
    url: "https://github.com/najidevs/",
    siteName: "Passage Panel",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Passage Panel - Cloudflare Workers",
    description: "Modern Passage Panel management interface for Cloudflare Workers",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

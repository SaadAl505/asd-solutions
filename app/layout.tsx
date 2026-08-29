import type { Metadata } from "next";
import { Cairo, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-body",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await (await import("@/lib/content")).getContent();
  const title = `${settings.siteName} — ${settings.tagline}`;
  return {
    title: { default: title, template: `%s | ${settings.siteName}` },
    description: settings.description,
    openGraph: {
      title,
      description: settings.description,
      type: "website",
      locale: "ar_SA",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <body className={`${cairo.variable} ${grotesk.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}

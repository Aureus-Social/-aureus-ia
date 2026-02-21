import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aureus IA — The Institutional Edge | AI Market Analysis",
  description: "Institutional-grade AI analytics. 11 proprietary indicators. 13 years of expertise. Brussels-based market analysis hub.",
  keywords: "AI trading, market analysis, Brussels, institutional indicators, Aureus IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

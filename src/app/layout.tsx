import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/globals.css";
import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { StructuredData } from "@/components/common/StructuredData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ravoxlabs.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RAVOXLABS | Sites e Sistemas para Pequenos Negócios",
    template: "%s | RAVOXLABS",
  },
  description:
    "Soluções digitais rápidas, modernas e acessíveis para pequenos negócios. Criamos sites profissionais, sistemas personalizados e design UI/UX que transformam sua presença online.",
  keywords: [
    "sites para pequenos negócios",
    "desenvolvimento web",
    "sistemas personalizados",
    "design UI/UX",
    "soluções digitais",
    "automação de processos",
    "e-commerce",
    "landing page",
    "dashboard",
  ],
  authors: [{ name: "Ravox Labs" }],
  creator: "Ravox Labs",
  publisher: "Ravox Labs",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "RAVOXLABS",
    title: "RAVOXLABS | Sites e Sistemas para Pequenos Negócios",
    description:
      "Soluções digitais rápidas, modernas e acessíveis para pequenos negócios. Sites profissionais, sistemas personalizados e design UI/UX.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Ravox Labs - Soluções Digitais para Pequenos Negócios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RAVOXLABS | Sites e Sistemas para Pequenos Negócios",
    description:
      "Soluções digitais rápidas, modernas e acessíveis para pequenos negócios.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [
      {
        url: "/assets/img/MiniLogo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/assets/img/MiniLogo.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/assets/img/MiniLogo.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`${inter.variable} ${inter.variable} ${inter.variable} antialiased`}
      >
        <StructuredData />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

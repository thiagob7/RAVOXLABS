import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Painel",
    template: "%s | Painel RAVOXLABS",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen bg-gray-900 text-white">{children}</div>;
}

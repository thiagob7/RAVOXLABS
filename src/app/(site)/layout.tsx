import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { StructuredData } from "@/components/common/StructuredData";
// TODO: tela de loading desativada por enquanto; para reativar, volte a
// envolver o conteúdo com <LoadingProvider>.
// import { LoadingProvider } from "@/components/providers/LoadingProvider";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <LoadingProvider>
    <>
      <StructuredData />
      <Header />
      {children}
      <Footer />
    </>
    // </LoadingProvider>
  );
}

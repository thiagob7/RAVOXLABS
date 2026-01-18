import type { Metadata } from "next";

import { About } from "@/components/sections/About";
import { Banner } from "@/components/sections/Banner";
import { Benefits } from "@/components/sections/Benefits";
import { Budget } from "@/components/sections/Budget";
import { Contact } from "@/components/sections/Contact";
import { Services } from "@/components/sections/Services";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ravoxlabs.com";

export const metadata: Metadata = {
  // title não definido - usa o default do layout: "RAVOXLABS | Sites e Sistemas para Pequenos Negócios"
  description:
    "Transforme seu negócio com soluções digitais profissionais e acessíveis. Sites responsivos, sistemas personalizados e design UI/UX que geram resultados para pequenos negócios e autônomos.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RAVOXLABS | Sites e Sistemas para Pequenos Negócios",
    description:
      "Transforme seu negócio com soluções digitais profissionais e acessíveis.",
    url: siteUrl,
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Banner />
      <About />
      <Services />
      <Benefits />
      <Budget />
      <Contact />
    </main>
  );
}

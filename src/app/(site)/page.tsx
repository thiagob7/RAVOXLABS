import { env } from "~/@core/infra/constants/env";
import type { Metadata } from "next";

import { CurvedTextLoop } from "@/components/animations/CurvedTextLoop";
import { About } from "@/components/sections/About";
import { Banner } from "@/components/sections/Banner";
import { Benefits } from "@/components/sections/Benefits";
import { Budget } from "@/components/sections/Budget";
import { Contact } from "@/components/sections/Contact";
import { Portfolio } from "@/components/sections/Portfolio";
import { Services } from "@/components/sections/Services";
import { getPublicProjects } from "@/server/projects/queries";

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
    url: env.BASE_URL,
  },
};

export const revalidate = 3600;

export default async function Home() {
  const projects = await getPublicProjects();

  return (
    <main className="min-h-screen">
      <Banner />
      <About />
      <Services
        showcase={
          projects.find((p) => p.category === "sites" && p.image) ??
          projects.find((p) => p.image) ??
          projects.find((p) => p.category === "sites")
        }
      />

      {/* Transição entre os serviços e os diferenciais. */}
      <div className="bg-gradient-to-b from-gray-650 to-gray-550 py-4 max-md:py-2">
        <CurvedTextLoop
          items={[
            "Sites profissionais",
            "Sistemas",
            "Dashboards",
            "Design UI/UX",
          ]}
          compactItems={["Sites", "Sistemas", "Dashboards", "UI/UX"]}
        />
      </div>

      <Benefits />
      <Portfolio projects={projects} />
      <Budget />
      <Contact />
    </main>
  );
}

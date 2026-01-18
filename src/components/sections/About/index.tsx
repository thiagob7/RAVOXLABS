"use client";

import { StatCard } from "./components/StatCard";

export const About = () => {
  return (
    <section id="about" className="relative bg-gray-900 py-[120px]">
      <div className="flex flex-col items-center justify-center max-w-content mx-auto max-[1359px]:px-4">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8">
          Quem somos
        </h2>

        <div className="flex flex-col items-center text-center space-y-4">
          <span className="text-lg text-gray-400 leading-relaxed  mx-auto">
            A Ravox Labs desenvolve soluções digitais rápidas, modernas e
            acessíveis. <br /> Nosso objetivo é tornar tecnologia e design
            profissional acessíveis para pequenos <br /> empreendedores e
            autônomos que querem melhorar sua presença online.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          <StatCard number="50+" title="Projetos entregues" />
          <StatCard number="100%" title="Clientes satisfeitos" />
          <StatCard number="3+" title="Anos de experiência" />
        </div>
      </div>
    </section>
  );
};

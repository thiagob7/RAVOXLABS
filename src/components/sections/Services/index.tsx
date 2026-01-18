"use client";

import { FiGlobe, FiGrid, FiLayers } from "react-icons/fi";

import { ServiceCard } from "./components/ServiceCard";

const services = [
  {
    icon: <FiGlobe className="w-12 h-12" />,
    title: "Sites profissionais",
    description:
      "Sites rápidos, responsivos e modernos criados para fortalecer sua presença digital.",
  },
  {
    icon: <FiGrid className="w-12 h-12" />,
    title: "Sistemas e dashboards",
    description:
      "Desenvolvimento de sistemas personalizados para automação de processos e gestão.",
  },
  {
    icon: <FiLayers className="w-12 h-12" />,
    title: "Design UI/UX",
    description:
      "Interfaces modernas, intuitivas e centradas na experiência do usuário.",
  },
];

export const Services = () => {
  return (
    <section id="services" className="relative bg-gray-650 py-[120px]">
      <div className="flex flex-col items-center justify-center max-w-content mx-auto max-[1359px]:px-4">
        <h2 className="text-4xl font-bold text-white text-center">
          Nossos serviços
        </h2>

        <span className="text-lg text-gray-400 text-center mx-auto mt-4">
          Soluções completas para transformar sua presença digital
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

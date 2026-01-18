"use client";

import {
  FiZap,
  FiShield,
  FiClock,
  FiTrendingUp,
  FiUsers,
  FiCheckCircle,
} from "react-icons/fi";

import { BenefitCard } from "./components/BenefitCard";

const benefits = [
  {
    icon: <FiZap className="w-6 h-6" />,
    title: "Agilidade",
    description: "Entregas rápidas sem comprometer a qualidade do projeto.",
  },
  {
    icon: <FiShield className="w-6 h-6" />,
    title: "Segurança",
    description: "Seus dados e projetos protegidos com as melhores práticas.",
  },
  {
    icon: <FiClock className="w-6 h-6" />,
    title: "Pontualidade",
    description: "Cumprimos prazos rigorosamente para sua tranquilidade.",
  },
  {
    icon: <FiTrendingUp className="w-6 h-6" />,
    title: "Resultados",
    description: "Foco em métricas que realmente impactam seu negócio.",
  },
  {
    icon: <FiUsers className="w-6 h-6" />,
    title: "Parceria",
    description: "Relacionamento próximo e suporte contínuo.",
  },
  {
    icon: <FiCheckCircle className="w-6 h-6" />,
    title: "Qualidade",
    description: "Padrões elevados em cada detalhe do projeto.",
  },
];

export const Benefits = () => {
  return (
    <section id="benefits" className="relative bg-gray-550 py-[120px]">
      <div className="flex flex-col items-start justify-center container mx-auto max-[1150px]:px-4 max-w-content">
        <span className="text-sm font-medium text-blue-500 uppercase tracking-wider mb-4">
          POR QUE NOS ESCOLHER
        </span>

        <h2 className="text-4xl font-bold text-white text-start">
          Benefícios exclusivos
        </h2>

        <span className="text-lg text-gray-400 text-start mt-4 max-w-2xl">
          Trabalhamos para entregar não apenas projetos, mas experiências que
          transformam seu negócio.
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 w-full ">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

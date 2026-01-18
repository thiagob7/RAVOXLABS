"use client";

import { FiArrowRight } from "react-icons/fi";

import { Button } from "@/components/ui/Button";

export const Budget = () => {
  return (
    <section
      id="get-started"
      className="relative bg-budget bg-no-repeat bg-cover bg-center py-[120px]"
    >
      <div className="flex flex-col items-center justify-center container mx-auto max-[1150px]:px-4 max-w-content">
        <span className="text-4xl font-bold text-white text-center mb-6">
          Pronto para transformar seu negócio?
        </span>

        <p className="text-lg text-white text-center mb-10 max-w-2xl mx-auto leading-relaxed">
          Fale com nossa equipe e receba um orçamento rápido e personalizado.
        </p>

        <Button
          href="#contact"
          variant="white"
          className="group gap-2 max-w-[223px]"
        >
          Solicitar orçamento
          <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </section>
  );
};

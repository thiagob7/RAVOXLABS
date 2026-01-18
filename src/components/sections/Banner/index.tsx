"use client";

import { FiArrowRight, FiChevronDown } from "react-icons/fi";

import { Button } from "../../ui/Button";

export const Banner = () => {
  return (
    <section
      id="/"
      className="relative min-h-screen bg-banner bg-left bg-no-repeat bg-cover flex items-center justify-center bg-gray-900 overflow-hidden pt-16"
    >
      <div className="flex flex-col relative z-10 mx-auto text-center max-[1150px]:px-4 max-w-content">
        <div className="inline-flex items-center mx-auto gap-2 px-4 py-2 rounded-full bg-gray-650 backdrop-blur-sm border border-gray-600">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-white text-sm font-medium">
            Soluções digitais para pequenos negócios
          </span>
        </div>

        <h1 className="text-[60px] max-md:text-[32px] font-bold text-white leading-tight mx-auto mt-8">
          Tecnologia e design acessíveis <br />
          para <span className="text-blue-500">pequenos negócios.</span>
        </h1>

        <span className="text-lg text-gray-400 mb-10 max-w-2xl max-md:text-sm mx-auto leading-relaxed mt-6">
          Criamos sites, sistemas e interfaces modernas spanara autônomos e
          pequenas empresas que querem se posicionar digitalmente.
        </span>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          <Button
            href="#get-started"
            className="flex-1 gap-2 group max-w-[212px] w-full"
          >
            Começar agora
            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            href="#services"
            variant="outline"
            className="flex-1 max-w-[212px] w-full"
          >
            Nossos serviços
          </Button>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <FiChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </section>
  );
};

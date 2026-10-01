import Link from "next/link";
import { FiArrowRight, FiFolder } from "react-icons/fi";

/** Mostrado enquanto nenhum projeto foi publicado pelo painel. */
export const PortfolioEmpty = () => (
  <div className="flex flex-col items-center rounded-xl border border-dashed border-white/10 px-6 py-20 text-center">
    <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-gray-400">
      <FiFolder className="h-5 w-5" />
    </span>
    <h3 className="mt-5 text-lg font-semibold text-gray-100">
      Novos projetos em breve
    </h3>
    <p className="mt-1 max-w-sm text-sm text-gray-400">
      Estamos preparando os cases para mostrar aqui. Enquanto isso, conte o que
      você precisa e receba uma proposta.
    </p>
    <Link
      href="/#contact"
      className="group mt-6 inline-flex h-10 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 text-sm font-medium text-gray-100 transition-colors hover:border-white/20"
    >
      Falar com a gente
      <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  </div>
);

import { Logo } from "./Logo";

export const Footer = () => {
  return (
    <footer className="relative bg-gray-900 border-t border-gray-600 py-8">
      <div className="container mx-auto max-[1150px]:px-4 max-w-content">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo href="/" />
          <span className="text-sm text-gray-400">
            © 2025 Ravox Labs — Todos os direitos reservados.
          </span>
        </div>
      </div>
    </footer>
  );
};

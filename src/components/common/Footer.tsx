import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";

import { Logo } from "./Logo";

export const Footer = () => {
  return (
    <footer className="relative bg-gray-900 border-t border-gray-600 py-6">
      <div className="container mx-auto max-[1150px]:px-4 max-w-content">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo variant="text" href="/" />

          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-400">
              © 2026 Ravox Labs — Todos os direitos reservados.
            </span>
            <div className="flex items-center gap-2">
              <Link
                href="https://wa.me/5571992446022"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-md text-gray-400 hover:text-blue-500 hover:bg-white/5 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-[18px] h-[18px]" />
              </Link>
              <Link
                href="https://www.instagram.com/ravoxlabs/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-md text-gray-400 hover:text-blue-500 hover:bg-white/5 transition-all duration-300"
                aria-label="Instagram"
              >
                <FiInstagram className="w-[18px] h-[18px]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

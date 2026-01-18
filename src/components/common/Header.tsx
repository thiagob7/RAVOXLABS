"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

import { Button } from "../ui/Button";
import { Logo } from "./Logo";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-600 z-50">
      <nav className="max-w-content mx-auto max-[1150px]:px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="hidden md:flex items-center justify-between gap-[31px]">
            <Link
              href="#about"
              className="text-gray-100 hover:text-gray-100/80 transition"
            >
              Sobre
            </Link>
            <Link
              href="#services"
              className="text-gray-100 hover:text-gray-100/80 transition"
            >
              Serviços
            </Link>
            <Link
              href="#contact"
              className="text-gray-100 hover:text-gray-100/80 transition"
            >
              Contato
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <Button href="#get-started" className="h-[40px]">
              Fale conosco
            </Button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="flex flex-col md:hidden py-4 gap-6 items-center">
            <Link
              href="#about"
              className="text-gray-100 hover:text-gray-100/80 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              href="#services"
              className="text-gray-100 hover:text-gray-100/80 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Serviços
            </Link>
            <Link
              href="#contact"
              className="text-gray-100 hover:text-gray-100/80 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contato
            </Link>

            <Button
              href="#get-started"
              className="h-[40px]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Fale conosco
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}

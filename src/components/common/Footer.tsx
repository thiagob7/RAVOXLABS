import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { FiInstagram, FiMail, FiPhone } from "react-icons/fi";

import { Logo } from "./Logo";

/* Âncoras com "/" na frente: o rodapé aparece também fora da home. */
const navLinks = [
  { href: "/#about", label: "Sobre" },
  { href: "/#services", label: "Serviços" },
  { href: "/projetos", label: "Portfólio" },
  { href: "/#contact", label: "Contato" },
  { href: "https://ui.ravoxlabs.com", label: "Ravox UI", external: true },
];

/* As páginas de serviço hoje só redirecionam para a home; apontar direto
   para a seção evita o salto extra. Trocar quando as páginas existirem. */
const serviceLinks = [
  { href: "/#services", label: "Sites profissionais" },
  { href: "/#services", label: "Sistemas e dashboards" },
  { href: "/#services", label: "Design UI/UX" },
];

const socials = [
  {
    href: "https://wa.me/5571992446022",
    label: "WhatsApp",
    icon: FaWhatsapp,
  },
  {
    href: "https://www.instagram.com/ravoxlabs/",
    label: "Instagram",
    icon: FiInstagram,
  },
];

export const Footer = () => {
  return (
    <footer className="bg-gray-900 pb-6 pt-16 max-md:pt-10">
      <div className="mx-auto max-w-content max-[1359px]:px-4">
        <div className="relative isolate overflow-hidden rounded-3xl border border-white/[0.07] bg-gray-850 px-6 py-10 md:px-10">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"
          />

          <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
            <div className="flex flex-col items-start">
              <Logo variant="text" href="/" />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
                Sites, sistemas e design para pequenos negócios e autônomos.
              </p>

              <div className="mt-6 flex items-center gap-2">
                {socials.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-gray-400 transition-colors duration-300 hover:border-white/20 hover:text-blue-500"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </Link>
                ))}
              </div>
            </div>

            <FooterColumn title="Navegação" links={navLinks} />
            <FooterColumn title="Serviços" links={serviceLinks} />

            <div>
              <h3 className="text-sm font-semibold text-white">Contato</h3>
              <ul className="mt-4 flex flex-col gap-3">
                <li>
                  <FooterLink href="mailto:contato@ravoxlabs.com">
                    <FiMail className="h-4 w-4 shrink-0" />
                    contato@ravoxlabs.com
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="tel:+5571992446022">
                    <FiPhone className="h-4 w-4 shrink-0" />
                    (71) 99244-6022
                  </FooterLink>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-white/[0.07] pt-6 text-center text-sm text-gray-400 md:text-left">
            © {new Date().getFullYear()} Ravox Labs — Todos os direitos
            reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
}) => (
  <div>
    <h3 className="text-sm font-semibold text-white">{title}</h3>
    <ul className="mt-4 flex flex-col gap-3">
      {links.map((link) => (
        <li key={link.label}>
          <FooterLink href={link.href} external={link.external}>
            {link.label}
          </FooterLink>
        </li>
      ))}
    </ul>
  </div>
);

const FooterLink = ({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors duration-300 hover:text-white"
  >
    {children}
  </Link>
);

"use client";

import { FiMail, FiPhone } from "react-icons/fi";

import { ContactChannel } from "./components/ContactChannel";
import { ContactForm } from "./components/ContactForm";

const contactData = {
  eyebrow: "FALE CONOSCO",
  title: "Entre em contato",
  subtitle:
    "Estamos prontos para ouvir suas ideias e transformá-las em realidade.",
  left: {
    title: "Vamos conversar?",
    description:
      "Preencha o formulário ou entre em contato diretamente pelos canais abaixo. Responderemos em até 24 horas.",
    channels: [
      {
        type: "email",
        label: "Email",
        value: "contato@ravoxlabs.com",
        href: "mailto:contato@ravox.com",
        icon: <FiMail className="w-6 h-6" />,
      },
      {
        type: "phone",
        label: "Telefone",
        value: "(71) 99244-6022",
        href: "tel:+5571992446022",
        icon: <FiPhone className="w-6 h-6" />,
      },
    ],
  },
};

export const Contact = () => {
  return (
    <section id="contact" className="relative bg-gray-900 py-[120px]">
      <div className="container mx-auto max-[1359px]:px-4 max-w-content">
        <div className="flex flex-col items-center text-center">
          <span className="text-sm font-medium text-blue-500 uppercase tracking-wider">
            {contactData.eyebrow}
          </span>
          <h2 className="text-4xl font-bold text-white mt-2">
            {contactData.title}
          </h2>
          <span className="text-lg text-white max-w-2xl mx-auto mt-4">
            {contactData.subtitle}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-12">
          <div className="flex flex-col max-w-[442px]">
            <span className="text-2xl font-bold text-white">
              {contactData.left.title}
            </span>
            <span className="text-base leading-relaxed mt-6 text-gray-400">
              {contactData.left.description}
            </span>

            <div className="flex flex-col gap-6 mt-8">
              {contactData.left.channels.map((channel) => (
                <ContactChannel
                  key={channel.type}
                  icon={channel.icon}
                  label={channel.label}
                  value={channel.value}
                  href={channel.href}
                />
              ))}
            </div>
          </div>

          <div className="bg-gray-850 rounded-2xl border border-gray-600 p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

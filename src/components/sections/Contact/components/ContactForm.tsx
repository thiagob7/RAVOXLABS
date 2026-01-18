"use client";

import { useState, FormEvent } from "react";
import { FiSend } from "react-icons/fi";

import { InputField } from "@/components/common/InputField";
import { TextareaField } from "@/components/common/TextareaField";
import { Button } from "@/components/ui/Button";
import { maskPhone } from "@/lib/maskPhone";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const maskedValue = maskPhone(value);
      setFormData({
        ...formData,
        [name]: maskedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const message = `
    Olá, Leonardo! 👋
    👤 *Nome:* ${formData.name}
    📧 *Email:* ${formData.email}
    📱 *Telefone:* ${formData.phone || "Não informado"}

    💬 *Mensagem:*
    ${formData.message}`;

    const encodedMessage = encodeURIComponent(message);

    const phoneNumber = "5571992446022";

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");

    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Primeira linha: Nome e Email lado a lado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputField
          name="name"
          type="text"
          label="Nome"
          placeholder="Seu nome"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <InputField
          name="email"
          type="email"
          label="Email"
          placeholder="seu@email.com"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      {/* Segunda linha: Telefone */}
      <InputField
        name="phone"
        type="tel"
        label="Telefone"
        placeholder="(71) 99244-6022"
        value={formData.phone}
        onChange={handleChange}
      />

      {/* Terceira linha: Mensagem */}
      <TextareaField
        name="message"
        label="Mensagem"
        placeholder="Conte-nos sobre seu projeto..."
        required
        rows={5}
        value={formData.message}
        onChange={handleChange}
      />

      {/* Botão de envio */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full group flex items-center justify-center gap-2"
      >
        Enviar mensagem
        <FiSend className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </form>
  );
};

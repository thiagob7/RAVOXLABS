"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { FiSend, FiCheck } from "react-icons/fi";
import { animated, useSpring, useTrail } from "react-spring";
import gsap from "gsap";

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
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const fields = [
    { name: "name-email", delay: 0 },
    { name: "phone", delay: 100 },
    { name: "message", delay: 200 },
    { name: "button", delay: 300 },
  ];

  // Stagger animation for form fields
  useEffect(() => {
    if (!formRef.current) return;

    const children = formRef.current.children;
    gsap.fromTo(
      children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
      }
    );
  }, []);

  const buttonSpring = useSpring({
    scale: isSubmitting ? 0.95 : 1,
    config: { tension: 300, friction: 20 },
  });

  const successSpring = useSpring({
    opacity: isSuccess ? 1 : 0,
    transform: isSuccess ? "scale(1)" : "scale(0.5)",
    config: { tension: 300, friction: 15 },
  });

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

    // Button animation
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
    }

    const message = `
    Olá, Leonardo!
    *Nome:* ${formData.name}
    *Email:* ${formData.email}
    *Telefone:* ${formData.phone || "Não informado"}

    *Mensagem:*
    ${formData.message}`;

    const encodedMessage = encodeURIComponent(message);

    const phoneNumber = "5571992446022";

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");

    // Success animation
    setIsSuccess(true);

    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setIsSubmitting(false);

      // Reset success after showing
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    }, 500);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
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
      <animated.div style={buttonSpring}>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full group flex items-center justify-center gap-2 relative overflow-hidden"
        >
          {isSuccess ? (
            <animated.span style={successSpring} className="flex items-center gap-2">
              <FiCheck className="w-5 h-5" />
              Enviado!
            </animated.span>
          ) : (
            <>
              {isSubmitting ? "Enviando..." : "Enviar mensagem"}
              <FiSend className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </Button>
      </animated.div>
    </form>
  );
};

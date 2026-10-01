"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { FiAlertCircle, FiCheck, FiLoader, FiSend } from "react-icons/fi";

import { submitContactMessage } from "@/app/(site)/_actions/contact";
import {
  contactFieldErrors,
  contactSchema,
  type ContactField,
  type ContactInput,
} from "@/lib/contact-schema";
import { maskPhone } from "@/lib/maskPhone";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "5571992446022";

const emptyForm: ContactInput = { name: "", email: "", phone: "", message: "" };

type Status = "idle" | "sending" | "sent" | "error";

function buildWhatsappUrl(data: ContactInput) {
  const message = [
    "Olá, vim pelo site da RAVOX Labs!",
    "",
    `*Nome:* ${data.name}`,
    `*Email:* ${data.email}`,
    `*Telefone:* ${data.phone || "Não informado"}`,
    "",
    "*Mensagem:*",
    data.message,
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const ContactForm = () => {
  const [form, setForm] = useState<ContactInput>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>(
    {}
  );
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState<string | null>(null);

  const update = (field: ContactField, value: string) => {
    const next = field === "phone" ? maskPhone(value) : value;
    setForm((current) => ({ ...current, [field]: next }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
    if (status === "sent" || status === "error") {
      setStatus("idle");
      setNotice(null);
    }
  };

  // Valida o campo ao sair dele, só se já tiver algo digitado.
  const validateField = (field: ContactField) => {
    if (!form[field]) return;
    const result = contactSchema.shape[field].safeParse(form[field]);
    setErrors((current) => ({
      ...current,
      [field]: result.success ? undefined : result.error.issues[0]?.message,
    }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setNotice(null);

    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = contactFieldErrors(parsed.error);
      setErrors(fieldErrors);
      const first = Object.keys(fieldErrors)[0];
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    // A aba precisa abrir no clique (senão o navegador bloqueia o pop-up);
    // o endereço do WhatsApp é definido depois que a mensagem é salva.
    const whatsappWindow = window.open("", "_blank");
    setStatus("sending");

    const formData = new FormData(event.currentTarget);
    let result: Awaited<ReturnType<typeof submitContactMessage>>;
    try {
      result = await submitContactMessage(formData);
    } catch {
      result = { status: "unsaved" };
    }

    if (result.status === "invalid" || result.status === "rate_limited") {
      whatsappWindow?.close();
      setStatus("error");
      if (result.status === "invalid") {
        setErrors(result.fieldErrors);
        setNotice("Revise os campos destacados.");
      } else {
        setNotice(
          "Você enviou muitas mensagens seguidas. Tente novamente em alguns minutos."
        );
      }
      return;
    }

    const whatsappUrl = buildWhatsappUrl(parsed.data);
    if (whatsappWindow) {
      whatsappWindow.opener = null;
      whatsappWindow.location.href = whatsappUrl;
    } else {
      window.location.href = whatsappUrl;
    }

    setForm(emptyForm);
    setErrors({});
    setStatus("sent");
    setNotice(
      "Mensagem enviada! Continue a conversa pelo WhatsApp que acabamos de abrir."
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Honeypot contra robôs: fica fora da tela e do teclado. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Nome" field="name" required error={errors.name}>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => validateField("name")}
            aria-invalid={Boolean(errors.name)}
            className={controlClass}
          />
        </Field>
        <Field label="E-mail" field="email" required error={errors.email}>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() => validateField("email")}
            aria-invalid={Boolean(errors.email)}
            className={controlClass}
          />
        </Field>
      </div>

      <Field
        label="Telefone / WhatsApp"
        field="phone"
        hint="Opcional"
        error={errors.phone}
      >
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          maxLength={15}
          autoComplete="tel"
          placeholder="(71) 99999-9999"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          onBlur={() => validateField("phone")}
          aria-invalid={Boolean(errors.phone)}
          className={controlClass}
        />
      </Field>

      <Field label="Mensagem" field="message" required error={errors.message}>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="Conte-nos sobre seu projeto: o que você precisa, prazo e objetivos."
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          onBlur={() => validateField("message")}
          aria-invalid={Boolean(errors.message)}
          className={cn(controlClass, "h-auto min-h-36 resize-none py-3.5")}
        />
      </Field>

      {notice && (
        <p
          role="status"
          className={cn(
            "flex items-start gap-2 rounded-lg border px-4 py-3 text-sm",
            status === "sent"
              ? "border-green-400/30 bg-green-400/10 text-green-400"
              : "border-red-400/30 bg-red-400/10 text-red-300"
          )}
        >
          {status === "sent" ? (
            <FiCheck className="mt-0.5 shrink-0" />
          ) : (
            <FiAlertCircle className="mt-0.5 shrink-0" />
          )}
          {notice}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="group mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 text-base font-medium text-white transition-colors duration-200 hover:bg-blue-500/85 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {sending ? (
          <>
            <FiLoader className="h-5 w-5 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            Enviar mensagem
            <FiSend className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-500">
        Ao enviar, você também será direcionado para o nosso WhatsApp.
      </p>
    </form>
  );
};

const controlClass =
  "h-12 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 text-base text-gray-100 placeholder:text-gray-500 outline-none transition-colors duration-200 hover:border-white/[0.16] focus:border-blue-500/70 focus:bg-white/[0.05] focus:ring-4 focus:ring-blue-500/15 aria-[invalid=true]:border-red-400/70 aria-[invalid=true]:focus:ring-red-400/15";

function Field({
  label,
  field,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  field: ContactField;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={`contact-${field}`}
        className="flex items-center justify-between text-sm font-medium text-gray-300"
      >
        <span>
          {label}
          {required && <span className="ml-0.5 text-blue-500">*</span>}
        </span>
        {hint && (
          <span className="text-xs font-normal text-gray-500">{hint}</span>
        )}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-400">
          <FiAlertCircle className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

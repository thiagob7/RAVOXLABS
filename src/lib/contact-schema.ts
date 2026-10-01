import { z } from "zod";

/** Validação do formulário de contato, usada no navegador e no servidor. */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome.")
    .max(120, "Use no máximo 120 caracteres."),
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .pipe(z.email("Informe um e-mail válido.")),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || value.replace(/\D/g, "").length >= 10,
      "Informe o telefone com DDD."
    ),
  message: z
    .string()
    .trim()
    .min(10, "Conte um pouco mais sobre o projeto (mín. 10 caracteres).")
    .max(3000, "Use no máximo 3000 caracteres."),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

export function contactFieldErrors(error: z.ZodError) {
  const errors: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as ContactField;
    errors[key] ??= issue.message;
  }
  return errors;
}

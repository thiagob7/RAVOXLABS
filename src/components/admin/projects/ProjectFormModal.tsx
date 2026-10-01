"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { FiAlertCircle } from "react-icons/fi";
import { toast } from "react-toastify";

import {
  saveProject,
  type ProjectFormState,
} from "@/app/admin/(panel)/projetos/actions";
import { categoryOptions, type ProjectCategory } from "@/data/projects";
import { cn } from "@/lib/utils";

import { Button } from "../Button";
import { Field, Input, Textarea } from "../form/Field";
import { fieldControlClassName } from "../form/field-layout";
import { SwitchField } from "../form/SwitchField";
import { Modal } from "../Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ImageDropzone } from "./ImageDropzone";

export interface ProjectFormValues {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  client: string;
  category: ProjectCategory;
  year: number;
  tags: string[];
  href: string;
  accent: string;
  featured: boolean;
  published: boolean;
  imageUrl: string | null;
}

export const emptyProjectValues = (): ProjectFormValues => ({
  title: "",
  slug: "",
  summary: "",
  description: "",
  client: "",
  category: "sites",
  year: new Date().getFullYear(),
  tags: [],
  href: "",
  accent: "#6467F2",
  featured: false,
  published: true,
  imageUrl: null,
});

interface ProjectFormModalProps {
  isOpen: boolean;
  values: ProjectFormValues;
  onRequestClose: () => void;
}

export function ProjectFormModal({
  isOpen,
  values,
  onRequestClose,
}: ProjectFormModalProps) {
  const [pending, setPending] = useState(false);
  const isEdit = Boolean(values.id);

  // Não fecha no meio do envio (ESC / clique fora).
  const close = () => {
    if (!pending) onRequestClose();
  };

  return (
    <Modal.Root
      isOpen={isOpen}
      onRequestClose={close}
      className="w-[calc(100%-24px)] max-w-3xl"
    >
      <Modal.Header>
        <Modal.Title>{isEdit ? "Editar projeto" : "Novo projeto"}</Modal.Title>
        <Modal.Subtitle>
          {isEdit
            ? "Atualize as informações e o print do projeto."
            : "Cadastre um projeto para exibir no portfólio do site."}
        </Modal.Subtitle>
        <Modal.ButtonClose onClick={close} />
      </Modal.Header>

      {/* Modal só renderiza o conteúdo aberto: o formulário recomeça a cada abertura. */}
      <ProjectForm
        values={values}
        onPendingChange={setPending}
        onCancel={close}
        onSaved={onRequestClose}
      />
    </Modal.Root>
  );
}

const initialState: ProjectFormState = { status: "idle" };

interface ProjectFormProps {
  values: ProjectFormValues;
  onPendingChange: (pending: boolean) => void;
  onCancel: () => void;
  onSaved: () => void;
}

function ProjectForm({
  values,
  onPendingChange,
  onCancel,
  onSaved,
}: ProjectFormProps) {
  const [state, formAction, pending] = useActionState(
    saveProject,
    initialState
  );
  const [accent, setAccent] = useState(values.accent);
  const handledSave = useRef<number | undefined>(undefined);
  const errors = state.fieldErrors ?? {};
  const isEdit = Boolean(values.id);

  useEffect(() => onPendingChange(pending), [pending, onPendingChange]);

  useEffect(() => {
    if (state.status !== "success" || handledSave.current === state.savedAt) {
      return;
    }
    handledSave.current = state.savedAt;
    toast.success(state.message);
    onSaved();
  }, [state, onSaved]);

  return (
    <form
      // Envio manual: com `action={...}` o React limpa o formulário ao
      // terminar, o que apagaria os campos (e o print) quando há erro.
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
      }}
      className="flex min-h-0 flex-1 flex-col"
    >
      {values.id && <input type="hidden" name="id" value={values.id} />}

      <Modal.Content>
        <div className="flex flex-col gap-6">
          {state.status === "error" && state.message && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-lg border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300"
            >
              <FiAlertCircle className="shrink-0" />
              {state.message}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-[280px_minmax(0,1fr)]">
            <Field label="Print do projeto">
              <ImageDropzone
                name="image"
                currentUrl={values.imageUrl}
                error={errors.image}
              />
            </Field>

            <div className="flex flex-col gap-4">
              <Input
                label="Nome do projeto"
                name="title"
                defaultValue={values.title}
                placeholder="Ex: Real Tax Contabilidade"
                error={errors.title}
                required
                autoFocus={!isEdit}
              />
              <Input
                label="Resumo"
                name="summary"
                defaultValue={values.summary}
                maxLength={160}
                placeholder="Ex: Site para contabilidade no Canadá"
                hint="Frase curta exibida acima do nome."
                error={errors.summary}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Categoria"
                  htmlFor="category"
                  error={errors.category}
                >
                  <Select name="category" defaultValue={values.category}>
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Input
                  label="Ano"
                  name="year"
                  type="number"
                  min={2000}
                  max={2100}
                  defaultValue={values.year}
                  error={errors.year}
                  required
                />
              </div>
            </div>
          </div>

          <Section title="Detalhes">
            <Input
              label="Cliente"
              name="client"
              defaultValue={values.client}
              placeholder="Nome do cliente"
              error={errors.client}
            />
            <Input
              label="Link do projeto"
              name="href"
              type="url"
              defaultValue={values.href}
              placeholder="https://"
              hint="Opcional. Mostra o botão “Veja online”."
              error={errors.href}
            />
            <Textarea
              label="Descrição"
              name="description"
              defaultValue={values.description}
              maxLength={2000}
              rows={3}
              placeholder="O que foi feito, desafios e resultados."
              error={errors.description}
              containerClassName="md:col-span-2"
              className="min-h-24"
            />
            <Input
              label="Tecnologias"
              name="tags"
              defaultValue={values.tags.join(", ")}
              placeholder="Next.js, Tailwind, SEO"
              hint="Separe por vírgula."
              error={errors.tags}
            />
            <Input
              label="Endereço (slug)"
              name="slug"
              defaultValue={values.slug}
              placeholder="real-tax-contabilidade"
              hint="Gerado a partir do nome se ficar vazio."
              error={errors.slug}
            />
          </Section>

          <Section title="Exibição">
            <Field
              label="Cor de destaque"
              htmlFor="accent"
              hint="Usada no fundo atrás do print."
              error={errors.accent}
              className="md:col-span-2"
            >
              <div className="flex items-center gap-2 md:max-w-xs">
                <input
                  id="accent"
                  name="accent"
                  type="color"
                  value={accent}
                  onChange={(event) => setAccent(event.target.value)}
                  className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-gray-700 bg-gray-800 p-1"
                />
                <input
                  aria-label="Código da cor"
                  value={accent.toUpperCase()}
                  onChange={(event) => {
                    const next = event.target.value;
                    if (/^#[0-9a-fA-F]{0,6}$/.test(next)) setAccent(next);
                  }}
                  className={cn(fieldControlClassName, "h-10 font-mono")}
                />
              </div>
            </Field>
            <SwitchField
              name="published"
              label="Publicado"
              description="Visível no site."
              defaultChecked={values.published}
            />
            <SwitchField
              name="featured"
              label="Destaque no carrossel"
              description="Aparece no carrossel da home."
              defaultChecked={values.featured}
            />
          </Section>
        </div>
      </Modal.Content>

      <Modal.Actions>
        <Button
          type="button"
          variant="light"
          size="md"
          className="flex-1"
          onClick={onCancel}
          disabled={pending}
        >
          Cancelar
        </Button>
        <Button type="submit" size="md" className="flex-1" loading={pending}>
          {isEdit ? "Salvar alterações" : "Criar projeto"}
        </Button>
      </Modal.Actions>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-gray-700 pt-5">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

"use client";

import { useCallback, useOptimistic, useState, useTransition } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiEdit2,
  FiExternalLink,
  FiEye,
  FiEyeOff,
  FiImage,
  FiPlus,
  FiSearch,
  FiStar,
  FiTrash2,
} from "react-icons/fi";
import { IoEllipsisVertical } from "react-icons/io5";
import { toast } from "react-toastify";

import {
  deleteProject,
  moveProject,
  toggleProjectFlag,
} from "@/app/admin/(panel)/projetos/actions";
import {
  categoryLabels,
  categoryOptions,
  type ProjectCategory,
} from "@/data/projects";
import { cn } from "@/lib/utils";

import { AlertDialog } from "../AlertDialog";
import { Button } from "../Button";
import { Card } from "../Card";
import { fieldControlClassName } from "../form/field-layout";
import { PageHeader } from "../PageHeader";
import { Tag } from "../Tag";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import {
  emptyProjectValues,
  ProjectFormModal,
  type ProjectFormValues,
} from "./ProjectFormModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface ProjectListItem extends Required<
  Pick<ProjectFormValues, "id">
> {
  title: string;
  slug: string;
  summary: string;
  description: string;
  client: string;
  category: ProjectCategory;
  year: number;
  tags: string[];
  href: string | null;
  featured: boolean;
  published: boolean;
  thumbnail: string | null;
  imageUrl: string | null;
  accent: string;
}

const toFormValues = (item: ProjectListItem): ProjectFormValues => ({
  id: item.id,
  title: item.title,
  slug: item.slug,
  summary: item.summary,
  description: item.description,
  client: item.client,
  category: item.category,
  year: item.year,
  tags: item.tags,
  href: item.href ?? "",
  accent: item.accent,
  featured: item.featured,
  published: item.published,
  imageUrl: item.imageUrl,
});

type Flag = "featured" | "published";
type Update = { id: string; flag: Flag } | { removeId: string };

const flagMessages: Record<Flag, [on: string, off: string]> = {
  published: ["Projeto publicado.", "Projeto movido para rascunho."],
  featured: [
    "Projeto adicionado ao carrossel.",
    "Projeto removido do carrossel.",
  ],
};

export function ProjectList({ items }: { items: ProjectListItem[] }) {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | ProjectCategory>("all");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");
  const [toDelete, setToDelete] = useState<ProjectListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<{
    open: boolean;
    values: ProjectFormValues;
  }>({ open: false, values: emptyProjectValues() });

  const openCreate = () =>
    setForm({ open: true, values: emptyProjectValues() });
  const openEdit = (item: ProjectListItem) =>
    setForm({ open: true, values: toFormValues(item) });
  const closeForm = useCallback(
    () => setForm((current) => ({ ...current, open: false })),
    []
  );

  const [optimisticItems, applyOptimistic] = useOptimistic(
    items,
    (current, update: Update) =>
      "removeId" in update
        ? current.filter((item) => item.id !== update.removeId)
        : current.map((item) =>
            item.id === update.id
              ? { ...item, [update.flag]: !item[update.flag] }
              : item
          )
  );

  const term = search.trim().toLowerCase();
  const filtered = optimisticItems.filter(
    (item) =>
      (category === "all" || item.category === category) &&
      (status === "all" ||
        (status === "published" ? item.published : !item.published)) &&
      (!term ||
        [item.title, item.summary, item.client].some((value) =>
          value.toLowerCase().includes(term)
        ))
  );
  const isFiltering = Boolean(term) || category !== "all" || status !== "all";

  const publishedCount = optimisticItems.filter((i) => i.published).length;
  const featuredCount = optimisticItems.filter(
    (i) => i.published && i.featured
  ).length;

  const toggle = (item: ProjectListItem, flag: Flag) =>
    startTransition(async () => {
      applyOptimistic({ id: item.id, flag });
      try {
        await toggleProjectFlag(item.id, flag);
        toast.success(flagMessages[flag][item[flag] ? 1 : 0]);
      } catch {
        toast.error("Não foi possível atualizar o projeto.");
      }
    });

  const move = (id: string, direction: "up" | "down") =>
    startTransition(async () => {
      try {
        await moveProject(id, direction);
      } catch {
        toast.error("Não foi possível reordenar.");
      }
    });

  const confirmDelete = () => {
    if (!toDelete) return;
    const target = toDelete;
    setDeleting(true);
    startTransition(async () => {
      applyOptimistic({ removeId: target.id });
      try {
        await deleteProject(target.id);
        toast.success("Projeto excluído.");
      } catch {
        toast.error("Não foi possível excluir o projeto.");
      } finally {
        setDeleting(false);
        setToDelete(null);
      }
    });
  };

  return (
    <>
      <PageHeader.Root>
        <PageHeader.Col>
          <PageHeader.Title>Projetos</PageHeader.Title>
          <PageHeader.Subtitle>
            Gerencie os projetos exibidos no portfólio do site.
          </PageHeader.Subtitle>
        </PageHeader.Col>
        <Button size="md" className="gap-2 max-md:w-full" onClick={openCreate}>
          <FiPlus size={16} />
          Novo projeto
        </Button>
      </PageHeader.Root>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Projetos" value={optimisticItems.length} />
        <Stat label="Publicados" value={publishedCount} />
        <Stat label="No carrossel" value={featuredCount} />
      </div>

      {optimisticItems.length > 0 && (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome, resumo ou cliente"
              aria-label="Buscar projetos"
              className={cn(fieldControlClassName, "h-10 pl-9")}
            />
          </label>
          <div className="grid grid-cols-2 gap-3 lg:w-[420px]">
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as typeof category)}
            >
              <SelectTrigger aria-label="Categoria" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as typeof status)}
            >
              <SelectTrigger aria-label="Status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="published">Publicados</SelectItem>
                <SelectItem value="draft">Rascunhos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {optimisticItems.length === 0 ? (
        <Card className="justify-center py-10">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FiImage className="h-5 w-5" />
              </EmptyMedia>
              <EmptyTitle>Nenhum projeto ainda</EmptyTitle>
              <EmptyDescription>
                Enquanto não houver projetos publicados, o site mostra os
                exemplos. Cadastre o primeiro para substituí-los.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="md" className="gap-2" onClick={openCreate}>
                <FiPlus size={16} />
                Cadastrar projeto
              </Button>
            </EmptyContent>
          </Empty>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-500">
            {filtered.length} de {optimisticItems.length}{" "}
            {optimisticItems.length === 1 ? "projeto" : "projetos"}
            {!isFiltering && " · a ordem abaixo é a mesma do site"}
          </p>

          {filtered.length === 0 && (
            <Card className="justify-center py-8 text-sm text-gray-300">
              Nenhum projeto encontrado com esses filtros.
            </Card>
          )}

          {filtered.map((item) => {
            const index = optimisticItems.indexOf(item);
            return (
              <Card
                key={item.id}
                className={cn(
                  "items-center gap-4 p-3 max-sm:flex-col max-sm:items-stretch",
                  isPending && "cursor-progress"
                )}
              >
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  aria-label={`Editar ${item.title}`}
                  className="relative aspect-[16/10] w-full shrink-0 cursor-pointer overflow-hidden rounded-md border border-gray-700 sm:w-36"
                  style={{ backgroundColor: `${item.accent}22` }}
                >
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <FiImage className="absolute inset-0 m-auto h-5 w-5 text-gray-500" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="cursor-pointer truncate text-left text-base font-semibold text-white hover:text-blue-500"
                    >
                      {item.title}
                    </button>
                    <Tag
                      tone={item.published ? "success" : "neutral"}
                      size="md"
                    >
                      {item.published ? "Publicado" : "Rascunho"}
                    </Tag>
                    {item.featured && (
                      <Tag
                        tone="primary"
                        size="md"
                        icon={FiStar}
                        iconClassName="size-3 fill-current"
                      >
                        Carrossel
                      </Tag>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-300">
                    {item.summary}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {categoryLabels[item.category]} · {item.year}
                    {item.client && ` · ${item.client}`}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2 max-sm:justify-between">
                  {!isFiltering && (
                    <div className="flex items-center gap-1">
                      <OrderButton
                        label="Mover para cima"
                        disabled={index === 0 || isPending}
                        onClick={() => move(item.id, "up")}
                      >
                        <FiArrowUp />
                      </OrderButton>
                      <OrderButton
                        label="Mover para baixo"
                        disabled={
                          index === optimisticItems.length - 1 || isPending
                        }
                        onClick={() => move(item.id, "down")}
                      >
                        <FiArrowDown />
                      </OrderButton>
                    </div>
                  )}

                  <Button
                    variant="light"
                    className="gap-2"
                    onClick={() => openEdit(item)}
                  >
                    <FiEdit2 size={14} />
                    Editar
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        aria-label={`Mais ações para ${item.title}`}
                        className="cursor-pointer rounded-full bg-gray-700/40 p-2 text-white duration-300 hover:bg-gray-700"
                      >
                        <IoEllipsisVertical />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[220px]">
                      <DropdownMenuItem
                        onClick={() => toggle(item, "published")}
                      >
                        {item.published ? <FiEyeOff /> : <FiEye />}
                        {item.published ? "Mover para rascunho" : "Publicar"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toggle(item, "featured")}
                      >
                        <FiStar />
                        {item.featured
                          ? "Tirar do carrossel"
                          : "Colocar no carrossel"}
                      </DropdownMenuItem>
                      {item.href && (
                        <DropdownMenuItem asChild>
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FiExternalLink />
                            Abrir projeto
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setToDelete(item)}
                        className="text-red-400 focus:text-red-400"
                      >
                        <FiTrash2 className="text-red-400" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ProjectFormModal
        isOpen={form.open}
        values={form.values}
        onRequestClose={closeForm}
      />

      <AlertDialog
        isOpen={Boolean(toDelete)}
        onRequestClose={() => !deleting && setToDelete(null)}
        onConfirm={confirmDelete}
        isLoading={deleting}
        title="Excluir projeto?"
        description={
          <>
            <strong className="font-medium text-white">
              {toDelete?.title}
            </strong>{" "}
            e o print serão removidos permanentemente do site.
          </>
        }
        confirmLabel="Excluir"
      />
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="flex-col gap-1 max-sm:p-3">
      <span className="truncate text-xs text-gray-500">{label}</span>
      <span className="text-xl font-semibold text-white max-sm:text-lg">
        {value}
      </span>
    </Card>
  );
}

function OrderButton({
  label,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className="flex size-8 items-center justify-center rounded-md border border-gray-700 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white disabled:pointer-events-none disabled:opacity-30 [&_svg]:size-3.5"
    >
      {children}
    </button>
  );
}

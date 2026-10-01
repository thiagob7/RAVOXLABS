"use client";

import { useOptimistic, useState, useTransition } from "react";
import {
  FiArchive,
  FiCheckCircle,
  FiInbox,
  FiMail,
  FiRotateCcw,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import { IoEllipsisVertical, IoLogoWhatsapp } from "react-icons/io5";
import { toast } from "react-toastify";

import {
  removeContactMessage,
  setContactStatus,
} from "@/app/admin/(panel)/contatos/actions";
import { cn } from "@/lib/utils";
import type { ContactMessageStatus } from "@/server/db/schema";

import { AlertDialog } from "../AlertDialog";
import { Button } from "../Button";
import { Card } from "../Card";
import { fieldControlClassName } from "../form/field-layout";
import { PageHeader } from "../PageHeader";
import { Tag } from "../Tag";
import type { TagTone } from "../Tag/variant";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

export interface ContactListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
}

type Filter = "all" | ContactMessageStatus;

const statusMeta: Record<
  ContactMessageStatus,
  { label: string; tone: TagTone }
> = {
  new: { label: "Nova", tone: "primary" },
  replied: { label: "Respondida", tone: "success" },
  archived: { label: "Arquivada", tone: "neutral" },
};

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "new", label: "Novas" },
  { value: "replied", label: "Respondidas" },
  { value: "archived", label: "Arquivadas" },
];

// Fuso fixo para o texto ser igual no servidor e no navegador.
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

function whatsappUrl(item: ContactListItem) {
  const digits = item.phone?.replace(/\D/g, "") ?? "";
  if (!digits) return null;
  const number = digits.length <= 11 ? `55${digits}` : digits;
  const text = `Olá, ${item.name.split(" ")[0]}! Aqui é da RAVOX Labs, recebemos sua mensagem pelo site.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

function mailtoUrl(item: ContactListItem) {
  const subject = "Seu contato com a RAVOX Labs";
  return `mailto:${item.email}?subject=${encodeURIComponent(subject)}`;
}

export function ContactList({ items }: { items: ContactListItem[] }) {
  const [, startTransition] = useTransition();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [toDelete, setToDelete] = useState<ContactListItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [optimisticItems, applyOptimistic] = useOptimistic(
    items,
    (
      current,
      update:
        | { id: string; status: ContactMessageStatus }
        | { removeId: string }
    ) =>
      "removeId" in update
        ? current.filter((item) => item.id !== update.removeId)
        : current.map((item) =>
            item.id === update.id ? { ...item, status: update.status } : item
          )
  );

  const countFor = (value: Filter) =>
    value === "all"
      ? optimisticItems.filter((item) => item.status !== "archived").length
      : optimisticItems.filter((item) => item.status === value).length;

  const term = search.trim().toLowerCase();
  const visible = optimisticItems.filter(
    (item) =>
      (filter === "all"
        ? item.status !== "archived"
        : item.status === filter) &&
      (!term ||
        [item.name, item.email, item.phone ?? "", item.message].some((value) =>
          value.toLowerCase().includes(term)
        ))
  );

  const changeStatus = (
    item: ContactListItem,
    status: ContactMessageStatus,
    message?: string
  ) =>
    startTransition(async () => {
      applyOptimistic({ id: item.id, status });
      try {
        await setContactStatus(item.id, status);
        if (message) toast.success(message);
      } catch {
        toast.error("Não foi possível atualizar a mensagem.");
      }
    });

  // Responder por um canal marca a mensagem como respondida.
  const markRepliedOnReply = (item: ContactListItem) => {
    if (item.status === "new") changeStatus(item, "replied");
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    const target = toDelete;
    setDeleting(true);
    startTransition(async () => {
      applyOptimistic({ removeId: target.id });
      try {
        await removeContactMessage(target.id);
        toast.success("Mensagem excluída.");
      } catch {
        toast.error("Não foi possível excluir a mensagem.");
      } finally {
        setDeleting(false);
        setToDelete(null);
      }
    });
  };

  const toggleExpanded = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <>
      <PageHeader.Root>
        <PageHeader.Col>
          <PageHeader.Title>Contatos</PageHeader.Title>
          <PageHeader.Subtitle>
            Mensagens enviadas pelo formulário do site.
          </PageHeader.Subtitle>
        </PageHeader.Col>
      </PageHeader.Root>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Recebidas" value={optimisticItems.length} />
        <Stat label="Novas" value={countFor("new")} highlight />
        <Stat label="Respondidas" value={countFor("replied")} />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div
          role="tablist"
          aria-label="Filtrar mensagens"
          className="flex h-10 shrink-0 overflow-x-auto rounded-full border border-gray-700 bg-gray-850 p-1"
        >
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={filter === item.value}
              onClick={() => setFilter(item.value)}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-medium transition-colors",
                filter === item.value
                  ? "bg-blue-500/15 text-blue-500"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              {item.label}
              <span className="text-xs opacity-70">{countFor(item.value)}</span>
            </button>
          ))}
        </div>

        <label className="relative flex-1">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome, e-mail, telefone ou mensagem"
            aria-label="Buscar mensagens"
            className={cn(fieldControlClassName, "h-10 pl-9")}
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <Card className="justify-center py-10">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FiInbox className="h-5 w-5" />
              </EmptyMedia>
              <EmptyTitle>
                {optimisticItems.length === 0
                  ? "Nenhuma mensagem ainda"
                  : "Nada por aqui"}
              </EmptyTitle>
              <EmptyDescription>
                {optimisticItems.length === 0
                  ? "Quando alguém preencher o formulário de contato do site, a mensagem aparece aqui."
                  : "Nenhuma mensagem encontrada com esses filtros."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((item) => {
            const meta = statusMeta[item.status];
            const whatsapp = whatsappUrl(item);
            const isExpanded = expanded.has(item.id);
            const isLong = item.message.length > 220;

            return (
              <Card
                key={item.id}
                className={cn(
                  "flex-col gap-4",
                  item.status === "new" && "border-blue-500/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                      item.status === "new"
                        ? "bg-blue-500/15 text-blue-500"
                        : "bg-gray-700 text-gray-300"
                    )}
                  >
                    {initialsOf(item.name)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-base font-semibold text-white">
                        {item.name}
                      </h3>
                      <Tag tone={meta.tone} size="md">
                        {meta.label}
                      </Tag>
                    </div>
                    <p className="mt-0.5 flex flex-wrap gap-x-2 text-sm text-gray-300">
                      <a
                        href={mailtoUrl(item)}
                        onClick={() => markRepliedOnReply(item)}
                        className="hover:text-white hover:underline"
                      >
                        {item.email}
                      </a>
                      {item.phone && (
                        <>
                          <span className="text-gray-500">·</span>
                          <span>{item.phone}</span>
                        </>
                      )}
                    </p>
                  </div>

                  <time
                    dateTime={item.createdAt}
                    className="shrink-0 text-xs text-gray-500 max-sm:hidden"
                  >
                    {dateFormatter.format(new Date(item.createdAt))}
                  </time>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        aria-label={`Mais ações para ${item.name}`}
                        className="shrink-0 cursor-pointer rounded-full bg-gray-700/40 p-2 text-white duration-300 hover:bg-gray-700"
                      >
                        <IoEllipsisVertical />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[220px]">
                      {item.status !== "replied" && (
                        <DropdownMenuItem
                          onClick={() =>
                            changeStatus(
                              item,
                              "replied",
                              "Marcada como respondida."
                            )
                          }
                        >
                          <FiCheckCircle />
                          Marcar como respondida
                        </DropdownMenuItem>
                      )}
                      {item.status !== "new" && (
                        <DropdownMenuItem
                          onClick={() =>
                            changeStatus(item, "new", "Marcada como nova.")
                          }
                        >
                          <FiRotateCcw />
                          Marcar como nova
                        </DropdownMenuItem>
                      )}
                      {item.status !== "archived" && (
                        <DropdownMenuItem
                          onClick={() =>
                            changeStatus(
                              item,
                              "archived",
                              "Mensagem arquivada."
                            )
                          }
                        >
                          <FiArchive />
                          Arquivar
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

                <div className="rounded-lg border border-gray-700 bg-gray-800/60 px-4 py-3">
                  <p
                    className={cn(
                      "whitespace-pre-line text-sm leading-relaxed text-gray-100",
                      !isExpanded && isLong && "line-clamp-3"
                    )}
                  >
                    {item.message}
                  </p>
                  {isLong && (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(item.id)}
                      className="mt-2 cursor-pointer text-xs font-medium text-blue-500 hover:underline"
                    >
                      {isExpanded ? "Mostrar menos" : "Ler mensagem completa"}
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {whatsapp && (
                    <Button asChild variant="light-green" className="gap-2">
                      <a
                        href={whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => markRepliedOnReply(item)}
                      >
                        <IoLogoWhatsapp size={16} />
                        Responder no WhatsApp
                      </a>
                    </Button>
                  )}
                  <Button asChild variant="light" className="gap-2">
                    <a
                      href={mailtoUrl(item)}
                      onClick={() => markRepliedOnReply(item)}
                    >
                      <FiMail size={14} />
                      Responder por e-mail
                    </a>
                  </Button>
                  <time
                    dateTime={item.createdAt}
                    className="ml-auto text-xs text-gray-500 sm:hidden"
                  >
                    {dateFormatter.format(new Date(item.createdAt))}
                  </time>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog
        isOpen={Boolean(toDelete)}
        onRequestClose={() => !deleting && setToDelete(null)}
        onConfirm={confirmDelete}
        isLoading={deleting}
        title="Excluir mensagem?"
        description={
          <>
            A mensagem de{" "}
            <strong className="font-medium text-white">{toDelete?.name}</strong>{" "}
            será removida permanentemente.
          </>
        }
        confirmLabel="Excluir"
      />
    </>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <Card className="flex-col gap-1 max-sm:p-3">
      <span className="truncate text-xs text-gray-500">{label}</span>
      <span
        className={cn(
          "text-xl font-semibold max-sm:text-lg",
          highlight && value > 0 ? "text-blue-500" : "text-white"
        )}
      >
        {value}
      </span>
    </Card>
  );
}

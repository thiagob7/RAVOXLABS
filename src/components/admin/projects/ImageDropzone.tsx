"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import {
  FiCrop,
  FiRefreshCw,
  FiRotateCcw,
  FiTrash2,
  FiUploadCloud,
} from "react-icons/fi";
import { IoImagesOutline } from "react-icons/io5";

import { cn } from "@/lib/utils";

import {
  ImageCropDialog,
  type CropFrame,
  type CropResult,
} from "./ImageCropDialog";

/** O original é reduzido no navegador antes do envio, então pode ser grande. */
const MAX_BYTES = 40 * 1024 * 1024;
const ACCEPT = "image/png,image/jpeg,image/webp,image/avif";
/** Mesma proporção da capa no site (ProjectCover). */
const ASPECT = 16 / 10;
const EXPORT_WIDTH = 2000;

interface ImageDropzoneProps {
  name: string;
  currentUrl?: string | null;
  error?: string;
}

interface Pending {
  /** Arquivo como veio, para reabrir o corte sem perder qualidade. */
  original: File;
  /** O que vai de fato no formulário: recortado ou o original. */
  file: File;
  frame?: CropFrame;
  cropped: boolean;
}

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export function ImageDropzone({ name, currentUrl, error }: ImageDropzoneProps) {
  // O seletor é só para escolher; o arquivo que segue no formulário fica no
  // input com `name`, assim cancelar o corte não apaga o que já estava lá.
  const pickerRef = useRef<HTMLInputElement>(null);
  const fieldRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [editing, setEditing] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [dragState, setDragState] = useState<"idle" | "accept" | "reject">(
    "idle"
  );
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!pending) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(pending.file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [pending]);

  useEffect(() => {
    if (!fieldRef.current) return;
    const transfer = new DataTransfer();
    if (pending) transfer.items.add(pending.file);
    fieldRef.current.files = transfer.files;
  }, [pending]);

  const shownUrl = preview ?? (removed ? null : currentUrl);
  // O erro do servidor deixa de valer quando um novo arquivo é escolhido.
  const message = localError ?? (pending ? undefined : error);
  const changed = Boolean(currentUrl) && (Boolean(pending) || removed);

  function openPicker() {
    pickerRef.current?.click();
  }

  function selectFile(file: File | undefined) {
    setLocalError(null);
    if (!file) return;

    if (!ACCEPT.split(",").includes(file.type)) {
      setLocalError("Formato não suportado. Use PNG, JPG, WebP ou AVIF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setLocalError("A imagem deve ter no máximo 40 MB.");
      return;
    }

    setEditing(file);
  }

  function applyCrop({ file, frame }: CropResult) {
    if (!editing) return;
    setPending({ original: editing, file, frame, cropped: true });
    setRemoved(false);
    setEditing(null);
  }

  function skipCrop(file: File) {
    if (!editing) return;
    setPending({ original: editing, file, cropped: false });
    setRemoved(false);
    setEditing(null);
  }

  function clear() {
    setPending(null);
    setLocalError(null);
    setRemoved(Boolean(currentUrl));
  }

  // Volta ao print salvo, descartando troca ou remoção.
  function restore() {
    setPending(null);
    setLocalError(null);
    setRemoved(false);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const type = event.dataTransfer.items[0]?.type;
    setDragState(
      type && ACCEPT.split(",").includes(type) ? "accept" : "reject"
    );
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    // Ignora a saída para um filho (botões, imagem): só zera ao sair da área.
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }
    setDragState("idle");
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragState("idle");
    selectFile(event.dataTransfer.files[0]);
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={pickerRef}
        id={name}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          selectFile(event.target.files?.[0]);
          // Permite escolher o mesmo arquivo de novo depois de cancelar.
          event.target.value = "";
        }}
      />
      <input
        ref={fieldRef}
        name={name}
        type="file"
        className="hidden"
        aria-hidden
        tabIndex={-1}
      />
      {removed && <input type="hidden" name="removeImage" value="on" />}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "group relative aspect-[16/10] overflow-hidden rounded-lg transition-colors duration-200",
          shownUrl ? "border" : "border-2 border-dashed",
          dragState === "accept" && "border-blue-500 bg-blue-500/10",
          dragState === "reject" && "border-red-400 bg-red-400/10",
          dragState === "idle" &&
            (message
              ? "border-red-400"
              : shownUrl
                ? "border-gray-700"
                : "border-gray-500 hover:border-blue-500")
        )}
      >
        {shownUrl ? (
          <>
            <img
              src={shownUrl}
              alt="Prévia do print"
              className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
            />

            {dragState === "idle" ? (
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center gap-2 bg-gray-950/60 backdrop-blur-[2px] transition-opacity duration-200",
                  "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100",
                  "pointer-coarse:pointer-events-auto pointer-coarse:bg-gray-950/40 pointer-coarse:opacity-100"
                )}
              >
                {pending && (
                  <OverlayButton
                    label="Ajustar corte"
                    onClick={() => setEditing(pending.original)}
                  >
                    <FiCrop />
                  </OverlayButton>
                )}
                <OverlayButton label="Trocar print" onClick={openPicker}>
                  <FiRefreshCw />
                </OverlayButton>
                <OverlayButton label="Remover print" danger onClick={clear}>
                  <FiTrash2 />
                </OverlayButton>
              </div>
            ) : (
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-sm font-medium backdrop-blur-sm",
                  dragState === "accept"
                    ? "bg-blue-500/25 text-white"
                    : "bg-red-400/25 text-red-100"
                )}
              >
                <FiUploadCloud className="size-6" />
                {dragState === "accept"
                  ? "Solte para trocar o print"
                  : "Formato não suportado"}
              </div>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={openPicker}
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 px-6 text-center"
          >
            <IoImagesOutline
              size={56}
              className={cn(
                dragState === "accept" ? "text-blue-500" : "text-gray-500"
              )}
            />
            <span className="text-sm text-white">
              Arraste e solte ou clique para enviar
            </span>
            <span className="text-xs text-gray-500">
              PNG, JPG, WebP ou AVIF · até 40 MB
              <br />
              Recomendado: 2000px de largura
            </span>
          </button>
        )}
      </div>

      <div className="flex min-h-4 items-center justify-between gap-3 text-xs">
        {message ? (
          <p className="font-light text-red-400">{message}</p>
        ) : pending ? (
          <p className="min-w-0 truncate text-gray-500">
            <span className="text-blue-400">
              {pending.cropped ? "Recortado:" : "Novo:"}
            </span>{" "}
            {pending.file.name} · {formatSize(pending.file.size)}
          </p>
        ) : removed ? (
          <p className="text-gray-500">
            O print atual será removido ao salvar.
          </p>
        ) : (
          currentUrl && <p className="text-gray-500">Print atual</p>
        )}

        {changed && (
          <button
            type="button"
            onClick={restore}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-gray-400 transition-colors hover:text-white"
          >
            <FiRotateCcw className="size-3" />
            Desfazer
          </button>
        )}
      </div>

      {editing && (
        <ImageCropDialog
          file={editing}
          aspect={ASPECT}
          exportWidth={EXPORT_WIDTH}
          initialFrame={
            editing === pending?.original ? pending.frame : undefined
          }
          onCancel={() => setEditing(null)}
          onSkip={skipCrop}
          onApply={applyCrop}
        />
      )}
    </div>
  );
}

function OverlayButton({
  label,
  danger,
  onClick,
  children,
}: {
  label: string;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-gray-900/80 text-gray-100 shadow-lg backdrop-blur transition-all duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-blue-500 [&_svg]:size-4",
        danger
          ? "hover:border-red-400/60 hover:bg-red-400/25 hover:text-red-300"
          : "hover:border-white/30 hover:bg-gray-800"
      )}
    >
      {children}
    </button>
  );
}

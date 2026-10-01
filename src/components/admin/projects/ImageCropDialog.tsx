"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Cropper, {
  type Area,
  type MediaSize,
  type Point,
  type Size,
} from "react-easy-crop";
import { FiMaximize, FiMinimize, FiRotateCw } from "react-icons/fi";

import { cn } from "@/lib/utils";

import { Button } from "../Button";
import { Modal } from "../Modal";

const ZOOM_MAX = 3;
/** Teto de pixels do canvas: o Safari recusa acima de ~16,7 milhões. */
const MAX_PIXELS = 16_000_000;
/** O servidor aceita até 10 MB; passando disso, recomprime. */
const MAX_OUTPUT_BYTES = 9.5 * 1024 * 1024;

export interface CropFrame {
  crop: Point;
  zoom: number;
  rotation: number;
}

export interface CropResult {
  file: File;
  /** Enquadramento usado, para reabrir o editor do mesmo jeito. */
  frame: CropFrame;
}

interface ImageCropDialogProps {
  file: File;
  aspect: number;
  /** Largura máxima exportada. Imagens menores não são ampliadas. */
  exportWidth: number;
  initialFrame?: CropFrame;
  onCancel: () => void;
  /** Recebe o arquivo inteiro, só reduzido, sem corte. */
  onSkip: (file: File) => void;
  onApply: (result: CropResult) => void;
}

const START: CropFrame = { crop: { x: 0, y: 0 }, zoom: 1, rotation: 0 };

const bboxOf = (media: MediaSize, rotation: number) =>
  rotation % 180 === 0
    ? { width: media.width, height: media.height }
    : { width: media.height, height: media.width };

export function ImageCropDialog({
  file,
  aspect,
  exportWidth,
  initialFrame = START,
  onCancel,
  onSkip,
  onApply,
}: ImageCropDialogProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>(initialFrame.crop);
  const [zoom, setZoom] = useState(initialFrame.zoom);
  const [rotation, setRotation] = useState(initialFrame.rotation);
  const [area, setArea] = useState<Area | null>(null);
  const [media, setMedia] = useState<MediaSize | null>(null);
  const [cropSize, setCropSize] = useState<Size | null>(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // O modal do projeto também escuta ESC; aqui ele só fecha o editor.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      if (!working) onCancel();
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [onCancel, working]);

  // Zoom 1 cobre a moldura; o menor zoom encaixa a imagem inteira nela.
  const fitZoom =
    media && cropSize
      ? Math.min(
          1,
          cropSize.width / bboxOf(media, rotation).width,
          cropSize.height / bboxOf(media, rotation).height
        )
      : Math.min(1, initialFrame.zoom);

  /*
    A posição é presa à mão (e não pela lib) porque com zoom abaixo de 1 a
    lib cortaria a sobra do recorte. Aqui a imagem fica sempre dentro da
    moldura no lado em que é menor e cobrindo no lado em que é maior.
  */
  const hold = (point: Point, nextZoom: number, nextRotation = rotation) => {
    if (!media || !cropSize) return point;
    const box = bboxOf(media, nextRotation);
    const roomX = Math.abs(box.width * nextZoom - cropSize.width) / 2;
    const roomY = Math.abs(box.height * nextZoom - cropSize.height) / 2;
    return {
      x: Math.min(roomX, Math.max(-roomX, point.x)),
      y: Math.min(roomY, Math.max(-roomY, point.y)),
    };
  };

  const changeZoom = (next: number) => {
    const clamped = Math.min(ZOOM_MAX, Math.max(fitZoom, next));
    setZoom(clamped);
    setCrop((old) => hold(old, clamped));
  };

  const rotate = () => {
    const next = (rotation + 90) % 360;
    setRotation(next);
    setCrop(START.crop);
    setZoom(1);
  };

  const isFit = Math.abs(zoom - fitZoom) < 0.005;
  const isFill = Math.abs(zoom - 1) < 0.005;
  const untouched = isFill && rotation === 0 && crop.x === 0 && crop.y === 0;

  async function run(task: () => Promise<void>) {
    if (!src || working) return;
    setWorking(true);
    try {
      await task();
    } finally {
      setWorking(false);
    }
  }

  const apply = () =>
    run(async () => {
      if (!area || !src) return;
      onApply({
        file: await exportImage(src, file.name, area, rotation, exportWidth),
        frame: { crop, zoom, rotation },
      });
    });

  const skip = () =>
    run(async () => {
      if (!src) return;
      onSkip(await exportImage(src, file.name, null, rotation, exportWidth));
    });

  return createPortal(
    <div data-modal-interactive-layer="true">
      <Modal.Root
        isOpen
        onRequestClose={() => !working && onCancel()}
        className="w-[calc(100%-24px)] max-w-2xl"
      >
        <Modal.Header>
          <Modal.Title>Ajustar print</Modal.Title>
          <Modal.Subtitle>
            Arraste para posicionar e use a roda do mouse ou o gesto de pinça
            para o zoom.
          </Modal.Subtitle>
          <Modal.ButtonClose onClick={() => !working && onCancel()} />
        </Modal.Header>

        <Modal.Content>
          <div className="relative h-[min(420px,55vh)] overflow-hidden rounded-lg bg-gray-950 bg-[repeating-conic-gradient(#ffffff08_0_25%,transparent_0_50%)] bg-[length:16px_16px]">
            {src && (
              <Cropper
                image={src}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect}
                minZoom={fitZoom}
                maxZoom={ZOOM_MAX}
                zoomSpeed={0.6}
                restrictPosition={false}
                onCropChange={(next) => setCrop(hold(next, zoom))}
                onZoomChange={changeZoom}
                onCropComplete={(_, pixels) => setArea(pixels)}
                onMediaLoaded={setMedia}
                onCropSizeChange={setCropSize}
                classes={{ cropAreaClassName: "!rounded-sm !border-white/80" }}
              />
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div
              role="radiogroup"
              aria-label="Enquadramento"
              className="flex rounded-lg border border-gray-700 bg-gray-800 p-0.5 text-sm"
            >
              <ModeButton
                active={isFill}
                onClick={() => {
                  setZoom(1);
                  setCrop((old) => hold(old, 1));
                }}
              >
                Preencher
              </ModeButton>
              <ModeButton
                active={isFit}
                disabled={fitZoom > 0.995}
                onClick={() => {
                  setZoom(fitZoom);
                  setCrop(START.crop);
                }}
              >
                Inteira
              </ModeButton>
            </div>

            <div className="flex min-w-40 flex-1 items-center gap-3 text-gray-500">
              <FiMinimize className="size-4 shrink-0" />
              <input
                type="range"
                aria-label="Zoom"
                min={fitZoom}
                max={ZOOM_MAX}
                step={0.01}
                value={zoom}
                onChange={(event) => changeZoom(Number(event.target.value))}
                className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-gray-700 accent-blue-500"
              />
              <FiMaximize className="size-4 shrink-0" />
            </div>

            <Button
              type="button"
              variant="light"
              aria-label="Girar 90°"
              title="Girar 90°"
              className="w-9 px-0"
              onClick={rotate}
            >
              <FiRotateCw className="size-4" />
            </Button>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Em “Inteira”, a sobra fica transparente e mostra o fundo do card no
            site. A imagem é reduzida para até {exportWidth}px antes do envio.
          </p>
        </Modal.Content>

        <Modal.Actions className="flex-wrap gap-2 max-sm:[&>*]:flex-1">
          <Button
            type="button"
            variant="light"
            size="md"
            className="sm:mr-auto"
            disabled={untouched || working}
            onClick={() => {
              setRotation(0);
              setZoom(1);
              setCrop(START.crop);
            }}
          >
            Redefinir
          </Button>
          <Button
            type="button"
            variant="light"
            size="md"
            disabled={working}
            onClick={() => void skip()}
          >
            Usar sem cortar
          </Button>
          <Button
            type="button"
            size="md"
            disabled={!area}
            loading={working}
            onClick={() => void apply()}
          >
            Aplicar
          </Button>
        </Modal.Actions>
      </Modal.Root>
    </div>,
    document.body
  );
}

function ModeButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-8 cursor-pointer rounded-md px-3 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        active
          ? "bg-gray-700 text-white shadow-sm"
          : "text-gray-400 not-disabled:hover:text-gray-100"
      )}
    >
      {children}
    </button>
  );
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

const toBlob = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Falha ao exportar"))),
      "image/webp",
      quality
    )
  );

/**
 * Desenha a imagem girada e recorta `area` (em pixels da imagem girada;
 * pode passar das bordas, e a sobra fica transparente). Sem `area`, usa a
 * imagem inteira. Reduz para `maxWidth` e nunca amplia.
 */
async function exportImage(
  src: string,
  fileName: string,
  area: Area | null,
  rotation: number,
  maxWidth: number
) {
  const image = await loadImage(src);
  const { naturalWidth, naturalHeight } = image;
  const sideways = rotation % 180 !== 0;
  const rotatedWidth = sideways ? naturalHeight : naturalWidth;
  const rotatedHeight = sideways ? naturalWidth : naturalHeight;
  const region = area ?? {
    x: 0,
    y: 0,
    width: rotatedWidth,
    height: rotatedHeight,
  };

  const scale = Math.min(
    1,
    maxWidth / region.width,
    Math.sqrt(MAX_PIXELS / (region.width * region.height))
  );

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(region.width * scale));
  canvas.height = Math.max(1, Math.round(region.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas indisponível");

  // Direto no canvas final, sem intermediário em tamanho cheio.
  context.imageSmoothingQuality = "high";
  context.scale(scale, scale);
  context.translate(rotatedWidth / 2 - region.x, rotatedHeight / 2 - region.y);
  context.rotate((rotation * Math.PI) / 180);
  context.drawImage(image, -naturalWidth / 2, -naturalHeight / 2);

  let blob = await toBlob(canvas, 0.9);
  if (blob.size > MAX_OUTPUT_BYTES) blob = await toBlob(canvas, 0.72);

  // Safari sem WebP devolve PNG: o nome segue o tipo real.
  const extension = blob.type === "image/webp" ? ".webp" : ".png";
  return new File([blob], fileName.replace(/\.[^.]+$/, "") + extension, {
    type: blob.type,
  });
}

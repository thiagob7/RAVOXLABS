import "server-only";

import { randomUUID } from "node:crypto";
import sharp, { type Metadata } from "sharp";

import { deleteObjects, publicUrl, putObject } from "./r2";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const ACCEPTED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
]);

/** Larguras geradas para cada print. O maior é usado no carrossel. */
export const IMAGE_WIDTHS = { lg: 2000, md: 1000 } as const;
export type ImageSize = keyof typeof IMAGE_WIDTHS;

const variantKey = (baseKey: string, size: ImageSize) =>
  `${baseKey}-${size}.webp`;

export class ImageUploadError extends Error {}

/**
 * Valida, redimensiona (sem ampliar) e envia o print para o R2 em WebP,
 * gerando uma versão grande e uma média. Retorna a chave base.
 */
export async function uploadProjectImage(file: File) {
  if (!ACCEPTED_TYPES.has(file.type)) {
    throw new ImageUploadError(
      "Formato não suportado. Use PNG, JPG, WebP ou AVIF."
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ImageUploadError("A imagem deve ter no máximo 10 MB.");
  }

  const input = Buffer.from(await file.arrayBuffer());

  let metadata: Metadata;
  try {
    metadata = await sharp(input).metadata();
  } catch {
    throw new ImageUploadError("Não foi possível ler a imagem enviada.");
  }
  if (!metadata.width || !metadata.height) {
    throw new ImageUploadError("Não foi possível ler as dimensões da imagem.");
  }

  const baseKey = `projects/${randomUUID()}`;

  const variants = await Promise.all(
    (Object.keys(IMAGE_WIDTHS) as ImageSize[]).map(async (size) => {
      const { data, info } = await sharp(input)
        .rotate()
        .resize({ width: IMAGE_WIDTHS[size], withoutEnlargement: true })
        .webp({ quality: size === "lg" ? 82 : 78, effort: 5 })
        .toBuffer({ resolveWithObject: true });
      return { size, data, info };
    })
  );

  await Promise.all(
    variants.map(({ size, data }) =>
      putObject(variantKey(baseKey, size), data, "image/webp")
    )
  );

  const large = variants.find((v) => v.size === "lg")!.info;
  return { key: baseKey, width: large.width, height: large.height };
}

export async function deleteProjectImage(baseKey: string | null | undefined) {
  if (!baseKey) return;
  await deleteObjects(
    (Object.keys(IMAGE_WIDTHS) as ImageSize[]).map((size) =>
      variantKey(baseKey, size)
    )
  );
}

export function projectImageUrl(baseKey: string, size: ImageSize = "lg") {
  return publicUrl(variantKey(baseKey, size));
}

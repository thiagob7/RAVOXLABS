import "server-only";

import {
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { serverEnv } from "../env";

let client: S3Client | undefined;

function getClient() {
  client ??= new S3Client({
    region: "auto",
    endpoint:
      serverEnv.R2_ENDPOINT ??
      `https://${serverEnv.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: serverEnv.R2_ACCESS_KEY_ID,
      secretAccessKey: serverEnv.R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: Boolean(serverEnv.R2_ENDPOINT),
  });
  return client;
}

export async function putObject(
  key: string,
  body: Buffer,
  contentType: string
) {
  await getClient().send(
    new PutObjectCommand({
      Bucket: serverEnv.R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      // Chaves são únicas por upload, então o cache pode ser eterno.
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
}

export async function deleteObjects(keys: string[]) {
  if (keys.length === 0) return;
  await getClient().send(
    new DeleteObjectsCommand({
      Bucket: serverEnv.R2_BUCKET,
      Delete: { Objects: keys.map((Key) => ({ Key })), Quiet: true },
    })
  );
}

export function publicUrl(key: string) {
  return `${serverEnv.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
}

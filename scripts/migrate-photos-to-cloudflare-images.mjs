import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const sourceDir = path.join(projectRoot, "src/assets/images");
const activeSourceFile = path.join(projectRoot, "src/data/photos.ts");
const remoteSourceFile = path.join(projectRoot, "src/data/photos.remote.ts");

const validExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
]);
const rootLabels = {
  ANIMALES: "Animales",
  CLABORACIONES: "Colaboraciones",
  JUJITSU: "Jiu-Jitsu",
  LUGARES: "Lugares",
  MAR: "Mar",
  MONOCROMA: "Monocroma",
  NATURALEZA: "Naturaleza",
  RETRATOS: "Retratos",
  SKATE: "Skate",
  SURF: "Surf",
};
const uploadTargetBytes = 9_500_000;
const widthSteps = [null, 5000, 4600, 4200, 3800, 3400, 3000, 2600, 2200];
const qualitySteps = [85, 80, 75, 70, 65, 60, 55];

function toCategoryId(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatSegment(value) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function titleFromFilename(filename) {
  const withoutExt = filename.replace(/\.[^.]+$/, "");
  return withoutExt
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildCustomId(relativePath) {
  const normalized = relativePath
    .normalize("NFKD")
    .replace(/[^\w./-]+/g, "-")
    .replace(/\/+/g, "/")
    .replace(/-+/g, "-")
    .replace(/\.[^.]+$/, "")
    .toLowerCase();

  const shortHash = createHash("sha1").update(relativePath).digest("hex").slice(0, 10);
  return `gallery/${normalized}-${shortHash}`;
}

function buildRemotePhoto(relativePath, imageId, src, width, height) {
  const parts = relativePath.split("/");
  const filename = parts[parts.length - 1] ?? "";
  const rootFolder = parts[0] ?? "OTROS";
  const subfolder = parts.length > 2 ? parts[1] : "";
  const rootLabel = rootLabels[rootFolder] ?? formatSegment(rootFolder);
  const title = titleFromFilename(filename);

  return {
    id: imageId,
    title,
    alt: `Sergi Ortega - ${title}`,
    category: toCategoryId(rootFolder),
    filterLabel: rootLabel,
    displayCategory: subfolder
      ? `${rootLabel} / ${formatSegment(subfolder)}`
      : rootLabel,
    src,
    width,
    height,
    aspect: `${width}/${height}`,
    relativePath,
  };
}

function parseEnvFile(content) {
  const env = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

async function loadEnv() {
  const env = {};
  for (const fileName of [".env", ".dev.vars"]) {
    const filePath = path.join(projectRoot, fileName);
    try {
      const content = await fs.readFile(filePath, "utf8");
      Object.assign(env, parseEnvFile(content));
    } catch (error) {
      if (error && error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  return {
    ...env,
    ...process.env,
  };
}

async function listImageFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listImageFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && validExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(entryPath);
    }
  }

  return files.sort((a, b) => a.localeCompare(b, "es"));
}

function uniqueNumbers(values) {
  return [...new Set(values.filter((value) => Number.isFinite(value) && value > 0))];
}

function getContentType(format, filePath) {
  const byFormat = {
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    avif: "image/avif",
  };

  return byFormat[format] ?? byFormat[path.extname(filePath).slice(1).toLowerCase()] ?? "application/octet-stream";
}

function getOutputExtension(format) {
  return format === "jpeg" ? ".jpg" : `.${format}`;
}

function getPreferredUploadFormat(metadata) {
  if (metadata.hasAlpha) {
    return "webp";
  }

  return "jpeg";
}

async function renderVariant(inputBuffer, targetWidth, format, quality) {
  let pipeline = sharp(inputBuffer, { failOn: "none" }).rotate();

  if (targetWidth) {
    pipeline = pipeline.resize({
      width: targetWidth,
      withoutEnlargement: true,
      fit: "inside",
    });
  }

  if (format === "webp") {
    return pipeline.webp({ quality, effort: 6, alphaQuality: 80 }).toBuffer();
  }

  return pipeline.jpeg({ quality, mozjpeg: true, progressive: true }).toBuffer();
}

async function prepareUploadAsset(filePath) {
  const inputBuffer = await fs.readFile(filePath);
  const metadata = await sharp(inputBuffer, { failOn: "none" }).rotate().metadata();
  const width = metadata.width;
  const height = metadata.height;

  if (!width || !height) {
    throw new Error(`No se pudieron leer las dimensiones de ${filePath}`);
  }

  const originalFormat = metadata.format ?? path.extname(filePath).slice(1).toLowerCase();
  if (inputBuffer.byteLength <= uploadTargetBytes) {
    return {
      buffer: inputBuffer,
      width,
      height,
      contentType: getContentType(originalFormat, filePath),
      outputFilename: path.basename(filePath),
      transformed: false,
    };
  }

  const targetFormat = getPreferredUploadFormat(metadata);
  const candidateWidths = uniqueNumbers([
    width,
    ...widthSteps.map((value) => (value === null ? width : Math.min(width, value))),
  ]);
  let bestCandidate = null;

  for (const candidateWidth of candidateWidths) {
    for (const quality of qualitySteps) {
      const buffer = await renderVariant(inputBuffer, candidateWidth, targetFormat, quality);
      const candidateMetadata = await sharp(buffer, { failOn: "none" }).metadata();

      const candidate = {
        buffer,
        width: candidateMetadata.width ?? candidateWidth,
        height: candidateMetadata.height ?? height,
        contentType: getContentType(targetFormat, filePath),
        outputFilename: `${path.basename(filePath, path.extname(filePath))}${getOutputExtension(targetFormat)}`,
        transformed: true,
      };

      if (!bestCandidate || buffer.byteLength < bestCandidate.buffer.byteLength) {
        bestCandidate = candidate;
      }

      if (buffer.byteLength <= uploadTargetBytes) {
        return candidate;
      }
    }
  }

  throw new Error(
    `No se pudo reducir ${filePath} por debajo de 10 MiB. Mejor candidato: ${bestCandidate?.buffer.byteLength ?? 0} bytes.`,
  );
}

async function getExistingImage(accountId, token, imageId) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${imageId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (response.status === 404) {
    return null;
  }

  const payload = await response.json();
  if (!response.ok || !payload?.success || !payload?.result) {
    return null;
  }

  return payload.result;
}

function getPublicVariantUrl(accountHash, imageId, variants = []) {
  return (
    variants.find((variant) => typeof variant === "string" && variant.endsWith("/public")) ??
    `https://imagedelivery.net/${accountHash}/${imageId}/public`
  );
}

async function uploadImage({ accountId, token, accountHash, filePath, relativePath }) {
  const prepared = await prepareUploadAsset(filePath);
  const imageId = buildCustomId(relativePath);
  const formData = new FormData();

  formData.append("id", imageId);
  formData.append(
    "file",
    new File([prepared.buffer], prepared.outputFilename, {
      type: prepared.contentType,
    }),
  );
  formData.append(
    "metadata",
    JSON.stringify({
      relativePath,
      source: "astro-gallery-migration",
    }),
  );
  formData.append("requireSignedURLs", "false");

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );
  const payload = await response.json().catch(() => null);

  if (response.ok && payload?.success && payload?.result) {
    return {
      imageId,
      src: getPublicVariantUrl(accountHash, imageId, payload.result.variants),
      width: prepared.width,
      height: prepared.height,
      transformed: prepared.transformed,
      reused: false,
    };
  }

  const existing = await getExistingImage(accountId, token, imageId);
  if (existing) {
    return {
      imageId,
      src: getPublicVariantUrl(accountHash, imageId, existing.variants),
      width: prepared.width,
      height: prepared.height,
      transformed: prepared.transformed,
      reused: true,
    };
  }

  throw new Error(
    `Fallo subiendo ${relativePath}: ${payload ? JSON.stringify(payload.errors ?? payload) : `HTTP ${response.status}`}`,
  );
}

function buildRemoteSourceContent(records) {
  const serialized = JSON.stringify(records, null, 2);

  return `import type { PhotoCategory, PhotoItem } from "./photos.shared";\nexport type { PhotoCategory, PhotoDimensions, PhotoItem } from "./photos.shared";\nexport { getPanoramaTileClass } from "./photos.shared";\n\nexport const galleryPhotos: PhotoItem[] = ${serialized};\n\nconst uniqueCategories = new Map<string, string>();\nfor (const photo of galleryPhotos) {\n  if (!uniqueCategories.has(photo.category)) {\n    uniqueCategories.set(photo.category, photo.filterLabel);\n  }\n}\n\nexport const photoCategories: PhotoCategory[] = Array.from(\n  uniqueCategories.entries(),\n)\n  .map(([id, label]) => ({ id, label }))\n  .sort((a, b) => a.label.localeCompare(b.label, \"es\"));\n\nexport const photoFilters: PhotoCategory[] = [\n  { id: \"all\", label: \"Todo\" },\n  ...photoCategories,\n];\n`;
}

async function activateRemoteSource(records) {
  await fs.writeFile(remoteSourceFile, buildRemoteSourceContent(records), "utf8");
  await fs.writeFile(activeSourceFile, 'export * from "./photos.remote";\n', "utf8");
}

async function activateLocalSource() {
  await fs.writeFile(activeSourceFile, 'export * from "./photos.local";\n', "utf8");
}

async function removeFileIfExists(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (!error || error.code !== "ENOENT") {
      throw error;
    }
  }
}

async function removeEmptyDirectories(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await removeEmptyDirectories(path.join(dirPath, entry.name));
    }
  }

  const remainingEntries = await fs.readdir(dirPath);
  if (remainingEntries.length === 0 && dirPath !== sourceDir) {
    await fs.rmdir(dirPath);
  }
}

async function deleteLocalAssets(files) {
  for (const filePath of files) {
    await fs.unlink(filePath);
  }

  await removeEmptyDirectories(sourceDir);
}

async function main() {
  const args = new Set(process.argv.slice(2));
  if (args.has("--restore-local")) {
    await activateLocalSource();
    await removeFileIfExists(remoteSourceFile);
    console.log("Fuente local restaurada en src/data/photos.ts");
    return;
  }

  const env = await loadEnv();
  const accountId = (env.CF_ACCOUNT_ID ?? "").trim();
  const accountHash = (env.CF_IMAGES_ACCOUNT_HASH ?? "").trim();
  const token = (env.CF_IMAGES_TOKEN ?? "").trim();

  if (!accountId || !accountHash || !token) {
    throw new Error(
      "Faltan CF_ACCOUNT_ID, CF_IMAGES_ACCOUNT_HASH o CF_IMAGES_TOKEN. Crea .env o exporta esas variables antes de ejecutar la migracion.",
    );
  }

  const files = await listImageFiles(sourceDir);
  if (files.length === 0) {
    throw new Error("No hay imagenes en src/assets/images para migrar.");
  }

  const records = [];
  let transformedCount = 0;
  let reusedCount = 0;

  for (const filePath of files) {
    const relativePath = path.relative(sourceDir, filePath).split(path.sep).join("/");
    const uploaded = await uploadImage({
      accountId,
      token,
      accountHash,
      filePath,
      relativePath,
    });

    if (uploaded.transformed) transformedCount += 1;
    if (uploaded.reused) reusedCount += 1;

    records.push(
      buildRemotePhoto(
        relativePath,
        uploaded.imageId,
        uploaded.src,
        uploaded.width,
        uploaded.height,
      ),
    );

    console.log(`${uploaded.reused ? "reusado" : "subido"}: ${relativePath}`);
  }

  const orderedRecords = records
    .sort((a, b) => a.relativePath.localeCompare(b.relativePath, "es"))
    .map((photo, index) => ({
      ...photo,
      id: index + 1,
    }));

  await activateRemoteSource(orderedRecords);

  if (args.has("--delete-local")) {
    await deleteLocalAssets(files);
  }

  console.log(`Migracion completada. Total: ${orderedRecords.length}. Recomprimidas: ${transformedCount}. Reusadas: ${reusedCount}.`);
  console.log(`Fuente activa: ${path.relative(projectRoot, activeSourceFile)}`);
  console.log(`Fuente remota generada: ${path.relative(projectRoot, remoteSourceFile)}`);
  if (args.has("--delete-local")) {
    console.log("Assets locales eliminados de src/assets/images.");
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
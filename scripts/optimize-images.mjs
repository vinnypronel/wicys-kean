// Shrinks photos uploaded through the admin editor so the repo and the site
// stay light. Files keep their name and extension, so content links still work.
// Runs on every build and from the GitHub Action after each upload.
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const ROOT = path.join(process.cwd(), 'public', 'images', 'uploads');
const MAX_EDGE = 2000;
const MAX_BYTES = 450 * 1024;
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXTENSIONS.has(path.extname(entry.name).toLowerCase())) yield full;
  }
}

function encode(pipeline, ext) {
  if (ext === '.png') return pipeline.png({ compressionLevel: 9, palette: true, quality: 85 });
  if (ext === '.webp') return pipeline.webp({ quality: 80 });
  return pipeline.jpeg({ quality: 80, mozjpeg: true });
}

let changed = 0;
let saved = 0;

for await (const file of walk(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  const { size } = await stat(file);
  const input = await readFile(file);
  const meta = await sharp(input).metadata();
  const longest = Math.max(meta.width ?? 0, meta.height ?? 0);
  const rotated = (meta.orientation ?? 1) > 1;

  if (longest <= MAX_EDGE && size <= MAX_BYTES && !rotated) continue;

  const output = await encode(
    sharp(input)
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true }),
    ext
  ).toBuffer();

  if (output.length >= size && !rotated && longest <= MAX_EDGE) continue;

  await writeFile(file, output);
  changed += 1;
  saved += size - output.length;
  console.log(
    `optimized ${path.relative(process.cwd(), file)}: ${(size / 1024).toFixed(0)}KB -> ${(output.length / 1024).toFixed(0)}KB`
  );
}

console.log(
  changed > 0
    ? `Optimized ${changed} image(s), saved ${(saved / 1024 / 1024).toFixed(1)}MB.`
    : 'Uploaded images are already optimized.'
);

import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const args = parseArgs(process.argv.slice(2));
const root = required(args, "root");
const outputDirectory = required(args, "output-dir");
const prefix = args.prefix ?? "screenshot-review";
const pageSize = Number.parseInt(args["page-size"] ?? "16", 10);
const start = args.start ? new Date(args.start) : null;
const end = args.end ? new Date(args.end) : null;

if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 30) {
  throw new Error("--page-size must be an integer from 1 to 30.");
}

const discovered = await walkImages(root);
const selected = [];

for (const filePath of discovered) {
  const fileStat = await stat(filePath);
  const effectiveTime = fileStat.mtime > fileStat.birthtime ? fileStat.mtime : fileStat.birthtime;
  if (start && effectiveTime < start) continue;
  if (end && effectiveTime >= end) continue;

  try {
    const metadata = await sharp(filePath).metadata();
    selected.push({
      filePath,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      createdAt: fileStat.birthtime.toISOString(),
      modifiedAt: fileStat.mtime.toISOString(),
      effectiveTime,
    });
  } catch (error) {
    console.warn(`Skipped unreadable image ${filePath}: ${error.message}`);
  }
}

selected.sort((a, b) => a.effectiveTime - b.effectiveTime || a.filePath.localeCompare(b.filePath));
selected.forEach((item, index) => {
  item.id = `S${String(index + 1).padStart(3, "0")}`;
});

await mkdir(outputDirectory, { recursive: true });

const columns = 4;
const rows = Math.ceil(pageSize / columns);
const cellWidth = 390;
const cellHeight = 250;
const pageWidth = columns * cellWidth;
const pageHeight = rows * cellHeight + 70;
const pageCount = Math.ceil(selected.length / pageSize);

for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
  const pageItems = selected.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  const composites = [];

  for (let itemIndex = 0; itemIndex < pageItems.length; itemIndex += 1) {
    const item = pageItems[itemIndex];
    const column = itemIndex % columns;
    const row = Math.floor(itemIndex / columns);
    const left = column * cellWidth + 10;
    const top = row * cellHeight + 60;
    const imageBuffer = await sharp(item.filePath)
      .resize(370, 194, { fit: "contain", background: "#E8ECEA" })
      .png()
      .toBuffer();
    composites.push({ input: imageBuffer, left, top });

    const timestamp = item.effectiveTime.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const label = `${item.id} · ${timestamp} · ${item.width}×${item.height}`;
    composites.push({
      input: Buffer.from(labelSvg(label, 370, 34)),
      left,
      top: top + 198,
    });
  }

  const header = `${prefix} · page ${pageIndex + 1}/${pageCount} · ${selected.length} images`;
  composites.push({ input: Buffer.from(labelSvg(header, pageWidth - 30, 42, 24)), left: 15, top: 10 });

  const pagePath = path.join(
    outputDirectory,
    `${prefix}-${String(pageIndex + 1).padStart(2, "0")}.png`,
  );
  await sharp({
    create: { width: pageWidth, height: pageHeight, channels: 3, background: "#F3F2ED" },
  })
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toFile(pagePath);
  console.log(`Wrote ${pagePath}`);
}

const inventoryPath = path.join(outputDirectory, `${prefix}-inventory.json`);
await writeFile(
  inventoryPath,
  `${JSON.stringify(selected.map(({ effectiveTime, ...item }) => item), null, 2)}\n`,
  "utf8",
);
console.log(`Wrote ${inventoryPath}`);
console.log(`Reviewed inventory contains ${selected.length} images across ${pageCount} page(s).`);

function parseArgs(values) {
  const parsed = {};
  for (let index = 0; index < values.length; index += 1) {
    const key = values[index];
    if (!key.startsWith("--")) throw new Error(`Unexpected argument: ${key}`);
    const value = values[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${key}`);
    parsed[key.slice(2)] = value;
    index += 1;
  }
  return parsed;
}

function required(values, key) {
  if (!values[key]) throw new Error(`Missing --${key}.`);
  return path.resolve(values[key]);
}

async function walkImages(directory) {
  const output = [];
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      output.push(...(await walkImages(entryPath)));
    } else if (/\.(png|jpe?g|webp)$/i.test(entry.name)) {
      output.push(entryPath);
    }
  }
  return output;
}

function labelSvg(text, width, height, fontSize = 16) {
  const safe = text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" rx="6" fill="#17221E"/>
    <text x="10" y="${Math.round(height * 0.68)}" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700">${safe}</text>
  </svg>`;
}

import { access, copyFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const packageRoot = path.resolve(import.meta.dirname, "..");
const draftRoot = path.join(packageRoot, "drafts");
const finalRoot = path.join(packageRoot, "final");
const finalHistoryRoot = path.join(finalRoot, "history");
const sourceHistoryRoot = path.join(import.meta.dirname, "history");

const promotions = [
  {
    approved: path.join(draftRoot, "04-human-controlled-evidence-curation-draft.png"),
    final: path.join(finalRoot, "04-human-controlled-evidence-curation.png"),
  },
  {
    approved: path.join(draftRoot, "05-approved-artifact-ready-draft.png"),
    final: path.join(finalRoot, "05-approved-artifact-ready.png"),
  },
  {
    approved: path.join(draftRoot, "06-webmcp-architecture-validation-secondary.png"),
    final: path.join(finalRoot, "06-webmcp-architecture.png"),
  },
  {
    approved: path.join(draftRoot, "06-webmcp-architecture-validation-secondary.svg"),
    final: path.join(import.meta.dirname, "06-webmcp-architecture.svg"),
  },
];

await mkdir(finalHistoryRoot, { recursive: true });
await mkdir(sourceHistoryRoot, { recursive: true });

await preserveOnce(
  path.join(finalRoot, "06-webmcp-architecture.png"),
  path.join(finalHistoryRoot, "06-webmcp-architecture-original-validation-strip.png"),
);
await preserveOnce(
  path.join(import.meta.dirname, "06-webmcp-architecture.svg"),
  path.join(sourceHistoryRoot, "06-webmcp-architecture-original-validation-strip.svg"),
);

for (const promotion of promotions) {
  await copyFile(promotion.approved, promotion.final);
  await assertIdentical(promotion.approved, promotion.final);
}

for (const filename of [
  "01-three-in-the-loop-hero-cover.png",
  "02-how-it-works.png",
  "03-who-does-what.png",
  "04-human-controlled-evidence-curation.png",
  "05-approved-artifact-ready.png",
  "06-webmcp-architecture.png",
]) {
  const filepath = path.join(finalRoot, filename);
  const metadata = await sharp(filepath).metadata();
  if (metadata.format !== "png" || metadata.width !== 1500 || metadata.height !== 1000) {
    throw new Error(`${filename} is not a 1500x1000 PNG.`);
  }
}

console.log("Submission media freeze complete: six approved 1500x1000 final PNGs.");

async function preserveOnce(source, target) {
  try {
    await access(target);
  } catch {
    await copyFile(source, target);
  }
}

async function assertIdentical(approved, final) {
  const [approvedBytes, finalBytes] = await Promise.all([
    readFile(approved),
    readFile(final),
  ]);
  if (!approvedBytes.equals(finalBytes)) {
    throw new Error(`${final} is not byte-identical to ${approved}.`);
  }
}

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const packageRoot = path.resolve(import.meta.dirname, "..");
const sourcePath = path.join(
  import.meta.dirname,
  "history",
  "06-webmcp-architecture-original-validation-strip.svg",
);
const draftDirectory = path.join(packageRoot, "drafts");
const svgOutput = path.join(draftDirectory, "06-webmcp-architecture-validation-secondary.svg");
const pngOutput = path.join(draftDirectory, "06-webmcp-architecture-validation-secondary.png");

let svg = await readFile(sourcePath, "utf8");

svg = replaceOnce(
  svg,
  '<g transform="translate(84 244)">',
  '<g transform="translate(84 246)" opacity="0.68">',
);
svg = replaceOnce(
  svg,
  '<rect x="0" y="0" width="1332" height="54" rx="27" fill="#FFFFFF" stroke="#D4DCD7" stroke-width="2"/>',
  '<rect x="0" y="6" width="1332" height="42" rx="21" fill="#F3F2ED" stroke="#D4DCD7" stroke-width="1"/>',
);
svg = replaceOnce(svg, '<circle cx="30" cy="27" r="11" fill="#17643E"/>', '<circle cx="30" cy="27" r="7" fill="#17643E"/>');
svg = svg.replaceAll('font-size="20" font-weight="800"', 'font-size="16" font-weight="700"');
svg = replaceOnce(svg, '<g transform="translate(62 334)">', '<g transform="translate(62 316)">');

for (const required of [
  "93/93 tests PASS",
  "lint PASS",
  "build PASS",
  "production PASS",
  "final human dogfood PASS",
  "get_research_workspace",
  "search_sources",
  "get_source_details",
  "propose_evidence",
  "draft_evidence_brief",
]) {
  if (!svg.includes(required)) throw new Error(`Required technical content missing: ${required}`);
}

await mkdir(draftDirectory, { recursive: true });
await writeFile(svgOutput, svg, "utf8");
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(pngOutput);
console.log(`Wrote ${svgOutput}`);
console.log(`Wrote ${pngOutput}`);

function replaceOnce(source, before, after) {
  const first = source.indexOf(before);
  if (first === -1) throw new Error(`Expected SVG fragment not found: ${before}`);
  if (source.indexOf(before, first + before.length) !== -1) {
    throw new Error(`Expected one SVG fragment but found more than one: ${before}`);
  }
  return `${source.slice(0, first)}${after}${source.slice(first + before.length)}`;
}

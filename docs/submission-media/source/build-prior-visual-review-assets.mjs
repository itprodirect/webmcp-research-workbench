import { mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const packageRoot = path.resolve(import.meta.dirname, "..");
const inspirationRoot = path.join(packageRoot, "inspiration");
const draftRoot = path.join(packageRoot, "drafts");
const screenshotRoot = "C:\\Users\\user\\Pictures\\Screenshots";

const priorCandidates = [
  {
    id: "PV-01",
    label: "Light human / agent workspace",
    path: path.join(inspirationRoot, "adapt", "PV-01-light-human-agent-workspace-composition.png"),
  },
  {
    id: "PV-02",
    label: "Light five-tool boundary",
    path: path.join(inspirationRoot, "adapt", "PV-02-light-five-tool-evidence-boundary.png"),
  },
  {
    id: "PV-08",
    label: "Dark five-stage launch cover",
    path: path.join(inspirationRoot, "adapt", "PV-08-dark-five-stage-launch-cover.png"),
  },
  {
    id: "PV-10",
    label: "Dark launch background study",
    path: path.join(inspirationRoot, "adapt", "PV-10-dark-launch-background-study.png"),
  },
  {
    id: "PV-14",
    label: "YouTube media concept catalog",
    path: path.join(inspirationRoot, "adapt", "PV-14-youtube-media-concept-catalog.png"),
  },
  {
    id: "PV-16",
    label: "Cross-channel campaign catalog",
    path: path.join(inspirationRoot, "adapt", "PV-16-cross-channel-campaign-catalog.png"),
  },
];

const heroDirections = [
  {
    id: "CURRENT",
    label: "Accepted editorial baseline",
    path: path.join(packageRoot, "final", "01-three-in-the-loop-hero-cover.png"),
    kind: "full",
  },
  {
    id: "H-01",
    label: "Real WebMCP Activity",
    path: path.join(screenshotRoot, "Screenshot 2026-08-31 184805.png"),
    kind: "product",
  },
  {
    id: "H-02",
    label: "Real Artifact Ready",
    path: path.join(screenshotRoot, "Screenshot 2026-08-31 213651.png"),
    kind: "product",
  },
  {
    id: "H-03",
    label: "Real Curate → Synthesize",
    path: path.join(screenshotRoot, "Screenshot 2026-08-29 235959.png"),
    kind: "product",
  },
  ...priorCandidates.slice(0, 4).map((candidate) => ({ ...candidate, kind: "full" })),
];

await mkdir(inspirationRoot, { recursive: true });
await mkdir(draftRoot, { recursive: true });

const hybridHeroPath = path.join(draftRoot, "01-hybrid-hero-real-activity-draft.png");
await buildHybridHero(hybridHeroPath);
await buildPriorContactSheet();
await buildHeroComparison(hybridHeroPath);

async function buildHybridHero(outputPath) {
  const source = path.join(screenshotRoot, "Screenshot 2026-08-31 184805.png");
  const screenshot = await sharp(source)
    .extract({ left: 592, top: 80, width: 687, height: 640 })
    .resize(560, 522, { fit: "fill" })
    .composite([
      {
        input: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="560" height="522"><rect width="560" height="522" rx="20" fill="#fff"/></svg>'),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();

  const base = `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1000">
    <defs>
      <filter id="shadow" x="-25%" y="-25%" width="150%" height="160%">
        <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#17221E" flood-opacity="0.16"/>
      </filter>
      <radialGradient id="energy" cx="62%" cy="45%" r="68%">
        <stop offset="0" stop-color="#3153A4" stop-opacity="0.20"/>
        <stop offset="0.52" stop-color="#145D49" stop-opacity="0.13"/>
        <stop offset="1" stop-color="#145D49" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1500" height="1000" fill="#F3F2ED"/>
    <rect width="1500" height="12" fill="#145D49"/>

    <circle cx="1122" cy="465" r="350" fill="url(#energy)"/>
    <path d="M905 176 C1255 75 1458 306 1398 650" fill="none" stroke="#3153A4" stroke-width="3" stroke-opacity="0.18"/>
    <path d="M882 760 C1118 909 1390 818 1455 574" fill="none" stroke="#145D49" stroke-width="4" stroke-opacity="0.20"/>

    <g transform="translate(70 58)">
      <circle cx="25" cy="25" r="22" fill="#FFFFFF" stroke="#D4DCD7" stroke-width="2"/>
      <path d="M14 16 C20 7, 31 7, 37 16" fill="none" stroke="#145D49" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M39 20 C46 30, 40 40, 30 44" fill="none" stroke="#3153A4" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M24 45 C12 44, 7 34, 11 23" fill="none" stroke="#7A4A0A" stroke-width="3.2" stroke-linecap="round"/>
      <circle cx="13" cy="17" r="5" fill="#7A4A0A"/>
      <circle cx="38" cy="17" r="5" fill="#3153A4"/>
      <circle cx="26" cy="44" r="5" fill="#145D49"/>
    </g>
    <text x="125" y="79" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="800" letter-spacing="3" fill="#145D49">THREE IN THE LOOP</text>
    <text x="125" y="110" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="700" fill="#5A6862">A WebMCP Research Workbench</text>

    <text x="70" y="196" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="800" letter-spacing="-1.8" fill="#17221E">Three in the Loop</text>
    <text x="70" y="300" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="800" letter-spacing="-2.6" fill="#17221E">
      <tspan x="70">The agent gathers.</tspan>
      <tspan x="70" dy="80">You decide what counts.</tspan>
    </text>

    <rect x="70" y="468" width="675" height="4" rx="2" fill="#145D49"/>
    <text x="70" y="526" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="500" fill="#5A6862">
      <tspan x="70">A WebMCP research workbench for</tspan>
      <tspan x="70" dy="40">human-controlled evidence and</tspan>
      <tspan x="70" dy="40">source-linked synthesis.</tspan>
    </text>

    <g filter="url(#shadow)">
      <rect x="816" y="118" width="608" height="640" rx="28" fill="#FFFFFF" stroke="#C8D2CC" stroke-width="2"/>
    </g>
    <rect x="838" y="140" width="560" height="42" rx="21" fill="#17221E"/>
    <circle cx="864" cy="161" r="7" fill="#66C887"/>
    <text x="883" y="168" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="800" letter-spacing="1.2" fill="#FFFFFF">REAL PRODUCT · LIVE WEBMCP ACTIVITY</text>
    <text x="1398" y="741" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#5A6862">research.itprodirect.com</text>

    <g transform="translate(70 862)" filter="url(#shadow)">
      <rect width="1360" height="86" rx="22" fill="#FFFFFF" stroke="#D4DCD7" stroke-width="2"/>
      <circle cx="52" cy="43" r="15" fill="#F9F0DF" stroke="#7A4A0A" stroke-width="2"/>
      <circle cx="88" cy="43" r="15" fill="#EDF1FB" stroke="#3153A4" stroke-width="2"/>
      <circle cx="124" cy="43" r="15" fill="#E9F3EF" stroke="#145D49" stroke-width="2"/>
      <text x="168" y="53" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="800" fill="#17221E">Human + Agent + Website working together</text>
      <rect x="1112" y="22" width="208" height="42" rx="21" fill="#E9F3EF"/>
      <text x="1216" y="50" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="800" letter-spacing="1.3" fill="#145D49">REAL WORKFLOW</text>
    </g>
  </svg>`;

  await sharp(Buffer.from(base))
    .composite([{ input: screenshot, left: 838, top: 190 }])
    .png({ compressionLevel: 9 })
    .withMetadata({ density: 96 })
    .toFile(outputPath);
  await assertPng(outputPath, 1500, 1000);
}

async function buildPriorContactSheet() {
  const width = 1500;
  const height = 1000;
  const cellWidth = 460;
  const cellHeight = 390;
  const composites = [];

  for (let index = 0; index < priorCandidates.length; index += 1) {
    const candidate = priorCandidates[index];
    const column = index % 3;
    const row = Math.floor(index / 3);
    const left = 40 + column * 480;
    const top = 142 + row * cellHeight;
    const preview = await roundedPreview(candidate.path, cellWidth, 300, "contain");
    composites.push({ input: preview, left, top });
    composites.push({ input: Buffer.from(labelSvg(candidate.id, candidate.label, cellWidth, 68)), left, top: top + 310 });
  }

  const base = contactSheetBase(
    width,
    height,
    "Prior ChatGPT visual candidates",
    "ADAPTATION REFERENCES · GENERATED UI IS NOT PRODUCT EVIDENCE",
    "Six strongest prior directions · see prior-visual-review.md for factual corrections and complete classification",
  );
  const outputPath = path.join(inspirationRoot, "prior-visual-contact-sheet.png");
  await sharp(Buffer.from(base)).composite(composites).png({ compressionLevel: 9 }).toFile(outputPath);
  await assertPng(outputPath, width, height);
}

async function buildHeroComparison(hybridHeroPath) {
  const directions = [
    ...heroDirections,
    { id: "HYBRID", label: "New draft · real H-01 proof", path: hybridHeroPath, kind: "full" },
  ];
  const width = 1500;
  const height = 1000;
  const cellWidth = 450;
  const cellHeight = 272;
  const composites = [];

  for (let index = 0; index < directions.length; index += 1) {
    const direction = directions[index];
    const column = index % 3;
    const row = Math.floor(index / 3);
    const left = 45 + column * 480;
    const top = 125 + row * cellHeight;
    const preview = direction.kind === "product"
      ? await safeProductPreview(direction.path, cellWidth, 200)
      : await roundedPreview(direction.path, cellWidth, 200, "contain");
    composites.push({ input: preview, left, top });
    composites.push({ input: Buffer.from(labelSvg(direction.id, direction.label, cellWidth, 56)), left, top: top + 205 });
  }

  const base = contactSheetBase(
    width,
    height,
    "Hero direction comparison",
    "CURRENT BASELINE · REAL CROPS · PRIOR REFERENCES · ONE HYBRID DRAFT",
    "H-01/H-02/H-03 are safe product-only crops. Generated references remain inspiration only.",
  );
  const outputPath = path.join(inspirationRoot, "hero-direction-contact-sheet.png");
  await sharp(Buffer.from(base)).composite(composites).png({ compressionLevel: 9 }).toFile(outputPath);
  await assertPng(outputPath, width, height);
}

async function safeProductPreview(source, width, height) {
  return sharp(source)
    .extract({ left: 592, top: 80, width: 687, height: 640 })
    .resize(width, height, { fit: "cover" })
    .composite([
      {
        input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="14" fill="#fff"/></svg>`),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();
}

async function roundedPreview(source, width, height, fit) {
  return sharp(source)
    .resize(width, height, { fit, background: "#E8ECEA" })
    .composite([
      {
        input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="14" fill="#fff"/></svg>`),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();
}

function contactSheetBase(width, height, title, eyebrow, footer) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="#F3F2ED"/>
    <rect width="${width}" height="10" fill="#145D49"/>
    <text x="40" y="51" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="800" letter-spacing="2.2" fill="#145D49">${escapeXml(eyebrow)}</text>
    <text x="40" y="99" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="800" fill="#17221E">${escapeXml(title)}</text>
    <text x="40" y="978" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#5A6862">${escapeXml(footer)}</text>
  </svg>`;
}

function labelSvg(id, label, width, height) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" rx="12" fill="#17221E"/>
    <text x="14" y="28" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#FFFFFF">${escapeXml(id)}</text>
    <text x="14" y="51" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#CBD6D0">${escapeXml(label)}</text>
  </svg>`;
}

async function assertPng(filePath, width, height) {
  const metadata = await sharp(filePath).metadata();
  if (metadata.format !== "png" || metadata.width !== width || metadata.height !== height) {
    throw new Error(`${filePath} rendered as ${metadata.width}x${metadata.height} ${metadata.format}`);
  }
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

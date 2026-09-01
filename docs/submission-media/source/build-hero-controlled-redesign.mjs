import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const packageRoot = path.resolve(import.meta.dirname, "..");
const draftRoot = path.join(packageRoot, "drafts");
const finalRoot = path.join(packageRoot, "final");

const baselineHero = path.join(
  finalRoot,
  "history",
  "01-three-in-the-loop-hero-cover-editorial-baseline.png",
);
const h01Source = "C:\\Users\\user\\Pictures\\Screenshots\\Screenshot 2026-08-31 184805.png";
const redesignedHero = path.join(draftRoot, "01-hero-controlled-redesign-draft.png");
const promotedHero = path.join(finalRoot, "01-three-in-the-loop-hero-cover.png");
const comparisonSheet = path.join(draftRoot, "01-hero-comparison-sheet.png");

await mkdir(draftRoot, { recursive: true });
await mkdir(finalRoot, { recursive: true });
await buildRedesign();
await copyFile(redesignedHero, promotedHero);
await buildComparison();

async function buildRedesign() {
  const productCrop = await sharp(h01Source)
    .extract({ left: 592, top: 80, width: 687, height: 640 })
    .resize({ width: 540 })
    .composite([
      {
        input: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="540" height="503"><rect width="540" height="503" rx="18" fill="#fff"/></svg>'),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();

  const favicon = await sharp(baselineHero)
    .extract({ left: 84, top: 72, width: 56, height: 56 })
    .resize(48, 48, { fit: "contain" })
    .png()
    .toBuffer();

  const base = `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1000" role="img" aria-labelledby="title desc">
    <title id="title">Three in the Loop controlled Hero redesign</title>
    <desc id="desc">Three in the Loop. The agent gathers. You decide what counts. A WebMCP research workbench for human-controlled evidence and source-linked synthesis. Human + Agent + Website working together.</desc>
    <defs>
      <filter id="cardShadow" x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="0" dy="20" stdDeviation="24" flood-color="#17221E" flood-opacity="0.17"/>
      </filter>
      <filter id="softShadow" x="-25%" y="-25%" width="150%" height="160%">
        <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#17221E" flood-opacity="0.09"/>
      </filter>
      <radialGradient id="greenWash" cx="50%" cy="46%" r="60%">
        <stop offset="0" stop-color="#4D8D76" stop-opacity="0.20"/>
        <stop offset="0.62" stop-color="#145D49" stop-opacity="0.09"/>
        <stop offset="1" stop-color="#145D49" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="blueWash" cx="50%" cy="50%" r="60%">
        <stop offset="0" stop-color="#3153A4" stop-opacity="0.13"/>
        <stop offset="1" stop-color="#3153A4" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="productField" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#17221E"/>
        <stop offset="0.62" stop-color="#11362D"/>
        <stop offset="1" stop-color="#1B4B3E"/>
      </linearGradient>
    </defs>

    <rect width="1500" height="1000" fill="#F3F2ED"/>
    <rect width="1500" height="12" fill="#145D49"/>

    <ellipse cx="1165" cy="460" rx="390" ry="395" fill="url(#greenWash)"/>
    <ellipse cx="1008" cy="340" rx="270" ry="275" fill="url(#blueWash)"/>

    <text x="130" y="82" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" letter-spacing="3.2" fill="#145D49">THREE IN THE LOOP</text>
    <text x="130" y="114" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="700" fill="#5A6862">A WebMCP Research Workbench</text>

    <text x="72" y="210" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="800" letter-spacing="-1.8" fill="#17221E">Three in the Loop</text>

    <text x="72" y="324" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="800" letter-spacing="-2.6" fill="#17221E">
      <tspan x="72">The agent gathers.</tspan>
      <tspan x="72" dy="84">You decide what counts.</tspan>
    </text>

    <g transform="translate(72 477)">
      <rect x="0" y="0" width="210" height="6" rx="3" fill="#7A4A0A"/>
      <rect x="218" y="0" width="210" height="6" rx="3" fill="#3153A4"/>
      <rect x="436" y="0" width="310" height="6" rx="3" fill="#145D49"/>
    </g>

    <text x="72" y="547" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="500" fill="#5A6862">
      <tspan x="72">A WebMCP research workbench for</tspan>
      <tspan x="72" dy="42">human-controlled evidence and</tspan>
      <tspan x="72" dy="42">source-linked synthesis.</tspan>
    </text>

    <g filter="url(#cardShadow)">
      <rect x="835" y="105" width="610" height="700" rx="30" fill="url(#productField)"/>
    </g>
    <rect x="835" y="105" width="204" height="5" rx="2.5" fill="#7A4A0A"/>
    <rect x="1038" y="105" width="204" height="5" rx="2.5" fill="#3153A4"/>
    <rect x="1241" y="105" width="204" height="5" rx="2.5" fill="#65B58A"/>

    <circle cx="878" cy="151" r="7" fill="#65B58A"/>
    <text x="896" y="158" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" letter-spacing="1.3" fill="#FFFFFF">REAL PRODUCT · LIVE WEBMCP ACTIVITY</text>

    <rect x="862" y="185" width="556" height="519" rx="22" fill="#FFFFFF" stroke="#D4DCD7" stroke-width="2"/>
    <text x="1140" y="752" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" letter-spacing="0.6" fill="#C7D6D0">research.itprodirect.com</text>

    <g transform="translate(72 858)" filter="url(#softShadow)">
      <rect width="1356" height="92" rx="22" fill="#FFFFFF" stroke="#D4DCD7" stroke-width="2"/>
      <circle cx="74" cy="46" r="15" fill="#F9F0DF" stroke="#7A4A0A" stroke-width="2"/>
      <circle cx="112" cy="46" r="15" fill="#EDF1FB" stroke="#3153A4" stroke-width="2"/>
      <circle cx="150" cy="46" r="15" fill="#E9F3EF" stroke="#145D49" stroke-width="2"/>
      <text x="196" y="56" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="800" fill="#17221E">Human + Agent + Website working together</text>
      <text x="1314" y="54" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="800" letter-spacing="1.6" fill="#145D49">HUMAN-CONTROLLED</text>
    </g>
  </svg>`;

  await sharp(Buffer.from(base))
    .composite([
      { input: favicon, left: 72, top: 50 },
      { input: productCrop, left: 870, top: 193 },
    ])
    .png({ compressionLevel: 9, palette: false })
    .withMetadata({ density: 96 })
    .toFile(redesignedHero);

  await assertPng(redesignedHero, 1500, 1000);
}

async function buildComparison() {
  const currentPreview = await roundedPreview(baselineHero, 680, 454);
  const redesignPreview = await roundedPreview(redesignedHero, 680, 454);

  const base = `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1000">
    <rect width="1500" height="1000" fill="#F3F2ED"/>
    <rect width="1500" height="10" fill="#145D49"/>
    <text x="60" y="60" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="800" letter-spacing="2.4" fill="#145D49">ASSET 01 · HUMAN REVIEW</text>
    <text x="60" y="112" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="800" fill="#17221E">Current Hero vs controlled redesign</text>

    <rect x="50" y="160" width="700" height="610" rx="24" fill="#FFFFFF" stroke="#D4DCD7" stroke-width="2"/>
    <rect x="750" y="160" width="700" height="610" rx="24" fill="#FFFFFF" stroke="#D4DCD7" stroke-width="2"/>
    <text x="70" y="205" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" fill="#17221E">CURRENT</text>
    <text x="770" y="205" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" fill="#145D49">CONTROLLED REDESIGN</text>
    <text x="70" y="740" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#5A6862">Editorial clarity · conceptual loop · no product proof</text>
    <text x="770" y="740" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#5A6862">Exact copy · real H-01 evidence · stronger focal contrast</text>

    <rect x="50" y="810" width="1400" height="120" rx="22" fill="#17221E"/>
    <text x="82" y="853" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" letter-spacing="1.6" fill="#65B58A">DESIGN JUDGMENT</text>
    <text x="82" y="892" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="700" fill="#FFFFFF">The redesign is stronger for Devpost and thumbnail use because the thesis remains dominant</text>
    <text x="82" y="920" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="700" fill="#FFFFFF">while a real completed WebMCP run supplies immediate credibility.</text>
  </svg>`;

  await sharp(Buffer.from(base))
    .composite([
      { input: currentPreview, left: 60, top: 230 },
      { input: redesignPreview, left: 760, top: 230 },
    ])
    .png({ compressionLevel: 9, palette: false })
    .withMetadata({ density: 96 })
    .toFile(comparisonSheet);

  await assertPng(comparisonSheet, 1500, 1000);
}

async function roundedPreview(source, width, height) {
  return sharp(source)
    .resize(width, height, { fit: "fill" })
    .composite([
      {
        input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="16" fill="#fff"/></svg>`),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();
}

async function assertPng(filePath, width, height) {
  const metadata = await sharp(filePath).metadata();
  if (metadata.format !== "png" || metadata.width !== width || metadata.height !== height) {
    throw new Error(`${filePath} rendered as ${metadata.width}x${metadata.height} ${metadata.format}`);
  }
}

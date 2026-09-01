import { mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const packageRoot = path.resolve(import.meta.dirname, "..");
const screenshotDirectory = path.join(packageRoot, "screenshots");
const draftDirectory = path.join(packageRoot, "drafts");

const candidates = [
  {
    label: "04-A / H-03",
    state: "Curate complete → Synthesize",
    time: "2026-08-29 23:59:59 EDT",
    source: "C:\\Users\\user\\Pictures\\Screenshots\\Screenshot 2026-08-29 235959.png",
  },
  {
    label: "04-B",
    state: "Accepted evidence + synthesis handoff",
    time: "2026-08-30 00:00:11 EDT",
    source: "C:\\Users\\user\\Pictures\\Screenshots\\Screenshot 2026-08-30 000011.png",
  },
  {
    label: "04-C",
    state: "Archive only · obsolete host",
    time: "2026-08-29 21:29:06 EDT",
    source: "C:\\Users\\user\\Pictures\\Screenshots\\Screenshot 2026-08-29 212906.png",
  },
  {
    label: "05-A / H-02",
    state: "Complete · Artifact ready",
    time: "2026-08-31 21:36:51 EDT",
    source: "C:\\Users\\user\\Pictures\\Screenshots\\Screenshot 2026-08-31 213651.png",
  },
  {
    label: "05-B",
    state: "Complete · Download ready",
    time: "2026-08-30 00:05:07 EDT",
    source: "C:\\Users\\user\\Pictures\\Screenshots\\Screenshot 2026-08-30 000507.png",
  },
  {
    label: "05-C / H-01",
    state: "Complete + WebMCP Activity",
    time: "2026-08-31 18:48:05 EDT",
    source: "C:\\Users\\user\\Pictures\\Screenshots\\Screenshot 2026-08-31 184805.png",
  },
];

await mkdir(screenshotDirectory, { recursive: true });
await mkdir(draftDirectory, { recursive: true });

await buildContactSheet();
await buildAsset05Draft();

async function buildContactSheet() {
  const composites = [];
  const cellWidth = 470;
  const cellHeight = 410;

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    const column = index % 3;
    const row = Math.floor(index / 3);
    const left = 35 + column * 480;
    const top = 130 + row * cellHeight;

    const crop = await safeProductCrop(candidate.source, 450, 315);
    composites.push({ input: crop, left, top });
    composites.push({
      input: Buffer.from(candidateLabelSvg(candidate, 450, 72)),
      left,
      top: top + 320,
    });
  }

  const chrome = `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1000">
    <rect width="1500" height="1000" fill="#F3F2ED"/>
    <rect width="1500" height="10" fill="#145D49"/>
    <text x="35" y="57" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" letter-spacing="2.5" fill="#145D49">THREE IN THE LOOP · HUMAN REVIEW</text>
    <text x="35" y="105" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="800" fill="#17221E">Real screenshot candidate contact sheet</text>
    <text x="1465" y="57" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="17" fill="#5A6862">Safe product crops · originals unchanged</text>
    <text x="35" y="975" font-family="Arial, Helvetica, sans-serif" font-size="17" fill="#5A6862">04 candidates do not show the required pending Accept / Reject state. See candidate-review.md before selection.</text>
  </svg>`;

  const output = path.join(screenshotDirectory, "candidate-contact-sheet.png");
  await sharp(Buffer.from(chrome))
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toFile(output);
  console.log(`Wrote ${output}`);
}

async function buildAsset05Draft() {
  const source = candidates.find((candidate) => candidate.label.startsWith("05-A")).source;
  const screenshot = await sharp(source)
    .extract({ left: 0, top: 80, width: 1279, height: 640 })
    .resize(1320, 660, { fit: "fill" })
    .composite([
      {
        input: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1320" height="660"><rect width="1320" height="660" rx="22" fill="#fff"/></svg>'),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();

  const base = `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1000">
    <rect width="1500" height="1000" fill="#F3F2ED"/>
    <rect width="1500" height="10" fill="#145D49"/>
    <text x="90" y="62" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" letter-spacing="2.7" fill="#145D49">REAL PRODUCT · FINAL DOGFOOD</text>
    <text x="90" y="132" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="800" letter-spacing="-1.5" fill="#17221E">Approved artifact, ready to use</text>

    ${chip(90, 164, 270, "Research cycle complete")}
    ${chip(372, 164, 270, "Human-approved artifact")}
    ${chip(654, 164, 260, "Download approved brief")}
    ${chip(926, 164, 484, "WebMCP activity captured during the workflow")}

    <rect x="86" y="232" width="1328" height="668" rx="25" fill="#FFFFFF" stroke="#C8D2CC" stroke-width="2"/>
    <text x="750" y="963" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#17221E">From mission definition to approved Markdown artifact in one shared workspace</text>
  </svg>`;

  const output = path.join(draftDirectory, "05-approved-artifact-ready-draft.png");
  await sharp(Buffer.from(base))
    .composite([{ input: screenshot, left: 90, top: 236 }])
    .png({ compressionLevel: 9 })
    .toFile(output);
  console.log(`Wrote ${output}`);
}

async function safeProductCrop(source, width, height) {
  return sharp(source)
    .extract({ left: 592, top: 80, width: 687, height: 640 })
    .resize(width, height, { fit: "contain", background: "#E8ECEA" })
    .composite([
      {
        input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="16" fill="#fff"/></svg>`),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();
}

function chip(x, y, width, text) {
  return `<g transform="translate(${x} ${y})">
    <rect width="${width}" height="44" rx="22" fill="#FFFFFF" stroke="#D4DCD7" stroke-width="2"/>
    <circle cx="23" cy="22" r="7" fill="#17643E"/>
    <text x="42" y="29" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#17221E">${escapeXml(text)}</text>
  </g>`;
}

function candidateLabelSvg(candidate, width, height) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" rx="12" fill="#17221E"/>
    <text x="14" y="28" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="800" fill="#FFFFFF">${escapeXml(candidate.label)} · ${escapeXml(candidate.state)}</text>
    <text x="14" y="54" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#CBD6D0">${escapeXml(candidate.time)}</text>
  </svg>`;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

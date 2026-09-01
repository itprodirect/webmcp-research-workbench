import { mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const packageRoot = path.resolve(import.meta.dirname, "..");
const draftRoot = path.join(packageRoot, "drafts");
const finalRoot = path.join(packageRoot, "final");

const curateSource = path.join(
  packageRoot,
  "screenshots",
  "04-evidence-curation-selected-curate.png",
);
const asset04Draft = path.join(
  draftRoot,
  "04-human-controlled-evidence-curation-draft.png",
);
const reviewBundle = path.join(
  draftRoot,
  "final-review-bundle-01-04-05-06.png",
);

await mkdir(draftRoot, { recursive: true });
await buildAsset04();
await buildReviewBundle();

async function buildAsset04() {
  // Preserve the real split-screen state while removing only the desktop menu,
  // browser-tab row, and Windows taskbar. The live domain remains visible.
  const screenshot = await sharp(curateSource)
    .extract({ left: 0, top: 70, width: 1275, height: 650 })
    .resize({ width: 1380, height: 702, fit: "fill" })
    .composite([
      {
        input: Buffer.from(
          '<svg xmlns="http://www.w3.org/2000/svg" width="1380" height="702"><rect width="1380" height="702" rx="18" fill="#fff"/></svg>',
        ),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();

  const base = `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1000" role="img" aria-labelledby="title desc">
    <title id="title">Human-controlled evidence curation</title>
    <desc id="desc">A real Three in the Loop split-screen product capture showing an agent proposal handoff, three evidence proposals, Accept evidence and Reject controls, and the Research Cycle at Human Curate 3 of 5.</desc>
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#17221E" flood-opacity="0.16"/>
      </filter>
    </defs>
    <rect width="1500" height="1000" fill="#F3F2ED"/>
    <rect width="1500" height="12" fill="#145D49"/>

    <text x="60" y="53" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="800" letter-spacing="2.6" fill="#145D49">REAL PRODUCT · EVIDENCE BOUNDARY</text>
    <text x="60" y="108" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="800" letter-spacing="-1.1" fill="#17221E">Human-controlled evidence curation</text>

    <g transform="translate(1040 50)">
      <rect width="400" height="72" rx="18" fill="#17221E"/>
      <text x="200" y="29" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="800" letter-spacing="1.5" fill="#94D4B2">THE PRODUCT THESIS</text>
      <text x="200" y="55" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="800" fill="#FFFFFF">AGENT PROPOSES → HUMAN DECIDES</text>
    </g>

    <g transform="translate(60 145)" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="800">
      <rect width="252" height="48" rx="14" fill="#EDF1FB" stroke="#B9C6E6"/>
      <circle cx="24" cy="24" r="7" fill="#3153A4"/>
      <text x="42" y="30" fill="#263E7D">Agent proposes evidence</text>

      <g transform="translate(266 0)">
        <rect width="257" height="48" rx="14" fill="#F9F0DF" stroke="#DCC28E"/>
        <circle cx="24" cy="24" r="7" fill="#7A4A0A"/>
        <text x="42" y="30" fill="#6B420A">Human accepts or rejects</text>
      </g>

      <g transform="translate(537 0)">
        <rect width="345" height="48" rx="14" fill="#E9F3EF" stroke="#B9D7C9"/>
        <circle cx="24" cy="24" r="7" fill="#145D49"/>
        <text x="42" y="30" fill="#145D49">Only accepted sources become evidence</text>
      </g>

      <g transform="translate(896 0)">
        <rect width="484" height="48" rx="14" fill="#FFFFFF" stroke="#D4DCD7"/>
        <circle cx="24" cy="24" r="7" fill="#7A4A0A"/>
        <text x="42" y="30" fill="#4B5A54">Research Cycle makes the handoff visible</text>
      </g>
    </g>

    <g filter="url(#shadow)">
      <rect x="54" y="218" width="1392" height="713" rx="24" fill="#FFFFFF"/>
    </g>
    <rect x="60" y="224" width="1380" height="702" rx="18" fill="#FFFFFF" stroke="#CBD5CF" stroke-width="2"/>

    <g transform="translate(60 956)">
      <circle cx="7" cy="-1" r="7" fill="#65B58A"/>
      <text x="23" y="5" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="800" fill="#17221E">REAL CURATE STATE</text>
      <text x="195" y="5" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="600" fill="#5A6862">ChatGPT handoff + live Workbench · research.itprodirect.com</text>
      <text x="1380" y="5" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="800" letter-spacing="1.2" fill="#145D49">CURATE · HUMAN 3/5</text>
    </g>
  </svg>`;

  await sharp(Buffer.from(base))
    .composite([{ input: screenshot, left: 60, top: 224 }])
    .png({ compressionLevel: 9, palette: false })
    .withMetadata({ density: 96 })
    .toFile(asset04Draft);

  await assertPng(asset04Draft, 1500, 1000);
}

async function buildReviewBundle() {
  const items = [
    {
      path: path.join(finalRoot, "01-three-in-the-loop-hero-cover.png"),
      x: 52,
      y: 172,
      width: 684,
      height: 456,
      label: "01 · FINAL · HUMAN APPROVED",
      color: "#145D49",
    },
    {
      path: asset04Draft,
      x: 764,
      y: 172,
      width: 684,
      height: 456,
      label: "04 · DRAFT · REVIEW",
      color: "#7A4A0A",
    },
    {
      path: path.join(draftRoot, "05-approved-artifact-ready-draft.png"),
      x: 52,
      y: 680,
      width: 444,
      height: 304,
      label: "05 · DRAFT · REVIEW",
      color: "#7A4A0A",
    },
    {
      path: path.join(finalRoot, "06-webmcp-architecture.png"),
      x: 528,
      y: 680,
      width: 444,
      height: 304,
      label: "06 · ORIGINAL · SELECT",
      color: "#3153A4",
    },
    {
      path: path.join(draftRoot, "06-webmcp-architecture-validation-secondary.png"),
      x: 1004,
      y: 680,
      width: 444,
      height: 304,
      label: "06 · VALIDATION SECONDARY · SELECT",
      color: "#3153A4",
    },
  ];

  const previews = [];
  for (const item of items) {
    previews.push({
      input: await framedPreview(item.path, item.width, item.height - 36),
      left: item.x,
      top: item.y + 36,
    });
  }

  const labels = items
    .map(
      (item) => `
        <rect x="${item.x}" y="${item.y}" width="${item.width}" height="36" rx="10" fill="${item.color}"/>
        <text x="${item.x + 14}" y="${item.y + 24}" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="800" letter-spacing="1.1" fill="#FFFFFF">${item.label}</text>`,
    )
    .join("");

  const base = `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1000" role="img" aria-labelledby="title desc">
    <title id="title">Three in the Loop final media review bundle</title>
    <desc id="desc">Comparison board for final Asset 01, draft Assets 04 and 05, and the two Asset 06 architecture variants.</desc>
    <rect width="1500" height="1000" fill="#E9ECE8"/>
    <rect width="1500" height="10" fill="#145D49"/>
    <text x="52" y="54" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="800" letter-spacing="2.4" fill="#145D49">THREE IN THE LOOP · SUBMISSION MEDIA</text>
    <text x="52" y="108" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="800" fill="#17221E">Final review bundle · Assets 01 / 04 / 05 / 06</text>
    <text x="52" y="142" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="600" fill="#5A6862">01 is approved. Review 04 and 05 for acceptance; select the preferred 06 validation treatment.</text>
    ${labels}
  </svg>`;

  await sharp(Buffer.from(base))
    .composite(previews)
    .png({ compressionLevel: 9, palette: false })
    .withMetadata({ density: 96 })
    .toFile(reviewBundle);

  await assertPng(reviewBundle, 1500, 1000);
}

async function framedPreview(source, width, height) {
  const innerWidth = width - 4;
  const innerHeight = height - 4;
  const preview = await sharp(source)
    .resize(innerWidth, innerHeight, { fit: "contain", background: "#FFFFFF" })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: "#FFFFFF",
    },
  })
    .composite([
      { input: preview, left: 2, top: 2 },
      {
        input: Buffer.from(
          `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="10" fill="none" stroke="#C7D1CB" stroke-width="2"/></svg>`,
        ),
      },
    ])
    .png()
    .toBuffer();
}

async function assertPng(filePath, width, height) {
  const metadata = await sharp(filePath).metadata();
  if (metadata.format !== "png" || metadata.width !== width || metadata.height !== height) {
    throw new Error(
      `${filePath} rendered as ${metadata.width}x${metadata.height} ${metadata.format}`,
    );
  }
}

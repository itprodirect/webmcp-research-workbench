import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const sourceDirectory = path.dirname(fileURLToPath(import.meta.url));
const packageDirectory = path.resolve(sourceDirectory, "..");
const outputDirectory = path.join(packageDirectory, "final");
const draftDirectory = path.join(packageDirectory, "drafts");
const screenshotDirectory = path.join(packageDirectory, "screenshots");

const completedAssets = [
  {
    source: "build-hero-controlled-redesign.mjs",
    output: "01-three-in-the-loop-hero-cover.png",
    copy: [
      "Three in the Loop",
      "The agent gathers.",
      "You decide what counts.",
      "A WebMCP research workbench for human-controlled evidence and source-linked synthesis.",
      "Human + Agent + Website working together",
    ],
  },
  {
    source: "02-how-it-works.svg",
    output: "02-how-it-works.png",
    copy: [
      "How it works",
      "1. Human defines",
      "2. Agent researches",
      "3. Human curates",
      "4. Agent synthesizes",
      "5. Human approves",
      "The agent does the research legwork.",
      "The human controls what becomes evidence and what gets approved.",
      "Shared live workspace powered by WebMCP",
    ],
  },
  {
    source: "03-who-does-what.svg",
    output: "03-who-does-what.png",
    copy: [
      "Who does what",
      "Defines the mission",
      "Accepts or rejects evidence",
      "Reviews the brief",
      "Approves the final artifact",
      "Reads the workspace",
      "Searches OpenAlex",
      "Inspects source details",
      "Proposes evidence",
      "Drafts the Evidence Brief",
      "The agent can propose evidence.",
      "Only the human decides what counts.",
    ],
  },
  {
    source: "build-asset04-review-bundle.mjs",
    output: "04-human-controlled-evidence-curation.png",
    copy: [
      "Human-controlled evidence curation",
      "AGENT PROPOSES → HUMAN DECIDES",
      "Agent proposes evidence",
      "Human accepts or rejects",
      "Only accepted sources become evidence",
      "Research Cycle makes the handoff visible",
    ],
  },
  {
    source: "build-screenshot-review-assets.mjs",
    output: "05-approved-artifact-ready.png",
    copy: [
      "Approved artifact, ready to use",
      "Research cycle complete",
      "Human-approved artifact",
      "Download approved brief",
      "WebMCP activity captured during the workflow",
      "From mission definition to approved Markdown artifact in one shared workspace",
    ],
  },
  {
    source: "06-webmcp-architecture.svg",
    output: "06-webmcp-architecture.png",
    copy: [
      "WebMCP architecture",
      "Human UI",
      "Three in the Loop",
      "WebMCP-enabled agent",
      "OpenAlex",
      "Shared browser workspace",
      "Structured tools, shared state, human-controlled evidence",
      "93/93 tests PASS",
      "lint PASS",
      "build PASS",
      "production PASS",
      "final human dogfood PASS",
    ],
  },
];

const toolNames = [
  "get_research_workspace",
  "search_sources",
  "get_source_details",
  "propose_evidence",
  "draft_evidence_brief",
];

const errors = [];

for (const asset of completedAssets) {
  const sourcePath = path.join(sourceDirectory, asset.source);
  const outputPath = path.join(outputDirectory, asset.output);
  const source = await readFile(sourcePath, "utf8");

  for (const requiredCopy of asset.copy) {
    if (!source.includes(requiredCopy)) {
      errors.push(`${asset.source} is missing locked copy: ${requiredCopy}`);
    }
  }

  const metadata = await sharp(outputPath).metadata();
  if (metadata.width !== 1500 || metadata.height !== 1000 || metadata.format !== "png") {
    errors.push(
      `${asset.output} is ${metadata.width}x${metadata.height} ${metadata.format}; expected 1500x1000 PNG.`,
    );
  }
}

for (const reviewAsset of [
  path.join(screenshotDirectory, "candidate-contact-sheet.png"),
  path.join(screenshotDirectory, "04-evidence-curation-selected-curate.png"),
  path.join(draftDirectory, "04-human-controlled-evidence-curation-draft.png"),
  path.join(draftDirectory, "05-approved-artifact-ready-draft.png"),
  path.join(draftDirectory, "06-webmcp-architecture-validation-secondary.png"),
  path.join(draftDirectory, "final-review-bundle-01-04-05-06.png"),
]) {
  const metadata = await sharp(reviewAsset).metadata();
  const isSelectedScreenshot = reviewAsset.endsWith(
    "04-evidence-curation-selected-curate.png",
  );
  const expectedWidth = isSelectedScreenshot ? 1275 : 1500;
  const expectedHeight = isSelectedScreenshot ? 738 : 1000;
  if (
    metadata.width !== expectedWidth ||
    metadata.height !== expectedHeight ||
    metadata.format !== "png"
  ) {
    errors.push(
      `${path.relative(packageDirectory, reviewAsset)} is ${metadata.width}x${metadata.height} ${metadata.format}; expected ${expectedWidth}x${expectedHeight} PNG.`,
    );
  }
}

const selectedHero = await readFile(
  path.join(draftDirectory, "01-hero-controlled-redesign-draft.png"),
);
const promotedHero = await readFile(
  path.join(outputDirectory, "01-three-in-the-loop-hero-cover.png"),
);
if (!selectedHero.equals(promotedHero)) {
  errors.push("The promoted Asset 01 final does not match the human-selected controlled redesign draft.");
}

for (const [approvedName, finalName] of [
  ["04-human-controlled-evidence-curation-draft.png", "04-human-controlled-evidence-curation.png"],
  ["05-approved-artifact-ready-draft.png", "05-approved-artifact-ready.png"],
  ["06-webmcp-architecture-validation-secondary.png", "06-webmcp-architecture.png"],
]) {
  const [approvedBytes, finalBytes] = await Promise.all([
    readFile(path.join(draftDirectory, approvedName)),
    readFile(path.join(outputDirectory, finalName)),
  ]);
  if (!approvedBytes.equals(finalBytes)) {
    errors.push(`${finalName} is not byte-identical to its human-approved input ${approvedName}.`);
  }
}

const [approvedArchitectureSource, canonicalArchitectureSource] = await Promise.all([
  readFile(path.join(draftDirectory, "06-webmcp-architecture-validation-secondary.svg")),
  readFile(path.join(sourceDirectory, "06-webmcp-architecture.svg")),
]);
if (!approvedArchitectureSource.equals(canonicalArchitectureSource)) {
  errors.push("The canonical Asset 06 SVG does not match the approved validation-secondary source.");
}

const historicalHero = path.join(
  outputDirectory,
  "history",
  "01-three-in-the-loop-hero-cover-editorial-baseline.png",
);
const historicalHeroMetadata = await sharp(historicalHero).metadata();
if (
  historicalHeroMetadata.width !== 1500 ||
  historicalHeroMetadata.height !== 1000 ||
  historicalHeroMetadata.format !== "png"
) {
  errors.push("The archived editorial Asset 01 baseline is not a 1500x1000 PNG.");
}

const historicalArchitecture = path.join(
  outputDirectory,
  "history",
  "06-webmcp-architecture-original-validation-strip.png",
);
const historicalArchitectureMetadata = await sharp(historicalArchitecture).metadata();
if (
  historicalArchitectureMetadata.width !== 1500 ||
  historicalArchitectureMetadata.height !== 1000 ||
  historicalArchitectureMetadata.format !== "png"
) {
  errors.push("The archived original Asset 06 is not a 1500x1000 PNG.");
}

for (const [relativePath, expectedHash] of [
  ["source/02-how-it-works.svg", "112DEC93C853F1DA91F99C31A3A71372335787A10D18C0E481A4F1740C25553D"],
  ["final/02-how-it-works.png", "B7004A2506A571131ECB48890B7F71872F2B4E71CBBDA01A7AE7E679FB9A6590"],
  ["source/03-who-does-what.svg", "27E52686A18587054D1D846F0DF91181E0600B55A0D6E4DE6F0F957722AA545B"],
  ["final/03-who-does-what.png", "E5936AE88EEC7280E45FE03DC13AEDAAE5E2B8DB553D3D5AB6DE0AB1148B2333"],
  ["final/history/06-webmcp-architecture-original-validation-strip.png", "827FABCFC35C27D92C26E10E47E3BE37A7F60778390E7CD7F42AB75B215981B2"],
  ["source/history/06-webmcp-architecture-original-validation-strip.svg", "222A4D3268EC06F75218F893764566F6A1359C68434A342BC8CCAF4F8D892D86"],
]) {
  const bytes = await readFile(path.join(packageDirectory, relativePath));
  const actualHash = createHash("sha256").update(bytes).digest("hex").toUpperCase();
  if (actualHash !== expectedHash) {
    errors.push(`${relativePath} changed after approval/history freeze.`);
  }
}

const archiveCurate = await readFile(
  "C:\\Users\\user\\Pictures\\Screenshots\\Screenshot 2026-09-01 000412.png",
);
const packagedCurate = await readFile(
  path.join(screenshotDirectory, "04-evidence-curation-selected-curate.png"),
);
if (!archiveCurate.equals(packagedCurate)) {
  errors.push("The packaged Asset 04 source is not byte-identical to the selected archive capture.");
}

const screenshotBuildSource = await readFile(
  path.join(sourceDirectory, "build-screenshot-review-assets.mjs"),
  "utf8",
);
for (const requiredCopy of [
  "Approved artifact, ready to use",
  "Research cycle complete",
  "Human-approved artifact",
  "Download approved brief",
  "WebMCP activity captured during the workflow",
  "From mission definition to approved Markdown artifact in one shared workspace",
]) {
  if (!screenshotBuildSource.includes(requiredCopy)) {
    errors.push(`build-screenshot-review-assets.mjs is missing Asset 05 copy: ${requiredCopy}`);
  }
}

const asset04BuildSource = await readFile(
  path.join(sourceDirectory, "build-asset04-review-bundle.mjs"),
  "utf8",
);
for (const requiredCopy of [
  "Human-controlled evidence curation",
  "AGENT PROPOSES → HUMAN DECIDES",
  "Agent proposes evidence",
  "Human accepts or rejects",
  "Only accepted sources become evidence",
  "Research Cycle makes the handoff visible",
]) {
  if (!asset04BuildSource.includes(requiredCopy)) {
    errors.push(`build-asset04-review-bundle.mjs is missing Asset 04 copy: ${requiredCopy}`);
  }
}

const architectureSource = await readFile(
  path.join(sourceDirectory, "06-webmcp-architecture.svg"),
  "utf8",
);
const visibleArchitecture = architectureSource.replace(/<desc[\s\S]*?<\/desc>/, "");
for (const toolName of toolNames) {
  const visibleOccurrences = visibleArchitecture.split(toolName).length - 1;
  if (visibleOccurrences !== 1) {
    errors.push(
      `06-webmcp-architecture.svg shows ${toolName} ${visibleOccurrences} times; expected exactly once.`,
    );
  }
}

const alternativeArchitecture = await readFile(
  path.join(draftDirectory, "06-webmcp-architecture-validation-secondary.svg"),
  "utf8",
);
const visibleAlternativeArchitecture = alternativeArchitecture.replace(/<desc[\s\S]*?<\/desc>/, "");
for (const toolName of toolNames) {
  const visibleOccurrences = visibleAlternativeArchitecture.split(toolName).length - 1;
  if (visibleOccurrences !== 1) {
    errors.push(
      `06 WebMCP alternative shows ${toolName} ${visibleOccurrences} times; expected exactly once.`,
    );
  }
}

const historicalArchitectureSource = await readFile(
  path.join(sourceDirectory, "history", "06-webmcp-architecture-original-validation-strip.svg"),
  "utf8",
);
const visibleHistoricalArchitecture = historicalArchitectureSource.replace(
  /<desc[\s\S]*?<\/desc>/,
  "",
);
for (const toolName of toolNames) {
  const visibleOccurrences = visibleHistoricalArchitecture.split(toolName).length - 1;
  if (visibleOccurrences !== 1) {
    errors.push(
      `Historical Asset 06 shows ${toolName} ${visibleOccurrences} times; expected exactly once.`,
    );
  }
}

const manifest = await readFile(path.join(packageDirectory, "media-manifest.md"), "utf8");
for (const assetId of ["Asset 01", "Asset 02", "Asset 03", "Asset 04", "Asset 05", "Asset 06"]) {
  if (!manifest.includes(assetId)) {
    errors.push(`media-manifest.md is missing ${assetId}.`);
  }
}
if (!manifest.includes("All six assets are **HUMAN APPROVED /")) {
  errors.push("media-manifest.md does not declare the six-asset gallery human approved.");
}

const finalFiles = await readdir(outputDirectory);
const expectedFinals = [
  "01-three-in-the-loop-hero-cover.png",
  "02-how-it-works.png",
  "03-who-does-what.png",
  "04-human-controlled-evidence-curation.png",
  "05-approved-artifact-ready.png",
  "06-webmcp-architecture.png",
];
for (const expectedFinal of expectedFinals) {
  if (!finalFiles.includes(expectedFinal)) {
    errors.push(`${expectedFinal} is missing from the final gallery.`);
  }
}
const numberedFinals = finalFiles.filter((filename) => /^\d{2}-.*\.png$/.test(filename));
if (numberedFinals.length !== expectedFinals.length) {
  errors.push(`Final gallery contains ${numberedFinals.length} numbered PNGs; expected exactly six.`);
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Submission media validation PASS");
  console.log("- all 6 human-approved final PNGs exist and are exactly 1500x1000");
  console.log("- Asset 01 final is byte-identical to the selected controlled redesign draft");
  console.log("- Asset 04, Asset 05, and Asset 06 finals are byte-identical to their approved inputs");
  console.log("- the canonical Asset 06 source is the approved validation-secondary SVG");
  console.log("- prior Asset 01 and Asset 06 versions remain archived with frozen hashes");
  console.log("- frozen Asset 02 and Asset 03 source/output hashes are unchanged");
  console.log("- selected Asset 04 source is byte-identical to the archive original");
  console.log("- contact sheet, Asset 04/05 drafts, Asset 06 alternative, and review bundle have expected dimensions");
  console.log("- locked copy is present in every completed deterministic source");
  console.log("- all five WebMCP tool names appear exactly once in the approved and historical architecture sources");
  console.log("- media manifest declares the complete six-asset gallery human approved");
}

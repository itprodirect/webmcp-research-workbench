import type { ResearchWorkspaceState } from "../domain/workspace";

function escapeMarkdownText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/([`*_\[\]|])/g, "\\$1")
    .split("\n")
    .map((line) =>
      line.replace(/^(\s*)(#{1,6}|[-+]|\d+\.)\s/, "$1\\$2 "),
    )
    .join("\n");
}

export function buildApprovedBriefMarkdown(
  workspace: ResearchWorkspaceState,
): string {
  const { brief, mission } = workspace;
  if (!mission || !brief?.approved) {
    throw new Error("An approved brief and active mission are required for export.");
  }

  const acceptedById = new Map(
    workspace.accepted_evidence.map((source) => [source.id, source] as const),
  );
  const lines = [
    `# ${escapeMarkdownText(brief.title)}`,
    "",
    "**Status:** Human approved",
    "",
    "## Research mission",
    "",
    escapeMarkdownText(mission.question),
  ];

  if (mission.context) {
    lines.push("", `**Context:** ${escapeMarkdownText(mission.context)}`);
  }

  lines.push("", "## Summary", "", escapeMarkdownText(brief.summary));
  lines.push("", "## Findings");

  brief.findings.forEach((finding, index) => {
    lines.push(
      "",
      `### Finding ${index + 1}`,
      "",
      escapeMarkdownText(finding.statement),
      "",
      "**Cited accepted evidence:**",
    );
    finding.source_ids.forEach((sourceId) => {
      const source = acceptedById.get(sourceId);
      lines.push(
        `- \`${sourceId}\` — ${escapeMarkdownText(source?.title ?? "Title unknown")}`,
      );
    });
  });

  lines.push(
    "",
    "## Caveats",
    "",
    escapeMarkdownText(brief.caveats || "None stated."),
    "",
    "## Accepted evidence",
  );

  workspace.accepted_evidence.forEach((source) => {
    const published = source.publication_date ?? "publication date unknown";
    lines.push(
      "",
      `- \`${source.id}\` — ${escapeMarkdownText(source.title ?? "Title unknown")}`,
      `  - Provider: OpenAlex (${source.provider_record_id})`,
      `  - Published: ${escapeMarkdownText(published)}`,
    );
  });

  return `${lines.join("\n")}\n`;
}

export function getApprovedBriefFilename(title: string): string {
  const slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);

  return `${slug || "approved-evidence-brief"}.md`;
}

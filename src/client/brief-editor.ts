import type { BriefInput } from "../domain/workspace";

export type EditableBriefContent = BriefInput;
export type BriefSaveResult =
  | { status: "unchanged" }
  | { status: "saved"; editorKey: string }
  | { status: "failed" };

export function hasUnsavedBriefChanges(
  savedBrief: EditableBriefContent,
  visibleBrief: EditableBriefContent,
): boolean {
  return (
    visibleBrief.title !== savedBrief.title ||
    visibleBrief.summary !== savedBrief.summary ||
    visibleBrief.caveats !== savedBrief.caveats ||
    visibleBrief.findings.length !== savedBrief.findings.length ||
    visibleBrief.findings.some((finding, index) => {
      const savedFinding = savedBrief.findings[index];
      return (
        !savedFinding ||
        finding.statement !== savedFinding.statement ||
        finding.source_ids.length !== savedFinding.source_ids.length ||
        finding.source_ids.some(
          (sourceId) => !savedFinding.source_ids.includes(sourceId),
        )
      );
    })
  );
}

export function getBriefEditorContentKey(
  brief: EditableBriefContent,
): string {
  return JSON.stringify({
    title: brief.title,
    summary: brief.summary,
    findings: brief.findings.map((finding) => ({
      statement: finding.statement,
      source_ids: [...finding.source_ids].sort(),
    })),
    caveats: brief.caveats,
  });
}

export function saveBriefChangesIfDirty(
  savedBrief: EditableBriefContent,
  visibleBrief: EditableBriefContent,
  onSave: (brief: EditableBriefContent) => EditableBriefContent | null,
): BriefSaveResult {
  if (!hasUnsavedBriefChanges(savedBrief, visibleBrief)) {
    return { status: "unchanged" };
  }
  const nextSavedBrief = onSave(visibleBrief);
  return nextSavedBrief
    ? { status: "saved", editorKey: getBriefEditorContentKey(nextSavedBrief) }
    : { status: "failed" };
}

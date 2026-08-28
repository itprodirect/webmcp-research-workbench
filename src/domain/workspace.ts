import type {
  SourceClass,
  SourceDetailsRecord,
  SourceOpenAccess,
  SourcePrimaryTopic,
} from "./source-record.ts";

export const WORKSPACE_SCHEMA_VERSION = 1;
export const DEFAULT_EVIDENCE_MAX = 3;
export const MAX_EVIDENCE_COUNT = 5;
export const MAX_MISSION_LENGTH = 1_000;
export const MAX_MISSION_CONTEXT_LENGTH = 1_000;
export const MAX_PROPOSALS_PER_CALL = 3;
export const MAX_PROPOSAL_NOTE_LENGTH = 300;
export const MAX_LEDGER_EVENTS = 20;
export const MAX_EVIDENCE_TITLE_LENGTH = 500;
export const MAX_EVIDENCE_ABSTRACT_LENGTH = 4_000;
export const MAX_BRIEF_TITLE_LENGTH = 200;
export const MAX_BRIEF_SUMMARY_LENGTH = 1_500;
export const MAX_BRIEF_FINDINGS = 6;
export const MAX_FINDING_STATEMENT_LENGTH = 1_000;
export const MAX_BRIEF_CAVEATS_LENGTH = 1_000;

const MAX_URL_LENGTH = 2_048;
const MAX_SHORT_PROVIDER_TEXT_LENGTH = 200;
const SOURCE_CLASSES: ReadonlySet<SourceClass> = new Set([
  "official_documentation",
  "standards_body",
  "government",
  "peer_reviewed",
  "preprint",
  "repository",
  "technical_publication",
  "community",
  "unknown",
]);

export type ActivityActor = "human" | "agent" | "system";
export type ActivityAction =
  | "mission_set"
  | "agent_proposed_source"
  | "human_accepted_source"
  | "human_rejected_source"
  | "human_removed_source"
  | "agent_drafted_brief"
  | "human_edited_brief"
  | "human_reviewed_brief"
  | "human_approved_brief";

const ACTIVITY_ACTIONS: ReadonlySet<ActivityAction> = new Set([
  "mission_set",
  "agent_proposed_source",
  "human_accepted_source",
  "human_rejected_source",
  "human_removed_source",
  "agent_drafted_brief",
  "human_edited_brief",
  "human_reviewed_brief",
  "human_approved_brief",
]);

export interface ResearchMission {
  question: string;
  context: string | null;
  evidence_max: number;
  updated_at: string;
}

export interface WorkspaceEvidence {
  id: string;
  provider: "openalex";
  provider_record_id: string;
  title: string | null;
  canonical_url: string | null;
  source_class: SourceClass;
  publication_date: string | null;
  retrieved_at: string;
  doi: string | null;
  provider_type: string | null;
  abstract: string | null;
  cited_by_count: number | null;
  open_access: SourceOpenAccess | null;
  primary_topic: SourcePrimaryTopic | null;
}

export interface EvidenceProposal {
  id: string;
  note: string | null;
  source: WorkspaceEvidence;
  proposed_at: string;
}

export interface EvidenceFinding {
  statement: string;
  source_ids: string[];
}

export interface EvidenceBrief {
  title: string;
  summary: string;
  findings: EvidenceFinding[];
  caveats: string;
  agent_generated: true;
  human_edited: boolean;
  human_reviewed: boolean;
  approved: boolean;
  updated_at: string;
}

export interface ActivityEvent {
  timestamp: string;
  actor: ActivityActor;
  action: ActivityAction;
  source_id: string | null;
}

export interface ResearchWorkspaceState {
  schema_version: typeof WORKSPACE_SCHEMA_VERSION;
  mission: ResearchMission | null;
  proposals: EvidenceProposal[];
  accepted_evidence: WorkspaceEvidence[];
  brief: EvidenceBrief | null;
  activity: ActivityEvent[];
}

export interface MissionInput {
  question: string;
  context?: string | null;
  evidence_max?: number;
}

export interface ProposalInput {
  proposals: Array<{ id: string; note?: string | null }>;
}

export interface ValidatedProposalInput {
  proposals: Array<{ id: string; note: string | null }>;
}

export interface BriefInput {
  title: string;
  summary: string;
  findings: EvidenceFinding[];
  caveats: string;
}

export type WorkspaceErrorCode =
  | "invalid_workspace_input"
  | "mission_required"
  | "mission_change_requires_reset"
  | "invalid_source_id"
  | "duplicate_proposal"
  | "already_accepted"
  | "evidence_capacity_reached"
  | "proposal_not_found"
  | "accepted_source_not_found"
  | "no_accepted_evidence"
  | "brief_citation_not_accepted"
  | "brief_required"
  | "brief_review_required"
  | "brief_references_source";

export class WorkspaceError extends Error {
  readonly code: WorkspaceErrorCode;

  constructor(code: WorkspaceErrorCode, message: string) {
    super(message);
    this.name = "WorkspaceError";
    this.code = code;
  }
}

export function createEmptyWorkspace(): ResearchWorkspaceState {
  return {
    schema_version: WORKSPACE_SCHEMA_VERSION,
    mission: null,
    proposals: [],
    accepted_evidence: [],
    brief: null,
    activity: [],
  };
}

export function validateMissionInput(input: unknown): Omit<ResearchMission, "updated_at"> {
  const candidate = exactObject(input, ["question", "context", "evidence_max"]);
  const question = requiredTrimmedText(
    candidate.question,
    "Research mission",
    MAX_MISSION_LENGTH,
  );
  const context = optionalTrimmedText(
    candidate.context,
    "Mission context",
    MAX_MISSION_CONTEXT_LENGTH,
  );
  const evidenceMax = candidate.evidence_max ?? DEFAULT_EVIDENCE_MAX;
  if (
    typeof evidenceMax !== "number" ||
    !Number.isInteger(evidenceMax) ||
    evidenceMax < 1 ||
    evidenceMax > MAX_EVIDENCE_COUNT
  ) {
    throw invalidInput(`Evidence maximum must be an integer from 1 to ${MAX_EVIDENCE_COUNT}.`);
  }
  return { question, context, evidence_max: evidenceMax };
}

export function setResearchMission(
  state: ResearchWorkspaceState,
  input: unknown,
  timestamp: string,
): ResearchWorkspaceState {
  const validated = validateMissionInput(input);
  const missionChanged =
    state.mission !== null &&
    (state.mission.question !== validated.question ||
      state.mission.context !== validated.context ||
      state.mission.evidence_max !== validated.evidence_max);
  if (
    missionChanged &&
    (state.proposals.length > 0 || state.accepted_evidence.length > 0 || state.brief)
  ) {
    throw new WorkspaceError(
      "mission_change_requires_reset",
      "Reset the active workspace before changing a mission that already has evidence or a brief.",
    );
  }

  return withActivity(
    {
      ...state,
      mission: { ...validated, updated_at: validTimestamp(timestamp) },
    },
    "human",
    "mission_set",
    null,
    timestamp,
  );
}

export function validateProposalInput(input: unknown): ValidatedProposalInput {
  const candidate = exactObject(input, ["proposals"]);
  if (
    !Array.isArray(candidate.proposals) ||
    candidate.proposals.length < 1 ||
    candidate.proposals.length > MAX_PROPOSALS_PER_CALL
  ) {
    throw invalidInput(`Proposals must contain 1 to ${MAX_PROPOSALS_PER_CALL} items.`);
  }

  const seen = new Set<string>();
  const proposals = candidate.proposals.map((value) => {
    const proposal = exactObject(value, ["id", "note"]);
    const id = canonicalSourceId(proposal.id);
    if (seen.has(id)) {
      throw new WorkspaceError("duplicate_proposal", `Source ${id} is duplicated in this proposal call.`);
    }
    seen.add(id);
    return {
      id,
      note: optionalTrimmedText(
        proposal.note,
        "Proposal note",
        MAX_PROPOSAL_NOTE_LENGTH,
      ),
    };
  });

  return { proposals };
}

export function proposeEvidence(
  state: ResearchWorkspaceState,
  input: unknown,
  resolvedSources: SourceDetailsRecord[],
  timestamp: string,
): ResearchWorkspaceState {
  if (!state.mission) {
    throw new WorkspaceError("mission_required", "A human-defined research mission is required first.");
  }
  const validated = validateProposalInput(input);
  if (resolvedSources.length !== validated.proposals.length) {
    throw invalidInput("Every proposal must resolve to exactly one source record.");
  }

  const evidence = resolvedSources.map((source, index) => {
    const normalized = toWorkspaceEvidence(source);
    if (normalized.id !== validated.proposals[index].id) {
      throw invalidInput(`Resolved source ${normalized.id} did not match the proposed ID.`);
    }
    return normalized;
  });

  const pendingIds = new Set(state.proposals.map((proposal) => proposal.id));
  const acceptedIds = new Set(state.accepted_evidence.map((source) => source.id));
  for (const proposal of validated.proposals) {
    if (pendingIds.has(proposal.id)) {
      throw new WorkspaceError("duplicate_proposal", `Source ${proposal.id} is already awaiting review.`);
    }
    if (acceptedIds.has(proposal.id)) {
      throw new WorkspaceError("already_accepted", `Source ${proposal.id} is already human-accepted.`);
    }
  }
  if (
    state.proposals.length +
      state.accepted_evidence.length +
      validated.proposals.length >
    state.mission.evidence_max
  ) {
    throw new WorkspaceError(
      "evidence_capacity_reached",
      `The mission allows at most ${state.mission.evidence_max} pending and accepted sources in total.`,
    );
  }

  let next: ResearchWorkspaceState = {
    ...state,
    proposals: [
      ...state.proposals,
      ...validated.proposals.map((proposal, index) => ({
        ...proposal,
        source: evidence[index],
        proposed_at: validTimestamp(timestamp),
      })),
    ],
  };
  for (const proposal of validated.proposals) {
    next = withActivity(next, "agent", "agent_proposed_source", proposal.id, timestamp);
  }
  return next;
}

export function acceptProposal(
  state: ResearchWorkspaceState,
  sourceId: unknown,
  timestamp: string,
): ResearchWorkspaceState {
  const id = canonicalSourceId(sourceId);
  const proposal = state.proposals.find((candidate) => candidate.id === id);
  if (!proposal) {
    throw new WorkspaceError("proposal_not_found", `Proposal ${id} is not awaiting review.`);
  }
  if (state.accepted_evidence.some((source) => source.id === id)) {
    throw new WorkspaceError("already_accepted", `Source ${id} is already human-accepted.`);
  }
  return withActivity(
    {
      ...state,
      proposals: state.proposals.filter((candidate) => candidate.id !== id),
      accepted_evidence: [...state.accepted_evidence, proposal.source],
    },
    "human",
    "human_accepted_source",
    id,
    timestamp,
  );
}

export function rejectProposal(
  state: ResearchWorkspaceState,
  sourceId: unknown,
  timestamp: string,
): ResearchWorkspaceState {
  const id = canonicalSourceId(sourceId);
  if (!state.proposals.some((candidate) => candidate.id === id)) {
    throw new WorkspaceError("proposal_not_found", `Proposal ${id} is not awaiting review.`);
  }
  return withActivity(
    {
      ...state,
      proposals: state.proposals.filter((candidate) => candidate.id !== id),
    },
    "human",
    "human_rejected_source",
    id,
    timestamp,
  );
}

export function acceptInspectedEvidence(
  state: ResearchWorkspaceState,
  source: SourceDetailsRecord,
  timestamp: string,
): ResearchWorkspaceState {
  if (!state.mission) {
    throw new WorkspaceError("mission_required", "A human-defined research mission is required first.");
  }
  const evidence = toWorkspaceEvidence(source);
  if (state.accepted_evidence.some((candidate) => candidate.id === evidence.id)) {
    throw new WorkspaceError("already_accepted", `Source ${evidence.id} is already human-accepted.`);
  }
  const matchingProposal = state.proposals.some((proposal) => proposal.id === evidence.id);
  const occupiedAfter =
    state.accepted_evidence.length + state.proposals.length + (matchingProposal ? 0 : 1);
  if (occupiedAfter > state.mission.evidence_max) {
    throw new WorkspaceError(
      "evidence_capacity_reached",
      `The mission allows at most ${state.mission.evidence_max} pending and accepted sources in total.`,
    );
  }
  return withActivity(
    {
      ...state,
      proposals: state.proposals.filter((proposal) => proposal.id !== evidence.id),
      accepted_evidence: [...state.accepted_evidence, evidence],
    },
    "human",
    "human_accepted_source",
    evidence.id,
    timestamp,
  );
}

export function removeAcceptedEvidence(
  state: ResearchWorkspaceState,
  sourceId: unknown,
  timestamp: string,
): ResearchWorkspaceState {
  const id = canonicalSourceId(sourceId);
  if (!state.accepted_evidence.some((source) => source.id === id)) {
    throw new WorkspaceError("accepted_source_not_found", `Accepted source ${id} was not found.`);
  }
  if (state.brief?.findings.some((finding) => finding.source_ids.includes(id))) {
    throw new WorkspaceError(
      "brief_references_source",
      `Remove ${id} from the brief findings before removing it from accepted evidence.`,
    );
  }
  return withActivity(
    {
      ...state,
      accepted_evidence: state.accepted_evidence.filter((source) => source.id !== id),
    },
    "human",
    "human_removed_source",
    id,
    timestamp,
  );
}

export function validateBriefInput(input: unknown): BriefInput {
  const candidate = exactObject(input, ["title", "summary", "findings", "caveats"]);
  const title = requiredTrimmedText(candidate.title, "Brief title", MAX_BRIEF_TITLE_LENGTH);
  const summary = requiredTrimmedText(
    candidate.summary,
    "Brief summary",
    MAX_BRIEF_SUMMARY_LENGTH,
  );
  if (
    !Array.isArray(candidate.findings) ||
    candidate.findings.length < 1 ||
    candidate.findings.length > MAX_BRIEF_FINDINGS
  ) {
    throw invalidInput(`Brief findings must contain 1 to ${MAX_BRIEF_FINDINGS} items.`);
  }
  const findings = candidate.findings.map((value) => {
    const finding = exactObject(value, ["statement", "source_ids"]);
    const statement = requiredTrimmedText(
      finding.statement,
      "Finding statement",
      MAX_FINDING_STATEMENT_LENGTH,
    );
    if (
      !Array.isArray(finding.source_ids) ||
      finding.source_ids.length < 1 ||
      finding.source_ids.length > MAX_EVIDENCE_COUNT
    ) {
      throw invalidInput(`Each finding must cite 1 to ${MAX_EVIDENCE_COUNT} sources.`);
    }
    const sourceIds = finding.source_ids.map(canonicalSourceId);
    if (new Set(sourceIds).size !== sourceIds.length) {
      throw invalidInput("A finding must not repeat a source ID.");
    }
    return { statement, source_ids: sourceIds };
  });
  if (typeof candidate.caveats !== "string") {
    throw invalidInput("Brief caveats must be a string.");
  }
  const caveats = candidate.caveats.trim();
  if (caveats.length > MAX_BRIEF_CAVEATS_LENGTH) {
    throw invalidInput(`Brief caveats must be ${MAX_BRIEF_CAVEATS_LENGTH} characters or fewer.`);
  }
  return { title, summary, findings, caveats };
}

export function draftEvidenceBrief(
  state: ResearchWorkspaceState,
  input: unknown,
  timestamp: string,
): ResearchWorkspaceState {
  if (state.accepted_evidence.length === 0) {
    throw new WorkspaceError(
      "no_accepted_evidence",
      "A brief requires at least one human-accepted source.",
    );
  }
  const validated = validateBriefInput(input);
  assertAcceptedCitations(state, validated.findings);
  return withActivity(
    {
      ...state,
      brief: {
        ...validated,
        agent_generated: true,
        human_edited: false,
        human_reviewed: false,
        approved: false,
        updated_at: validTimestamp(timestamp),
      },
    },
    "agent",
    "agent_drafted_brief",
    null,
    timestamp,
  );
}

export function editEvidenceBriefByHuman(
  state: ResearchWorkspaceState,
  input: unknown,
  timestamp: string,
): ResearchWorkspaceState {
  if (!state.brief) {
    throw new WorkspaceError("brief_required", "There is no evidence brief to edit.");
  }
  const validated = validateBriefInput(input);
  assertAcceptedCitations(state, validated.findings);
  return withActivity(
    {
      ...state,
      brief: {
        ...validated,
        agent_generated: true,
        human_edited: true,
        human_reviewed: false,
        approved: false,
        updated_at: validTimestamp(timestamp),
      },
    },
    "human",
    "human_edited_brief",
    null,
    timestamp,
  );
}

export function reviewEvidenceBrief(
  state: ResearchWorkspaceState,
  timestamp: string,
): ResearchWorkspaceState {
  if (!state.brief) {
    throw new WorkspaceError("brief_required", "There is no evidence brief to review.");
  }
  return withActivity(
    {
      ...state,
      brief: {
        ...state.brief,
        human_reviewed: true,
        approved: false,
        updated_at: validTimestamp(timestamp),
      },
    },
    "human",
    "human_reviewed_brief",
    null,
    timestamp,
  );
}

export function approveEvidenceBrief(
  state: ResearchWorkspaceState,
  timestamp: string,
): ResearchWorkspaceState {
  if (!state.brief) {
    throw new WorkspaceError("brief_required", "There is no evidence brief to approve.");
  }
  if (!state.brief.human_reviewed) {
    throw new WorkspaceError(
      "brief_review_required",
      "Human review is required before brief approval.",
    );
  }
  return withActivity(
    {
      ...state,
      brief: {
        ...state.brief,
        approved: true,
        updated_at: validTimestamp(timestamp),
      },
    },
    "human",
    "human_approved_brief",
    null,
    timestamp,
  );
}

export function parsePersistedWorkspace(value: unknown): ResearchWorkspaceState {
  const root = exactObject(value, [
    "schema_version",
    "mission",
    "proposals",
    "accepted_evidence",
    "brief",
    "activity",
  ]);
  if (root.schema_version !== WORKSPACE_SCHEMA_VERSION) {
    throw invalidInput("Workspace schema version is unsupported.");
  }
  const mission = root.mission === null ? null : parseMission(root.mission);
  const proposals = parseArray(root.proposals, MAX_EVIDENCE_COUNT, parseProposal, "proposals");
  const acceptedEvidence = parseArray(
    root.accepted_evidence,
    MAX_EVIDENCE_COUNT,
    parseWorkspaceEvidence,
    "accepted evidence",
  );
  const brief = root.brief === null ? null : parseBrief(root.brief);
  const activity = parseArray(root.activity, MAX_LEDGER_EVENTS, parseActivity, "activity");
  const state: ResearchWorkspaceState = {
    schema_version: WORKSPACE_SCHEMA_VERSION,
    mission,
    proposals,
    accepted_evidence: acceptedEvidence,
    brief,
    activity,
  };

  if (!mission && (proposals.length > 0 || acceptedEvidence.length > 0 || brief)) {
    throw invalidInput("Workspace evidence requires a mission.");
  }
  if (mission && proposals.length + acceptedEvidence.length > mission.evidence_max) {
    throw invalidInput("Workspace evidence exceeds the mission capacity.");
  }
  const allIds = [
    ...proposals.map((proposal) => proposal.id),
    ...acceptedEvidence.map((source) => source.id),
  ];
  if (new Set(allIds).size !== allIds.length) {
    throw invalidInput("Workspace evidence IDs must be unique.");
  }
  if (brief) {
    if (acceptedEvidence.length === 0) {
      throw invalidInput("A persisted brief requires accepted evidence.");
    }
    assertAcceptedCitations(state, brief.findings);
  }
  return state;
}

export function getResearchWorkspaceContext(state: ResearchWorkspaceState) {
  const briefStatus = !state.brief
    ? "none"
    : state.brief.approved
      ? "human_approved"
      : state.brief.human_reviewed
        ? "human_reviewed"
        : "human_review_required";
  const citedSourceIds = state.brief
    ? [...new Set(state.brief.findings.flatMap((finding) => finding.source_ids))]
    : [];

  return {
    schema_version: state.schema_version,
    mission: state.mission,
    proposals: state.proposals.map((proposal) => ({
      id: proposal.id,
      status: "pending_human_review" as const,
      note: proposal.note,
      title: proposal.source.title,
      publication_date: proposal.source.publication_date,
    })),
    accepted_evidence: state.accepted_evidence.map((source) => ({
      id: source.id,
      provider: source.provider,
      provider_record_id: source.provider_record_id,
      title: source.title,
      publication_date: source.publication_date,
      retrieved_at: source.retrieved_at,
    })),
    brief: {
      status: briefStatus,
      title: state.brief?.title ?? null,
      finding_count: state.brief?.findings.length ?? 0,
      cited_source_ids: citedSourceIds,
    },
    counts: {
      pending_proposals: state.proposals.length,
      accepted_evidence: state.accepted_evidence.length,
      activity_events: state.activity.length,
    },
  };
}

export function validateEmptyObject(input: unknown): Record<string, never> {
  const candidate = exactObject(input, []);
  return candidate as Record<string, never>;
}

export function toWorkspaceEvidence(source: SourceDetailsRecord): WorkspaceEvidence {
  const id = canonicalSourceId(source.id);
  const providerRecordId = id.slice("openalex:".length);
  if (source.provider !== "openalex" || source.provider_record_id !== providerRecordId) {
    throw invalidInput("Resolved source provenance did not match its canonical ID.");
  }
  if (!SOURCE_CLASSES.has(source.source_class)) {
    throw invalidInput("Resolved source class is invalid.");
  }

  return {
    id,
    provider: "openalex",
    provider_record_id: providerRecordId,
    title: boundedNullableText(source.title, MAX_EVIDENCE_TITLE_LENGTH, "Source title"),
    canonical_url: boundedNullableUrl(source.canonical_url, "Canonical URL"),
    source_class: source.source_class,
    publication_date: boundedNullableText(source.publication_date, 40, "Publication date"),
    retrieved_at: validTimestamp(source.retrieved_at),
    doi: boundedNullableText(source.doi, MAX_URL_LENGTH, "DOI"),
    provider_type: boundedNullableText(
      source.provider_type,
      MAX_SHORT_PROVIDER_TEXT_LENGTH,
      "Provider type",
    ),
    abstract: boundedNullableText(
      source.abstract,
      MAX_EVIDENCE_ABSTRACT_LENGTH,
      "Abstract",
    ),
    cited_by_count: nullableNonNegativeInteger(source.cited_by_count, "Citation count"),
    open_access: parseOpenAccess(source.open_access),
    primary_topic: parsePrimaryTopic(source.primary_topic),
  };
}

function parseMission(value: unknown): ResearchMission {
  const mission = exactObject(value, ["question", "context", "evidence_max", "updated_at"]);
  const validated = validateMissionInput({
    question: mission.question,
    context: mission.context,
    evidence_max: mission.evidence_max,
  });
  return { ...validated, updated_at: validTimestamp(mission.updated_at) };
}

function parseProposal(value: unknown): EvidenceProposal {
  const proposal = exactObject(value, ["id", "note", "source", "proposed_at"]);
  const validated = validateProposalInput({ proposals: [{ id: proposal.id, note: proposal.note }] });
  const source = parseWorkspaceEvidence(proposal.source);
  if (source.id !== validated.proposals[0].id) {
    throw invalidInput("Persisted proposal source ID did not match its proposal ID.");
  }
  return {
    ...validated.proposals[0],
    source,
    proposed_at: validTimestamp(proposal.proposed_at),
  };
}

function parseWorkspaceEvidence(value: unknown): WorkspaceEvidence {
  const source = exactObject(value, [
    "id",
    "provider",
    "provider_record_id",
    "title",
    "canonical_url",
    "source_class",
    "publication_date",
    "retrieved_at",
    "doi",
    "provider_type",
    "abstract",
    "cited_by_count",
    "open_access",
    "primary_topic",
  ]);
  const id = canonicalSourceId(source.id);
  const providerRecordId = id.slice("openalex:".length);
  if (source.provider !== "openalex" || source.provider_record_id !== providerRecordId) {
    throw invalidInput("Persisted source provenance is invalid.");
  }
  if (typeof source.source_class !== "string" || !SOURCE_CLASSES.has(source.source_class as SourceClass)) {
    throw invalidInput("Persisted source class is invalid.");
  }
  return {
    id,
    provider: "openalex",
    provider_record_id: providerRecordId,
    title: boundedNullableText(source.title, MAX_EVIDENCE_TITLE_LENGTH, "Source title"),
    canonical_url: boundedNullableUrl(source.canonical_url, "Canonical URL"),
    source_class: source.source_class as SourceClass,
    publication_date: boundedNullableText(source.publication_date, 40, "Publication date"),
    retrieved_at: validTimestamp(source.retrieved_at),
    doi: boundedNullableText(source.doi, MAX_URL_LENGTH, "DOI"),
    provider_type: boundedNullableText(
      source.provider_type,
      MAX_SHORT_PROVIDER_TEXT_LENGTH,
      "Provider type",
    ),
    abstract: boundedNullableText(
      source.abstract,
      MAX_EVIDENCE_ABSTRACT_LENGTH,
      "Abstract",
    ),
    cited_by_count: nullableNonNegativeInteger(source.cited_by_count, "Citation count"),
    open_access: parseOpenAccess(source.open_access),
    primary_topic: parsePrimaryTopic(source.primary_topic),
  };
}

function parseBrief(value: unknown): EvidenceBrief {
  const brief = exactObject(value, [
    "title",
    "summary",
    "findings",
    "caveats",
    "agent_generated",
    "human_edited",
    "human_reviewed",
    "approved",
    "updated_at",
  ]);
  const validated = validateBriefInput({
    title: brief.title,
    summary: brief.summary,
    findings: brief.findings,
    caveats: brief.caveats,
  });
  if (brief.agent_generated !== true) {
    throw invalidInput("Persisted brief must retain its agent-generated origin.");
  }
  const humanEdited = brief.human_edited;
  const humanReviewed = brief.human_reviewed;
  const approved = brief.approved;
  if (typeof humanEdited !== "boolean") {
    throw invalidInput("Persisted brief human_edited must be boolean.");
  }
  if (typeof humanReviewed !== "boolean") {
    throw invalidInput("Persisted brief human_reviewed must be boolean.");
  }
  if (typeof approved !== "boolean") {
    throw invalidInput("Persisted brief approved must be boolean.");
  }
  if (approved && !humanReviewed) {
    throw invalidInput("An approved brief must be human-reviewed.");
  }
  return {
    ...validated,
    agent_generated: true,
    human_edited: humanEdited,
    human_reviewed: humanReviewed,
    approved,
    updated_at: validTimestamp(brief.updated_at),
  };
}

function parseActivity(value: unknown): ActivityEvent {
  const event = exactObject(value, ["timestamp", "actor", "action", "source_id"]);
  if (event.actor !== "human" && event.actor !== "agent" && event.actor !== "system") {
    throw invalidInput("Persisted activity actor is invalid.");
  }
  if (typeof event.action !== "string" || !ACTIVITY_ACTIONS.has(event.action as ActivityAction)) {
    throw invalidInput("Persisted activity action is invalid.");
  }
  return {
    timestamp: validTimestamp(event.timestamp),
    actor: event.actor,
    action: event.action as ActivityAction,
    source_id: event.source_id === null ? null : canonicalSourceId(event.source_id),
  };
}

function parseOpenAccess(value: unknown): SourceOpenAccess | null {
  if (value === null) {
    return null;
  }
  const access = exactObject(value, ["is_oa", "oa_status", "oa_url"]);
  if (access.is_oa !== null && typeof access.is_oa !== "boolean") {
    throw invalidInput("Open-access is_oa must be boolean or null.");
  }
  return {
    is_oa: access.is_oa,
    oa_status: boundedNullableText(
      access.oa_status,
      MAX_SHORT_PROVIDER_TEXT_LENGTH,
      "Open-access status",
    ),
    oa_url: boundedNullableUrl(access.oa_url, "Open-access URL"),
  };
}

function parsePrimaryTopic(value: unknown): SourcePrimaryTopic | null {
  if (value === null) {
    return null;
  }
  const topic = exactObject(value, ["provider_record_id", "display_name"]);
  if (
    topic.provider_record_id !== null &&
    (typeof topic.provider_record_id !== "string" || !/^T\d+$/.test(topic.provider_record_id))
  ) {
    throw invalidInput("Primary topic provider ID is invalid.");
  }
  return {
    provider_record_id: topic.provider_record_id,
    display_name: boundedNullableText(
      topic.display_name,
      MAX_EVIDENCE_TITLE_LENGTH,
      "Primary topic name",
    ),
  };
}

function assertAcceptedCitations(
  state: ResearchWorkspaceState,
  findings: EvidenceFinding[],
): void {
  const acceptedIds = new Set(state.accepted_evidence.map((source) => source.id));
  for (const sourceId of findings.flatMap((finding) => finding.source_ids)) {
    if (!acceptedIds.has(sourceId)) {
      throw new WorkspaceError(
        "brief_citation_not_accepted",
        `Brief citation ${sourceId} is not in the human-accepted evidence set. No brief changes were saved.`,
      );
    }
  }
}

function withActivity(
  state: ResearchWorkspaceState,
  actor: ActivityActor,
  action: ActivityAction,
  sourceId: string | null,
  timestamp: string,
): ResearchWorkspaceState {
  const event: ActivityEvent = {
    timestamp: validTimestamp(timestamp),
    actor,
    action,
    source_id: sourceId,
  };
  return {
    ...state,
    activity: [...state.activity, event].slice(-MAX_LEDGER_EVENTS),
  };
}

function exactObject(value: unknown, allowedKeys: string[]): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw invalidInput("Workspace input must be an object.");
  }
  const candidate = value as Record<string, unknown>;
  const allowed = new Set(allowedKeys);
  if (Object.keys(candidate).some((key) => !allowed.has(key))) {
    throw invalidInput("Workspace input contains unsupported fields.");
  }
  return candidate;
}

function parseArray<T>(
  value: unknown,
  maximum: number,
  parser: (item: unknown) => T,
  field: string,
): T[] {
  if (!Array.isArray(value) || value.length > maximum) {
    throw invalidInput(`Persisted workspace ${field} is invalid or exceeds its bound.`);
  }
  return value.map(parser);
}

function requiredTrimmedText(value: unknown, field: string, maximum: number): string {
  if (typeof value !== "string") {
    throw invalidInput(`${field} must be a string.`);
  }
  const text = value.trim();
  if (!text) {
    throw invalidInput(`${field} must not be empty.`);
  }
  if (text.length > maximum) {
    throw invalidInput(`${field} must be ${maximum} characters or fewer.`);
  }
  return text;
}

function optionalTrimmedText(
  value: unknown,
  field: string,
  maximum: number,
): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  if (typeof value !== "string") {
    throw invalidInput(`${field} must be a string or null.`);
  }
  const text = value.trim();
  if (text.length > maximum) {
    throw invalidInput(`${field} must be ${maximum} characters or fewer.`);
  }
  return text || null;
}

function boundedNullableText(value: unknown, maximum: number, field: string): string | null {
  if (value === null) {
    return null;
  }
  if (typeof value !== "string" || value.length > maximum) {
    throw invalidInput(`${field} must be a bounded string or null.`);
  }
  return value;
}

function boundedNullableUrl(value: unknown, field: string): string | null {
  const url = boundedNullableText(value, MAX_URL_LENGTH, field);
  if (url === null) {
    return null;
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Unsupported scheme");
    }
  } catch {
    throw invalidInput(`${field} must be an HTTP(S) URL or null.`);
  }
  return url;
}

function nullableNonNegativeInteger(value: unknown, field: string): number | null {
  if (value === null) {
    return null;
  }
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw invalidInput(`${field} must be a non-negative integer or null.`);
  }
  return value;
}

function canonicalSourceId(value: unknown): string {
  if (typeof value !== "string" || !/^openalex:W[0-9]+$/.test(value)) {
    throw new WorkspaceError(
      "invalid_source_id",
      "Source ID must match the canonical OpenAlex format openalex:W followed by digits.",
    );
  }
  return value;
}

function validTimestamp(value: unknown): string {
  if (
    typeof value !== "string" ||
    value.length > 40 ||
    !Number.isFinite(Date.parse(value))
  ) {
    throw invalidInput("Workspace timestamp is invalid.");
  }
  return value;
}

function invalidInput(message: string): WorkspaceError {
  return new WorkspaceError("invalid_workspace_input", message);
}

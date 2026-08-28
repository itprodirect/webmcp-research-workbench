"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import type { FormEvent, ReactNode } from "react";
import type {
  SourceDetailsRecord,
  SourceRecord,
} from "@/src/domain/source-record";
import type {
  EvidenceBrief,
  ResearchMission,
  ResearchWorkspaceState,
  WorkspaceEvidence,
} from "@/src/domain/workspace";
import type { SearchMode } from "@/src/domain/search-input";
import { MAX_MISSION_LENGTH } from "@/src/domain/workspace";
import { searchSourcesViaServer } from "@/src/client/search-api";
import { getSourceDetailsViaServer } from "@/src/client/source-details-api";
import { workspaceStore } from "@/src/client/workspace-store";
import {
  buildApprovedBriefMarkdown,
  getApprovedBriefFilename,
} from "@/src/client/approved-brief-markdown";
import {
  deriveResearchCyclePresentation,
  getResearchCycleStageStatus,
  RESEARCH_CYCLE_STAGES,
} from "@/src/client/research-cycle";

const UI_RESULT_LIMIT = 5;
const AGENT_RESEARCH_PROMPT =
  "Open the WebMCP Research Workbench and read the active Research Mission. Search in both semantic and keyword modes where useful. Inspect the strongest candidates and propose up to three sources for human review. Prioritize direct relevance, provenance, recency where relevant, and open-access availability. Briefly explain why each source belongs in the evidence set, then stop and wait for human review. Do not accept evidence yourself.";
const AGENT_SYNTHESIS_PROMPT =
  "In the WebMCP Research Workbench, read the current research workspace and draft the Evidence Brief for the active mission. Use only the human-accepted evidence already in the workspace when supporting or citing findings. Cite each finding to the accepted source IDs that support it, include relevant caveats about the limits of the evidence, and leave the result for human review. Do not mark it reviewed or approve it.";
type RequestStatus = "idle" | "loading" | "success" | "error";

export function SearchWorkbench() {
  const workspace = useSyncExternalStore(
    workspaceStore.subscribe,
    workspaceStore.getSnapshot,
    workspaceStore.getServerSnapshot,
  );
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("keyword");
  const [results, setResults] = useState<SourceRecord[]>([]);
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [error, setError] = useState("");
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [details, setDetails] = useState<SourceDetailsRecord | null>(null);
  const [detailsStatus, setDetailsStatus] = useState<RequestStatus>("idle");
  const [detailsError, setDetailsError] = useState("");
  const [workspaceMessage, setWorkspaceMessage] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);
  const activeRequest = useRef<AbortController | null>(null);
  const activeDetailsRequest = useRef<AbortController | null>(null);

  function performWorkspaceAction(action: () => void, success: string) {
    try {
      action();
      setWorkspaceMessage({ kind: "success", text: success });
    } catch (caught) {
      setWorkspaceMessage({
        kind: "error",
        text: caught instanceof Error ? caught.message : "Workspace action failed.",
      });
    }
  }

  function handleMissionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    performWorkspaceAction(
      () =>
        workspaceStore.setMission({
          question: String(form.get("question") ?? ""),
          context: String(form.get("context") ?? ""),
          evidence_max: Number(form.get("evidence_max")),
        }),
      workspace.mission ? "Research mission updated." : "Research mission set.",
    );
  }

  function handleReset() {
    if (!window.confirm("Reset the entire shared research workspace? This cannot be undone.")) {
      return;
    }
    workspaceStore.reset();
    setWorkspaceMessage({ kind: "success", text: "Shared workspace reset." });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    activeRequest.current?.abort();
    activeDetailsRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setStatus("loading");
    setError("");
    setSelectedSourceId(null);
    setDetails(null);
    setDetailsStatus("idle");
    setDetailsError("");

    try {
      const response = await searchSourcesViaServer(
        { query, mode, limit: UI_RESULT_LIMIT },
        controller.signal,
      );
      setResults(response.results);
      setStatus("success");
    } catch (caught) {
      if (controller.signal.aborted) {
        return;
      }
      setResults([]);
      setError(caught instanceof Error ? caught.message : "Search failed.");
      setStatus("error");
    }
  }

  async function handleInspect(sourceId: string) {
    activeDetailsRequest.current?.abort();
    const controller = new AbortController();
    activeDetailsRequest.current = controller;
    setSelectedSourceId(sourceId);
    setDetails(null);
    setDetailsStatus("loading");
    setDetailsError("");

    try {
      const response = await getSourceDetailsViaServer(
        { id: sourceId },
        controller.signal,
      );
      if (response.source.id !== sourceId) {
        throw new Error("The source details service returned a different source ID.");
      }
      setDetails(response.source);
      setDetailsStatus("success");
    } catch (caught) {
      if (controller.signal.aborted) {
        return;
      }
      setDetailsError(
        caught instanceof Error ? caught.message : "Source details failed.",
      );
      setDetailsStatus("error");
    }
  }

  return (
    <div className="workbench-stack">
      <ResearchCycle workspace={workspace} />
      <RolesPanel />

      <MissionPanel
        mission={workspace.mission}
        onSubmit={handleMissionSubmit}
        onReset={handleReset}
      />

      {workspaceMessage && (
        <p
          className={`workspace-message ${workspaceMessage.kind}`}
          role={workspaceMessage.kind === "error" ? "alert" : "status"}
        >
          {workspaceMessage.text}
        </p>
      )}

      <section
        className="workspace-panel verification-panel"
        aria-labelledby="search-heading"
      >
        <div className="section-heading">
          <div>
            <p className="section-kicker">Agent-first discovery</p>
            <h2 id="search-heading">Optional human source verification</h2>
          </div>
          <span className="provider-chip">OpenAlex only</span>
        </div>
        <div className="agent-discovery-note">
          <p>
            <strong>The agent performs discovery during the Research stage through WebMCP.</strong>
          </p>
          <p>
            It may search OpenAlex in Keyword and Semantic modes and inspect candidate
            records. Selected candidates enter the shared workspace under Agent
            Proposals for your review. You do not need to repeat the agent&apos;s searches.
          </p>
        </div>
        <details className="manual-verification">
          <summary>
            <span>
              <strong>Open manual search and source inspection</strong>
              <small>Optional — independently verify or explore OpenAlex sources.</small>
            </span>
          </summary>
          <div className="manual-verification-content">
            <form className="search-form" onSubmit={handleSubmit}>
              <div className="field grow-field">
                <label htmlFor="source-query">Research topic</label>
                <input
                  id="source-query"
                  name="query"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="e.g. indirect prompt injection in browser agents"
                  maxLength={mode === "semantic" ? 2000 : 200}
                  required
                />
              </div>
              <div className="field mode-field">
                <label htmlFor="search-mode">Mode</label>
                <select
                  id="search-mode"
                  value={mode}
                  onChange={(event) => setMode(event.target.value as SearchMode)}
                >
                  <option value="keyword">Keyword</option>
                  <option value="semantic">Semantic</option>
                </select>
              </div>
              <button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Searching…" : "Search"}
              </button>
            </form>
            <div className="search-mode-guide" aria-label="Search mode guidance">
              <p>
                <strong>Keyword</strong>
                Best when you know the names, terms, acronyms, or phrases you want to
                search for.
              </p>
              <p>
                <strong>Semantic</strong>
                Best when you know the idea you&apos;re researching but relevant work may
                describe it using different words.
              </p>
            </div>

            <SearchStatus status={status} error={error} count={results.length} mode={mode} />

            {results.length > 0 && (
              <div className="results" aria-label="Search results">
                {results.map((source) => (
                  <SourceResult
                    key={source.id}
                    source={source}
                    isLoading={
                      detailsStatus === "loading" && selectedSourceId === source.id
                    }
                    onInspect={handleInspect}
                  />
                ))}
              </div>
            )}

            <SourceDetailsPanel
              sourceId={selectedSourceId}
              source={details}
              status={detailsStatus}
              error={detailsError}
              workspace={workspace}
              onAccept={(source) =>
                performWorkspaceAction(
                  () => workspaceStore.acceptInspectedEvidence(source),
                  `${source.id} accepted as evidence.`,
                )
              }
            />
          </div>
        </details>
      </section>

      <ProposalPanel
        workspace={workspace}
        onAccept={(id) =>
          performWorkspaceAction(
            () => workspaceStore.acceptProposal(id),
            `${id} accepted as evidence.`,
          )
        }
        onReject={(id) =>
          performWorkspaceAction(
            () => workspaceStore.rejectProposal(id),
            `${id} rejected.`,
          )
        }
      />

      <AcceptedEvidencePanel
        evidence={workspace.accepted_evidence}
        maximum={workspace.mission?.evidence_max ?? 0}
        onRemove={(id) =>
          performWorkspaceAction(
            () => workspaceStore.removeAcceptedEvidence(id),
            `${id} removed from accepted evidence.`,
          )
        }
      />

      <BriefPanel
        brief={workspace.brief}
        acceptedEvidence={workspace.accepted_evidence}
        onEdit={(input) =>
          performWorkspaceAction(
            () => workspaceStore.editBrief(input),
            "Human edits saved; review and approval reset.",
          )
        }
        onReview={() =>
          performWorkspaceAction(
            () => workspaceStore.reviewBrief(),
            "Evidence brief marked as human-reviewed.",
          )
        }
        onApprove={() =>
          performWorkspaceAction(
            () => workspaceStore.approveBrief(),
            "Evidence brief human-approved.",
          )
        }
      />

      <ActivityPanel workspace={workspace} />
    </div>
  );
}

function RolesPanel() {
  return (
    <section className="roles-panel" aria-labelledby="roles-heading">
      <div className="compact-section-heading">
        <p className="section-kicker">Who does what</p>
        <h2 id="roles-heading">Human judgment, agent acceleration</h2>
      </div>
      <div className="role-grid">
        <article className="role-card role-human">
          <h3>Human</h3>
          <p>
            Set the research question, decide which sources become evidence, edit the
            draft, review it, and give final approval.
          </p>
        </article>
        <article className="role-card role-agent">
          <h3>Agent</h3>
          <p>
            Searches OpenAlex, inspects source records, proposes evidence for your
            review, and drafts a brief from the evidence you accepted.
          </p>
        </article>
        <article className="role-card role-webmcp">
          <h3>WebMCP</h3>
          <p>
            Gives the agent structured access to the same workspace and its declared
            capabilities instead of requiring it to scrape the screen or imitate
            human clicks.
          </p>
        </article>
      </div>
      <p className="runtime-note">
        <strong>
          The website does not run an embedded AI model; a WebMCP-enabled agent uses
          the capabilities exposed by the workbench.
        </strong>
      </p>
    </section>
  );
}

function ResearchCycle({ workspace }: { workspace: ResearchWorkspaceState }) {
  const presentation = deriveResearchCyclePresentation(workspace);
  const [copyFeedback, setCopyFeedback] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  async function handleCopyResearchPrompt() {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard API unavailable.");
      }
      await navigator.clipboard.writeText(AGENT_RESEARCH_PROMPT);
      setCopyFeedback({ kind: "success", text: "Research prompt copied." });
    } catch {
      setCopyFeedback({ kind: "error", text: "Could not copy the research prompt." });
    }
  }

  return (
    <section
      id="research-cycle"
      className={`research-cycle-panel research-cycle-${presentation.owner}`}
      aria-labelledby="research-cycle-heading"
    >
      <div className="research-cycle-heading">
        <div>
          <p className="section-kicker">Live workspace position</p>
          <h2 id="research-cycle-heading">Research Cycle</h2>
        </div>
        <span className="cycle-position">{presentation.turnLabel}</span>
      </div>

      <ol className="research-cycle-steps" aria-label="Research cycle progress">
        {RESEARCH_CYCLE_STAGES.map((stage, index) => {
          const stageStatus = getResearchCycleStageStatus(presentation, index);
          const actorClass = stage.actor === "Human" ? "human" : "agent";
          return (
            <li
              className={`research-cycle-stage cycle-stage-${stageStatus} cycle-stage-${actorClass}`}
              key={stage.label}
              aria-current={stageStatus === "current" ? "step" : undefined}
            >
              <span className="cycle-stage-marker" aria-hidden="true">
                {stageStatus === "complete" ? "✓" : index + 1}
              </span>
              <strong className="cycle-stage-label">{stage.label}</strong>
              <span className={`cycle-stage-actor cycle-actor-${actorClass}`}>
                {stage.actor}
              </span>
              <span className="cycle-stage-status">
                {stageStatus === "complete"
                  ? "Complete"
                  : stageStatus === "current"
                    ? "Current"
                    : "Upcoming"}
              </span>
            </li>
          );
        })}
      </ol>

      <div className={`cycle-next-action cycle-next-${presentation.owner}`} aria-live="polite">
        <p className="cycle-turn-label">{presentation.turnLabel}</p>
        <h3>{presentation.headline}</h3>
        <p>{presentation.guidance}</p>
        {presentation.state === "research" && (
          <div className="cycle-copy-action">
            <button type="button" onClick={handleCopyResearchPrompt}>
              Copy research prompt
            </button>
            {copyFeedback && (
              <p
                className={`copy-feedback ${copyFeedback.kind}`}
                role={copyFeedback.kind === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                {copyFeedback.text}
              </p>
            )}
          </div>
        )}
        {presentation.state === "complete" && (
          <ApprovedBriefActions workspace={workspace} />
        )}
      </div>
    </section>
  );
}

function ApprovedBriefActions({ workspace }: { workspace: ResearchWorkspaceState }) {
  const [feedback, setFeedback] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);
  const markdown = buildApprovedBriefMarkdown(workspace);
  const downloadHref = `data:text/markdown;charset=utf-8,${encodeURIComponent(markdown)}`;

  async function handleCopyApprovedBrief() {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard API unavailable.");
      }
      await navigator.clipboard.writeText(markdown);
      setFeedback({ kind: "success", text: "Approved brief copied." });
    } catch {
      setFeedback({ kind: "error", text: "Could not copy the approved brief." });
    }
  }

  return (
    <div className="approved-artifact-actions" aria-label="Human-approved artifact actions">
      <div className="approved-artifact-buttons">
        <a
          className="download-button"
          href={downloadHref}
          download={getApprovedBriefFilename(workspace.brief?.title ?? "")}
          onClick={() =>
            setFeedback({ kind: "success", text: "Approved brief downloaded." })
          }
        >
          Download approved brief (.md)
        </a>
        <button
          className="secondary-button"
          type="button"
          onClick={handleCopyApprovedBrief}
        >
          Copy approved brief
        </button>
      </div>
      {feedback && (
        <p
          className={`copy-feedback ${feedback.kind}`}
          role={feedback.kind === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {feedback.text}
        </p>
      )}
    </div>
  );
}

function MissionPanel({
  mission,
  onSubmit,
  onReset,
}: {
  mission: ResearchMission | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
}) {
  return (
    <section className="workspace-panel mission-panel" aria-labelledby="mission-heading">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Human authority</p>
          <h2 id="mission-heading">Research Mission</h2>
        </div>
        <span className="human-chip">Human-owned</span>
      </div>
      <p className="section-intro">
        The mission is the question your research works toward — it guides searches,
        evidence proposals, and the final brief.
      </p>
      <p className="example-text" id="mission-guidance">
        <strong>Example:</strong> How effective are heat-pump retrofits at reducing
        residential energy use in cold climates?
      </p>
      <p className="example-text" id="context-guidance">
        <strong>Audience/context example:</strong> Briefing for a city sustainability
        team evaluating retrofit incentives.
      </p>
      <p className="authority-note">
        Only the visible human interface can set or change the mission. Reset before
        changing a mission that already has evidence or a brief.
      </p>
      <form
        className="mission-form"
        key={mission?.updated_at ?? "empty-mission"}
        onSubmit={onSubmit}
      >
        <div className="field full-field">
          <label htmlFor="mission-question">Research question / mission <span aria-hidden="true">*</span></label>
          <textarea
            id="mission-question"
            name="question"
            defaultValue={mission?.question ?? ""}
            maxLength={MAX_MISSION_LENGTH}
            rows={3}
            aria-describedby="mission-guidance"
            required
          />
        </div>
        <div className="field full-field">
          <label htmlFor="mission-context">Context or intended audience <span className="optional">optional</span></label>
          <textarea
            id="mission-context"
            name="context"
            defaultValue={mission?.context ?? ""}
            maxLength={1000}
            rows={2}
            aria-describedby="context-guidance"
          />
        </div>
        <div className="field evidence-limit-field">
          <label htmlFor="evidence-max">Maximum accepted evidence</label>
          <select
            id="evidence-max"
            name="evidence_max"
            defaultValue={String(mission?.evidence_max ?? 3)}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button type="submit">{mission ? "Update mission" : "Set mission"}</button>
          <button className="danger-button" type="button" onClick={onReset}>
            Reset workspace
          </button>
        </div>
      </form>
    </section>
  );
}

function SearchStatus({
  status,
  error,
  count,
  mode,
}: {
  status: RequestStatus;
  error: string;
  count: number;
  mode: SearchMode;
}) {
  if (status === "idle") {
    return <p className="status">Results are limited to {UI_RESULT_LIMIT} compact records.</p>;
  }
  if (status === "loading") {
    return <p className="status">Loading real OpenAlex {mode} results…</p>;
  }
  if (status === "error") {
    return <p className="status error" role="alert">{error}</p>;
  }
  if (count === 0) {
    return <p className="status">No matching OpenAlex records were returned.</p>;
  }
  return <p className="status">Found {count} source{count === 1 ? "" : "s"}.</p>;
}

function SourceResult({
  source,
  isLoading,
  onInspect,
}: {
  source: SourceRecord;
  isLoading: boolean;
  onInspect: (sourceId: string) => void;
}) {
  const externalUrl = safeExternalUrl(source.canonical_url);

  return (
    <article className="result-card">
      <code className="source-id">{source.id}</code>
      <h3>{source.title ?? "Title unknown"}</h3>
      <p className="metadata">
        <span>Provider: {source.provider}</span>
        <span>Published: {source.publication_date ?? "unknown"}</span>
        <span>Type: {source.provider_type ?? "unknown"}</span>
        {source.doi && <span>DOI: {source.doi}</span>}
      </p>
      <details className="provenance-disclosure">
        <summary>More provenance details</summary>
        <dl className="compact-details-list">
          <div><dt>Provider record ID</dt><dd>{source.provider_record_id}</dd></div>
          <div><dt>Source class</dt><dd>{source.source_class}</dd></div>
          <div><dt>Provider updated</dt><dd>{source.provider_updated_at ?? "unknown"}</dd></div>
          <div><dt>Retrieved</dt><dd>{source.retrieved_at}</dd></div>
        </dl>
      </details>
      <div className="card-actions">
        <button
          type="button"
          onClick={() => onInspect(source.id)}
          disabled={isLoading}
        >
          {isLoading ? "Loading details…" : "Inspect source"}
        </button>
        {externalUrl && <SafeExternalLink href={externalUrl}>View provider record</SafeExternalLink>}
      </div>
    </article>
  );
}

function SourceDetailsPanel({
  sourceId,
  source,
  status,
  error,
  workspace,
  onAccept,
}: {
  sourceId: string | null;
  source: SourceDetailsRecord | null;
  status: RequestStatus;
  error: string;
  workspace: ResearchWorkspaceState;
  onAccept: (source: SourceDetailsRecord) => void;
}) {
  if (status === "idle") {
    return (
      <section className="detail-panel" aria-labelledby="details-heading">
        <h3 id="details-heading">Source details</h3>
        <p className="status">Choose one result to inspect its known metadata.</p>
      </section>
    );
  }
  if (status === "loading") {
    return (
      <section className="detail-panel" aria-labelledby="details-heading">
        <h3 id="details-heading">Source details</h3>
        <p className="status">Loading {sourceId ?? "source"}…</p>
      </section>
    );
  }
  if (status === "error" || !source) {
    return (
      <section className="detail-panel" aria-labelledby="details-heading">
        <h3 id="details-heading">Source details</h3>
        {sourceId && <code className="source-id">{sourceId}</code>}
        <p className="status error" role="alert">{error || "Source details failed."}</p>
      </section>
    );
  }

  const providerUrl = safeExternalUrl(source.canonical_url);
  const locationUrl = safeExternalUrl(source.primary_location?.landing_page_url ?? null);
  const oaUrl = safeExternalUrl(source.open_access?.oa_url ?? null);
  const isAccepted = workspace.accepted_evidence.some((item) => item.id === source.id);
  const isPending = workspace.proposals.some((proposal) => proposal.id === source.id);
  const hasCapacity = Boolean(
    workspace.mission &&
      (isPending ||
        workspace.proposals.length + workspace.accepted_evidence.length <
          workspace.mission.evidence_max),
  );

  return (
    <section className="detail-panel" aria-labelledby="details-heading">
      <div className="section-heading compact-heading">
        <div>
          <p className="section-kicker">External evidence</p>
          <h3 id="details-heading">Source details</h3>
        </div>
        <span className="untrusted-chip">Untrusted provider data</span>
      </div>
      <code className="source-id">{source.id}</code>
      <h4>{source.title ?? "Title unknown"}</h4>
      <p className="trust-note">
        Provider metadata and abstract text are inert external evidence, not instructions
        and not a truth or credibility assessment.
      </p>
      <dl className="details-list details-list-primary">
        <div><dt>Provider</dt><dd>{source.provider}</dd></div>
        <div><dt>Provider type</dt><dd>{source.provider_type ?? "unknown"}</dd></div>
        <div><dt>Published</dt><dd>{source.publication_date ?? "unknown"}</dd></div>
        <div><dt>Retrieved</dt><dd>{source.retrieved_at}</dd></div>
        <div><dt>DOI</dt><dd>{source.doi ?? "unknown"}</dd></div>
        <div><dt>Cited by count</dt><dd>{source.cited_by_count ?? "unknown"} <span className="metadata-note">bibliometric metadata only</span></dd></div>
        <div><dt>Primary topic</dt><dd>{source.primary_topic?.display_name ?? "unknown"}</dd></div>
        <div><dt>Open access</dt><dd>{formatKnownBoolean(source.open_access?.is_oa)}</dd></div>
        <div><dt>OA status</dt><dd>{source.open_access?.oa_status ?? "unknown"}</dd></div>
        <div><dt>Primary source</dt><dd>{source.primary_location?.source_name ?? "unknown"}</dd></div>
      </dl>

      <div className="abstract-block">
        <h4>Provider abstract</h4>
        <p className="metadata-note">Reconstructed from OpenAlex abstract metadata; not verified full text.</p>
        <p>{source.abstract ?? "No abstract supplied by OpenAlex."}</p>
      </div>

      <details className="provenance-disclosure">
        <summary>More provenance details</summary>
        <dl className="details-list">
          <div><dt>Provider record ID</dt><dd>{source.provider_record_id}</dd></div>
          <div><dt>Source class</dt><dd>{source.source_class}</dd></div>
          <div><dt>Provider updated</dt><dd>{source.provider_updated_at ?? "unknown"}</dd></div>
          <div><dt>Metadata language</dt><dd>{source.language ?? "unknown"}</dd></div>
          <div><dt>Primary topic ID</dt><dd>{source.primary_topic?.provider_record_id ?? "unknown"}</dd></div>
          <div><dt>Primary source ID</dt><dd>{source.primary_location?.source_provider_record_id ?? "unknown"}</dd></div>
          <div><dt>Location version</dt><dd>{source.primary_location?.version ?? "unknown"}</dd></div>
          <div><dt>Location open access</dt><dd>{formatKnownBoolean(source.primary_location?.is_open_access)}</dd></div>
        </dl>
        <div className="authors-block">
          <h4>Authors</h4>
          {source.authors === null ? (
            <p>unknown</p>
          ) : source.authors.length === 0 ? (
            <p>None listed by the provider.</p>
          ) : (
            <ul>
              {source.authors.map((author, index) => (
                <li key={`${author.provider_record_id ?? "unknown"}-${index}`}>
                  {author.display_name ?? "Name unknown"}
                  {author.provider_record_id
                    ? ` (${author.provider_record_id})`
                    : " (provider ID unknown)"}
                  {author.orcid ? ` — ORCID ${author.orcid}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
      </details>

      <div className="card-actions">
        <button
          type="button"
          onClick={() => onAccept(source)}
          disabled={!workspace.mission || isAccepted || !hasCapacity}
        >
          {!workspace.mission
            ? "Set mission before accepting"
            : isAccepted
              ? "Already accepted"
              : !hasCapacity
                ? "Evidence limit reached"
                : "Accept as evidence"}
        </button>
        {providerUrl && <SafeExternalLink href={providerUrl}>View provider record</SafeExternalLink>}
        {locationUrl && locationUrl !== providerUrl && (
          <SafeExternalLink href={locationUrl}>View primary location</SafeExternalLink>
        )}
        {oaUrl && oaUrl !== locationUrl && oaUrl !== providerUrl && (
          <SafeExternalLink href={oaUrl}>View open-access location</SafeExternalLink>
        )}
      </div>
    </section>
  );
}

function ProposalPanel({
  workspace,
  onAccept,
  onReject,
}: {
  workspace: ResearchWorkspaceState;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <section className="workspace-panel" aria-labelledby="proposals-heading">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Agent handoff</p>
          <h2 id="proposals-heading">Agent Proposals ({workspace.proposals.length})</h2>
        </div>
        <span className="agent-chip">Human decision required</span>
      </div>
      {workspace.proposals.length === 0 ? (
        <p className="empty-state">
          Nothing is waiting for review yet. When an agent proposes promising sources,
          they&apos;ll appear here for you to accept or reject. Only accepted sources
          become evidence.
        </p>
      ) : (
        <div className="card-list">
          {workspace.proposals.map((proposal) => (
            <article className="proposal-card" key={proposal.id}>
              <p className="proposal-status">Agent proposed — awaiting human review</p>
              <code className="source-id">{proposal.id}</code>
              <h3>{proposal.source.title ?? "Title unknown"}</h3>
              {proposal.note && <p><strong>Agent note:</strong> {proposal.note}</p>}
              <p className="metadata">
                <span>Provider: {proposal.source.provider}</span>
                <span>Published: {proposal.source.publication_date ?? "unknown"}</span>
                <span>Cited by: {proposal.source.cited_by_count ?? "unknown"}</span>
              </p>
              {proposal.source.abstract && (
                <details>
                  <summary>Inspect provider abstract</summary>
                  <p>{proposal.source.abstract}</p>
                </details>
              )}
              <div className="card-actions">
                <button type="button" onClick={() => onAccept(proposal.id)}>Accept evidence</button>
                <button className="secondary-button" type="button" onClick={() => onReject(proposal.id)}>Reject</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function AcceptedEvidencePanel({
  evidence,
  maximum,
  onRemove,
}: {
  evidence: WorkspaceEvidence[];
  maximum: number;
  onRemove: (id: string) => void;
}) {
  return (
    <section className="workspace-panel" aria-labelledby="accepted-heading">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Human-controlled membership</p>
          <h2 id="accepted-heading">Accepted Evidence ({evidence.length}{maximum ? ` / ${maximum}` : ""})</h2>
        </div>
        <span className="human-chip">Human accepted</span>
      </div>
      {evidence.length === 0 ? (
        <p className="empty-state">No human-accepted evidence yet.</p>
      ) : (
        <div className="card-list">
          {evidence.map((source) => (
            <article className="evidence-card" key={source.id}>
              <code className="source-id">{source.id}</code>
              <h3>{source.title ?? "Title unknown"}</h3>
              <p className="metadata">
                <span>Provider: {source.provider}</span>
                <span>Provider ID: {source.provider_record_id}</span>
                <span>Published: {source.publication_date ?? "unknown"}</span>
                <span>Retrieved: {source.retrieved_at}</span>
              </p>
              <button className="secondary-button" type="button" onClick={() => onRemove(source.id)}>
                Remove accepted evidence
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function BriefPanel({
  brief,
  acceptedEvidence,
  onEdit,
  onReview,
  onApprove,
}: {
  brief: EvidenceBrief | null;
  acceptedEvidence: WorkspaceEvidence[];
  onEdit: (input: unknown) => void;
  onReview: () => void;
  onApprove: () => void;
}) {
  const [copyFeedback, setCopyFeedback] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  async function handleCopyPrompt() {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard API unavailable.");
      }
      await navigator.clipboard.writeText(AGENT_SYNTHESIS_PROMPT);
      setCopyFeedback({ kind: "success", text: "Prompt copied." });
    } catch {
      setCopyFeedback({ kind: "error", text: "Could not copy the prompt." });
    }
  }

  if (!brief) {
    const isReadyForSynthesis = acceptedEvidence.length > 0;

    return (
      <section
        className={`workspace-panel${isReadyForSynthesis ? " handoff-panel" : ""}`}
        aria-labelledby="brief-heading"
      >
        <div className="section-heading">
          <div>
            <p className="section-kicker">Synthesize</p>
            <h2 id="brief-heading">Evidence Brief</h2>
          </div>
        </div>
        {isReadyForSynthesis ? (
          <div className="handoff-state">
            <h3>Ready for agent synthesis</h3>
            <p><strong>Your evidence set is ready. The next move is the agent&apos;s.</strong></p>
            <p>
              Ask your WebMCP-enabled agent to draft the Evidence Brief. The brief can
              cite only the evidence you&apos;ve accepted, and it returns as a draft for
              your review.
            </p>
            <button type="button" onClick={handleCopyPrompt}>
              Copy agent prompt
            </button>
            {copyFeedback && (
              <p
                className={`copy-feedback ${copyFeedback.kind}`}
                role={copyFeedback.kind === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                {copyFeedback.text}
              </p>
            )}
          </div>
        ) : (
          <p className="empty-state">
            No agent draft yet. The agent can draft only after at least one source is
            human-accepted.
          </p>
        )}
      </section>
    );
  }

  function handleEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!brief) {
      return;
    }
    const form = new FormData(event.currentTarget);
    onEdit({
      title: String(form.get("brief-title") ?? ""),
      summary: String(form.get("brief-summary") ?? ""),
      findings: brief.findings.map((_, index) => ({
        statement: String(form.get(`finding-${index}-statement`) ?? ""),
        source_ids: form.getAll(`finding-${index}-sources`).map(String),
      })),
      caveats: String(form.get("brief-caveats") ?? ""),
    });
  }

  const status = brief.approved
    ? "Human approved"
    : brief.human_reviewed
      ? "Human reviewed — approval pending"
      : "Agent draft — human review required";

  return (
    <section className="workspace-panel brief-panel" aria-labelledby="brief-heading">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Synthesize</p>
          <h2 id="brief-heading">Evidence Brief</h2>
        </div>
        <span className={brief.approved ? "approved-chip" : "agent-chip"}>{status}</span>
      </div>
      {!brief.approved && (
        <div className="human-handoff">
          <p>
            <strong>
              The agent wrote the first draft; you control the final result. Edit
              anything that needs changing, mark the brief reviewed once you&apos;ve
              checked it, then approve it. Until you approve it, it remains a draft.
            </strong>
          </p>
          <ol aria-label="Human brief review sequence">
            <li>Edit</li>
            <li>Mark reviewed</li>
            <li>Approve</li>
          </ol>
        </div>
      )}
      <p className="trust-note">
        Based on provider metadata and abstracts, not verified full-text review.
      </p>
      {brief.human_edited && <p className="human-edit-note">Human edits are present.</p>}
      <form className="brief-form" key={brief.updated_at} onSubmit={handleEdit}>
        <div className="field full-field">
          <label htmlFor="brief-title">Title</label>
          <input id="brief-title" name="brief-title" defaultValue={brief.title} maxLength={200} required />
        </div>
        <div className="field full-field">
          <label htmlFor="brief-summary">Summary</label>
          <textarea className="brief-summary" id="brief-summary" name="brief-summary" defaultValue={brief.summary} maxLength={1500} rows={6} required />
        </div>
        <div className="findings-editor">
          <h3>Findings</h3>
          {brief.findings.map((finding, index) => (
            <fieldset className="finding-fieldset" key={`${brief.updated_at}-${index}`}>
              <legend>Finding {index + 1}</legend>
              <div className="field full-field">
                <label htmlFor={`finding-${index}-statement`}>Statement</label>
                <textarea
                  className="finding-statement"
                  id={`finding-${index}-statement`}
                  name={`finding-${index}-statement`}
                  defaultValue={finding.statement}
                  maxLength={1000}
                  rows={3}
                  required
                />
              </div>
              <div className="citation-options">
                <span className="field-label">Accepted evidence citations</span>
                {acceptedEvidence.map((source) => (
                  <label className="citation-option" key={source.id}>
                    <input
                      type="checkbox"
                      name={`finding-${index}-sources`}
                      value={source.id}
                      defaultChecked={finding.source_ids.includes(source.id)}
                    />
                    <span className="citation-copy">
                      <code>{source.id}</code>
                      <span aria-hidden="true"> — </span>
                      <span>{source.title ?? "Title unknown"}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
        <div className="field full-field">
          <label htmlFor="brief-caveats">Caveats</label>
          <textarea className="brief-caveats" id="brief-caveats" name="brief-caveats" defaultValue={brief.caveats} maxLength={1000} rows={5} />
        </div>
        <div className="form-actions">
          <button type="submit">Save human edits</button>
          <button className="secondary-button" type="button" onClick={onReview}>
            {brief.human_reviewed ? "Reviewed" : "Mark reviewed"}
          </button>
          <button type="button" onClick={onApprove} disabled={!brief.human_reviewed || brief.approved}>
            {brief.approved ? "Approved" : "Approve brief"}
          </button>
        </div>
      </form>
    </section>
  );
}

function ActivityPanel({ workspace }: { workspace: ResearchWorkspaceState }) {
  return (
    <section className="workspace-panel" aria-labelledby="activity-heading">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Collaboration trail</p>
          <h2 id="activity-heading">Collaboration log</h2>
        </div>
      </div>
      <p className="section-intro">
        See the human decisions and agent actions that shaped the workspace.
      </p>
      {workspace.activity.length === 0 ? (
        <p className="empty-state">No workspace activity yet.</p>
      ) : (
        <ol className="activity-list">
          {workspace.activity.map((event, index) => (
            <li key={`${event.timestamp}-${event.action}-${event.source_id ?? "none"}-${index}`}>
              <span className={`actor actor-${event.actor}`}>{event.actor}</span>
              <span>{formatActivity(event.action)}</span>
              {event.source_id && <code>{event.source_id}</code>}
              <time dateTime={event.timestamp}>{formatTimestamp(event.timestamp)}</time>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function SafeExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="external-link" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function formatKnownBoolean(value: boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return "unknown";
  }
  return value ? "yes" : "no";
}

function safeExternalUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : null;
  } catch {
    return null;
  }
}

function formatActivity(action: string): string {
  return action.replaceAll("_", " ");
}

function formatTimestamp(timestamp: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

import {
  acceptInspectedEvidence,
  acceptProposal,
  approveEvidenceBrief,
  createEmptyWorkspace,
  draftEvidenceBrief,
  editEvidenceBriefByHuman,
  parsePersistedWorkspace,
  proposeEvidence,
  rejectProposal,
  removeAcceptedEvidence,
  reviewEvidenceBrief,
  setResearchMission,
  type ResearchWorkspaceState,
} from "../domain/workspace.ts";
import type { SourceDetailsRecord } from "../domain/source-record.ts";

export const WORKSPACE_STORAGE_KEY = "webmcp-research-workspace:v1";

export interface WorkspaceStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface WorkspaceStore {
  getSnapshot(): ResearchWorkspaceState;
  getServerSnapshot(): ResearchWorkspaceState;
  subscribe(listener: () => void): () => void;
  setMission(input: unknown): ResearchWorkspaceState;
  proposeEvidence(
    input: unknown,
    resolvedSources: SourceDetailsRecord[],
  ): ResearchWorkspaceState;
  acceptProposal(sourceId: string): ResearchWorkspaceState;
  rejectProposal(sourceId: string): ResearchWorkspaceState;
  acceptInspectedEvidence(source: SourceDetailsRecord): ResearchWorkspaceState;
  removeAcceptedEvidence(sourceId: string): ResearchWorkspaceState;
  draftBrief(input: unknown): ResearchWorkspaceState;
  editBrief(input: unknown): ResearchWorkspaceState;
  reviewBrief(): ResearchWorkspaceState;
  approveBrief(): ResearchWorkspaceState;
  reset(): ResearchWorkspaceState;
}

interface StoreOptions {
  storage?: WorkspaceStorage | null;
  now?: () => string;
}

export function createWorkspaceStore(options: StoreOptions = {}): WorkspaceStore {
  const storage = options.storage === undefined ? browserStorage() : options.storage;
  const now = options.now ?? (() => new Date().toISOString());
  const serverSnapshot = createEmptyWorkspace();
  let state = readInitialState(storage);
  const listeners = new Set<() => void>();

  function commit(next: ResearchWorkspaceState): ResearchWorkspaceState {
    state = next;
    try {
      storage?.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable or quota-limited. The in-page shared state remains usable.
    }
    for (const listener of listeners) {
      listener();
    }
    return state;
  }

  return {
    getSnapshot: () => state,
    getServerSnapshot: () => serverSnapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setMission(input) {
      return commit(setResearchMission(state, input, now()));
    },
    proposeEvidence(input, resolvedSources) {
      return commit(proposeEvidence(state, input, resolvedSources, now()));
    },
    acceptProposal(sourceId) {
      return commit(acceptProposal(state, sourceId, now()));
    },
    rejectProposal(sourceId) {
      return commit(rejectProposal(state, sourceId, now()));
    },
    acceptInspectedEvidence(source) {
      return commit(acceptInspectedEvidence(state, source, now()));
    },
    removeAcceptedEvidence(sourceId) {
      return commit(removeAcceptedEvidence(state, sourceId, now()));
    },
    draftBrief(input) {
      return commit(draftEvidenceBrief(state, input, now()));
    },
    editBrief(input) {
      return commit(editEvidenceBriefByHuman(state, input, now()));
    },
    reviewBrief() {
      return commit(reviewEvidenceBrief(state, now()));
    },
    approveBrief() {
      return commit(approveEvidenceBrief(state, now()));
    },
    reset() {
      state = createEmptyWorkspace();
      try {
        storage?.removeItem(WORKSPACE_STORAGE_KEY);
      } catch {
        // Reset is deterministic in memory even if browser storage is unavailable.
      }
      for (const listener of listeners) {
        listener();
      }
      return state;
    },
  };
}

function browserStorage(): WorkspaceStorage | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function readInitialState(storage: WorkspaceStorage | null): ResearchWorkspaceState {
  if (!storage) {
    return createEmptyWorkspace();
  }
  try {
    const raw = storage.getItem(WORKSPACE_STORAGE_KEY);
    if (raw === null) {
      return createEmptyWorkspace();
    }
    return parsePersistedWorkspace(JSON.parse(raw));
  } catch {
    try {
      storage.removeItem(WORKSPACE_STORAGE_KEY);
    } catch {
      // An unreadable store still falls back to a safe empty workspace.
    }
    return createEmptyWorkspace();
  }
}

export const workspaceStore = createWorkspaceStore();

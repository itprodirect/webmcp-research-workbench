export const WEBMCP_ACTIVITY_TOOLS = [
  { name: "get_research_workspace", label: "Workspace read" },
  { name: "search_sources", label: "OpenAlex discovery" },
  { name: "get_source_details", label: "Candidate inspection" },
  { name: "propose_evidence", label: "Evidence proposal" },
  { name: "draft_evidence_brief", label: "Brief synthesis" },
] as const;

export type WebMcpActivityToolName = (typeof WEBMCP_ACTIVITY_TOOLS)[number]["name"];
export type WebMcpActivityStatus = "unused" | "running" | "succeeded" | "failed";

export type WebMcpActivityEntry = {
  name: WebMcpActivityToolName;
  label: string;
  status: WebMcpActivityStatus;
  invocationCount: number;
};

export type WebMcpActivitySnapshot = readonly WebMcpActivityEntry[];

export interface WebMcpActivityStore {
  subscribe(listener: () => void): () => void;
  getSnapshot(): WebMcpActivitySnapshot;
  getServerSnapshot(): WebMcpActivitySnapshot;
  start(name: WebMcpActivityToolName): void;
  succeed(name: WebMcpActivityToolName): void;
  fail(name: WebMcpActivityToolName): void;
}

type InternalActivityEntry = WebMcpActivityEntry & {
  activeCount: number;
};

const INITIAL_SNAPSHOT: WebMcpActivitySnapshot = WEBMCP_ACTIVITY_TOOLS.map(
  ({ name, label }) => ({
    name,
    label,
    status: "unused",
    invocationCount: 0,
  }),
);

export function createWebMcpActivityStore(): WebMcpActivityStore {
  let entries: InternalActivityEntry[] = INITIAL_SNAPSHOT.map((entry) => ({
    ...entry,
    activeCount: 0,
  }));
  let snapshot: WebMcpActivitySnapshot = INITIAL_SNAPSHOT;
  const listeners = new Set<() => void>();

  function publish() {
    snapshot = entries.map((entry) => ({
      name: entry.name,
      label: entry.label,
      status: entry.status,
      invocationCount: entry.invocationCount,
    }));
    for (const listener of listeners) {
      listener();
    }
  }

  function update(
    name: WebMcpActivityToolName,
    transform: (entry: InternalActivityEntry) => InternalActivityEntry,
  ) {
    entries = entries.map((entry) => (entry.name === name ? transform(entry) : entry));
    publish();
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot() {
      return snapshot;
    },
    getServerSnapshot() {
      return INITIAL_SNAPSHOT;
    },
    start(name) {
      update(name, (entry) => ({
        ...entry,
        status: "running",
        invocationCount: entry.invocationCount + 1,
        activeCount: entry.activeCount + 1,
      }));
    },
    succeed(name) {
      update(name, (entry) => {
        const activeCount = Math.max(0, entry.activeCount - 1);
        return {
          ...entry,
          activeCount,
          status: activeCount > 0 ? "running" : "succeeded",
        };
      });
    },
    fail(name) {
      update(name, (entry) => {
        const activeCount = Math.max(0, entry.activeCount - 1);
        return {
          ...entry,
          activeCount,
          status: activeCount > 0 ? "running" : "failed",
        };
      });
    },
  };
}

export const webMcpActivityStore = createWebMcpActivityStore();

export function instrumentWebMcpTools(
  tools: WebMCP.ModelContextTool[],
  activityStore: WebMcpActivityStore = webMcpActivityStore,
): WebMCP.ModelContextTool[] {
  return tools.map((tool) => {
    const name = getAuthorizedToolName(tool.name);
    const execute = tool.execute;

    return {
      ...tool,
      execute: async (input, context) => {
        activityStore.start(name);
        try {
          const result = await execute(input, context);
          activityStore.succeed(name);
          return result;
        } catch (error) {
          activityStore.fail(name);
          throw error;
        }
      },
    };
  });
}

function getAuthorizedToolName(name: string): WebMcpActivityToolName {
  const match = WEBMCP_ACTIVITY_TOOLS.find((tool) => tool.name === name);
  if (!match) {
    throw new Error(`Cannot instrument unauthorized WebMCP tool: ${name}`);
  }
  return match.name;
}

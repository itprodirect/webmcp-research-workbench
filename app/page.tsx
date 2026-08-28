import { SearchWorkbench } from "./components/search-workbench";
import { WebMcpRegistration } from "./components/webmcp-registration";

export default function Home() {
  return (
    <main>
      <header className="page-header">
        <p className="eyebrow">Phase 2B · Shared Evidence Mission</p>
        <h1>WebMCP Research Workbench</h1>
        <p className="lede">
          Define the mission, inspect real OpenAlex evidence, review agent proposals,
          and approve a source-linked brief. The agent accelerates discovery and
          synthesis; you control evidence membership and conclusions.
        </p>
        <p className="header-boundary">
          Shared state · human-authorized evidence · no DOM automation
        </p>
      </header>
      <SearchWorkbench />
      <WebMcpRegistration />
    </main>
  );
}

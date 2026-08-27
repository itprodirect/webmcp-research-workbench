import { SearchWorkbench } from "./components/search-workbench";
import { WebMcpRegistration } from "./components/webmcp-registration";

export default function Home() {
  return (
    <main>
      <header className="page-header">
        <p className="eyebrow">Phase 2A Inspect + Curate</p>
        <h1>WebMCP Research Workbench</h1>
        <p className="lede">
          Search and inspect real OpenAlex records through the same server capabilities
          used by the read-only WebMCP tools. You decide which inspected sources belong
          in the in-memory research packet.
        </p>
      </header>
      <SearchWorkbench />
      <WebMcpRegistration />
    </main>
  );
}

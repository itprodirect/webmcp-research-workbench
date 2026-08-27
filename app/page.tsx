import { SearchWorkbench } from "./components/search-workbench";
import { WebMcpRegistration } from "./components/webmcp-registration";

export default function Home() {
  return (
    <main>
      <header className="page-header">
        <p className="eyebrow">Phase 1 Technical Gate</p>
        <h1>WebMCP Research Workbench</h1>
        <p className="lede">
          Search real OpenAlex records through the same server capability used by
          the read-only <code>search_sources</code> WebMCP tool.
        </p>
      </header>
      <SearchWorkbench />
      <WebMcpRegistration />
    </main>
  );
}

import { SearchWorkbench } from "./components/search-workbench";
import { WebMcpRegistration } from "./components/webmcp-registration";

export default function Home() {
  return (
    <main>
      <header className="page-header">
        <p className="eyebrow">Human-directed research · Agent-accelerated</p>
        <p className="product-name">Three in the Loop</p>
        <p className="product-descriptor">A WebMCP Research Workbench</p>
        <h1>The agent gathers. You decide what counts.</h1>
        <p className="lede">
          <span className="lede-emphasis">
            You, your agent, and the website working together.
          </span>{" "}
          Through WebMCP, your agent searches real scholarly sources, proposes evidence,
          and drafts a cited brief. You control what counts as evidence and what gets
          approved.
        </p>
        <p className="header-boundary">
          Real OpenAlex research · human-controlled evidence · source-linked conclusions
        </p>
      </header>

      <SearchWorkbench />
      <WebMcpRegistration />
    </main>
  );
}

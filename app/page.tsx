import { SearchWorkbench } from "./components/search-workbench";
import { WebMcpRegistration } from "./components/webmcp-registration";

export default function Home() {
  return (
    <main>
      <header className="page-header">
        <p className="eyebrow">Human-directed research · Agent-accelerated</p>
        <p className="product-name">WebMCP Research Workbench</p>
        <h1>The agent gathers. You decide what counts.</h1>
        <p className="lede">
          A shared research workspace where a WebMCP-enabled agent searches real
          scholarly sources, proposes evidence, and drafts a cited brief — while you
          control what counts as evidence and what gets approved.
        </p>
        <p className="header-boundary">
          Real OpenAlex research · human-controlled evidence · source-linked conclusions
        </p>
      </header>

      <section className="workflow-panel" aria-labelledby="workflow-heading">
        <div className="compact-section-heading">
          <p className="section-kicker">The shared workflow</p>
          <h2 id="workflow-heading">From question to approved brief</h2>
        </div>
        <ol className="workflow-steps">
          <li>
            <span className="workflow-actor workflow-human">You</span>
            <strong>Define the mission</strong>
          </li>
          <li>
            <span className="workflow-actor workflow-agent">Agent</span>
            <strong>Researches sources</strong>
          </li>
          <li>
            <span className="workflow-actor workflow-human">You</span>
            <strong>Accept the evidence</strong>
          </li>
          <li>
            <span className="workflow-actor workflow-agent">Agent</span>
            <strong>Drafts the brief</strong>
          </li>
          <li>
            <span className="workflow-actor workflow-human">You</span>
            <strong>Review &amp; approve</strong>
          </li>
        </ol>
      </section>

      <section className="roles-panel" aria-labelledby="roles-heading">
        <div className="compact-section-heading">
          <p className="section-kicker">Who does what</p>
          <h2 id="roles-heading">Human judgment, agent acceleration</h2>
        </div>
        <div className="role-grid">
          <article className="role-card role-human">
            <h3>Human</h3>
            <p>
              Set the research question, decide which sources become evidence, edit
              the draft, review it, and give final approval.
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

      <SearchWorkbench />
      <WebMcpRegistration />
    </main>
  );
}

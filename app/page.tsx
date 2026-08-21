"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  learningResources,
  projectIdeas,
  resources,
  statusLabels,
  timelineEvents,
  workflows,
  type Resource,
  type ResourceStatus,
  type TimelineEvent,
} from "./resource-data";

const preziUrl =
  "https://prezi.com/view/hA7y76syYIEjPvflo1nh/?referral_token=PsDn3ylnB3FN";

const statusOptions: Array<{ value: "all" | ResourceStatus; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "verified", label: "Verified" },
  { value: "tad-built", label: "TAD-built" },
  { value: "review", label: "Emerging" },
];

const categoryCodes: Record<string, string> = {
  Illustration: "IL",
  "Animation & Video": "AV",
  "Motion Graphics": "MG",
  "3D & CAD": "3D",
  "Apps & Games": "AG",
  Audio: "AU",
  "Graphic Design": "GD",
  "Research & Learning": "RL",
  "Responsible Practice": "RP",
};

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18">
      <path d="M4 10h11M10.5 4.5 16 10l-5.5 5.5" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16">
      <path d="M7 5h8v8M15 5l-9 9M14 11v4H5V6h4" />
    </svg>
  );
}

function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  const categoryClass = resource.category.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and");
  return (
    <article className={`resource-card category-${categoryClass}`}>
      <div className="resource-card-top">
        <span className="resource-glyph" aria-hidden="true">
          {categoryCodes[resource.category] ?? String(index + 1).padStart(2, "0")}
        </span>
        <span className={`status-badge status-${resource.status}`}>
          <i className={`status-dot ${resource.status}`} />
          {statusLabels[resource.status]}
        </span>
      </div>
      <p className="resource-category">{resource.category}</p>
      <h3>{resource.name}</h3>
      <p className="resource-summary">{resource.summary}</p>
      {resource.note && <p className="resource-note">{resource.note}</p>}
      <div className="tag-list" aria-label="Tags">
        {resource.tags.slice(0, 4).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="resource-actions">
        <a href={resource.url} target="_blank" rel="noreferrer">
          Open resource <ExternalIcon />
        </a>
        {resource.exampleUrl && resource.exampleUrl !== resource.url && (
          <a className="example-link" href={resource.exampleUrl} target="_blank" rel="noreferrer">
            Example ↗
          </a>
        )}
      </div>
    </article>
  );
}

const timelineEraOptions = [
  "All eras",
  "Foundations",
  "Breakthroughs",
  "Generative AI",
  "Governance & culture",
] as const;

type TimelineEraOption = (typeof timelineEraOptions)[number];

function TimelineSources({ event }: { event: TimelineEvent }) {
  return (
    <div className="timeline-sources" aria-label={`Sources for ${event.title}`}>
      {event.sources.map((source) => (
        <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
          {source.label} <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}

function TimelineExplorer() {
  const [mode, setMode] = useState<"2d" | "3d">("2d");
  const [era, setEra] = useState<TimelineEraOption>("All eras");
  const [activeId, setActiveId] = useState(timelineEvents.at(-1)?.id ?? timelineEvents[0].id);

  const visibleTimeline = useMemo(
    () => timelineEvents.filter((event) => era === "All eras" || event.era === era),
    [era],
  );

  const foundIndex = visibleTimeline.findIndex((event) => event.id === activeId);
  const activeIndex = foundIndex >= 0 ? foundIndex : 0;
  const activeEvent = visibleTimeline[activeIndex];

  const chooseEra = (nextEra: TimelineEraOption) => {
    const firstMatch = timelineEvents.find(
      (event) => nextEra === "All eras" || event.era === nextEra,
    );
    setEra(nextEra);
    if (firstMatch) setActiveId(firstMatch.id);
  };

  const moveActive = (direction: -1 | 1) => {
    const nextIndex = Math.min(
      visibleTimeline.length - 1,
      Math.max(0, activeIndex + direction),
    );
    setActiveId(visibleTimeline[nextIndex].id);
  };

  return (
    <div className="timeline-explorer">
      <div className="timeline-toolbar">
        <div className="timeline-view-toggle" aria-label="Timeline view">
          <button type="button" aria-pressed={mode === "2d"} onClick={() => setMode("2d")}>
            <span aria-hidden="true">▤</span> 2D timeline
          </button>
          <button type="button" aria-pressed={mode === "3d"} onClick={() => setMode("3d")}>
            <span aria-hidden="true">◇</span> 3D timeline
          </button>
        </div>
        <div className="timeline-era-filter" aria-label="Filter timeline by era">
          {timelineEraOptions.map((option) => (
            <button
              type="button"
              aria-pressed={era === option}
              onClick={() => chooseEra(option)}
              key={option}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {mode === "2d" ? (
        <div className="timeline-2d-shell">
          <ol className="timeline-2d-track" aria-label="AI history events">
            {visibleTimeline.map((event) => (
              <li key={event.id}>
                <span className="timeline-node" aria-hidden="true" />
                <article>
                  <div className="timeline-card-heading">
                    <span>{event.year}</span>
                    <p>{event.era}</p>
                  </div>
                  <small>{event.date}</small>
                  <h3>{event.title}</h3>
                  <p>{event.summary}</p>
                  <div className="timeline-significance">
                    <b>Why it matters</b>
                    <span>{event.significance}</span>
                  </div>
                  <TimelineSources event={event} />
                </article>
              </li>
            ))}
          </ol>
          <p className="timeline-scroll-cue">Scroll through history →</p>
        </div>
      ) : (
        <div className="timeline-3d-shell">
          <div className="timeline-3d-controls">
            <button
              type="button"
              onClick={() => moveActive(-1)}
              disabled={activeIndex === 0}
              aria-label="Previous timeline event"
            >
              ← Previous
            </button>
            <p aria-live="polite">
              <b>{String(activeIndex + 1).padStart(2, "0")}</b>
              <span> / {String(visibleTimeline.length).padStart(2, "0")}</span>
            </p>
            <button
              type="button"
              onClick={() => moveActive(1)}
              disabled={activeIndex === visibleTimeline.length - 1}
              aria-label="Next timeline event"
            >
              Next →
            </button>
          </div>

          <div className="timeline-3d-stage" aria-label="Three-dimensional AI history view">
            {visibleTimeline.map((event, index) => {
              const offset = index - activeIndex;
              const depth = Math.abs(offset);
              if (depth > 2) return null;
              const style = {
                "--timeline-shift": `${offset * 48}%`,
                "--timeline-z": `${depth * -180}px`,
                "--timeline-y": `${depth * 18}px`,
                "--timeline-rotate": `${offset * -11}deg`,
                "--timeline-scale": 1 - depth * 0.12,
                "--timeline-opacity": 1 - depth * 0.3,
                zIndex: 10 - depth,
              } as CSSProperties;
              return (
                <article
                  className={`timeline-3d-card${offset === 0 ? " is-active" : ""}`}
                  style={style}
                  aria-hidden={offset !== 0}
                  key={event.id}
                >
                  <button
                    type="button"
                    onClick={() => setActiveId(event.id)}
                    tabIndex={offset === 0 ? 0 : -1}
                    aria-label={`Select ${event.date}: ${event.title}`}
                  >
                    <span>{event.year}</span>
                    <small>{event.era}</small>
                    <b>{event.title}</b>
                  </button>
                  {offset === 0 && (
                    <div className="timeline-3d-detail">
                      <p>{event.date}</p>
                      <h3>{event.title}</h3>
                      <p>{event.summary}</p>
                      <div className="timeline-significance">
                        <b>Why it matters</b>
                        <span>{event.significance}</span>
                      </div>
                      <TimelineSources event={event} />
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="timeline-year-jump" aria-label="Jump to a timeline event">
            {visibleTimeline.map((event) => (
              <button
                type="button"
                aria-pressed={activeEvent.id === event.id}
                onClick={() => setActiveId(event.id)}
                key={event.id}
              >
                {event.year}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="timeline-update-note">
        <b>Built to grow:</b> send a date, title, explanation, and credible source.
        New entries are added directly to this maintained timeline.
      </p>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<"all" | ResourceStatus>("all");

  const categories = useMemo(
    () => Array.from(new Set(resources.map((resource) => resource.category))),
    [],
  );

  const visibleResources = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesQuery =
        !normalized ||
        [resource.name, resource.category, resource.summary, resource.note ?? "", ...resource.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      const matchesCategory = category === "all" || resource.category === category;
      const matchesStatus = status === "all" || resource.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [category, query, status]);

  const verifiedCount = resources.filter((resource) => resource.status === "verified").length;
  const builtCount = resources.filter((resource) => resource.status === "tad-built").length;

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setStatus("all");
  };

  return (
    <main>
      <section className="hero" id="top">
        <div className="circuit-pattern" aria-hidden="true" />
        <nav className="site-nav" aria-label="Main navigation">
          <a className="brand-lockup" href="#top" aria-label="TAD AI Resource Hub home">
            <img src="./ai-tad-logo.png" alt="" />
            <span>Resource Hub</span>
          </a>
          <div className="nav-links">
            <a href="#directory">Directory</a>
            <a href="#workflows">Workflows</a>
            <a href="#projects">Projects</a>
            <a href="#timeline">Timeline</a>
            <a href="#learn">Learn</a>
            <a href="#verification">Verification</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">School of Technology, Art &amp; Design</p>
            <h1>
              Tools that <span>change the work.</span>
            </h1>
            <p className="hero-lede">
              A field guide to AI tools, creative workflows, project ideas, and
              critical resources for TAD students and faculty.
            </p>
            <div className="hero-control-row">
              <div className="hero-actions">
                <a className="button button-primary" href="#directory">
                  Browse verified tools <ArrowIcon />
                </a>
                <a
                  className="button button-ghost"
                  href={preziUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open TADD 2310 Prezi <span aria-hidden="true">↗</span>
                </a>
              </div>

              <div className="status-strip" aria-label="Resource status key">
                <span><i className="status-dot verified" /> Verified</span>
                <span><i className="status-dot tad-built" /> TAD-built</span>
                <span><i className="status-dot review" /> Emerging</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-identity-card">
              <img
                className="hero-logo"
                src="./ai-tad-logo.png"
                alt="TAD AI logo"
              />
              <nav className="hero-identity-meta" aria-label="Resource hub focus">
                <a href="#directory">Verified tools</a>
                <a href="#workflows">Creative workflows</a>
                <a href="#learn">Critical resources</a>
              </nav>
            </div>
          </div>
        </div>

        <div className="hero-footer">
          <p>
            <b>Verified</b> identifies a high-quality, robust tool for its stated
            workflow—not blanket ethical or institutional endorsement.
          </p>
          <span aria-hidden="true">SCROLL ↓</span>
        </div>
      </section>

      <section className="signal-band" aria-label="Collection overview">
        <div><b>{verifiedCount}</b><span>Verified tools</span></div>
        <div><b>{builtCount}</b><span>TAD-built workflows</span></div>
        <div><b>{categories.length}</b><span>Creative domains</span></div>
        <div><b>{resources.length}</b><span>Structured resources</span></div>
      </section>

      <section className="content-section directory-section" id="directory">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">01 / Tool directory</p>
            <h2>Find the right tool for the task.</h2>
          </div>
          <p>
            Start with the workflow—not the novelty. Search by task, filter by
            domain, and check the status before committing time, money, or work.
          </p>
        </div>

        <div className="filter-panel">
          <label className="search-field">
            <span className="sr-only">Search tools and resources</span>
            <svg aria-hidden="true" viewBox="0 0 20 20" width="20" height="20">
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="m13 13 4 4" />
            </svg>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tools, tasks, or tags…"
            />
          </label>
          <label>
            <span className="sr-only">Filter by creative domain</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">All creative domains</option>
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Filter by review status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as "all" | ResourceStatus)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="results-meta">
          <p><b>{visibleResources.length}</b> resources shown · Curated August 2026</p>
          {(query || category !== "all" || status !== "all") && (
            <button type="button" onClick={resetFilters}>Clear filters</button>
          )}
        </div>

        {visibleResources.length > 0 ? (
          <div className="resource-grid">
            {visibleResources.map((resource, index) => (
              <ResourceCard key={resource.name} resource={resource} index={index} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>00</span>
            <h3>No exact match.</h3>
            <p>Try a broader task, a different domain, or clear the filters.</p>
            <button type="button" onClick={resetFilters}>Reset directory</button>
          </div>
        )}
      </section>

      <section className="workflow-section" id="workflows">
        <div className="workflow-inner">
          <div className="section-heading inverse">
            <div>
              <p className="eyebrow">02 / Workflow maps</p>
              <h2>Build a process, not a prompt.</h2>
            </div>
            <p>
              The useful unit is the whole chain: source material, generation,
              human revision, testing, documentation, and final responsibility.
            </p>
          </div>

          <div className="workflow-list">
            {workflows.map((workflow) => (
              <article className="workflow-card" key={workflow.number}>
                <div className="workflow-title">
                  <span>{workflow.number}</span>
                  <div>
                    <p>{workflow.category}</p>
                    <h3>{workflow.title}</h3>
                  </div>
                </div>
                <ol>
                  {workflow.steps.map((step) => <li key={step}>{step}</li>)}
                </ol>
                <p className="workflow-tools"><b>Working set:</b> {workflow.tools.join(" · ")}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section project-section" id="projects">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">03 / Project sparks</p>
            <h2>Make something that tests the claim.</h2>
          </div>
          <p>
            These ideas come from the course planning workbook. Each one is a
            vehicle for testing where AI helps, where it fails, and what the maker contributes.
          </p>
        </div>
        <div className="project-grid">
          {projectIdeas.map((project, index) => (
            <article key={project.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{project.domain}</p>
              <h3>{project.title}</h3>
              <small>{project.format}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="timeline-section" id="timeline">
        <div className="content-section">
          <div className="section-heading inverse timeline-heading">
            <div>
              <p className="eyebrow">04 / AI timeline</p>
              <h2>History changes the view.</h2>
            </div>
            <p>
              Move between a clear chronological map and a spatial view that
              brings one turning point forward at a time. Each entry links to
              the strongest available source and separates evidence from interpretation.
            </p>
          </div>
          <TimelineExplorer />
        </div>
      </section>

      <section className="learn-section" id="learn">
        <div className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark">05 / Learn + question</p>
              <h2>Context belongs in the workflow.</h2>
            </div>
            <p>
              Technical capability is only one layer. Use these course, legal,
              historical, and critical resources to examine authorship, judgment,
              accountability, and impact.
            </p>
          </div>
          <div className="learning-grid">
            {learningResources.map((item, index) => (
              <a href={item.url} target="_blank" rel="noreferrer" key={item.title}>
                <span className="learning-index">{String(index + 1).padStart(2, "0")}</span>
                <p>{item.type}</p>
                <h3>{item.title}</h3>
                <span className="learning-summary">{item.summary}</span>
                <b>Open resource <ExternalIcon /></b>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="verification-section" id="verification">
        <div className="verification-grid">
          <div className="verification-intro">
            <p className="eyebrow">06 / Verification standard</p>
            <h2>Verified is a working claim.</h2>
            <p>
              It means the current evidence supports a tool as high-quality,
              robust, and repeatable for a specific professional task. It does not
              mean the tool is accurate in every context, ethically neutral,
              institutionally approved, secure for every file, or superior to
              non-AI methods.
            </p>
            <p className="verification-date">Current curation review · August 2026</p>
            <div className="verification-legend">
              <span><i className="status-dot verified" /><b>Verified</b> High-quality, repeatable use</span>
              <span><i className="status-dot tad-built" /><b>TAD-built</b> Local workflow or tutorial</span>
              <span><i className="status-dot review" /><b>Emerging</b> Promising, still changing or not yet proven enough to call standard</span>
            </div>
          </div>
          <div className="verification-checks">
            <article><span>1</span><div><h3>Does it work?</h3><p>Test a real task more than once and record where it succeeds or breaks.</p></div></article>
            <article><span>2</span><div><h3>Does it improve the workflow?</h3><p>Compare time, quality, control, editability, and learning—not just surprise.</p></div></article>
            <article><span>3</span><div><h3>Can we use it responsibly?</h3><p>Check terms, privacy, consent, authorship, access, cost, and environmental burden.</p></div></article>
            <article><span>4</span><div><h3>Can others reproduce it?</h3><p>Document inputs, settings, human decisions, revisions, failures, and final use.</p></div></article>
          </div>
        </div>
      </section>

      <section className="brand-section" id="brand">
        <div className="content-section brand-grid">
          <div>
            <p className="eyebrow dark">Logo-derived identity</p>
            <h2>A system built from signal and structure.</h2>
            <p>
              Deep pine creates the field; signal green marks action and verified
              status; gold highlights history and human judgment; cyan and coral
              separate technical and critical layers. Condensed display type and
              circuit geometry connect the app directly to the supplied TAD AI logo.
            </p>
          </div>
          <div className="swatches" aria-label="App color palette">
            <span style={{ background: "#04271f" }}><b>Deep pine</b>#04271F</span>
            <span style={{ background: "#00efad", color: "#04271f" }}><b>Signal green</b>#00EFAD</span>
            <span style={{ background: "#f7c83e", color: "#281d00" }}><b>Warm gold</b>#F7C83E</span>
            <span style={{ background: "#2aaac4", color: "#032f3a" }}><b>Technical cyan</b>#2AAAC4</span>
            <span style={{ background: "#ea4d2f" }}><b>Critical coral</b>#EA4D2F</span>
          </div>
        </div>
      </section>

      <footer>
        <a className="brand-lockup footer-brand" href="#top">
          <img src="./ai-tad-logo.png" alt="TAD AI" />
          <span>Resource Hub</span>
        </a>
        <p>Created and directed by Eric Carlson · School of Technology, Art &amp; Design · Bemidji State University</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}

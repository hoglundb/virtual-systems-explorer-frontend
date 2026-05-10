import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

let sessionBooted = false;

const isTouchOnly = () =>
  window.matchMedia("(pointer: coarse) and (hover: none)").matches;

function TouchWarningModal({ path, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p className="modal-index">// WARNING</p>
        <h2 className="modal-title">Touch Device Detected</h2>
        <p className="modal-body">
          This experience is designed for mouse and keyboard interaction.
          Touch devices may have limited or non-existent functionality.
        </p>
        <div className="modal-actions">
          <button className="modal-btn modal-btn-cancel" onClick={onCancel}>Go Back</button>
          <button className="modal-btn modal-btn-confirm" onClick={onConfirm}>Proceed Anyway</button>
        </div>
      </div>
    </div>
  );
}

const PROJECTS = [
  {
    index: "01",
    slug: "viewer",
    status: "live",
    statusLabel: "LIVE — PROTOTYPE",
    title: ["Virtual Systems", "Explorer"],
    subtitle: "Interactive 3D Assembly Explorer",
    desc: "A Unity WebGL environment where users explore, disassemble, and identify every component of a mechanical assembly — down to individual nuts and bolts. Part metadata displayed on selection.",
    tags: ["Unity WebGL", "3D Interaction", "Parts Catalog"],
    cta: "Enter Viewer",
    deco: "3D",
    path: "/viewer",
  },
  {
    index: "02",
    slug: "procedures",
    status: "dev",
    statusLabel: "IN DEVELOPMENT",
    disabled: true,
    title: ["Hydrostatic", "Test Tank"],
    subtitle: "Interactive Maintenance Platform",
    desc: "Step-by-step guided maintenance workflows for complex equipment. Safety interlocks, configurable parameters, and operator familiarization tools built for certification training.",
    tags: ["Unity WebGL", "Simulation", "Safety Procedures", "Certification"],
    cta: "Enter Procedures",
    deco: "SOP",
    path: "/procedures",
  },
];

const POSTS = [
  {
    date: "MAY\n2025",
    cat: "tech-art",
    catLabel: "TECH ART",
    title: "Optimizing 1,200-Part Motorcycle Meshes for WebGL",
    excerpt: "Getting a fully-disassembled motorcycle to run at 60fps in a browser means aggressive LOD strategies, texture atlasing, and draw-call budgeting. Here's the workflow we landed on after a lot of trial and error.",
  },
  {
    date: "APR\n2025",
    cat: "game-dev",
    catLabel: "GAME DEV",
    title: "Building a Part-Selection System with Unity's New Input System",
    excerpt: "Click-to-select sounds simple. With nested part hierarchies, overlapping colliders, and camera raycasting through glass — it isn't. This post covers the architecture we built to handle it cleanly.",
  },
  {
    date: "MAR\n2025",
    cat: "systems",
    catLabel: "SYSTEMS",
    title: "Why We Chose Unity WebGL Over Unreal's Pixel Streaming",
    excerpt: "Both paths can deliver 3D in a browser. The tradeoffs between local render in WebGL versus server-side pixel streaming shaped everything: cost, latency, offline capability, and deployment simplicity.",
  },
  {
    date: "FEB\n2025",
    cat: "tech-art",
    catLabel: "TECH ART",
    title: "Creating the Explode-View Animation Rig",
    excerpt: "The explode view — where each part separates outward from the assembly — required a custom rig and scripted offsets rather than hand-keyed animation. Here's how we made it work at runtime for any part subset.",
  },
];

const FILTERS = [
  { key: "all", label: "All Posts" },
  { key: "game-dev", label: "Game Development" },
  { key: "tech-art", label: "Technical Art" },
  { key: "systems", label: "Systems Design" },
];

function BootScreen({ onDone }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let n = 0;
    const tick = setInterval(() => {
      n = Math.min(n + Math.floor(Math.random() * 8 + 3), 100);
      setPct(n);
      if (n >= 100) {
        clearInterval(tick);
        setTimeout(onDone, 400);
      }
    }, 60);
    return () => clearInterval(tick);
  }, [onDone]);

  return (
    <div className="boot">
      <div>
        <div className="boot-wordmark">VIXTRION</div>
        <p className="boot-sub">Interactive Systems Portfolio</p>
      </div>
      <ul className="boot-log" aria-hidden="true">
        <li>Initializing asset registry...</li>
        <li>Mounting project modules...</li>
        <li>Establishing operator session...</li>
        <li>System ready.</li>
      </ul>
      <div className="boot-bar-wrap">
        <div className="boot-bar-label">
          <span>Loading</span>
          <span>{pct}%</span>
        </div>
        <div className="boot-bar">
          <div className="boot-bar-fill" />
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, onEnter }) {
  return (
    <div
      className={`project-card${project.disabled ? " project-card--disabled" : ""}`}
      onClick={() => !project.disabled && onEnter(project.path)}
      role={project.disabled ? undefined : "link"}
      tabIndex={project.disabled ? -1 : 0}
      onKeyDown={e => !project.disabled && e.key === "Enter" && onEnter(project.path)}
      aria-label={`${project.title.join(" ")} — ${project.subtitle}`}
    >
      <p className="card-index">{project.index} / {project.slug.toUpperCase()}</p>
      <span className={`card-status ${project.status}`}>{project.statusLabel}</span>
      <h2 className="card-title">{project.title[0]}<br />{project.title[1]}</h2>
      <p className="card-subtitle">{project.subtitle}</p>
      <p className="card-desc">{project.desc}</p>
      <div className="card-tags">
        {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
      <span className={`card-cta${project.disabled ? " card-cta--disabled" : ""}`}>{project.disabled ? "Coming Soon" : project.cta}</span>
      <div className="card-deco" aria-hidden="true">{project.deco}</div>
    </div>
  );
}

function DevLog() {
  const [activeFilter, setActiveFilter] = useState("all");

  const visible = POSTS.filter(p => activeFilter === "all" || p.cat === activeFilter);

  return (
    <section className="devlog" id="devlog" aria-labelledby="devlog-heading">
      <div className="devlog-grid">
        <div className="devlog-sidebar">
          <div className="section-label">Build Notes</div>
          <h2 className="devlog-title" id="devlog-heading">Dev Log</h2>
          <p className="devlog-intro">
            Notes from the build — written from two perspectives: a game developer's and a technical artist's.
            How the platforms were made, what broke, and what we learned.
          </p>
          <div className="devlog-filter" role="tablist" aria-label="Filter posts by category">
            {FILTERS.map(f => (
              <button
                key={f.key}
                className={`filter-btn${activeFilter === f.key ? " active" : ""}`}
                onClick={() => setActiveFilter(f.key)}
                role="tab"
                aria-selected={activeFilter === f.key}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="posts" aria-label="Blog posts">
          {visible.map((post, i) => (
            <article key={i} className="post">
              <div className="post-meta">
                <p className="post-date">{post.date.split("\n")[0]}<br />{post.date.split("\n")[1]}</p>
                <span className="post-cat">{post.catLabel}</span>
              </div>
              <div className="post-body">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{post.excerpt}</p>
                <span className="post-link" role="button" tabIndex={0}>Read Note →</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Home() {
  const [booted, setBooted] = useState(sessionBooted);
  const [scrolled, setScrolled] = useState(false);
  const [touchWarning, setTouchWarning] = useState(null);

  const handleBoot = () => {
    sessionBooted = true;
    setBooted(true);
  };

  const handleEnter = (path) => {
    if (isTouchOnly()) {
      setTouchWarning(path);
    } else {
      window.open(path, "_blank");
    }
  };

  useEffect(() => {
    document.body.classList.add("landing");
    return () => document.body.classList.remove("landing");
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const projects = document.getElementById("projects");
      const threshold = projects ? projects.offsetTop - window.innerHeight + 60 : 20;
      setScrolled(window.scrollY > Math.max(threshold, 20));
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {!booted && <BootScreen onDone={handleBoot} />}
      {touchWarning && (
        <TouchWarningModal
          path={touchWarning}
          onConfirm={() => { window.open(touchWarning, "_blank"); setTouchWarning(null); }}
          onCancel={() => setTouchWarning(null)}
        />
      )}
      <div className={`home-main${booted ? " visible" : ""}`}>

        <nav>
          <a href="#" className="nav-logo">VIX<span>T</span>RION</a>
          <ul className="nav-links">
            <li><a href="#projects" onClick={e => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }}>Projects</a></li>
            <li><a href="#devlog" onClick={e => { e.preventDefault(); document.getElementById("devlog")?.scrollIntoView({ behavior: "smooth" }); }}>Dev Log</a></li>
          </ul>
          <div className="nav-status">PROTOTYPE BUILD</div>
        </nav>

        <section className="hero" aria-labelledby="hero-heading">
          <p className="hero-eyebrow">Virtual Systems Engineering</p>
          <h1 className="hero-title" id="hero-heading">VIXTRION</h1>
          <p className="hero-desc">
            Interactive 3D training platforms built by a game developer and a technical artist.
            Bridging the gap between engineering documentation and hands-on understanding.
          </p>
          <button
            className={`scroll-hint${scrolled ? " hidden" : ""}`}
            aria-label="Scroll to projects"
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
          >
            <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
              <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </section>

        <section className="projects" id="projects" aria-labelledby="projects-heading">
          <div className="section-label" id="projects-heading">Active Projects</div>
          <div className="projects-grid">
            {PROJECTS.map(p => <ProjectCard key={p.slug} project={p} onEnter={handleEnter} />)}
          </div>
        </section>

        <DevLog />

        <footer>
          <div className="footer-logo">VIX<span>T</span>RION</div>
          <div className="footer-copy">PROTOTYPE BUILD — NOT FOR DISTRIBUTION</div>
        </footer>

      </div>
    </>
  );
}

export default Home;

// Projects — personal & open-source work.
// Each project renders as a card (summary → highlights → tech → screenshots → links)
// and is also curated into the PDF export, between Career Trajectory and Education.
//
// Text fields (summary, highlights) support the same inline markers as the rest of the
// site:  *number* → coloured figure   ^skill^ → highlight   `software` → pill.
// (In the printed PDF every marker renders as bold blue.)
//
// Per project:
//   id          unique slug (stable — the PDF export keys its saved choices off this)
//   name        display title
//   tagline     one short line under the title
//   status      small badge, e.g. "Active" / "Live" / "Work in Progress"
//   period      optional date/label shown beside the status badge
//   wip         optional; true renders the "in progress" treatment (no dead links)
//   colors      { light, dark } brand accent, like TRAJECTORY_DATA
//   summary     paragraph (markers supported)
//   highlights  optional bullet list (markers supported)
//   tech        optional stack pills
//   links       [{ label, href, icon }] — first entry is treated as the primary/repo link in the PDF
//   note        optional muted chip (used for WIP projects with nothing to link yet)
//   screenshots [{ src, alt }] — shown in a gallery; click opens a lightbox
const PROJECTS_DATA = [
  {
    id: "tippani",
    name: "Tippani",
    tagline: "Self-hosted store for book & film annotations",
    status: "Active",
    period: "2025 – Present",
    colors: { light: "#0d9488", dark: "#2dd4bf" },
    summary: "A self-hosted, multi-user home for your ^book highlights^ and ^movie dialogues^. Paste or bulk-import quotes, then tag, colour, favourite and rate them, auto-fetch covers and metadata, `search` everything instantly, and export it all back out as ^Obsidian-friendly Markdown^.",
    highlights: [
      "Ships as a single static `Go` binary (*~12 MB*) on `SQLite` + `FTS5` — *~25 MB* idle memory and ^zero background jobs^",
      "Purpose-built for ^low-powered NAS boxes^: plain HTTP on your LAN, or built-in HTTPS from a hot-reloaded cert pair",
      "Bulk import from `Kindle`, `Bookcision`, `Goodreads` and `IMDb`; instant full-text search across books, annotations and dialogues",
      "A ^read-only interactive demo^ rebuilds automatically whenever the frontend UI changes"
    ],
    tech: ["Go", "SQLite", "FTS5", "React", "Docker", "Full-text search"],
    links: [
      { label: "GitHub", href: "https://github.com/aaronified/tippani", icon: "folder-git-2" },
      { label: "Interactive demo", href: "https://aaronified.github.io/tippani/", icon: "external-link" }
    ],
    screenshots: [
      { src: "assets/projects/tippani-library-light.jpg", alt: "Tippani — book library in the paper / light theme: a grid of real book covers with genre filters" },
      { src: "assets/projects/tippani-catalogue-dark.jpg", alt: "Tippani — film catalogue in the dark theme: a grid of movie and show posters with dialogue counts" },
      { src: "assets/projects/tippani-search-dark.jpg", alt: "Tippani — instant full-text search across books, annotations, movies and dialogues" },
      { src: "assets/projects/tippani-import-light.jpg", alt: "Tippani — import screen with cards for Markdown, Bookcision, Goodreads, IMDb and Kindle" }
    ]
  },
  {
    id: "resume-builder",
    name: "Interactive Résumé Template",
    tagline: "The single-page site you're reading right now",
    status: "Live",
    period: "2025 – Present",
    colors: { light: "#4f46e5", dark: "#818cf8" },
    summary: "The very page you're reading. A single-page, ^dependency-free^ interactive résumé you host free on `GitHub Pages` — no build step and no framework, just static HTML, a CDN `Tailwind` copy, `Lucide` icons, and plain `JavaScript` data files you edit to make it your own.",
    highlights: [
      "Fully ^data-driven^: every section lives in small `data/*.js` files, so the rendering logic is never touched",
      "^Light / dark theming^ with an animated view-transition wipe and a complete reduced-motion mode",
      "A ^customisable PDF export^ screen — curate, reorder and edit every section before printing a compact one-page résumé",
      "^Hash-routed^ tabs, scroll-reveal animations and a fully responsive glassmorphic layout"
    ],
    tech: ["HTML", "Tailwind CSS", "JavaScript", "Lucide", "GitHub Pages"],
    links: [
      { label: "GitHub", href: "https://github.com/aaronified/aaronified.github.io", icon: "folder-git-2" },
      { label: "Live site", href: "https://aaronified.github.io", icon: "external-link" }
    ],
    screenshots: [
      { src: "assets/projects/resume-overview-light.jpg", alt: "The résumé's Overview tab in light mode: hero, contacts and executive-profile sidebar" },
      { src: "assets/projects/resume-timeline-dark.jpg", alt: "The Career Trajectory timeline in dark mode: a Z-pattern of brand-coloured role cards" },
      { src: "assets/projects/resume-pdf-dark.jpg", alt: "The customisable PDF export screen: toggle, reorder and edit every section before printing" }
    ]
  },
  {
    id: "data-sampler",
    name: "data-sampler",
    tagline: "Realistic, anonymized data samples in one command",
    status: "Active",
    period: "2025 – Present",
    colors: { light: "#b45309", dark: "#fbbf24" },
    summary: "Hand someone data that ^looks and behaves^ like your production data, isn't your production data, and ^provably keeps its statistical variety^ — in one command. `Stratified` sampling detects strata automatically, and every anonymizer maps each unique value to exactly one replacement, so duplicates stay duplicated and joint distributions survive.",
    highlights: [
      "^Anonymizes^ names, ids, emails, salaries and dates while preserving every distribution, duplicate and group structure",
      "Optionally collapses numeric columns into a few ^principal components^ (`PCA`) — output that's short *and* narrow",
      "Samples *100M-row* `Parquet` files out-of-core and in parallel through an optional `DuckDB` engine",
      "One package, three front ends: a colourful `Textual` terminal UI, a headless `CLI` and a plain `Python` API — published on `PyPI`"
    ],
    tech: ["Python", "DuckDB", "PCA", "Textual", "pandas", "PyPI"],
    links: [
      { label: "GitHub", href: "https://github.com/aaronified/data-sampler", icon: "folder-git-2" },
      { label: "PyPI", href: "https://pypi.org/project/data-sampler/", icon: "package" }
    ],
    screenshots: [
      { src: "assets/projects/datasampler-columns.svg", alt: "data-sampler columns screen: per-column stats, anonymizer, stratify and reduce configuration" },
      { src: "assets/projects/datasampler-report.svg", alt: "data-sampler report screen: side-by-side source-vs-sample distribution comparison per column" },
      { src: "assets/projects/datasampler-file.svg", alt: "data-sampler file screen: type a path or pick one from the directory browser" }
    ]
  },
  {
    id: "lexodle",
    name: "Lexodle",
    tagline: "A word game in the making",
    status: "Work in Progress",
    period: "In development",
    wip: true,
    colors: { light: "#db2777", dark: "#f472b6" },
    summary: "A project I'm currently building — a browser-based ^word game^. It's early days yet: the source repository and a playable demo will be linked here as it comes together.",
    highlights: [],
    tech: [],
    links: [],
    note: "Repository & demo coming soon",
    screenshots: []
  }
];

// Projects — personal & open-source work.
// Each project renders as a card (logo · title → badges → summary → highlights → tech →
// screenshots → links) and is also curated into the PDF export, between Career Trajectory
// and Education.
//
// Text fields (summary, highlights) support the same inline markers as the rest of the
// site:  *number* → coloured figure   ^skill^ → highlight   `software` → pill.
// (In the printed PDF every marker renders as bold blue.)
//
// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS_CONFIG — section-wide switches. Nothing below is hard-coded in
// index.html: change it here (or drop a file in assets/) and the page follows.
// ─────────────────────────────────────────────────────────────────────────────
const PROJECTS_CONFIG = {
  // Cards flagged `featured: true` are pulled to the top of the section, in data order,
  // and get the accent treatment below. Set `enabled: false` to render one flat list.
  featured: {
    enabled: true,
    label: "Hero project",       // chip text on a featured card ("" hides the chip)
    icon: "star"                 // any Lucide icon name
  },

  // Optional headings above each group. Set a heading to "" or null to hide that heading.
  groups: {
    featured: { heading: "Hero projects", sub: "The two I put the most into" },
    rest:     { heading: "Other projects", sub: "" }
  },

  // GitHub badges, read live from each project's README (the `repo` field below).
  // Cached in localStorage, so repeat visits paint them with no layout shift.
  badges: {
    enabled: true,
    source: "readme",        // "readme" = parse the repo README | "data" = only use per-project `badges`
    branch: "HEAD",          // ref to read the README from ("HEAD" follows the default branch)
    readmePath: "README.md",
    headerOnly: true,        // only scan the README header (before the first --- or ## ) — keeps inline screenshots out
    max: 6,                  // per project; 0 = unlimited
    cacheHours: 12,          // re-fetch only after this long
    height: 20,              // rendered badge height in px
    // An image only counts as a badge if its host is listed here. This is a safety
    // allowlist as much as a filter — a README is remote content.
    allowHosts: [
      "img.shields.io",
      "badgen.net",
      "badge.fury.io",
      "codecov.io",
      "coveralls.io",
      "github.com",          // Actions status badges (…/workflows/….yml/badge.svg)
      "raw.githubusercontent.com"
    ],
    // Badges whose alt text contains any of these (case-insensitive) are dropped.
    exclude: [],
    label: "Repository badges"
  },

  // Screenshot gallery tile presets. `gallery:` on a project picks one by name;
  // add your own freely — the values feed CSS custom properties, so any valid
  // CSS length / aspect-ratio / object-fit works.
  gallery: {
    default: "wide",
    tiles: {
      // Landscape UI screenshots.
      wide:   { min: "210px", max: "1fr",   aspect: "16 / 10", fit: "cover", position: "top" },
      // Portrait poster / cover artwork.
      poster: { min: "120px", max: "180px", aspect: "2 / 3",   fit: "cover", position: "center" },
      // Anything that must not be cropped (diagrams, logos, wide charts).
      full:   { min: "210px", max: "1fr",   aspect: "16 / 10", fit: "contain", position: "center" }
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// A note on image sources.
//
// Screenshots and logos below are hot-linked straight from each GitHub repo via
// raw.githubusercontent.com, so updating a repo updates this page — no copies to
// re-sync. GitHub serves them with a real image content-type, CORS `*` and a
// 5-minute cache, so a pushed change shows up here within minutes.
//
//   https://raw.githubusercontent.com/<owner>/<repo>/HEAD/<path-in-repo>
//
// `HEAD` tracks the repo's default branch; pin a tag or branch instead if you'd
// rather the résumé not move when the repo does. Any src is just a string, so a
// local `assets/…` path works exactly as well — the résumé's own screenshots
// below use local paths because they live in this repo. A tile whose image fails
// to load is dropped from the gallery rather than left broken.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Per project:
//   id          unique slug (stable — the PDF export keys its saved choices off this)
//   name        display title
//   tagline     one short line under the title
//   featured    optional; true pulls the card into the "hero" group up top
//   status      small badge, e.g. "Active" / "Live" / "Alpha"
//   period      optional date/label shown beside the status badge
//   wip         optional; true renders the "in progress" treatment (no dead links)
//   colors      { light, dark } brand accent, like TRAJECTORY_DATA
//   logo        optional mark shown beside the title (assets/…); logoDark = dark-theme variant
//   icon        optional Lucide icon used as the mark when there's no logo file
//   repo        "owner/name" — the source for auto-fetched README badges
//   badges      optional [{ alt, src, href }] — used when auto-fetch is off or finds nothing
//   summary     paragraph (markers supported)
//   highlights  optional bullet list (markers supported)
//   tech        optional stack pills
//   links       [{ label, href, icon }] — first entry is treated as the primary/repo link in the PDF
//   note        optional muted chip (used for WIP projects with nothing to link yet)
//   gallery     optional tile preset name from PROJECTS_CONFIG.gallery.tiles (default "wide")
//   screenshots [{ src, alt }] — shown in a gallery; click opens a lightbox
const PROJECTS_DATA = [
  {
    id: "tippani",
    name: "Tippani",
    tagline: "Self-hosted home for the quotes you keep",
    featured: true,
    status: "Active",
    period: "2025 – Present",
    colors: { light: "#0d9488", dark: "#2dd4bf" },
    logo: "https://raw.githubusercontent.com/aaronified/tippani/HEAD/web/frontend/public/mark.svg",
    logoDark: "https://raw.githubusercontent.com/aaronified/tippani/HEAD/web/frontend/public/mark-dark.svg",
    repo: "aaronified/tippani",
    summary: "A self-hosted, multi-user home for your ^book highlights^, ^movie dialogues^ and quotes from anywhere else. Paste or bulk-import them, then tag, colour and favourite them, auto-fetch covers and metadata, `search` everything instantly, and export it all back out as ^Obsidian-friendly Markdown^.",
    highlights: [
      "Ships as a single static `Go` binary (*~12 MB*) on `SQLite` + `FTS5` — *~25 MB* idle memory and ^zero background jobs^, built for the NAS that is already busy",
      "A ^daily quiz^ built on the *Ebbinghaus* forgetting curve: every quote carries a memory half-life and returns one of *five* ways, including a server-graded fill-in-the-blank",
      "Instant full-text search with a ^typo-tolerant fallback^, plus `tag:` / `author:` / `colour:` field search across *16* fields that offers your own library's words",
      "Bulk import from `Kindle`, `Bookcision`, `Goodreads`, `Hardcover` and `IMDb` lands in a ^pending queue^ you correct wholesale before anything is saved",
      "Installable `PWA` in ^English and Bengali^, two hand-made skins, and a ^read-only interactive demo^ that rebuilds whenever the frontend changes"
    ],
    tech: ["Go", "SQLite", "FTS5", "React", "Docker", "PWA", "Full-text search"],
    links: [
      { label: "GitHub", href: "https://github.com/aaronified/tippani", icon: "brand-github" },
      { label: "Interactive demo", href: "https://aaronified.github.io/tippani/demo/", icon: "external-link" },
      { label: "Roadmap", href: "https://aaronified.github.io/tippani/roadmap.html", icon: "target" }
    ],
    gallery: "wide",
    screenshots: [
      { src: "https://raw.githubusercontent.com/aaronified/tippani/HEAD/docs/img/library-paper-light.jpg", alt: "Tippani — books in the paper / light theme: a grid of real book covers with genre filters" },
      { src: "https://raw.githubusercontent.com/aaronified/tippani/HEAD/docs/img/catalogue-film-dark.jpg", alt: "Tippani — catalogue in the film / dark theme: a grid of movie and show posters with dialogue counts" },
      { src: "https://raw.githubusercontent.com/aaronified/tippani/HEAD/docs/img/search-film-light.jpg", alt: "Tippani — search correcting a misspelled query automatically, with results across books and annotations" }
    ]
  },
  {
    id: "data-sampler",
    name: "data-sampler",
    tagline: "Realistic, anonymized data samples in one command",
    featured: true,
    status: "Active",
    period: "2025 – Present",
    colors: { light: "#b45309", dark: "#fbbf24" },
    icon: "shuffle",
    repo: "aaronified/data-sampler",
    summary: "Hand someone data that ^looks and behaves^ like your production data, isn't your production data, and ^provably keeps its statistical variety^ — in one command. `Stratified` sampling detects strata automatically, and every anonymizer maps each unique value to exactly one replacement, so duplicates stay duplicated and joint distributions survive.",
    highlights: [
      "^Anonymizes^ names, ids, emails, salaries and dates while preserving every distribution, duplicate and group structure",
      "Optionally collapses numeric columns into a few ^principal components^ (`PCA`) — output that's short *and* narrow",
      "Samples *100M-row* `Parquet` files out-of-core and in parallel through an optional `DuckDB` engine",
      "One package, three front ends: a colourful `Textual` terminal UI, a headless `CLI` and a plain `Python` API — published on `PyPI`"
    ],
    tech: ["Python", "DuckDB", "PCA", "Textual", "pandas", "PyPI"],
    links: [
      { label: "GitHub", href: "https://github.com/aaronified/data-sampler", icon: "brand-github" },
      { label: "PyPI", href: "https://pypi.org/project/data-sampler/", icon: "package" }
    ],
    gallery: "wide",
    screenshots: [
      { src: "https://raw.githubusercontent.com/aaronified/data-sampler/HEAD/docs/img/tui-welcome.svg", alt: "data-sampler welcome menu: the terminal UI's entry point, listing sample, inspect and report actions" },
      { src: "https://raw.githubusercontent.com/aaronified/data-sampler/HEAD/docs/img/tui-columns.svg", alt: "data-sampler columns screen: per-column stats, anonymizer, stratify and reduce configuration" },
      { src: "https://raw.githubusercontent.com/aaronified/data-sampler/HEAD/docs/img/tui-report.svg", alt: "data-sampler report screen: side-by-side source-vs-sample distribution comparison per column" }
    ]
  },
  {
    id: "resume-builder",
    name: "Interactive Résumé Template",
    tagline: "The single-page site you're reading right now",
    status: "Live",
    period: "2025 – Present",
    colors: { light: "#4f46e5", dark: "#818cf8" },
    icon: "file-text",
    repo: "aaronified/aaronified.github.io",
    summary: "The very page you're reading. A single-page, ^dependency-free^ interactive résumé you host free on `GitHub Pages` — no build step and no framework, just static HTML, a CDN `Tailwind` copy, `Lucide` icons, and plain `JavaScript` data files you edit to make it your own.",
    highlights: [
      "Fully ^data-driven^: every section lives in small `data/*.js` files, so the rendering logic is never touched",
      "^Light / dark theming^ with an animated view-transition wipe and a complete reduced-motion mode",
      "A ^customisable PDF export^ screen — curate, reorder and edit every section before printing a compact one-page résumé",
      "^Hash-routed^ tabs, scroll-reveal animations and a fully responsive glassmorphic layout"
    ],
    tech: ["HTML", "Tailwind CSS", "JavaScript", "Lucide", "GitHub Pages"],
    links: [
      { label: "GitHub", href: "https://github.com/aaronified/aaronified.github.io", icon: "brand-github" },
      { label: "Live site", href: "https://aaronified.github.io", icon: "external-link" }
    ],
    gallery: "wide",
    screenshots: [
      { src: "assets/projects/resume-overview-light.jpg", alt: "The résumé's Overview tab in light mode: hero, contacts and executive-profile sidebar" },
      { src: "assets/projects/resume-timeline-dark.jpg", alt: "The Career Trajectory timeline in dark mode: a Z-pattern of brand-coloured role cards" },
      { src: "assets/projects/resume-pdf-dark.jpg", alt: "The customisable PDF export screen: toggle, reorder and edit every section before printing" }
    ]
  },
  {
    id: "jellyfin-tagsmith",
    name: "Tagsmith",
    tagline: "Namespaced, searchable tags for Jellyfin",
    status: "Alpha",
    period: "2026 – Present",
    colors: { light: "#1565C0", dark: "#4FC3F7" },
    logo: "https://raw.githubusercontent.com/aaronified/jellyfin-tagsmith/HEAD/assets/tagsmith.svg",
    repo: "aaronified/jellyfin-tagsmith",
    summary: "A `Jellyfin` plugin that derives ^searchable, namespaced tags^ from the metadata your server already has — production country, audio language, release year — so you can browse by where something is from or what language it's in without hand-tagging a single item. ^Awards and curated lists^ are on the roadmap.",
    highlights: [
      "Namespaced tag shape (`origin=`, `lang=`, `year=`) with slugified values; tags outside the configured namespaces are ^never touched^",
      "Country names are ^canonicalised^ — `United States of America`, `USA`, `Estados Unidos` and `美国` all collapse to one tag, not four",
      "Projects tag groups into ^real Jellyfin collections^ and pushes matching poster artwork onto them, so `origin=india` becomes a browsable, illustrated shelf",
      "Targets ^Jellyfin 10.11.11^ on `net9.0`, with scheduled tag-sync and artwork-reapply tasks"
    ],
    tech: ["C#", ".NET 9", "Jellyfin", "Plugin API", "Metadata"],
    links: [
      { label: "GitHub", href: "https://github.com/aaronified/jellyfin-tagsmith", icon: "brand-github" }
    ],
    // No screenshots yet — the repo has no docs/img shots to hot-link. Drop three
    // paths in here (or point at the repo's own docs/img) and the gallery appears.
    // The plugin's shipped collection cards suit the "poster" tile preset.
    gallery: "poster",
    screenshots: []
  },
  {
    id: "lexodle",
    name: "Lexodle",
    tagline: "A word game in the making",
    status: "Work in Progress",
    period: "In development",
    wip: true,
    colors: { light: "#db2777", dark: "#f472b6" },
    icon: "puzzle",
    summary: "A project I'm currently building — a browser-based ^word game^. It's early days yet: the source repository and a playable demo will be linked here as it comes together.",
    highlights: [],
    tech: [],
    links: [],
    note: "Repository & demo coming soon",
    screenshots: []
  }
];

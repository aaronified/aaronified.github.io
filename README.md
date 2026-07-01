# Interactive Resume Template

A single-page, interactive résumé / portfolio site you can host for free on **GitHub Pages**.
No build step, no framework, no dependencies to install — just static HTML, a CDN copy of
[Tailwind CSS](https://tailwindcss.com/), [Lucide icons](https://lucide.dev/), and a few plain
JavaScript data files you edit to make the site your own.

It renders four sections — **Overview**, **Career Trajectory**, **FAQ**, and
**Recommendations** — plus light/dark theming that remembers the visitor's choice.

> The repo currently ships with one person's content as a worked example. To build your own,
> replace the content in the `data/*.js` files (and a few spots in `index.html`) as described below.
> You never need to touch the rendering logic.

---

## Quick start

1. **Get the files.** Fork this repo, or click *Use this template* / download it.
2. **Preview locally.** No tooling required — either open `index.html` directly in your browser,
   or serve the folder (so relative image paths resolve exactly like production):

   ```bash
   # from the project root, pick one:
   python -m http.server 8000      # then visit http://localhost:8000
   npx serve .
   ```

3. **Edit your content** in the `data/*.js` files (see [Customizing your content](#customizing-your-content)).
4. **Update the page metadata** in `index.html` (see [Things to change in `index.html`](#things-to-change-in-indexhtml)).
5. **Deploy** to GitHub Pages (see [Deploying to GitHub Pages](#deploying-to-github-pages)).

---

## How the repo is organized

```text
.
├── index.html              # Markup + all rendering logic (edit metadata only)
├── data/                   # ← Your content lives here. Edit these files.
│   ├── personal.js         # Name, title, photo, contact links
│   ├── overview.js         # Bio, quick facts, global footprint, competencies
│   ├── trajectory.js       # Career/education timeline
│   ├── faqs.js             # Frequently asked questions
│   └── recommendations.js  # Testimonials + references
├── assets/                 # Your photo, company/school logos, avatars
└── README.md               # This guide
```

Each file in `data/` defines one or more global `const`s (e.g. `PERSONAL_DATA`). `index.html`
loads them with `<script>` tags and renders them into the page on load. **Editing content =
editing a data file. Nothing else is required.**

---

## Customizing your content

All content is plain JavaScript objects/arrays. Keep the quotes and commas intact — a stray
comma or missing quote will stop the page from rendering. Fields marked *(HTML allowed)* accept
inline HTML such as `<br>` or `<strong>` for light formatting.

### Inline highlights (markers)

Inside most text fields you can wrap a phrase in a marker to highlight it. There are three types,
each styled to match its surroundings — inside a timeline card a highlight picks up *that card's*
brand colour; elsewhere it uses the site accent (indigo in light mode, amber in dark):

- **Significant numbers / achievements** → wrap in asterisks — renders as coloured, bold text.
- **Skills & techniques** → wrap in carets `^…^` — renders with a subtle highlighter background.
- **Software / tools** → wrap in backticks — renders as a small pill badge.

Examples — the raw text you'd type into a data field:

```text
saving *₹50 lakh/month*      →  coloured figure
using ^geofencing^           →  highlighted skill
Introduced `TIBCO Spotfire`  →  software pill
```

Markers work in the overview bio, competency descriptions, timeline descriptions & highlights, FAQ
answers, and recommendation quotes. They don't nest, and any HTML you already use (e.g. `<br>`) is
left untouched. The marker characters (`*`, `^`, backtick) are reserved for this, so avoid them as
literal punctuation in those fields. Keep it light — a few highlights per entry reads best; over-
highlighting defeats the purpose.

**Guidance for dense skill lists (e.g. competencies):** pill only **standalone software** (languages,
platforms, apps — `Python`, `Power BI`, `AWS`); put **libraries/packages** and a couple of *signature*
skills in the highlight (`^pandas^`, `^NLP^`) rather than pilling everything; and **group each tool
with its own packages/features** — e.g. `` `Python` (^pandas^, ^NumPy^, ^scikit-learn^) `` rather than
listing all tools first and all packages after.

### `data/personal.js` — header & contacts

```js
const PERSONAL_DATA = {
  name: "Your Name",
  title: "Your Headline / Current Role",
  profileImage: "assets/your-photo.jpg",
  contacts: [
    { type: "phone",    label: "+1 555 123 4567",        href: "tel:+15551234567",              icon: "phone" },
    { type: "email",    label: "you@example.com",         href: "mailto:you@example.com",         icon: "mail" },
    { type: "linkedin", label: "linkedin.com/in/you",     href: "https://linkedin.com/in/you",    icon: "contact-round" }
  ]
};
```

- `icon` is any [Lucide icon](https://lucide.dev/icons/) name.
- `type: "linkedin"` (or any external link) opens in a new tab; other types open in the same tab.
- Add or remove contact entries freely.

### `data/overview.js` — bio, quick facts, footprint, competencies

```js
const OVERVIEW_DATA = {
  bio: "A short paragraph about you.",            // (HTML allowed)
  // Free-form facts. "Current Position" and "Experience" are NOT listed here — they're computed
  // automatically (see below). Set emphasis:true to render a fact as a larger, highlighted row.
  quickFacts: [
    { label: "Core Expertise", value: "Analytics and Insights" },
    { label: "Function Setup", value: "Ground Up Analytics" },
    { label: "Role Base",      value: "Hyderabad, India" }
  ],
  competencies: [
    {
      title: "Skill Area",
      icon: "brain-circuit",                       // optional; any Lucide icon name
      description: "What you do in this area."
    }
  ]
};
```

- `competencies` render as a responsive card grid; add as many as you like. `icon` is any
  [Lucide icon](https://lucide.dev/icons/) name (omit it for no icon).

**Auto-computed fields** (derived from `TRAJECTORY_DATA` — you don't edit these):

- **Current Position** — the role whose `period` ends in "Present" (else the most recent entry),
  shown as `"<role>, <company>"`. Add your newest role and it updates itself.
- **Experience** — the summed duration of all `type: "work"` roles ("Present" counts up to today).
  Shown in **months** up to 24 months, then in whole **years**. (This is independent of any "X years"
  you write in the `bio`, which stays exactly as you type it.)
- **Geographic footprint** — countries (with flags) and a city count parsed from each entry's
  `location` (`"City, Country"`). The heading reads **"Global Footprint"** for more than one country
  and **"Geographic Footprint"** for a single country. If there's only **one city**, the whole
  footprint widget is hidden.

These three come first in the Quick Facts panel; the free-form `quickFacts` above follow them.

### `data/trajectory.js` — the career timeline

`TRAJECTORY_DATA` is an **array in reverse-chronological order** — the first entry appears at the
top of the timeline (most recent) and the last at the bottom.

**Standard entry (single role):**

```js
{
  id: "unique-slug",                 // must be unique across all entries
  role: "Your Title",
  company: "Company / School",
  location: "City, Country",
  flag: "🇮🇳",                        // emoji flag for the location
  period: "Jan 2024 - Present",
  type: "work",                      // "work" | "education" | "internship" (sets the badge icon)
  colors: { light: "#C62828", dark: "#EF5350" },  // brand accent per theme
  logo: "assets/company-logo.jpg",   // optional; omit for no logo
  link: "https://www.linkedin.com/company/...",   // optional; makes the logo + name clickable
  description: "One or two sentences of context.",
  highlights: [                      // optional; bullet list. Use [] for none.
    "An achievement with a number.",
    "Another achievement."
  ],
  score: "8.18/10"                   // optional; typically for education entries
}
```

**Merged entry (multiple roles at the same organization):** set `isMerged: true` and provide a
`roles` array instead of a top-level `description`/`highlights`:

```js
{
  id: "acme",
  role: "Multiple",
  company: "Acme Corp",
  location: "City, Country",
  flag: "🇮🇳",
  period: "Sep 2020 - Dec 2023",
  type: "work",
  colors: { light: "#C20068", dark: "#FF6B9D" },
  logo: "assets/acme-logo.jpg",
  isMerged: true,
  roles: [
    {
      role: "Senior Role",
      period: "Jul 2022 - Dec 2023",
      description: "Context for this role.",
      highlights: ["…", "…"]
    },
    {
      role: "Earlier Role",
      period: "Sep 2020 - Jul 2022",
      description: "Context for this role.",
      highlights: ["…"]
    }
  ]
}
```

- `type` controls the badge icon: `work` → briefcase, `education` → graduation cap,
  `internship` → award.
- `colors` sets the card's accent in light and dark themes — use the org's brand color, or any
  hex you like.
- `link` (optional) turns the logo and company name into a link that opens in a new tab. Convention:
  use the org's **LinkedIn company page** for employers and the **official website** for schools.
  Omit it and the logo/name simply render as plain, non-clickable text.

### `data/faqs.js` — FAQ accordion

```js
const FAQS_DATA = [
  { question: "A question about your work or philosophy?",
    answer: "Your answer. <br><br> Use <br> for paragraph breaks." }   // (HTML allowed)
];
```

### `data/recommendations.js` — testimonials & references

Three exports:

```js
// 1. Testimonials with full quote text
const RECOMMENDATIONS_DATA = [
  {
    author: "Person Name",
    title: "Their Title",
    relationship: "How they know you (e.g. Reported to me at …)",
    avatarImage: "assets/their-avatar.jpg",
    text: "The full recommendation quote.",
    linkedin: "https://linkedin.com/in/them"
  }
];

// 2. Heading + blurb shown above the References grid
const REFERENCES_INTRO = {
  heading: "Professional References",
  description: "Short intro line.<br/>Can include HTML."               // (HTML allowed)
};

// 3. Reference contacts (name + link, no quote)
const REFERENCES_DATA = [
  {
    name: "Person Name",
    title: "Their Title",
    relationship: "e.g. Direct Manager at …",
    avatarImage: "assets/their-avatar.jpg",
    linkedin: "https://linkedin.com/in/them"
  }
];
```

### Images (`assets/`)

Put your photo, company/school logos, and recommender avatars in `assets/` and reference them by
relative path (e.g. `"assets/my-photo.jpg"`). Square images work best for the profile photo,
logos, and avatars. Filenames are case-sensitive on GitHub Pages — match them exactly.

---

## Things to change in `index.html`

You only edit the `<head>` — leave the markup and scripts alone. Update these for your own SEO and
browser-tab identity:

- **`<title>`** — the browser tab / search-result title.
- **`<meta name="description">`** — one-sentence summary for search engines and link previews.
- **`<meta name="keywords">`** — a few relevant keywords.
- **`<link rel="icon" …>`** — the favicon. It's an inline SVG emoji (`📊` by default); swap the
  emoji for one you prefer.

Your name in the footer copyright is filled in automatically from `PERSONAL_DATA.name`.

---

## Deploying to GitHub Pages

1. Push your edited repo to GitHub.
2. For a **personal site**, name the repo `your-username.github.io`; it will publish at
   `https://your-username.github.io/`. For a **project site**, use any repo name; it publishes at
   `https://your-username.github.io/<repo-name>/`.
3. In the repo, go to **Settings → Pages**, set **Source** to *Deploy from a branch*, choose your
   default branch (e.g. `main`) and the `/ (root)` folder, and save.
4. Wait a minute for the build, then visit your URL.

Because the site is fully static, there is nothing to build — GitHub serves the files as-is.

---

## Notes & tips

- **No build / no install.** Tailwind and Lucide load from a CDN, so there's no `npm install`.
  The trade-off is a small runtime cost and a dependency on those CDNs being reachable.
- **Theming.** Light/dark is toggled by the button in the nav and saved to `localStorage`; it
  defaults to the visitor's system preference. Per-entry accent colors come from each timeline
  entry's `colors` field.
- **Validate your JSON-ish data.** After editing a `data/*.js` file, a quick
  `node --check data/that-file.js` catches syntax mistakes (missing comma/quote) before you deploy.
- **Encoding.** Files are UTF-8. Keep emoji flags and symbols as real UTF-8 characters; avoid
  editors/tools that re-save as a different code page.
- **Accessibility.** The template includes a skip-to-content link, focus rings, ARIA attributes on
  the accordions, and honors `prefers-reduced-motion`. Try to preserve these if you customize the
  markup.

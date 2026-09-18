// Personal and Contact Details
const PERSONAL_DATA = {
  name: "Arani Das",
  title: "Leading Analytics & Data Science at ISB",
  // Live resume URL shown in the hero. Optional — if omitted, it's auto-detected from the
  // host the site is served on (e.g. your-username.github.io). Set it to show a link in local previews too.
  website: "aaronified.github.io",
  profileImage: "assets/Arani_professional.JPG",
  // Browser-tab title + SEO meta. Applied on load — edit these here instead of index.html.
  //
  // IMPORTANT: index.html <head> carries a hard-coded copy of these values, plus Open Graph,
  // Twitter card and schema.org JSON-LD tags. That duplication is deliberate — most crawlers
  // (Bing, DuckDuckGo, LinkedIn, Slack, AI bots) never run JS, so anything set only at runtime
  // is invisible to them. If you change something here, mirror it in <head> too.
  seo: {
    title: "Arani Das — Analytics & Data Science Leader | ISB, Hyderabad",
    description: "Arani Das is a data-driven analytics leader with 9+ years across supply chain operations, logistics, e-commerce, and strategic analytics. Currently Associate Director, Program Analytics at the Indian School of Business, Hyderabad.",
    // Lead with name variants people actually type — this page's job is to win the name search.
    keywords: "Arani Das, Arani Das analytics, Arani Das ISB, Arani Das data science, Arani Das resume, Data Analytics, Data Science, Supply Chain, Logistics, Operations, Leadership, Indian School of Business, Allcargo Gati, Tata CLiQ, Hyderabad",
    // Absolute origin, no trailing path. Drives canonical, Open Graph and JSON-LD URLs.
    siteUrl: "https://aaronified.github.io",
    // Shown as the link preview thumbnail. Relative paths are resolved against siteUrl.
    ogImage: "assets/Arani_professional.JPG"
  },

  // Extra facts for the schema.org Person record that can't be derived from the other data
  // files. Everything else (job title, employer, education, skills, profile links) is read
  // straight out of TRAJECTORY_DATA / OVERVIEW_DATA / contacts by buildPersonJsonLd().
  schema: {
    givenName: "Arani",
    familyName: "Das",
    addressLocality: "Hyderabad",
    addressCountry: "IN"
  },
  contacts: [
    { type: "phone", label: "+91 8017014853", href: "tel:+918017014853", icon: "phone" },
    { type: "github", label: "github.com/aaronified", href: "https://github.com/aaronified", icon: "brand-github" },
    { type: "email", label: "das.arani@gmail.com", href: "mailto:das.arani@gmail.com", icon: "mail" },
    { type: "linkedin", label: "linkedin.com/in/arani-das", href: "https://www.linkedin.com/in/arani-das", icon: "brand-linkedin" }
  ]
};

// Overview Bio, Quick Facts and Competencies
const OVERVIEW_DATA = {
  bio: "Data-driven analytics leader with *9+ years* spanning supply chain operations, logistics, e-commerce, and now strategic analytics. Built high-impact analytics functions from scratch, delivering insights that shape CEO-level decisions. Combine hands-on supply chain expertise with ^advanced statistical and ML^ capabilities. Proven track record designing delivery models, optimizing networks, and scaling data-informed cultures across organizations.",
  // Quick Facts sidepanel. NOTE: "Current Position" and "Experience" are computed automatically
  // from TRAJECTORY_DATA (current role + summed work duration) and are prepended at render time.
  // The facts below are free-form — edit/add/remove them to suit your profile.
  quickFacts: [
    { label: "Function", value: "Analytics and Insights" },
    { label: "Core Expertise", value: "Ground Up Analytics" },
    { label: "Base Location", value: "Hyderabad, India" }
  ],
  // Skill bars — a short, rated list, drawn as four-step bars by the résumé templates that use
  // them. Deliberately NOT all 47 skills below: a page of bars reads as noise, a handful reads
  // as a considered claim.
  //
  // Which templates show them:
  //   Bhagirathi  — never. It is a single flowing column of prose.
  //   Dokra       — always. The bars are part of that layout.
  //   Pattachitra — either these bars OR the competency text in its sidebar, your choice in the
  //                 Save PDF screen. Not both: the sidebar has room for one of them.
  //
  // `level` is one of "Expert", "Advanced", "Proficient", "Working" — four named steps rather
  // than a percentage, because nobody can defend the difference between 85% and 90% of SQL in
  // an interview. Order is the order they are drawn in; strongest first reads best.
  //
  // TWELVE AT MOST. Anything past the twelfth is not drawn: a column of bars long enough to
  // need scrolling has stopped being a summary and become an inventory.
  //
  // Levels can also be dragged in the Save PDF editor. That only ever changes YOUR export, in
  // your own browser — this file stays the source of truth for what the site shows everyone.
  skillBars: [
    { name: "SQL",                  level: "Expert" },
    { name: "Advanced Excel",       level: "Expert" },
    { name: "Python",               level: "Advanced" },
    { name: "Statistical analysis", level: "Advanced" },
    { name: "NLP",                  level: "Advanced" },
    { name: "Tableau",              level: "Advanced" },
    { name: "Gen AI",               level: "Advanced" },
    { name: "Agentic workflows",    level: "Advanced" },
    { name: "R",                    level: "Proficient" },
    { name: "TIBCO Spotfire",       level: "Proficient" },
    { name: "Power BI",             level: "Proficient" },
    { name: "AWS",                  level: "Proficient" }
  ],

  // Global Footprint (countries + city count) is derived from the locations in TRAJECTORY_DATA.
  competencies: [
    {
      title: "Analytics & Data Science",
      icon: "brain-circuit",
      description: "`Python` (^pandas^, ^NumPy^, ^scikit-learn^, ^XGBoost^), `SQL`, `R`. ML projects in classification, segmentation, ^NLP^. Advanced statistical analysis. ^Time series forecasting^ (^Prophet^).",
      skills: ["Python", "SQL", "R", "pandas", "NumPy", "scikit-learn", "XGBoost", "Classification", "Segmentation", "NLP", "Prophet", "Statistical analysis"]
    },
    {
      title: "Strategic Leadership",
      icon: "target",
      description: "^Building analytics functions from ground up^. Embedding data culture. ^CEO/C-suite engagement^. Cross-functional team leadership. Stakeholder alignment on data strategy.",
      skills: ["Function building", "Data culture", "C-suite engagement", "Team leadership", "Data strategy", "Stakeholder alignment"]
    },
    {
      title: "Analytics Infrastructure",
      icon: "layout-dashboard",
      description: "`TIBCO Spotfire`, `Power BI`, `Tableau` (dashboard design, reporting automation). `AWS` (^data governance^, ^analytics platform architecture^).",
      skills: ["TIBCO Spotfire", "Power BI", "Tableau", "AWS", "Data governance", "Dashboard design", "Reporting automation"]
    },
    {
      title: "Supply Chain & Operations",
      icon: "package",
      description: "^Network optimization^. ^Delivery model design^. Cost reduction. Operational efficiency. Logistics. Warehouse management. 3PL coordination.",
      skills: ["Network optimization", "Delivery model design", "Cost reduction", "Logistics", "Warehouse management", "3PL coordination"]
    },
    {
      title: "Technical Tools",
      icon: "wrench",
      description: "`Python`, `SQL`, `R`, `AWS`, `Advanced Excel`. `Linux CLI`. `BigQuery`. `Power Query`. Geofencing and mapping APIs. ^Gen AI integration^.",
      skills: ["Python", "SQL", "R", "AWS", "Advanced Excel", "Linux CLI", "BigQuery", "Power Query", "Geofencing APIs", "Gen AI", "Agentic workflows"]
    },
    {
      title: "Cross-Functional Impact",
      icon: "users",
      description: "^Data literacy programs^. Mentorship. Process automation. Revenue opportunity identification. Cost optimization. ^Strategic reporting to leadership^.",
      skills: ["Data literacy", "Mentorship", "Process automation", "Revenue opportunities", "Cost optimization", "Strategic reporting"]
    }
  ],

  // STRENGTHS — the `title` of each competency above that you want a recruiter to take away.
  // A subset of what you already claim, not a second list that can drift out of step with it:
  // anything here that is not a competency title is ignored.
  //
  // Drawn as plain pills, with no proficiency scale — `skillBars` is where levels live. SIX AT
  // MOST; anything past the sixth is not drawn. Leave it empty and nothing is drawn at all.
  strengths: [
    "Analytics & Data Science",
    "Strategic Leadership",
    "Analytics Infrastructure",
    "Supply Chain & Operations",
    "Technical Tools",
    "Cross-Functional Impact"
  ],

  // LANGUAGES — shown on the Overview tab beside the global footprint, and in the résumé's
  // column. `level` is free text: "Native", "Professional", "Conversational", whatever is true.
  // Example: { name: "English", level: "Professional" }
  languages: [
    { name: "English", level: "Fluent" },
    { name: "Hindi",   level: "Professional" },
    { name: "Bengali", level: "Native" }
  ],

  // INTERESTS — the last thing on the Overview tab, and nowhere near the résumé unless you put
  // it there. Plain strings.
  // Example: "Long-distance cycling"
  interests: []
};

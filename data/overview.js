// Overview Bio, Quick Facts and Competencies
const OVERVIEW_DATA = {
  bio: "Data-driven analytics leader with *9+ years* spanning supply chain operations, logistics, e-commerce, and now strategic analytics. Built high-impact analytics functions from scratch, delivering insights that shape CEO-level decisions. Combine hands-on supply chain expertise with ^advanced statistical and ML^ capabilities. Proven track record designing delivery models, optimizing networks, and scaling data-informed cultures across organizations.",
  // Quick Facts sidepanel. NOTE: "Current Position" and "Experience" are computed automatically
  // from TRAJECTORY_DATA (current role + summed work duration) and are prepended at render time.
  // The facts below are free-form — edit/add/remove them to suit your profile.
  quickFacts: [
    { label: "Core Expertise", value: "Analytics and Insights" },
    { label: "Function Setup", value: "Ground Up Analytics" },
    { label: "Role Base", value: "Hyderabad, India" }
  ],
  // Global Footprint (countries + city count) is derived from the locations in TRAJECTORY_DATA.
  competencies: [
    {
      title: "Analytics & Data Science",
      icon: "brain-circuit",
      description: "Python, SQL, R, pandas, NumPy, scikit-learn, XGBoost. ML projects in classification, segmentation, NLP. Advanced statistical analysis. Time series forecasting (Prophet).",
      skills: ["Python", "SQL", "R", "pandas", "NumPy", "scikit-learn", "XGBoost", "Classification", "Segmentation", "NLP", "Prophet", "Statistical analysis"]
    },
    {
      title: "Strategic Leadership",
      icon: "target",
      description: "Building analytics functions from ground up. Embedding data culture. CEO/C-suite engagement. Cross-functional team leadership. Stakeholder alignment on data strategy.",
      skills: ["Function building", "Data culture", "C-suite engagement", "Team leadership", "Data strategy", "Stakeholder alignment"]
    },
    {
      title: "Analytics Infrastructure",
      icon: "layout-dashboard",
      description: "TIBCO Spotfire, Power BI, Tableau. AWS. Data governance. Dashboard design. Reporting automation. Analytics platform architecture.",
      skills: ["TIBCO Spotfire", "Power BI", "Tableau", "AWS", "Data governance", "Dashboard design", "Reporting automation"]
    },
    {
      title: "Supply Chain & Operations",
      icon: "package",
      description: "Network optimization. Delivery model design. Cost reduction. Operational efficiency. Logistics. Warehouse management. 3PL coordination.",
      skills: ["Network optimization", "Delivery model design", "Cost reduction", "Logistics", "Warehouse management", "3PL coordination"]
    },
    {
      title: "Technical Tools",
      icon: "wrench",
      description: "Python, SQL, R, AWS, Advanced Excel. Linux CLI. BigQuery. Power Query. Geofencing and mapping APIs. Gen AI integration.",
      skills: ["Python", "SQL", "R", "AWS", "Advanced Excel", "Linux CLI", "BigQuery", "Power Query", "Geofencing APIs", "Gen AI"]
    },
    {
      title: "Cross-Functional Impact",
      icon: "users",
      description: "Data literacy programs. Mentorship. Process automation. Revenue opportunity identification. Cost optimization. Strategic reporting to leadership.",
      skills: ["Data literacy", "Mentorship", "Process automation", "Revenue opportunities", "Cost optimization", "Strategic reporting"]
    }
  ]
};

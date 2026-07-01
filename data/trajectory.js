// Career Trajectory Timeline Data
const TRAJECTORY_DATA = [
  {
    id: "isb",
    role: "Associate Director, Program Analytics",
    company: "Indian School of Business",
    location: "Hyderabad, India",
    flag: "🇮🇳",
    period: "Jan 2026 - Present",
    type: "work",
    colors: { light: "#0066A1", dark: "#4A9FD9" },
    logo: "assets/indian_school_of_business_logo.jpg",
    link: "https://www.linkedin.com/school/indian-school-of-business/",
    description: "Leading analytics function for academic programs. Driving data-informed decision-making for program strategy, execution, and market positioning.",
    highlights: []
  },
  {
    id: "allcargo",
    role: "Manager – Data Analytics",
    company: "Allcargo Gati Limited",
    location: "Mumbai, India",
    flag: "🇮🇳",
    period: "Jan 2024 - Jan 2026",
    type: "work",
    colors: { light: "#C62828", dark: "#EF5350" },
    logo: "assets/allcargogati_logo.jpg",
    link: "https://www.linkedin.com/company/allcargogati",
    description: "Built the analytics function from the ground up and led a team of experienced analysts supporting Sales and Operations nationwide. Worked closely with CEO, COO, CFO, and other national leaders to embed data into key strategic decisions.",
    highlights: [
      "Designed and rolled out nationwide delivery model, saving ₹0.05/kg (~₹50 lakh/month in cost reduction)",
      "Created primary KRA tool now used across India for operational KPI tracking",
      "Leading initiative to revamp mid-mile routes, targeting 5-10% cost savings and reducing delays to <10%",
      "Mapped pincodes to nearest operating units using geofencing and Google Maps API to improve serviceability",
      "Reduced delivery promise times by 20% using performance data, with minimal impact on actual on-time delivery",
      "Identified opportunities leading to 2-4% top-line improvement without increasing bottom-line costs",
      "Introduced TIBCO Spotfire across organization for analytics delivery",
      "First hire to establish newly created analytics division; designed team structure, tools, and delivery processes",
      "Mentoring colleagues in advanced Excel and SQL across the organization"
    ]
  },
  {
    id: "tatacliq",
    role: "Multiple",
    company: "Tata CLiQ (Tata Unistore)",
    location: "Mumbai, India",
    flag: "🇮🇳",
    period: "Sep 2020 - Dec 2023",
    type: "work",
    colors: { light: "#C20068", dark: "#FF6B9D" },
    logo: "assets/tatacliqfashion_logo.jpg",
    link: "https://www.linkedin.com/company/tatacliq",
    isMerged: true,
    roles: [
      {
        role: "Lead Data Analyst",
        period: "Jul 2022 - Dec 2023",
        description: "Led analytics team mentoring three analysts. Worked closely with CEO, CBO, and COO on data capabilities. Delivered ML and NLP solutions while streamlining internal processes.",
        highlights: [
          "Headed analytics team supporting cross-functional stakeholders with data-driven decision-making",
          "Led ML projects on age classification, customer segmentation, and NLP analysis of call data",
          "Developed TAT Automation logic to optimize customer promise while maintaining operational adherence",
          "Optimized data structure and ticketing system: 20% reduction in analytics requests, 25% TAT reduction",
          "Improved retargeting algorithms, expanding eligible customer base without reducing CTR",
          "Conducted 5+ company-wide data literacy sessions (4.7/5 average satisfaction)",
          "Awarded Q1 FY2024 Fast & Frugal Tech Champion for building the Analytics & Insights team"
        ]
      },
      {
        role: "Category Operations Manager",
        period: "Sep 2020 - Jul 2022",
        description: "Managed all supply chain processes and projects for Electronics category. Developed process guides for sellers and category teams. Automated complex reporting for business intelligence.",
        highlights: [
          "~200% increase in <3-day delivery promises YoY (FY22); ~20% increase in <7-day promises",
          "4% increase in adherence to aggressively improved promises (FY22 vs FY21)",
          "B2B order contribution increased to >15% with <5% cancellations through GST invoicing project",
          "~10% man-hour reduction in PO creation through SAP process re-engineering",
          "Improved revenue ~₹25 lakh/year through 20% seller rejection decrease"
        ]
      }
    ]
  },
  {
    id: "noon",
    role: "Assistant Manager, Operations",
    company: "noon (Noon.com)",
    location: "Dubai, UAE",
    flag: "🇦🇪",
    period: "Sep 2019 - Sep 2020",
    type: "work",
    colors: { light: "#C49800", dark: "#F6BE00" },
    logo: "assets/nooncom_logo.jpg",
    link: "https://www.linkedin.com/company/nooncom",
    description: "On-boarded and trained vendors, devised SOPs, forecasted supply using SQL and R, and supervised 4 3PL warehouses. Helped design and set up e-commerce grocery warehouse.",
    highlights: [
      "Developed SQL (BigQuery) and R dashboards and data models for operations team",
      "Negotiated 3PL pricing and SLA models, achieving 10% operational cost reduction",
      "Devised SOPs for all Outbound and Packaging processes; standardized materials",
      "Ground-up e-commerce grocery warehouse setup (floor planning to process design)",
      "Designed expiry handling and return-to-vendor process; 90% wastage reduction"
    ]
  },
{
  id: "landmark",
  role: "Logistics Associate",
  company: "Landmark Group",
  location: "Kuwait City, Kuwait",
  flag: "🇰🇼",
  period: "May 2017 - Aug 2019",
  type: "work",
  colors: { light: "#005396", dark: "#4A90D9" },
  logo: "assets/landmark_group_logo.jpg",
  link: "https://www.linkedin.com/company/landmark-group",
  isMerged: true,
  roles: [
    {
      role: "MIS Lead",
      period: "May 2017 - Aug 2019",
      description: "Led the MIS team for Kuwait Centrepoint and Max warehouses serving 40+ stores across Kuwait. Acted as an internal consultant for supply chain initiatives and process optimization.",
      highlights: [
        "Improved Labour Management System via compartmentalisation and automatic validation for error-free operations",
        "Worked with IT department and TCS consultants to improve WMS systems and infrastructure",
        "Developed and deployed R and Power Query tools to automate report generation and streamline reporting",
        "Implemented GDMS system in Babyshop Nursery supporting 250+ daily deliveries with 100% accuracy",
        "Prepared cost-benefit and ROI analyses for operational process changes",
        "Achieved 90% daily replenishment across 40+ stores through route and capacity optimisation"
      ]
    },
    {
      role: "Warehouse Manager",
      period: "Sep 2018 - Aug 2019",
      description: "Led logistics and warehousing operations for Kuwait Centrepoint and Max e-commerce operations.",
      highlights: [
        "Led the logistics function with a team of 28 supporting e-commerce operations",
        "Managed day-to-day warehousing operations for 2 brands across 5 stores and 10 warehouse staff"
      ]
    }
  ]
},
  {
    id: "genmills",
    role: "Summer Intern",
    company: "General Mills",
    location: "Mumbai, India",
    flag: "🇮🇳",
    period: "Mar 2016 - May 2016",
    type: "internship",
    colors: { light: "#0655A3", dark: "#5C8AE6" },
    logo: "assets/1631339395596.jpg",
    link: "https://www.linkedin.com/company/general-mills",
    description: "Affinity analysis on POS data from 5k stores using R. Identified cross-selling and up-selling opportunities; up to 10% potential sales increase from SKU substitutes. Published and presented research paper at SPJIMR-POMS India Chapter Conference 2016.",
    highlights: []
  },
  {
    id: "iim_mumbai",
    role: "PGDIM (MBA equivalent), Operations & Analytics",
    company: "IIM Mumbai (NITIE)",
    location: "Mumbai, India",
    flag: "🇮🇳",
    period: "2015 - 2017",
    type: "education",
    colors: { light: "#003366", dark: "#4A90D9" },
    logo: "assets/1734438341229.jpg",
    link: "https://iimmumbai.ac.in/",
    description: "Post Graduate Diploma in Industrial Management, equivalent to an MBA degree, specializing in Operations and Analytics.",
    score: "8.18/10"
  },
  {
    id: "reliance",
    role: "Graduate Engineer Trainee",
    company: "Reliance Industries Limited",
    location: "Vadodara, India",
    flag: "🇮🇳",
    period: "Jul 2014 - May 2015",
    type: "work",
    colors: { light: "#9A7B3D", dark: "#D4B877" },
    logo: "assets/reliance_logo.jpg",
    link: "https://www.linkedin.com/company/reliance",
    description: "Provided technical support for process optimization in rubber manufacturing (PBR II Plant).",
    highlights: [
      "Carried out risk assessment of routine maintenance jobs and managed SAP-based work permits",
      "Led project to identify and eliminate defects in rubber bales",
      "Recognized by Process HOD for resolving leakage issues in the ammonia plant"
    ]
  },
  {
    id: "jadavpur",
    role: "B.E., Chemical Engineering",
    company: "Jadavpur University",
    location: "Kolkata, India",
    flag: "🇮🇳",
    period: "2010 - 2014",
    type: "education",
    colors: { light: "#800000", dark: "#CD5C5C" },
    logo: "assets/jadavpur_university_logo.jpg",
    link: "https://jadavpuruniversity.in/",
    description: "Bachelor of Engineering in Chemical Engineering from Jadavpur University.",
    score: "7.86/10"
  },
  {
    id: "indianoil",
    role: "Summer Intern",
    company: "Indian Oil Corporation",
    location: "Kolkata, India",
    flag: "🇮🇳",
    period: "May 2013",
    type: "internship",
    colors: { light: "#D84315", dark: "#FF8A50" },
    logo: "assets/indian_oil_corp_limited_logo.jpg",
    link: "https://www.linkedin.com/company/indian-oil-corp-limited",
    description: "Study of industrial equipment and processes.",
    highlights: []
  }
];

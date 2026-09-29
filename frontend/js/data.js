/**
 * GrowGov AI – Initial Data Models & Sample Datasets
 * iGOT Karmayogi Competency Platform
 */

window.GROWGOV_DATA = {
  // Demo Users
  users: {
    employee: {
      id: "GOV-STAT-2021-089",
      email: "rahul.sharma@mospi.gov.in",
      password: "password123",
      name: "Rahul Sharma",
      role: "Statistical Officer",
      department: "Ministry of Statistics and Programme Implementation",
      ministryCode: "MoSPI",
      cadre: "Indian Statistical Service (Subordinate)",
      experience: "5 Years",
      qualification: "M.Sc. Statistics",
      responsibilities: "Large-scale survey data analysis, official quarterly GDP reports, statistical modeling for policy inputs, district survey coordination",
      skills: "Descriptive Statistics, Survey Sampling, MS Excel (Advanced), Basic Python, Report Writing",
      previousTraining: "iGOT Karmayogi Induction (2021), National Accounts Basics (2022), Cyber Security in Governance (2023)",
      avatarInitials: "RS"
    },
    admin: {
      id: "GOV-ADMIN-001",
      email: "admin.karmayogi@gov.in",
      password: "adminpassword",
      name: "Dr. Sunita Rao",
      role: "Director of Capacity Building",
      department: "DoPT / Capacity Building Commission (CBC)",
      ministryCode: "DoPT",
      avatarInitials: "SR"
    }
  },

  // Competency Framework for Statistical Officer
  competencies: [
    {
      id: "comp_1",
      name: "Statistical Analysis",
      category: "Core Technical",
      current: 70,
      required: 80,
      gap: 10,
      priority: "Medium",
      color: "#2563eb",
      description: "Ability to formulate statistical hypotheses, execute multivariate analyses, and interpret official surveys."
    },
    {
      id: "comp_2",
      name: "Data Visualization",
      category: "Technical & Delivery",
      current: 40,
      required: 80,
      gap: 40,
      priority: "Critical",
      color: "#ef4444",
      description: "Designing intuitive dashboards, charts, and public policy visuals using Power BI, Tableau, and standard chart grammar."
    },
    {
      id: "comp_3",
      name: "Digital Governance",
      category: "Administrative",
      current: 55,
      required: 75,
      gap: 20,
      priority: "High",
      color: "#f59e0b",
      description: "Knowledge of eOffice 7.0, digital public infrastructure, cyber security protocols, and Government data governance frameworks."
    },
    {
      id: "comp_4",
      name: "Data Management",
      category: "Technical",
      current: 65,
      required: 75,
      gap: 10,
      priority: "Medium",
      color: "#8b5cf6",
      description: "Data validation, SQL queries, database indexing, and adherence to NDAP (National Data & Analytics Platform) standards."
    },
    {
      id: "comp_5",
      name: "Communication",
      category: "Behavioral",
      current: 80,
      required: 80,
      gap: 0,
      priority: "No Gap",
      color: "#10b981",
      description: "Preparation of inter-departmental briefs, press releases, stakeholder presentations, and official memos."
    }
  ],

  // Competency Mapping Structure
  competencyMapping: {
    role: "Statistical Officer",
    ministry: "Ministry of Statistics and Programme Implementation",
    mappings: [
      {
        id: "map_1",
        task: "Analyze Government Data",
        taskDesc: "Evaluate census, NSSO, and industrial survey datasets",
        competency: "Data Analysis",
        competencyDesc: "Exploratory & inferential statistical computation",
        skills: ["Python", "Excel", "Statistics", "R Programming"]
      },
      {
        id: "map_2",
        task: "Prepare Reports",
        taskDesc: "Generate monthly index bulletins and executive briefings",
        competency: "Data Visualization",
        competencyDesc: "Visual storytelling & executive dashboard creation",
        skills: ["Power BI", "Tableau", "Chart Selection", "D3.js Basics"]
      },
      {
        id: "map_3",
        task: "Use Statistical Tools",
        taskDesc: "Run survey sampling designs and calculate standard errors",
        competency: "Statistical Methods",
        competencyDesc: "Probability distribution and sample stratification",
        skills: ["Sampling", "Survey Methods", "Hypothesis Testing", "Time Series"]
      },
      {
        id: "map_4",
        task: "Support Policy Planning",
        taskDesc: "Provide statistical validation for cross-ministry schemes",
        competency: "Digital Governance",
        competencyDesc: "Safe government data sharing and compliance",
        skills: ["eOffice", "Data Security", "Cyber Hygiene", "NDAP Protocols"]
      }
    ]
  },

  // AI Learning Recommendations
  recommendations: [
    {
      id: "rec_1",
      courseName: "Advanced Data Visualization & Ministry Dashboards",
      competency: "Data Visualization",
      provider: "iGOT Karmayogi × NIC Data Centre",
      currentLevel: 40,
      targetLevel: 80,
      gap: 40,
      priority: "Critical",
      duration: "6 Hours",
      modulesCount: 4,
      difficulty: "Intermediate to Advanced",
      recommendedModule: "Module 3: Transforming Complex Government Datasets into Executive Dashboards with Power BI & Tableau",
      reason: "Your current Data Visualization competency is 40%, while your job role as Statistical Officer requires 80%. Competency Gap: 40%. Priority: Critical.",
      badge: "iGOT Verified",
      isPrimaryDemo: true
    },
    {
      id: "rec_2",
      courseName: "Digital Governance & eOffice 7.0 Security Workflows",
      competency: "Digital Governance",
      provider: "National Institute of Smart Governance (NISG)",
      currentLevel: 55,
      targetLevel: 75,
      gap: 20,
      priority: "High",
      duration: "4.5 Hours",
      modulesCount: 3,
      difficulty: "Intermediate",
      recommendedModule: "Module 2: Inter-Ministerial File Routing & Digital Signatures",
      reason: "Your current Digital Governance competency is 55%, while your role requires 75%. Competency Gap: 20%. Priority: High.",
      badge: "NIC Recommended"
    },
    {
      id: "rec_3",
      courseName: "National Survey Data Management & Quality Protocols",
      competency: "Data Management",
      provider: "MoSPI Training Academy",
      currentLevel: 65,
      targetLevel: 75,
      gap: 10,
      priority: "Medium",
      duration: "3 Hours",
      modulesCount: 2,
      difficulty: "Foundational",
      recommendedModule: "Module 1: Survey Validation & Missing Data Imputation",
      reason: "Your current Data Management competency is 65%, while your role benchmark is 75%. Competency Gap: 10%. Priority: Medium.",
      badge: "MoSPI Standard"
    },
    {
      id: "rec_4",
      courseName: "Time Series & Economic Forecasting for Public Policy",
      competency: "Statistical Analysis",
      provider: "Indian Statistical Institute (ISI) Kolkata",
      currentLevel: 70,
      targetLevel: 80,
      gap: 10,
      priority: "Medium",
      duration: "8 Hours",
      modulesCount: 5,
      difficulty: "Advanced",
      recommendedModule: "Module 4: Seasonal Adjustment & CPI Trends",
      reason: "Your current Statistical Analysis competency is 70%, target is 80%. Competency Gap: 10%. Priority: Medium.",
      badge: "ISI Certified"
    }
  ],

  // Adaptive Question Bank for Data Visualization Assessment
  questions: [
    {
      id: 1,
      difficulty: "Medium",
      topic: "Chart Selection",
      text: "Which type of chart is best suited for showing the trend of data over continuous time intervals in government economic reporting?",
      options: [
        "A. Pie Chart",
        "B. Bar Chart",
        "C. Line Chart",
        "D. Scatter Plot"
      ],
      correctIndex: 2,
      explanation: "Line charts represent continuous trends over chronological time intervals (e.g., monthly CPI or quarterly GDP growth), making trend direction immediately apparent."
    },
    {
      id: 2,
      difficulty: "Medium",
      topic: "Categorical Comparison",
      text: "When comparing categorical expenditure across 12 distinct ministry departments with lengthy names, which visualization format is most effective?",
      options: [
        "A. Horizontal Bar Chart",
        "B. 3D Donut Chart",
        "C. Radar Spider Chart",
        "D. Funnel Chart"
      ],
      correctIndex: 0,
      explanation: "Horizontal bar charts provide natural horizontal reading orientation for long department labels without text tilting or clipping."
    },
    {
      id: 3,
      difficulty: "Easy",
      topic: "Executive Dashboard Design",
      text: "In an executive ministry dashboard, what is the primary role of a 'KPI Metric Summary Card' at the top of the interface?",
      options: [
        "A. To provide decorative color accents to fill empty whitespace",
        "B. To display high-level aggregate metrics and status against predefined targets at a single glance",
        "C. To replace all underlying raw datasets and eliminate audits",
        "D. To run complex background database migrations"
      ],
      correctIndex: 1,
      explanation: "KPI summary cards give senior administrators instant situational awareness by presenting headline figures and delta indicators."
    },
    {
      id: 4,
      difficulty: "Hard",
      topic: "Visual Perception & Standards",
      text: "Why do national data publishing guidelines (MoSPI and international statistical standards) discourage the use of 3D Pie Charts?",
      options: [
        "A. They take excessive processing power to render in web browsers",
        "B. Perspective tilt distorts geometric area and angle, misleading human visual perception of true proportions",
        "C. 3D graphics cannot be exported into PDF documents",
        "D. Color printing costs increase significantly"
      ],
      correctIndex: 1,
      explanation: "3D tilt makes the slice closest to the viewer look disproportionately larger than slices in the background, violating accurate data representation principles."
    },
    {
      id: 5,
      difficulty: "Medium",
      topic: "Distribution & Outlier Detection",
      text: "Which statistical visualization is ideal for examining distribution quartiles, median skewness, and identifying survey outliers across districts?",
      options: [
        "A. Box and Whisker Plot",
        "B. Gauge Meter Chart",
        "C. Concentric Donut Chart",
        "D. Waterfall Flow Chart"
      ],
      correctIndex: 0,
      explanation: "Box plots succinctly reveal the median, interquartile range (IQR), minimum, maximum, and statistical outliers across cohorts."
    },
    {
      id: 6,
      difficulty: "Hard",
      topic: "Data-Ink Ratio",
      text: "According to Edward Tufte's fundamental visual principle, how should a government statistical officer optimize the 'Data-Ink Ratio'?",
      options: [
        "A. Maximize heavy dark borders, heavy grid lines, and decorative drop-shadows",
        "B. Devote the maximum ink/pixels to displaying the core data itself while eliminating redundant non-data clutter",
        "C. Use bright saturated colors for every single visual element",
        "D. Print dashboards in physical paper format only"
      ],
      correctIndex: 1,
      explanation: "Maximizing the data-ink ratio ensures that non-data ink (chartjunk, thick gridlines, excessive ornamentation) does not distract from statistical insights."
    },
    {
      id: 7,
      difficulty: "Easy",
      topic: "Government BI Tooling",
      text: "Which of the following represents an enterprise-grade business intelligence platform frequently deployed for state and district dashboard monitoring?",
      options: [
        "A. Microsoft Power BI / Apache Superset",
        "B. Notepad++",
        "C. VLC Media Player",
        "D. Adobe Illustrator"
      ],
      correctIndex: 0,
      explanation: "Power BI and open-source Apache Superset are standard enterprise BI engines supporting interactive filters, DAX queries, and live database connectors."
    },
    {
      id: 8,
      difficulty: "Hard",
      topic: "Geospatial Thematic Mapping",
      text: "In geospatial mapping of state-level infant mortality rates or literacy rates, which thematic map applies proportional color shading?",
      options: [
        "A. Choropleth Map",
        "B. Isarithmic Elevation Map",
        "C. Cadastral Survey Boundary Map",
        "D. Bathymetric Depth Map"
      ],
      correctIndex: 0,
      explanation: "A choropleth map shades geographic areas (states/districts) in proportion to an aggregate statistical variable using an ordered color scale."
    },
    {
      id: 9,
      difficulty: "Medium",
      topic: "Accessibility & GIGW Standards",
      text: "Under the Guidelines for Indian Government Websites (GIGW) and WCAG 2.1 AA, what is mandatory when using color in public data visualizations?",
      options: [
        "A. Only red and green may be used to convey pass/fail status",
        "B. Visual cues must never rely on color alone; text labels, patterns, or tooltips must accompany color variations",
        "C. Visualizations must be rasterized into unreadable JPEG images",
        "D. Contrast ratios should not exceed 1.5:1"
      ],
      correctIndex: 1,
      explanation: "Colorblind users cannot distinguish red/green easily; dual coding (color + text labels or patterns) is mandatory for government accessibility standards."
    },
    {
      id: 10,
      difficulty: "Medium",
      topic: "Interactive Drill-Downs",
      text: "What strategic advantage does an interactive drill-down hierarchy provide in a high-level review with the Ministry Secretary?",
      options: [
        "A. It hides unflattering performance figures from the review committee",
        "B. It allows executives to view nationwide aggregates and immediately drill down into state, district, or block root causes",
        "C. It permanently decouples the dashboard from the live database",
        "D. It removes the necessity of authenticating data sources"
      ],
      correctIndex: 1,
      explanation: "Hierarchical drill-downs empower decision-makers to inspect the macro perspective and seamlessly investigate micro variances without opening separate spreadsheets."
    }
  ],

  // Admin Dashboard Sample Data
  adminStats: {
    totalEmployees: 1420,
    departmentsCount: 18,
    criticalSkillGaps: 84,
    activePrograms: 42,
    assessmentsCompleted: 3890,
    departments: [
      { name: "MoSPI", total: 320, criticalGaps: 18, highGaps: 42, avgScore: 76 },
      { name: "Dept of Economic Affairs", total: 240, criticalGaps: 14, highGaps: 28, avgScore: 79 },
      { name: "Dept of Revenue", total: 410, criticalGaps: 22, highGaps: 54, avgScore: 68 },
      { name: "NITI Aayog", total: 180, criticalGaps: 8, highGaps: 18, avgScore: 84 },
      { name: "DoPT", total: 270, criticalGaps: 22, highGaps: 36, avgScore: 72 }
    ],
    employeesList: [
      {
        id: "GOV-STAT-2021-089",
        name: "Rahul Sharma",
        department: "MoSPI",
        role: "Statistical Officer",
        competencyScore: 78,
        criticalGaps: 3,
        trainingProgress: 60,
        status: "Active"
      },
      {
        id: "GOV-REV-2019-142",
        name: "Priya Patel",
        department: "Dept of Revenue",
        role: "Tax Officer",
        competencyScore: 62,
        criticalGaps: 4,
        trainingProgress: 35,
        status: "Under Review"
      },
      {
        id: "GOV-STAT-2018-044",
        name: "Amit Verma",
        department: "MoSPI",
        role: "Senior Investigator",
        competencyScore: 84,
        criticalGaps: 1,
        trainingProgress: 90,
        status: "Certified"
      },
      {
        id: "GOV-DOPT-2020-311",
        name: "Neha Gupta",
        department: "DoPT",
        role: "Admin Officer",
        competencyScore: 71,
        criticalGaps: 2,
        trainingProgress: 55,
        status: "Active"
      },
      {
        id: "GOV-NITI-2022-019",
        name: "Rajesh Kumar",
        department: "NITI Aayog",
        role: "Policy Analyst",
        competencyScore: 89,
        criticalGaps: 0,
        trainingProgress: 100,
        status: "Certified"
      },
      {
        id: "GOV-FIN-2017-088",
        name: "Vikramaditya Singh",
        department: "Ministry of Finance",
        role: "Accounts Officer",
        competencyScore: 66,
        criticalGaps: 3,
        trainingProgress: 45,
        status: "Action Required"
      }
    ]
  }
};

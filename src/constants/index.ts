import type { NavLink, Skill, SocialLink, Experience, Education } from "@/types";

export const NAV_LINKS: NavLink[] = [
  { label: "Systems", href: "#systems" },
  { label: "Skills", href: "#skills" },
  { label: "Journey", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/lavanya-s-1054711a2/",
  },
  {
    label: "Email",
    href: "mailto:lavanyasirimalla@gmail.com",
  },
];

export const SKILLS: Skill[] = [
  { name: "Selenium WebDriver", category: "automation" },
  { name: "Playwright", category: "automation" },
  { name: "TestNG", category: "automation" },
  { name: "Cucumber BDD", category: "automation" },
  { name: "Apache JMeter", category: "automation" },
  { name: "SoapUI", category: "automation" },
  { name: "SeeTest Mobile", category: "automation" },
  { name: "REST Assured", category: "automation" },
  { name: "QTP / UFT", category: "automation" },
  { name: "Page Object Model", category: "frameworks" },
  { name: "Data Driven", category: "frameworks" },
  { name: "Keyword Driven", category: "frameworks" },
  { name: "Hybrid Framework", category: "frameworks" },
  { name: "BDD / Gherkin", category: "frameworks" },
  { name: "Postman", category: "api" },
  { name: "REST APIs", category: "api" },
  { name: "SOAP / WSDL", category: "api" },
  { name: "XML / JSON", category: "api" },
  { name: "Network Interception", category: "api" },
  { name: "Core Java", category: "languages" },
  { name: "TypeScript", category: "languages" },
  { name: "SQL", category: "languages" },
  { name: "Oracle", category: "languages" },
  { name: "Azure DevOps Pipelines", category: "devops" },
  { name: "Jenkins", category: "devops" },
  { name: "Maven", category: "devops" },
  { name: "Git / GitHub", category: "devops" },
  { name: "Azure Boards", category: "devops" },
  { name: "OpenAI / LLM", category: "ai" },
  { name: "GitHub Copilot", category: "ai" },
  { name: "AI-Assisted Testing", category: "ai" },
  { name: "Azure DevOps", category: "management" },
  { name: "HP ALM / QC", category: "management" },
  { name: "JIRA", category: "management" },
  { name: "Bugzilla", category: "management" },
];

export const ALL_TECH = [
  "Selenium", "Playwright", "TestNG", "Cucumber", "JMeter", "Postman",
  "REST Assured", "Azure DevOps", "Jenkins", "Git", "Java", "TypeScript",
  "SQL", "Oracle", "Maven", "JIRA", "HP ALM", "SoapUI", "QTP",
  "OpenAI", "Copilot", "BDD", "POM", "CI/CD", "Docker",
  "API Testing", "Mobile Testing", "Performance Testing", "AI Testing",
  "Agile", "Scrum", "Data Driven", "Hybrid Framework",
];

export const EXPERIENCE: Experience[] = [
  {
    id: 1,
    company: "1st Franklin Financial",
    location: "Atlanta, GA",
    url: "https://www.1ffc.com",
    role: "Senior QA Automation Engineer",
    period: "Sep 2021 – Jun 2026",
    domain: "Banking & Finance",
    color: "cyan",
    tech: ["Selenium", "Playwright", "Azure DevOps", "Postman", "TypeScript", "AI Testing"],
    highlights: [
      "Led QA for core banking applications",
      "Selenium → Playwright migration",
      "AI-powered document validation",
      "CI/CD pipeline optimization",
    ],
  },
  {
    id: 2,
    company: "HealthEdge",
    location: "Virginia, USA",
    url: "https://www.healthedge.com",
    role: "QA Automation Engineer",
    period: "Feb 2020 – Aug 2021",
    domain: "Healthcare",
    color: "rose",
    tech: ["Selenium", "Karate", "GraphQL", "Appium", "Cypress", "HIPAA"],
    highlights: [
      "Automated claims & member enrollment flows",
      "Karate API & GraphQL validation",
      "Appium mobile regression (iOS / Android)",
      "HIPAA-aware test data handling",
    ],
  },
  {
    id: 3,
    company: "Netcracker Technologies",
    location: "Hyderabad, India",
    url: "https://www.netcracker.com",
    role: "Sr. Software Test Engineer",
    period: "Apr 2016 – Nov 2017",
    domain: "Telecom",
    color: "violet",
    tech: ["Selenium", "Java", "Postman", "SQL", "Agile", "REST APIs"],
    highlights: [
      "Automated Telecom order provisioning",
      "API & microservice validation",
      "Mentored junior engineers",
    ],
  },
  {
    id: 4,
    company: "Amdocs",
    location: "Pune, India",
    url: "https://www.amdocs.com",
    role: "Sr. Software Test Engineer",
    period: "Dec 2011 – Mar 2016",
    domain: "Telecom",
    color: "fuchsia",
    tech: ["QTP", "SeeTest", "HP ALM", "SQL", "Mobile Testing", "UAT"],
    highlights: [
      "Cross-platform mobile automation",
      "HP ALM test management",
      "End-to-end UAT cycles",
    ],
  },
  {
    id: 5,
    company: "Mahindra Satyam (Tech Mahindra)",
    location: "Hyderabad, India",
    url: "https://www.techmahindra.com",
    role: "Associate",
    period: "Jun 2010 – Jul 2011",
    domain: "Enterprise",
    color: "emerald",
    tech: ["Manual Testing", "Regression", "Defect Lifecycle", "Test Cases"],
    highlights: [
      "Foundation in structured testing",
      "Full defect lifecycle ownership",
    ],
  },
];

export const EDUCATION: Education[] = [
  {
    id: 1,
    degree: "Bachelor of Computer Science (BSc)",
    institution: "Kasturba Gandhi College, Osmania University",
    location: "Hyderabad, India",
    period: "June 2003 – June 2005",
  },
  {
    id: 2,
    degree: "Master of Computer Applications (MCA)",
    institution: "Osmania University",
    location: "Hyderabad, India",
    period: "2007 – 2009",
  },
];

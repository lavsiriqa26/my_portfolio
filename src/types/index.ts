export interface Experience {
  id: number;
  company: string;
  location: string;
  url?: string;
  role: string;
  period: string;
  current?: boolean;
  domain: string;
  color: string;
  tech: string[];
  highlights: string[];
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  location: string;
  period: string;
}

export interface Skill {
  name: string;
  category:
    | "automation"
    | "frameworks"
    | "api"
    | "languages"
    | "devops"
    | "ai"
    | "management";
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

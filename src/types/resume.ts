export type Language = 'en' | 'zh';

export type TemplateId =
  | 'executive'
  | 'harvard'
  | 'minimal'
  | 'tech'
  | 'editorial'
  | 'swiss'
  | 'nordic'
  | 'slate';

export type FontFamilyId = 'inter' | 'merriweather' | 'mono';
export type PageSize = 'letter' | 'a4';

export type SectionType =
  | 'summary'
  | 'experience'
  | 'projects'
  | 'education'
  | 'skills'
  | 'custom';

export interface BasicInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  avatar: string;
  showAvatar: boolean;
}

export interface TimelineItem {
  id: string;
  title: string; // Company or University
  subtitle: string; // Role or Degree
  location: string;
  date: string;
  description: string; // Bullet points, one per line
}

export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  date: string;
  url: string;
  techStack: string[];
  description: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  textContent?: string;
  timelineItems?: TimelineItem[];
  projectItems?: ProjectItem[];
  skillGroups?: SkillGroup[];
}

export interface ThemeConfig {
  template: TemplateId;
  accentColor: string;
  fontFamily: FontFamilyId;
  fontSize: 'sm' | 'md' | 'lg';
  pageSize: PageSize;
}

export type AIProviderId = 'openai' | 'deepseek' | 'gemini' | 'openrouter' | 'custom';

export interface AIConfig {
  provider: AIProviderId;
  apiUrl: string;
  apiKey: string;
  model: string;
}

export interface ResumeData {
  language: Language;
  basics: BasicInfo;
  sections: ResumeSection[];
  theme: ThemeConfig;
}

export interface AITailorResult {
  atsScoreBefore: number;
  atsScoreAfter: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  rationale: string;
  updatedSummary?: string;
  updatedExperience?: Array<{ id: string; description: string }>;
  updatedProjects?: Array<{ id: string; description: string }>;
  suggestedSkillsToAdd?: string[];
}

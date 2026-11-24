import type { AIConfig, ResumeData } from '../types/resume';

export const DEFAULT_RESUME_DATA: ResumeData = {
  language: 'en',
  basics: {
    name: 'Alex Morgan',
    title: 'Senior Full-Stack Product Engineer',
    email: 'alex.morgan@example.com',
    phone: '+1 (415) 555-0194',
    location: 'San Francisco, CA',
    website: 'alexmorgan.dev',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
    avatar: '',
    showAvatar: false,
  },
  sections: [
    {
      id: 'sec-summary',
      type: 'summary',
      title: 'Professional Summary',
      visible: true,
      textContent:
        'Product-minded Full-Stack Engineer with 7+ years of experience scaling B2B SaaS platforms, high-throughput payment flows, and developer tools from 0 to millions of users. Proven track record shipping accessible React/TypeScript interfaces backed by resilient Node.js and Go microservices.',
    },
    {
      id: 'sec-experience',
      type: 'experience',
      title: 'Experience',
      visible: true,
      timelineItems: [
        {
          id: 'exp-1',
          title: 'Stripe',
          subtitle: 'Senior Software Engineer, Checkout & Billing',
          location: 'San Francisco, CA',
          date: 'Mar 2023 – Present',
          description:
            '• Architected adaptive one-click checkout components in React & TypeScript, lifting global merchant conversion by +4.2% across $18B+ annualized volume.\n• Reduced p95 API latency on tax and currency calculation endpoints from 310ms to 88ms by introducing edge caching and batched Redis lookups.\n• Led a cross-functional squad of 5 engineers to launch instant invoice links, adopted by 42,000+ SMBs in Q1.',
        },
        {
          id: 'exp-2',
          title: 'Linear',
          subtitle: 'Full-Stack Product Engineer',
          location: 'Remote (US)',
          date: 'Jun 2020 – Feb 2023',
          description:
            '• Built local-first sync engine primitives using IndexedDB and delta snapshots, keeping workspace navigation under 16ms for 100k+ issue graphs.\n• Designed and shipped keyboard-first command palette workflows and automated GitHub PR state linking used daily by 65% of active teams.\n• Improved client bundle cold-start time by 34% via route-level code splitting and zero-runtime CSS migration.',
        },
        {
          id: 'exp-3',
          title: 'Datadog',
          subtitle: 'Software Engineer, Observability UI',
          location: 'New York, NY',
          date: 'Jul 2018 – May 2020',
          description:
            '• Developed real-time WebGL/Canvas time-series log explorers capable of scrubbing 500k events/sec smoothly in browser.\n• Standardized shared accessible UI primitives across 14 product teams, cutting front-end regression bugs by 28%.',
        },
      ],
    },
    {
      id: 'sec-projects',
      type: 'projects',
      title: 'Featured Projects',
      visible: true,
      projectItems: [
        {
          id: 'proj-1',
          name: 'EdgePulse Telemetry',
          role: 'Creator & Maintainer (3.4k GitHub Stars)',
          date: '2024',
          url: 'https://github.com/alexmorgan/edgepulse',
          techStack: ['TypeScript', 'Cloudflare Workers', 'ClickHouse', 'React'],
          description:
            '• Open-source privacy-first web vitals & analytics collector running on edge workers with <2KB client footprint.',
        },
        {
          id: 'proj-2',
          name: 'PromptDiff Studio',
          role: 'Open-Source Contributor',
          date: '2023',
          url: 'https://github.com/alexmorgan/promptdiff',
          techStack: ['Next.js', 'Tailwind CSS', 'OpenAI API'],
          description:
            '• Side-by-side LLM prompt regression evaluator with deterministic JSON schema validation and token cost telemetry.',
        },
      ],
    },
    {
      id: 'sec-education',
      type: 'education',
      title: 'Education',
      visible: true,
      timelineItems: [
        {
          id: 'edu-1',
          title: 'University of California, Berkeley',
          subtitle: 'B.S. in Electrical Engineering & Computer Sciences (EECS)',
          location: 'Berkeley, CA',
          date: '2014 – 2018',
          description:
            '• GPA: 3.87 / 4.0 · Dean’s Honors List · Teaching Assistant for CS162 (Operating Systems).',
        },
      ],
    },
    {
      id: 'sec-skills',
      type: 'skills',
      title: 'Technical Skills',
      visible: true,
      skillGroups: [
        {
          id: 'sk-1',
          category: 'Languages & Frameworks',
          items: ['TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Go', 'Python', 'SQL'],
        },
        {
          id: 'sk-2',
          category: 'Infrastructure & Data',
          items: ['PostgreSQL', 'Redis', 'AWS', 'Cloudflare Workers', 'Docker', 'GraphQL', 'CI/CD'],
        },
        {
          id: 'sk-3',
          category: 'Product & Engineering',
          items: ['System Design', 'Web Performance', 'ATS Accessibility', 'A/B Experimentation'],
        },
      ],
    },
  ],
  theme: {
    template: 'executive',
    accentColor: '#4F46E5',
    fontFamily: 'inter',
    fontSize: 'md',
    pageSize: 'letter',
  },
};

export const DEFAULT_AI_CONFIG: AIConfig = {
  provider: 'openai',
  apiUrl: 'https://api.openai.com/v1/chat/completions',
  apiKey: '',
  model: 'gpt-4o-mini',
};

export const AI_PROVIDER_PRESETS: Record<
  AIConfig['provider'],
  { label: string; apiUrl: string; defaultModel: string; keyHint: string }
> = {
  openai: {
    label: 'OpenAI',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    defaultModel: 'gpt-4o-mini',
    keyHint: 'sk-...',
  },
  deepseek: {
    label: 'DeepSeek',
    apiUrl: 'https://api.deepseek.com/v1/chat/completions',
    defaultModel: 'deepseek-chat',
    keyHint: 'sk-...',
  },
  gemini: {
    label: 'Google Gemini (OpenAI Compat)',
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    defaultModel: 'gemini-2.0-flash',
    keyHint: 'AIza...',
  },
  openrouter: {
    label: 'OpenRouter',
    apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
    defaultModel: 'openai/gpt-4o-mini',
    keyHint: 'sk-or-...',
  },
  custom: {
    label: 'Custom OpenAI-Compatible',
    apiUrl: 'http://localhost:11434/v1/chat/completions',
    defaultModel: 'llama3.1',
    keyHint: 'Optional for local Ollama',
  },
};

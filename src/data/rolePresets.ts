import type {
  BasicInfo,
  FontFamilyId,
  ProjectItem,
  ResumeData,
  ResumeSection,
  SkillGroup,
  TemplateId,
  TimelineItem,
} from '../types/resume';

export interface RolePreset {
  slug: string;
  label: string;
  badge: string;
  data: ResumeData;
}

interface PresetSpec {
  slug: string;
  label: string;
  badge: string;
  template: TemplateId;
  accentColor: string;
  fontFamily?: FontFamilyId;
  basics: Partial<BasicInfo> & { name: string; title: string; email: string };
  summary: string;
  experience: Array<Omit<TimelineItem, 'id'>>;
  projects?: Array<Omit<ProjectItem, 'id'>>;
  education: Array<Omit<TimelineItem, 'id'>>;
  skills: Array<Omit<SkillGroup, 'id'>>;
  extraSections?: Array<{ title: string; textContent: string }>;
  educationFirst?: boolean;
}

function makePreset(spec: PresetSpec): RolePreset {
  const sections: ResumeSection[] = [
    {
      id: `${spec.slug}-summary`,
      type: 'summary',
      title: 'Professional Summary',
      visible: true,
      textContent: spec.summary,
    },
  ];

  const eduSection: ResumeSection = {
    id: `${spec.slug}-edu`,
    type: 'education',
    title: 'Education',
    visible: true,
    timelineItems: spec.education.map((item, i) => ({ ...item, id: `${spec.slug}-edu-${i + 1}` })),
  };

  const expSection: ResumeSection = {
    id: `${spec.slug}-exp`,
    type: 'experience',
    title: spec.slug === 'academic-cv' ? 'Academic Appointments' : 'Experience',
    visible: true,
    timelineItems: spec.experience.map((item, i) => ({ ...item, id: `${spec.slug}-exp-${i + 1}` })),
  };

  if (spec.educationFirst) {
    sections.push(eduSection, expSection);
  } else {
    sections.push(expSection);
  }

  if (spec.projects?.length) {
    sections.push({
      id: `${spec.slug}-proj`,
      type: 'projects',
      title: 'Featured Projects',
      visible: true,
      projectItems: spec.projects.map((p, i) => ({ ...p, id: `${spec.slug}-proj-${i + 1}` })),
    });
  }

  if (!spec.educationFirst) {
    sections.push(eduSection);
  }

  if (spec.extraSections?.length) {
    spec.extraSections.forEach((extra, i) => {
      sections.push({
        id: `${spec.slug}-extra-${i + 1}`,
        type: 'custom',
        title: extra.title,
        visible: true,
        textContent: extra.textContent,
      });
    });
  }

  sections.push({
    id: `${spec.slug}-skills`,
    type: 'skills',
    title: 'Skills & Tools',
    visible: true,
    skillGroups: spec.skills.map((g, i) => ({ ...g, id: `${spec.slug}-sk-${i + 1}` })),
  });

  return {
    slug: spec.slug,
    label: spec.label,
    badge: spec.badge,
    data: {
      language: 'en',
      basics: {
        name: spec.basics.name,
        title: spec.basics.title,
        email: spec.basics.email,
        phone: spec.basics.phone ?? '+1 (415) 555-0148',
        location: spec.basics.location ?? 'San Francisco, CA',
        website: spec.basics.website ?? '',
        linkedin: spec.basics.linkedin ?? '',
        github: spec.basics.github ?? '',
        avatar: '',
        showAvatar: false,
      },
      sections,
      theme: {
        template: spec.template,
        accentColor: spec.accentColor,
        fontFamily: spec.fontFamily ?? 'inter',
        fontSize: 'md',
        pageSize: 'letter',
      },
    },
  };
}

const PRESET_SPECS: PresetSpec[] = [
  {
    slug: 'software-engineer',
    label: 'Software Engineer',
    badge: 'Tech Terminal',
    template: 'tech',
    accentColor: '#4F46E5',
    basics: {
      name: 'Liam Carter',
      title: 'Senior Backend & Distributed Systems Engineer',
      email: 'liam.carter@example.com',
      location: 'Seattle, WA',
      website: 'liamcarter.dev',
      linkedin: 'linkedin.com/in/liamcarter',
      github: 'github.com/liamcarter',
    },
    summary:
      'Systems-oriented Software Engineer with 6+ years building low-latency Go, Rust, and TypeScript microservices serving 40M+ daily requests at 99.99% uptime.',
    experience: [
      {
        title: 'Cloudflare',
        subtitle: 'Senior Systems Engineer, Edge Routing',
        location: 'Seattle, WA',
        date: 'Apr 2023 – Present',
        description:
          '• Rewrote request telemetry ingestion pipeline in Rust + Kafka, cutting p99 tail latency by 62% (from 145ms to 55ms) and saving $420K/yr in EC2 compute.\n• Designed zero-downtime blue/green schema migrations across 18 PostgreSQL shards supporting 2.1M active edge workers.',
      },
      {
        title: 'Twilio',
        subtitle: 'Software Engineer II, Messaging Core',
        location: 'San Francisco, CA',
        date: 'Jun 2020 – Mar 2023',
        description:
          '• Built adaptive rate-limiting middleware in Go + Redis Lua scripts, eliminating cascading retries during 10x Black Friday traffic spikes.\n• Reduced CI build & integration test duration from 24m to 6m using Buildkite caching and ephemeral testcontainers.',
      },
    ],
    projects: [
      {
        name: 'ChronosKV',
        role: 'Creator (2.8k GitHub Stars)',
        date: '2025',
        url: 'https://github.com/liamcarter/chronoskv',
        techStack: ['Rust', 'Raft', 'gRPC', 'Docker'],
        description:
          '• Raft-consensus embedded key-value store with deterministic simulation testing and Prometheus metrics.',
      },
    ],
    education: [
      {
        title: 'University of Washington',
        subtitle: 'B.S. in Computer Science',
        location: 'Seattle, WA',
        date: '2016 – 2020',
        description: '• GPA: 3.84 / 4.0 · Distributed Systems Lab Undergraduate Researcher.',
      },
    ],
    skills: [
      { category: 'Languages', items: ['Go', 'Rust', 'TypeScript', 'Python', 'SQL'] },
      { category: 'Infrastructure', items: ['PostgreSQL', 'Kafka', 'Redis', 'Kubernetes', 'Terraform', 'AWS'] },
    ],
  },
  {
    slug: 'frontend-developer',
    label: 'Frontend Developer',
    badge: 'Aurora Glass',
    template: 'executive',
    accentColor: '#6366F1',
    basics: {
      name: 'Maya Lin',
      title: 'Staff Frontend & Design Systems Engineer',
      email: 'maya.lin@example.com',
      location: 'New York, NY',
      website: 'mayalin.codes',
      linkedin: 'linkedin.com/in/mayalin',
      github: 'github.com/mayalin',
    },
    summary:
      'Frontend Architect specializing in React 19, TypeScript, Core Web Vitals optimization, and WCAG 2.2 accessible design systems powering 12M+ monthly active users.',
    experience: [
      {
        title: 'Vercel',
        subtitle: 'Senior Frontend Engineer, Dashboard DX',
        location: 'New York, NY',
        date: 'Feb 2023 – Present',
        description:
          '• Reduced Largest Contentful Paint (LCP) across deployment logs by 48% via streaming Server Components and virtualized log buffers.\n• Authored 35+ accessible Radix-based primitives adopted across 9 product squads, cutting duplicate UI code by 41%.',
      },
      {
        title: 'Figma',
        subtitle: 'Frontend Product Engineer',
        location: 'San Francisco, CA',
        date: 'Jul 2020 – Jan 2023',
        description:
          '• Shipped real-time multiplayer comment threads and keyboard navigation shortcuts used by 4M+ designers weekly.\n• Migrated legacy Redux modules to React Query + Zustand, dropping initial JS bundle size by 190KB gzipped.',
      },
    ],
    projects: [
      {
        name: 'MotionGrid UI',
        role: 'Author (1.9k GitHub Stars)',
        date: '2025',
        url: 'https://github.com/mayalin/motiongrid',
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'CSS Grid'],
        description:
          '• Zero-dependency 60fps CSS layout transition primitives with automatic prefers-reduced-motion compliance.',
      },
    ],
    education: [
      {
        title: 'New York University',
        subtitle: 'B.S. in Computer Science & Interactive Media',
        location: 'New York, NY',
        date: '2016 – 2020',
        description: '• Magna Cum Laude · Founder, NYU Web Accessibility Club.',
      },
    ],
    skills: [
      { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'WebGL', 'WCAG 2.2'] },
      { category: 'Tooling & Perf', items: ['Vite', 'Playwright', 'Core Web Vitals', 'GraphQL', 'Storybook'] },
    ],
  },
  {
    slug: 'data-scientist',
    label: 'Data Scientist & ML Engineer',
    badge: 'Tech Terminal',
    template: 'tech',
    accentColor: '#059669',
    basics: {
      name: 'Arjun Patel',
      title: 'Senior Data Scientist & Applied ML Engineer',
      email: 'arjun.patel@example.com',
      location: 'Austin, TX',
      website: 'arjunpatel.ai',
      linkedin: 'linkedin.com/in/arjunpatel',
      github: 'github.com/arjunpatel-ml',
    },
    summary:
      'Applied ML Engineer & Data Scientist with 5+ years turning noisy behavioral datasets into production ranking, churn-prediction, and RAG evaluation pipelines.',
    experience: [
      {
        title: 'Spotify',
        subtitle: 'Senior Data Scientist, Personalization',
        location: 'Remote (US)',
        date: 'May 2023 – Present',
        description:
          '• Trained two-tower neural retrieval models for cold-start podcast discovery, increasing 14-day listener retention by +6.8% across 18M MAU.\n• Built automated Bayesian A/B testing guardrails in Python + dbt, cutting experiment readout latency from 4 days to 6 hours.',
      },
      {
        title: 'DoorDash',
        subtitle: 'Data Scientist, Logistics Forecasting',
        location: 'San Francisco, CA',
        date: 'Aug 2020 – Apr 2023',
        description:
          '• Engineered LightGBM courier ETA models reducing mean absolute error by 19% across top 25 metro markets ($6.4M annual incentive savings).\n• Productionized feature store pipelines on Spark + Airflow handling 450M daily event rows.',
      },
    ],
    projects: [
      {
        name: 'EvalBench RAG',
        role: 'Maintainer',
        date: '2025',
        url: 'https://github.com/arjunpatel-ml/evalbench-rag',
        techStack: ['Python', 'PyTorch', 'DuckDB', 'FastAPI'],
        description:
          '• Lightweight retrieval faithfulness & hallucination benchmarking harness for hybrid BM25 + dense vector pipelines.',
      },
    ],
    education: [
      {
        title: 'Georgia Institute of Technology',
        subtitle: 'M.S. in Analytics (Computational Track)',
        location: 'Atlanta, GA',
        date: '2018 – 2020',
        description: '• GPA: 3.92 / 4.0 · Focus on Causal Inference & Deep Learning.',
      },
    ],
    skills: [
      { category: 'ML & Stats', items: ['Python', 'PyTorch', 'XGBoost', 'Causal Inference', 'A/B Testing', 'RAG'] },
      { category: 'Data Stack', items: ['SQL', 'Snowflake', 'dbt', 'Spark', 'Airflow', 'Docker'] },
    ],
  },
  {
    slug: 'devops-engineer',
    label: 'DevOps & SRE Engineer',
    badge: 'Slate Contrast',
    template: 'slate',
    accentColor: '#2563EB',
    basics: {
      name: 'Noah Kowalski',
      title: 'Staff DevOps & Site Reliability Engineer',
      email: 'noah.kowalski@example.com',
      location: 'Denver, CO',
      website: 'noahops.io',
      linkedin: 'linkedin.com/in/noahkowalski',
      github: 'github.com/nkowalski-sre',
    },
    summary:
      'Platform & SRE Engineer focused on multi-region Kubernetes, Terraform IaC, GitOps automation, and FinOps—cutting cloud spend while keeping 99.995% SLA.',
    experience: [
      {
        title: 'HashiCorp',
        subtitle: 'Senior Site Reliability Engineer',
        location: 'Remote (US)',
        date: 'Jan 2023 – Present',
        description:
          '• Automated multi-region EKS cluster provisioning with Terraform & ArgoCD, cutting new environment spin-up from 3 days to 14 minutes.\n• Right-sized Karpenter autoscaling and spot node pools, trimming monthly AWS bill by $78K (31%) with zero SLO breaches.',
      },
      {
        title: 'Atlassian',
        subtitle: 'DevOps Platform Engineer',
        location: 'Austin, TX',
        date: 'Jul 2019 – Dec 2022',
        description:
          '• Standardized OpenTelemetry + Grafana alerting across 60+ microservices, reducing Mean Time to Recovery (MTTR) from 42m to 9m.\n• Hardened container supply chains with Trivy image scanning and OIDC keyless GitHub Actions deploys.',
      },
    ],
    projects: [
      {
        name: 'KubeBudget CLI',
        role: 'Open-Source Author',
        date: '2025',
        url: 'https://github.com/nkowalski-sre/kubebudget',
        techStack: ['Go', 'Kubernetes', 'Prometheus'],
        description:
          '• Terminal analyzer identifying idle Kubernetes pods and over-provisioned PVCs directly from Prometheus metrics.',
      },
    ],
    education: [
      {
        title: 'University of Colorado Boulder',
        subtitle: 'B.S. in Information Systems',
        location: 'Boulder, CO',
        date: '2015 – 2019',
        description: '• AWS Certified Solutions Architect – Professional · CKA Certified.',
      },
    ],
    skills: [
      { category: 'Cloud & Orchestration', items: ['AWS', 'GCP', 'Kubernetes', 'Terraform', 'Helm', 'ArgoCD'] },
      { category: 'Observability & CI/CD', items: ['GitHub Actions', 'Prometheus', 'Grafana', 'OpenTelemetry', 'Linux'] },
    ],
  },
  {
    slug: 'cybersecurity-engineer',
    label: 'Cybersecurity Engineer',
    badge: 'Slate Contrast',
    template: 'slate',
    accentColor: '#DC2626',
    basics: {
      name: 'Elena Vance',
      title: 'Senior Application & Cloud Security Engineer',
      email: 'elena.vance@example.com',
      location: 'Washington, D.C.',
      website: 'elenavance.sec',
      linkedin: 'linkedin.com/in/elenavance',
      github: 'github.com/evance-sec',
    },
    summary:
      'Security Engineer specializing in cloud threat modeling, automated SAST/DAST pipelines, IAM least-privilege enforcement, and SOC 2 Type II readiness.',
    experience: [
      {
        title: 'CrowdStrike',
        subtitle: 'Senior Cloud Security Engineer',
        location: 'Remote (US)',
        date: 'Mar 2023 – Present',
        description:
          '• Designed automated AWS IAM permission boundary guardrails across 140+ accounts, reducing over-privileged roles by 87%.\n• Led quarterly purple-team cloud intrusion simulations and remediated 19 critical SSRF/OAuth flaws prior to production release.',
      },
      {
        title: 'Okta',
        subtitle: 'Application Security Engineer',
        location: 'San Francisco, CA',
        date: 'Jun 2020 – Feb 2023',
        description:
          '• Embedded Semgrep custom rules into 90+ GitHub repositories, catching 74% of injection and auth bypass patterns at PR review.\n• Partnered with compliance teams to pass SOC 2 Type II & ISO 27001 audits with zero major findings.',
      },
    ],
    projects: [
      {
        name: 'OAuthGuard Scanner',
        role: 'Creator',
        date: '2025',
        url: 'https://github.com/evance-sec/oauthguard',
        techStack: ['Python', 'Semgrep', 'OAuth 2.1', 'OIDC'],
        description:
          '• Open-source CLI auditing redirect URI validation and PKCE enforcement in modern SPA/API deployments.',
      },
    ],
    education: [
      {
        title: 'Carnegie Mellon University',
        subtitle: 'M.S. in Information Security (MSIS)',
        location: 'Pittsburgh, PA',
        date: '2018 – 2020',
        description: '• CISSP · AWS Security Specialty · CTF Team Captain.',
      },
    ],
    skills: [
      { category: 'AppSec & CloudSec', items: ['Threat Modeling', 'SAST/DAST', 'Semgrep', 'AWS IAM', 'Zero Trust', 'Burp Suite'] },
      { category: 'Compliance & Code', items: ['SOC 2', 'ISO 27001', 'Python', 'Go', 'Kubernetes Security'] },
    ],
  },
  {
    slug: 'product-manager',
    label: 'Product Manager',
    badge: 'Aurora Glass',
    template: 'executive',
    accentColor: '#4F46E5',
    basics: {
      name: 'Sophia Bennett',
      title: 'Senior Product Manager, B2B SaaS & AI Growth',
      email: 'sophia.bennett@example.com',
      location: 'San Francisco, CA',
      website: 'sophiabennett.pm',
      linkedin: 'linkedin.com/in/sophiabennett',
    },
    summary:
      'Data-driven Product Manager with 6+ years owning 0→1 AI workflows, self-serve PLG onboarding, and enterprise monetization scaling ARR from $12M to $48M.',
    experience: [
      {
        title: 'Notion',
        subtitle: 'Senior Product Manager, Onboarding & Activation',
        location: 'San Francisco, CA',
        date: 'Feb 2023 – Present',
        description:
          '• Redesigned interactive workspace templates and AI setup flows across 14 experiments, raising Team Trial-to-Paid conversion from 11.4% to 16.9% (+$9.2M ARR).\n• Killed 3 low-retention legacy widgets after cohort analysis, reclaiming 25% of engineering sprint capacity for core search.',
      },
      {
        title: 'Amplitude',
        subtitle: 'Product Manager, Analytics Platform',
        location: 'San Francisco, CA',
        date: 'Jul 2020 – Jan 2023',
        description:
          '• Launched natural-language SQL funnel builder from customer discovery interviews (60+ enterprise PMs) to 18,000 weekly active users.\n• Partnered with Pricing & Sales to introduce usage-based add-ons lifting Net Dollar Retention (NDR) by +8 points.',
      },
    ],
    projects: [
      {
        name: 'PM Teardown Archive',
        role: 'Author (14k Newsletter Readers)',
        date: '2025',
        url: 'https://sophiabennett.pm/teardowns',
        techStack: ['Product Strategy', 'SQL', 'PLG Pricing'],
        description:
          '• Bi-weekly teardown series analyzing activation loops and monetization experiments across top AI SaaS startups.',
      },
    ],
    education: [
      {
        title: 'Northwestern University',
        subtitle: 'B.A. in Economics & Computer Science',
        location: 'Evanston, IL',
        date: '2015 – 2019',
        description: '• Graduated with Distinction.',
      },
    ],
    skills: [
      { category: 'Product Craft', items: ['PLG Growth', 'Pricing & Packaging', 'A/B Experimentation', 'Customer Discovery', 'Roadmapping'] },
      { category: 'Technical & Data', items: ['SQL', 'Amplitude', 'Mixpanel', 'Figma', 'API Product Design'] },
    ],
  },
  {
    slug: 'ux-designer',
    label: 'UX / Product Designer',
    badge: 'Nordic Bento',
    template: 'nordic',
    accentColor: '#4F46E5',
    basics: {
      name: 'Clara Lindqvist',
      title: 'Senior Product & UX Designer (B2B & AI Tools)',
      email: 'clara.lindqvist@example.com',
      location: 'Los Angeles, CA',
      website: 'claralindqvist.design',
      linkedin: 'linkedin.com/in/claralindqvist',
    },
    summary:
      'Product Designer with 6+ years simplifying complex developer and fintech workflows into intuitive, WCAG-accessible interfaces backed by mixed-methods research.',
    experience: [
      {
        title: 'Mercury',
        subtitle: 'Senior Product Designer, Treasury & Billing',
        location: 'Remote (US)',
        date: 'May 2023 – Present',
        description:
          '• Overhauled wire approval & multi-entity permissions UX across 28 moderated usability sessions, cutting support tickets by 39% and halving task completion time.\n• Co-maintained a 180-component Figma Variables design system synced directly with React tokens.',
      },
      {
        title: 'Webflow',
        subtitle: 'Product Designer, Visual Editor',
        location: 'San Francisco, CA',
        date: 'Aug 2020 – Apr 2023',
        description:
          '• Designed responsive CSS Grid inspector controls adopted by 240K+ active creators in the first 90 days.\n• Standardized keyboard-only workflows and contrast audits across 6 core inspector panels.',
      },
    ],
    projects: [
      {
        name: 'CalmForms UX Kit',
        role: 'Creator (9k Figma Community Duplicates)',
        date: '2025',
        url: 'https://claralindqvist.design/calmforms',
        techStack: ['Figma Variables', 'WCAG AA', 'Design Tokens'],
        description:
          '• Open-source accessible form pattern library with inline validation states and mobile thumb-zone ergonomics.',
      },
    ],
    education: [
      {
        title: 'Rhode Island School of Design (RISD)',
        subtitle: 'B.F.A. in Industrial & Interaction Design',
        location: 'Providence, RI',
        date: '2016 – 2020',
        description: '• Cross-registered HCI coursework at Brown University.',
      },
    ],
    skills: [
      { category: 'Design & Research', items: ['Figma', 'Design Systems', 'Prototyping', 'Usability Testing', 'Information Architecture'] },
      { category: 'Execution', items: ['HTML/CSS', 'Tailwind', 'WCAG Accessibility', 'Framer', 'User Flows'] },
    ],
  },
  {
    slug: 'graphic-designer',
    label: 'Graphic & Brand Designer',
    badge: 'Editorial Serif',
    template: 'editorial',
    accentColor: '#DC2626',
    fontFamily: 'merriweather',
    basics: {
      name: 'Julian Reyes',
      title: 'Senior Brand & Visual Identity Designer',
      email: 'julian.reyes@example.com',
      location: 'Chicago, IL',
      website: 'julianreyes.studio',
      linkedin: 'linkedin.com/in/julianreyes',
    },
    summary:
      'Visual & Brand Designer crafting cohesive typography systems, SaaS launch campaigns, editorial publications, and packaging that drive measurable brand recall.',
    experience: [
      {
        title: 'Pentagram (Partner Studio)',
        subtitle: 'Senior Brand Designer',
        location: 'New York, NY',
        date: 'Mar 2022 – Present',
        description:
          '• Directed end-to-end visual rebrands for 4 Series B/C tech startups, unifying logo geometry, custom type pairings, motion guidelines, and web art direction.\n• Designed print & digital launch collateral driving 1.8M organic impressions during client Series C announcements.',
      },
      {
        title: 'Aesop Digital Studio',
        subtitle: 'Visual & Packaging Designer',
        location: 'Chicago, IL',
        date: 'Jun 2019 – Feb 2022',
        description:
          '• Produced seasonal campaign key visuals, retail window graphics, and print editorial lookbooks across 16 North American flagships.\n• Built reusable Adobe InDesign & Figma campaign kits cutting agency turnaround time by 35%.',
      },
    ],
    projects: [
      {
        name: 'TypeSpecimen 2026',
        role: 'Art Director',
        date: '2025',
        url: 'https://julianreyes.studio/typespecimen',
        techStack: ['Editorial Typography', 'Art Direction', 'After Effects'],
        description:
          '• Interactive digital type specimen showcasing kinetic editorial pairings for modern web publications.',
      },
    ],
    education: [
      {
        title: 'School of the Art Institute of Chicago',
        subtitle: 'B.F.A. in Visual Communication Design',
        location: 'Chicago, IL',
        date: '2015 – 2019',
        description: '• Merit Scholarship Recipient.',
      },
    ],
    skills: [
      { category: 'Brand & Print', items: ['Brand Identity', 'Editorial Layout', 'Typography', 'Packaging', 'Art Direction'] },
      { category: 'Tools', items: ['Illustrator', 'Photoshop', 'InDesign', 'Figma', 'After Effects'] },
    ],
  },
  {
    slug: 'copywriter',
    label: 'Copywriter & Content Strategist',
    badge: 'Editorial Serif',
    template: 'editorial',
    accentColor: '#0F172A',
    fontFamily: 'merriweather',
    basics: {
      name: 'Hannah Brooks',
      title: 'Senior SaaS Copywriter & Technical Content Strategist',
      email: 'hannah.brooks@example.com',
      location: 'Boston, MA',
      website: 'hannahbrooks.ink',
      linkedin: 'linkedin.com/in/hannahbrooks',
    },
    summary:
      'Conversion Copywriter & Editorial Strategist specializing in B2B SaaS messaging, landing page architecture, and high-authority technical guides that rank and convert.',
    experience: [
      {
        title: 'Ahrefs',
        subtitle: 'Senior Content Strategist & Copywriter',
        location: 'Remote',
        date: 'Jan 2023 – Present',
        description:
          '• Authored 40+ product-led long-form guides generating 380K+ monthly organic visits and ranking top-3 on 65 high-intent software keywords.\n• Rewrote core product landing pages with customer-interview voice-of-customer copy, lifting free-to-paid signups by 22%.',
      },
      {
        title: 'ConvertKit',
        subtitle: 'Conversion Copywriter',
        location: 'Remote (US)',
        date: 'May 2020 – Dec 2022',
        description:
          '• Built automated lifecycle email onboarding sequences generating $1.4M in attributed annual expansion revenue.\n• Defined brand tone-of-voice playbooks adopted across Product, Lifecycle Marketing, and Docs.',
      },
    ],
    projects: [
      {
        name: 'Microcopy Clinic',
        role: 'Founder & Writer',
        date: '2025',
        url: 'https://hannahbrooks.ink/clinic',
        techStack: ['Conversion Copy', 'SEO Editorial', 'UX Writing'],
        description:
          '• Public teardown library benchmarking SaaS hero headlines, pricing tables, and onboarding empty states.',
      },
    ],
    education: [
      {
        title: 'Boston University',
        subtitle: 'B.S. in Journalism & English Literature',
        location: 'Boston, MA',
        date: '2016 – 2020',
        description: '• Summa Cum Laude · Managing Editor, Daily Free Press.',
      },
    ],
    skills: [
      { category: 'Writing & Strategy', items: ['Conversion Copywriting', 'SaaS Messaging', 'Technical Writing', 'UX Microcopy', 'GEO/SEO Content'] },
      { category: 'Analytics', items: ['A/B Headline Testing', 'Customer Interviews', 'Search Console', 'HubSpot', 'Markdown'] },
    ],
  },
  {
    slug: 'digital-marketing',
    label: 'Digital Marketing & Growth',
    badge: 'Nordic Bento',
    template: 'nordic',
    accentColor: '#059669',
    basics: {
      name: 'Chloe Ramirez',
      title: 'Head of Growth & Performance Marketing',
      email: 'chloe.ramirez@example.com',
      location: 'Austin, TX',
      website: 'chloegrowth.com',
      linkedin: 'linkedin.com/in/chloeramirez',
    },
    summary:
      'Full-funnel Growth Marketer with 6+ years scaling paid acquisition, lifecycle CRM, and organic content loops across B2B SaaS and consumer subscriptions ($3M+ managed ad spend).',
    experience: [
      {
        title: 'Loom',
        subtitle: 'Growth Marketing Manager, Acquisition & Lifecycle',
        location: 'Remote (US)',
        date: 'Mar 2023 – Present',
        description:
          '• Scaled Google Search, LinkedIn, and YouTube creator sponsorships while lowering blended CAC by 29% (from $184 to $130) at 4.1x LTV:CAC.\n• Built automated HubSpot + Segment behavioral nurture tracks increasing 30-day workspace activation by +17%.',
      },
      {
        title: 'Canva',
        subtitle: 'Performance Marketing Specialist',
        location: 'Sydney / Remote US',
        date: 'Jun 2020 – Feb 2023',
        description:
          '• Managed $150K/month Meta & Google App campaigns across North America, maintaining 3.6x Day-90 ROAS.\n• Launched 50+ high-intent landing page variations via Webflow, boosting organic-to-signup conversion from 4.8% to 7.9%.',
      },
    ],
    projects: [
      {
        name: 'SaaS Funnel Attribution Kit',
        role: 'Creator',
        date: '2025',
        url: 'https://chloegrowth.com/attribution',
        techStack: ['GA4', 'GTM', 'SQL', 'Looker Studio'],
        description:
          '• Open-source Google Tag Manager server-side recipe & Looker dashboard template tracking first-touch to paid conversion.',
      },
    ],
    education: [
      {
        title: 'University of Texas at Austin',
        subtitle: 'B.B.A. in Marketing & Data Analytics',
        location: 'Austin, TX',
        date: '2016 – 2020',
        description: '• McCombs Business Honors Program.',
      },
    ],
    skills: [
      { category: 'Growth Channels', items: ['Google Ads', 'Meta Ads', 'LinkedIn ABM', 'Lifecycle Email', 'CRO', 'PLG'] },
      { category: 'Measurement', items: ['GA4', 'Google Tag Manager', 'HubSpot', 'Amplitude', 'SQL', 'Looker Studio'] },
    ],
  },
  {
    slug: 'seo-specialist',
    label: 'SEO & GEO Specialist',
    badge: 'Modern Minimal',
    template: 'minimal',
    accentColor: '#0D9488',
    basics: {
      name: 'Oliver Grant',
      title: 'Technical SEO & Generative Engine Optimization (GEO) Lead',
      email: 'oliver.grant@example.com',
      location: 'Toronto, ON',
      website: 'olivergrant.seo',
      linkedin: 'linkedin.com/in/olivergrant',
    },
    summary:
      'Technical SEO & GEO Strategist driving 4x organic traffic growth through programmatic landing pages, Core Web Vitals optimization, JSON-LD schema, and AI search citation strategy.',
    experience: [
      {
        title: 'Shopify',
        subtitle: 'Senior Technical SEO Specialist',
        location: 'Toronto, ON (Remote)',
        date: 'Apr 2023 – Present',
        description:
          '• Architected programmatic industry landing page hubs + structured FAQ/HowTo JSON-LD across 400+ URLs, lifting non-branded organic traffic by +142% YoY.\n• Audited crawl budget, canonicals, and SSR hydration issues, cutting index bloat by 38% and increasing AI Overviews & Perplexity citation share.',
      },
      {
        title: 'Zapier',
        subtitle: 'SEO Growth Strategist',
        location: 'Remote',
        date: 'Jul 2020 – Mar 2023',
        description:
          '• Managed high-intent comparison and integration directory pages generating 95K+ monthly organic signups.\n• Built automated Python + Search Console anomaly alerts catching ranking drops within 24 hours.',
      },
    ],
    projects: [
      {
        name: 'llms.txt & Schema Validator',
        role: 'Author',
        date: '2025',
        url: 'https://olivergrant.seo/llms-check',
        techStack: ['Python', 'JSON-LD', 'Screaming Frog', 'BigQuery'],
        description:
          '• Automated crawler-access and llms.txt diagnostic script auditing GPTBot, ClaudeBot, and Googlebot readiness.',
      },
    ],
    education: [
      {
        title: 'University of Waterloo',
        subtitle: 'B.A. in Digital Media & Economics',
        location: 'Waterloo, ON',
        date: '2016 – 2020',
        description: '• Co-op Program Honors.',
      },
    ],
    skills: [
      { category: 'SEO & GEO', items: ['Technical SEO', 'GEO / AI Search', 'llms.txt', 'Schema.org JSON-LD', 'Programmatic SEO', 'Link Building'] },
      { category: 'Tools', items: ['Google Search Console', 'Ahrefs', 'Screaming Frog', 'GA4', 'GTM', 'Python'] },
    ],
  },
  {
    slug: 'saas-sales',
    label: 'B2B SaaS Sales (AE / SDR)',
    badge: 'Slate Contrast',
    template: 'slate',
    accentColor: '#2563EB',
    basics: {
      name: 'Marcus Vance',
      title: 'Enterprise Account Executive — B2B SaaS',
      email: 'marcus.vance@example.com',
      location: 'Chicago, IL',
      website: 'marcusvance.co',
      linkedin: 'linkedin.com/in/marcusvance',
    },
    summary:
      'Quota-crushing Enterprise Account Executive with 6+ years closing $60K–$450K ACV cloud & developer-tool deals using MEDDPICC and consultative multi-threading.',
    experience: [
      {
        title: 'Databricks',
        subtitle: 'Enterprise Account Executive',
        location: 'Chicago, IL',
        date: 'Jan 2023 – Present',
        description:
          '• Achieved 146% of FY2025 annual quota ($2.92M closed-won ARR vs. $2.0M target), ranking #3 out of 48 North America AEs.\n• Shortened enterprise security & procurement cycles from 110 days to 64 days by front-loading InfoSec packets and executive ROI business cases.',
      },
      {
        title: 'HubSpot',
        subtitle: 'Mid-Market Account Executive',
        location: 'Cambridge, MA',
        date: 'May 2020 – Dec 2022',
        description:
          '• Exceeded quota 9 consecutive quarters (128% average attainment), closing 84 net-new logos with 96% Year-1 renewal rate.\n• Promoted from Senior SDR after generating $4.1M in qualified pipeline in 11 months.',
      },
    ],
    education: [
      {
        title: 'Indiana University (Kelley School)',
        subtitle: 'B.S. in Business, Sales & Marketing',
        location: 'Bloomington, IN',
        date: '2015 – 2019',
        description: '• President, National Collegiate Sales Competition Team.',
      },
    ],
    skills: [
      { category: 'Sales Methodology', items: ['MEDDPICC', 'Enterprise Discovery', 'Multi-Threading', 'Executive Negotiation', 'Pipeline Generation'] },
      { category: 'RevTech Stack', items: ['Salesforce', 'Gong', 'Apollo.io', 'Outreach', 'LinkedIn Sales Navigator'] },
    ],
  },
  {
    slug: 'finance',
    label: 'Finance & Investment Banking',
    badge: 'Harvard ATS',
    template: 'harvard',
    accentColor: '#0F172A',
    fontFamily: 'merriweather',
    basics: {
      name: 'Victoria Sterling',
      title: 'Investment Banking Associate | M&A & Tech Advisory',
      email: 'victoria.sterling@example.com',
      location: 'New York, NY',
      website: 'victoriasterling.bio',
      linkedin: 'linkedin.com/in/victoriasterling',
    },
    summary:
      'Quantitative Finance & M&A Associate with 4+ years executing $4.8B+ in software, fintech, and healthcare buyouts, DCF/LBO modeling, and board-level valuation decks.',
    experience: [
      {
        title: 'Goldman Sachs',
        subtitle: 'Investment Banking Associate, TMT Group',
        location: 'New York, NY',
        date: 'Jul 2023 – Present',
        description:
          '• Built operating, LBO, and accretion/dilution models for 5 completed sell-side and buy-side transactions totaling $3.4B enterprise value.\n• Authored management presentations, CIMs, and buyer diligence memos for a $1.1B enterprise SaaS carve-out.',
      },
      {
        title: 'J.P. Morgan',
        subtitle: 'Investment Banking Analyst, M&A',
        location: 'New York, NY',
        date: 'Jun 2021 – Jun 2023',
        description:
          '• Executed DCF, trading comps, and precedent transaction analyses across 8 debt and equity capital market mandates ($1.4B+ aggregate deal value).\n• Automated Capital IQ + FactSet comps refresh macros in VBA/Python, cutting pitchbook prep time by 45%.',
      },
    ],
    education: [
      {
        title: 'University of Pennsylvania (Wharton)',
        subtitle: 'B.S. in Economics, Concentrations in Finance & Statistics',
        location: 'Philadelphia, PA',
        date: '2017 – 2021',
        description: '• GPA: 3.91 / 4.0 · Summa Cum Laude · CFA Level II Candidate.',
      },
    ],
    skills: [
      { category: 'Financial Modeling', items: ['DCF Valuation', 'LBO Modeling', 'M&A Accretion/Dilution', '3-Statement Models', 'Due Diligence'] },
      { category: 'Data & Software', items: ['Excel (VBA)', 'Bloomberg Terminal', 'Capital IQ', 'FactSet', 'Python'] },
    ],
  },
  {
    slug: 'academic-cv',
    label: 'Academic & PhD CV',
    badge: 'Harvard Parchment',
    template: 'harvard',
    accentColor: '#0F172A',
    fontFamily: 'merriweather',
    educationFirst: true,
    basics: {
      name: 'Dr. Ethan Whitaker',
      title: 'Postdoctoral Research Fellow in Computational Biology',
      email: 'ethan.whitaker@example.edu',
      location: 'Cambridge, MA',
      website: 'ethanwhitaker.org',
      linkedin: 'linkedin.com/in/ethanwhitaker',
      github: 'github.com/ewhitaker-lab',
    },
    summary:
      'Computational Biologist & Postdoctoral Fellow developing interpretable graph neural networks for single-cell transcriptomics. Author of 11 peer-reviewed papers (980+ citations, h-index 8).',
    education: [
      {
        title: 'Massachusetts Institute of Technology (MIT)',
        subtitle: 'Ph.D. in Computational & Systems Biology',
        location: 'Cambridge, MA',
        date: '2020 – 2025',
        description:
          '• Dissertation: "Scalable Equivariant Representations for Spatial Single-Cell Proteomics." Advisor: Prof. M. Alvarez.\n• NSF Graduate Research Fellowship (GRFP) Recipient.',
      },
      {
        title: 'Stanford University',
        subtitle: 'B.S. with Honors in Bioengineering',
        location: 'Stanford, CA',
        date: '2016 – 2020',
        description: '• GPA: 3.95 / 4.0 · Phi Beta Kappa.',
      },
    ],
    experience: [
      {
        title: 'Broad Institute of MIT and Harvard',
        subtitle: 'Postdoctoral Research Fellow',
        location: 'Cambridge, MA',
        date: 'Sep 2025 – Present',
        description:
          '• Leading open-source spatial transcriptomics foundation model benchmark across 14M annotated cells.\n• Co-mentoring 4 PhD students and teaching graduate seminar HST.508 (Genomics & Machine Learning).',
      },
    ],
    extraSections: [
      {
        title: 'Selected Publications & Grants',
        textContent:
          '• Whitaker, E., et al. (2025). "SpatioGraph: Scaling Multi-Omic Cellular Graphs." Nature Methods, 22(4), 612–624. (180+ citations)\n• Whitaker, E., & Alvarez, M. (2024). "Equivariant Attention in Protein-Ligand Pockets." NeurIPS Spotlight.\n• NIH Ruth L. Kirschstein NRSA F32 Postdoctoral Fellowship ($198,000, 2025–2028).',
      },
    ],
    skills: [
      { category: 'Research & Methods', items: ['Single-Cell RNA-seq', 'Graph Neural Networks', 'Bayesian Modeling', 'Causal Genomics'] },
      { category: 'Computational', items: ['Python', 'PyTorch', 'JAX', 'R / Bioconductor', 'Snakemake', 'HPC Slurm'] },
    ],
  },
  {
    slug: 'cs-student',
    label: 'CS Student & New Grad',
    badge: 'Tech Terminal',
    template: 'tech',
    accentColor: '#4F46E5',
    educationFirst: true,
    basics: {
      name: 'Daniel Kim',
      title: 'B.S. Computer Science (Class of 2026) · SWE Intern',
      email: 'daniel.kim@example.edu',
      location: 'Ann Arbor, MI',
      website: 'danielkim.dev',
      linkedin: 'linkedin.com/in/danielkim-cs',
      github: 'github.com/dkim2026',
    },
    summary:
      'Senior Computer Science undergraduate (May 2026) with two production software engineering internships, strong algorithms fundamentals, and open-source TypeScript & Go projects.',
    education: [
      {
        title: 'University of Michigan',
        subtitle: 'B.S. in Computer Science (College of Engineering)',
        location: 'Ann Arbor, MI',
        date: 'Sep 2022 – May 2026',
        description:
          '• GPA: 3.89 / 4.0 · Dean’s List (6 semesters) · Relevant Coursework: Operating Systems, Distributed Systems, Databases, Compilers.',
      },
    ],
    experience: [
      {
        title: 'Stripe',
        subtitle: 'Software Engineering Intern, Developer Dashboard',
        location: 'San Francisco, CA',
        date: 'May 2025 – Aug 2025',
        description:
          '• Built interactive webhook replay inspector in React + TypeScript, cutting merchant debugging time by 35% in internal dogfooding.\n• Added 42 Jest & Playwright integration tests bringing critical payment-form coverage from 68% to 94%.',
      },
      {
        title: 'Michigan Hackers Lab',
        subtitle: 'Undergraduate Teaching Assistant (EECS 281: Data Structures)',
        location: 'Ann Arbor, MI',
        date: 'Jan 2024 – Apr 2025',
        description:
          '• Led weekly lab sections of 35 students covering graphs, dynamic programming, and C++ memory profiling.',
      },
    ],
    projects: [
      {
        name: 'CampusBus Live',
        role: 'Co-Creator (4,200 Active Students)',
        date: '2025',
        url: 'https://github.com/dkim2026/campusbus',
        techStack: ['Go', 'WebSockets', 'React', 'Redis'],
        description:
          '• Real-time campus transit tracker ingesting GTFS feeds with sub-second WebSocket updates and PWA offline caching.',
      },
    ],
    skills: [
      { category: 'Languages', items: ['C++', 'TypeScript', 'Python', 'Go', 'SQL'] },
      { category: 'Frameworks & Cloud', items: ['React', 'Next.js', 'PostgreSQL', 'Redis', 'Docker', 'Git'] },
    ],
  },
  {
    slug: 'mba-consulting',
    label: 'MBA & Management Consulting',
    badge: 'Harvard ATS',
    template: 'harvard',
    accentColor: '#0F172A',
    fontFamily: 'merriweather',
    basics: {
      name: 'Nathaniel Hayes',
      title: 'Strategy & Operations Consultant | MBA Candidate',
      email: 'nathaniel.hayes@example.com',
      location: 'Boston, MA',
      website: 'nathanielhayes.co',
      linkedin: 'linkedin.com/in/nathanielhayes',
    },
    summary:
      'Strategy Consultant & MBA Candidate (Harvard Business School) with 5+ years leading commercial due diligence, pricing transformations, and Fortune 500 supply-chain turnarounds.',
    experience: [
      {
        title: 'Bain & Company',
        subtitle: 'Summer Consultant, Private Equity Group',
        location: 'Boston, MA',
        date: 'Jun 2025 – Aug 2025',
        description:
          '• Conducted commercial due diligence on a $650M industrial SaaS buyout target across 35 customer interviews and cohort churn modeling.\n• Identified $18M in annualized EBITDA upside via tiered enterprise pricing and SKU rationalization.',
      },
      {
        title: 'McKinsey & Company',
        subtitle: 'Senior Business Analyst, Operations Practice',
        location: 'New York, NY',
        date: 'Aug 2021 – Jul 2024',
        description:
          '• Redesigned North America warehouse network for a $4B retail client, cutting freight spend by $27M (11%) and 2-day delivery SLA misses by 40%.\n• Presented weekly SteerCo progress updates directly to COO and SVP of Supply Chain.',
      },
    ],
    education: [
      {
        title: 'Harvard Business School',
        subtitle: 'Master of Business Administration (MBA)',
        location: 'Boston, MA',
        date: '2024 – 2026',
        description: '• Co-President, Tech & Strategy Club · First-Year Honors.',
      },
      {
        title: 'Duke University',
        subtitle: 'B.A. in Public Policy & Economics',
        location: 'Durham, NC',
        date: '2017 – 2021',
        description: '• GPA: 3.90 / 4.0 · Magna Cum Laude.',
      },
    ],
    skills: [
      { category: 'Strategy & Finance', items: ['Commercial Due Diligence', 'Market Sizing', 'Pricing Strategy', 'EBITDA Improvement', 'M&A Integration'] },
      { category: 'Analytics', items: ['Excel Modeling', 'SQL', 'Tableau', 'Executive Storytelling'] },
    ],
  },
  {
    slug: 'career-change',
    label: 'Career Changer / Bootcamp',
    badge: 'Swiss 2-Col',
    template: 'swiss',
    accentColor: '#0D9488',
    basics: {
      name: 'Grace Callahan',
      title: 'Full-Stack Developer (Former Operations Lead)',
      email: 'grace.callahan@example.com',
      location: 'Portland, OR',
      website: 'gracecallahan.dev',
      linkedin: 'linkedin.com/in/gracecallahan',
      github: 'github.com/gcallahan-dev',
    },
    summary:
      'Resourceful Full-Stack Developer combining 5 years of healthcare operations leadership with production React, TypeScript, and Node.js engineering. Proven ability to translate messy domain rules into reliable software.',
    experience: [
      {
        title: 'CivicHealth Open Source',
        subtitle: 'Full-Stack Software Contributor',
        location: 'Remote',
        date: 'Oct 2024 – Present',
        description:
          '• Built patient intake form validator & HL7 FHIR export API in TypeScript + PostgreSQL, cutting clinic manual re-entry errors by 44% across 3 pilot clinics.\n• Automated end-to-end Playwright CI checks and GitHub Actions deployments.',
      },
      {
        title: 'Pacific Northwest Medical Group',
        subtitle: 'Clinical Operations Manager (Transferable Domain Lead)',
        location: 'Portland, OR',
        date: 'Jun 2020 – Sep 2024',
        description:
          '• Automated weekly scheduling & billing reconciliations using Python scripts and SQL queries, saving 14 staff hours every week.\n• Coordinated 18-person clinical & IT rollout of a new EHR portal with 96% staff adoption in 30 days.',
      },
    ],
    projects: [
      {
        name: 'ShiftSync Scheduler',
        role: 'Solo Builder',
        date: '2025',
        url: 'https://github.com/gcallahan-dev/shiftsync',
        techStack: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
        description:
          '• Constraint-based nurse & clinic shift swap web app eliminating double-bookings via automated overlap detection.',
      },
    ],
    education: [
      {
        title: 'Oregon State University',
        subtitle: 'Post-Bacc B.S. in Computer Science (In Progress)',
        location: 'Remote',
        date: '2024 – 2026',
        description: '• GPA: 3.94 / 4.0 · Focus on Software Engineering & Databases.',
      },
    ],
    skills: [
      { category: 'Engineering', items: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Python', 'SQL'] },
      { category: 'Domain Strengths', items: ['Stakeholder Discovery', 'Process Automation', 'QA Testing', 'Healthcare Ops'] },
    ],
  },
  {
    slug: 'project-manager',
    label: 'Project Manager / Scrum',
    badge: 'Aurora Glass',
    template: 'executive',
    accentColor: '#2563EB',
    basics: {
      name: 'David Okafor',
      title: 'Senior Technical Project Manager (PMP · CSM)',
      email: 'david.okafor@example.com',
      location: 'Atlanta, GA',
      website: 'davidokafor.pm',
      linkedin: 'linkedin.com/in/davidokafor',
    },
    summary:
      'PMP-certified Technical Project Manager with 7+ years delivering multi-million-dollar cloud migrations, ERP rollouts, and cross-functional agile launches on schedule and 12% under budget.',
    experience: [
      {
        title: 'Salesforce',
        subtitle: 'Lead Technical Program Manager, Core Cloud',
        location: 'Atlanta, GA',
        date: 'Mar 2023 – Present',
        description:
          '• Directed 6 distributed engineering & security teams (48 contributors) to complete zero-downtime Hyperforce migration 3 weeks ahead of Q4 deadline.\n• Implemented automated Jira dependency tracking and risk burndowns, reducing cross-team sprint blockers by 51%.',
      },
      {
        title: 'Accenture',
        subtitle: 'Agile Project Manager / Scrum Master',
        location: 'Atlanta, GA',
        date: 'Jul 2019 – Feb 2023',
        description:
          '• Managed $4.5M enterprise billing modernization program across 4 time zones, achieving 98% milestone predictability over 18 months.\n• Coached 5 squads from waterfall to 2-week Scrum cadences, lifting release frequency from quarterly to bi-weekly.',
      },
    ],
    education: [
      {
        title: 'Emory University',
        subtitle: 'B.S. in Management Information Systems',
        location: 'Atlanta, GA',
        date: '2015 – 2019',
        description: '• PMP (Project Management Professional) · Certified ScrumMaster (CSM).',
      },
    ],
    skills: [
      { category: 'Delivery & Agile', items: ['Program Management', 'Scrum / Kanban', 'Risk Mitigation', 'Budget Forecasting', 'Vendor Governance'] },
      { category: 'Tooling', items: ['Jira', 'Linear', 'Asana', 'Confluence', 'Smartsheet', 'SQL'] },
    ],
  },
  {
    slug: 'freelancer',
    label: 'Freelancer & Consultant',
    badge: 'Swiss 2-Col',
    template: 'swiss',
    accentColor: '#4F46E5',
    basics: {
      name: 'Lucas Weber',
      title: 'Independent Web & Automation Consultant',
      email: 'lucas@weberstudio.co',
      location: 'Berlin / Remote Worldwide',
      website: 'weberstudio.co',
      linkedin: 'linkedin.com/in/lucasweber',
      github: 'github.com/lucasweber',
    },
    summary:
      'Independent Full-Stack & No-Code Consultant helping 24+ funded SaaS startups and boutique agencies ship high-converting marketing sites, Stripe billing portals, and AI workflows.',
    experience: [
      {
        title: 'Weber Studio (Independent Practice)',
        subtitle: 'Principal Web & Automation Consultant',
        location: 'Remote (EU / US)',
        date: 'Jan 2022 – Present',
        description:
          '• Delivered 32 fixed-scope client engagements at 4.95/5 average rating and 70% repeat retainer conversion.\n• Rebuilt SaaS checkout & onboarding sites in Next.js + Stripe for 8 B2B clients, boosting trial signups by an average of +34%.',
      },
      {
        title: 'N26',
        subtitle: 'Frontend Software Engineer',
        location: 'Berlin, Germany',
        date: 'May 2019 – Dec 2021',
        description:
          '• Built multilingual card management & onboarding flows serving 5M+ European banking customers.',
      },
    ],
    projects: [
      {
        name: 'ClientLaunch Playbook',
        role: 'Creator & Consultant',
        date: '2025',
        url: 'https://weberstudio.co/playbook',
        techStack: ['Next.js', 'Stripe', 'Cloudflare Pages', 'n8n'],
        description:
          '• Productized 14-day SaaS landing-page + CRM automation sprint with live client ROI calculators.',
      },
    ],
    education: [
      {
        title: 'Technical University of Munich (TUM)',
        subtitle: 'B.Sc. in Informatics',
        location: 'Munich, Germany',
        date: '2015 – 2019',
        description: '• Exchange semester at ETH Zurich.',
      },
    ],
    skills: [
      { category: 'Client Delivery', items: ['Next.js', 'TypeScript', 'Stripe Billing', 'Webflow', 'Cloudflare Pages', 'SEO'] },
      { category: 'Consulting', items: ['Scoped Proposals', 'Async Client Ops', 'n8n Automation', 'CRO Audits'] },
    ],
  },
  {
    slug: 'remote-worker',
    label: 'Remote / Async Specialist',
    badge: 'Modern Minimal',
    template: 'minimal',
    accentColor: '#059669',
    basics: {
      name: 'Sienna Foster',
      title: 'Senior Remote Customer Success & Operations Lead',
      email: 'sienna.foster@example.com',
      location: 'Lisbon / US-Eastern Hours',
      website: 'siennafoster.work',
      linkedin: 'linkedin.com/in/siennafoster',
    },
    summary:
      'Async-first Operations & Customer Success Lead with 6+ years managing globally distributed SaaS teams across US and European time zones—maintaining 118% Net Revenue Retention.',
    experience: [
      {
        title: 'GitLab',
        subtitle: 'Senior Customer Success Manager (Async Global)',
        location: '100% Remote (US / EMEA)',
        date: 'Feb 2023 – Present',
        description:
          '• Managed a $6.8M ARR enterprise book across 28 remote-first engineering organizations, sustaining 118% NRR and 97% gross retention.\n• Authored async handbook onboarding playbooks that cut new customer time-to-first-deploy from 29 days to 11 days.',
      },
      {
        title: 'Doist (Todoist)',
        subtitle: 'Remote Operations & Support Specialist',
        location: '100% Remote',
        date: 'Aug 2020 – Jan 2023',
        description:
          '• Coordinated cross-timezone support handoffs between Americas, Europe, and APAC, holding median first-response SLA under 45 minutes.\n• Consolidated 140+ internal SOPs in Notion, cutting new remote hire ramp time by 40%.',
      },
    ],
    education: [
      {
        title: 'University of British Columbia',
        subtitle: 'B.A. in International Relations',
        location: 'Vancouver, BC',
        date: '2016 – 2020',
        description: '• Fluent in English & Spanish · US/EU overlapping work hours.',
      },
    ],
    skills: [
      { category: 'Remote & Async Ops', items: ['Handbook Documentation', 'Cross-Timezone Handoffs', 'Enterprise Onboarding', 'Loom Async Video', 'SOP Design'] },
      { category: 'Platforms', items: ['Notion', 'Linear', 'Zendesk', 'Gainsight', 'Salesforce', 'Slack'] },
    ],
  },
  {
    slug: 'harvard-ats',
    label: 'Harvard ATS Classic',
    badge: 'Harvard Parchment',
    template: 'harvard',
    accentColor: '#1e293b',
    fontFamily: 'merriweather',
    educationFirst: true,
    basics: {
      name: 'Jordan Hayes',
      title: 'Strategy & Product Operations Associate',
      email: 'jordan.hayes@example.com',
      phone: '+1 (617) 555-0148',
      location: 'Boston, MA',
      linkedin: 'linkedin.com/in/jordanhayes',
      website: 'jordanhayes.org',
    },
    summary:
      'Analytical Strategy & Product Operations professional trained in classic Harvard ATS format—turning messy operational data into crisp executive decisions and revenue-backed roadmaps.',
    experience: [
      {
        title: 'Bain & Company',
        subtitle: 'Senior Associate Consultant',
        location: 'Boston, MA',
        date: 'Aug 2023 – Present',
        description:
          '• Led pricing and packaging workstream for a $380M B2B SaaS client, uncovering $19M in annual net expansion opportunities.\n• Built automated cohort retention models in SQL + Excel across 45K enterprise accounts, cutting executive diligence cycle time by 35%.',
      },
      {
        title: 'HubSpot',
        subtitle: 'Product Operations Intern',
        location: 'Cambridge, MA',
        date: 'May 2022 – Aug 2022',
        description:
          '• Audited onboarding funnel drop-offs across 12,000 trial workspaces and shipped 3 activation experiments that raised Day-14 conversion by 9.4%.\n• Standardized quarterly OKR tracking dashboard adopted by 6 product squads.',
      },
    ],
    education: [
      {
        title: 'Harvard University',
        subtitle: 'A.B. in Economics, Minor in Computer Science (Magna Cum Laude)',
        location: 'Cambridge, MA',
        date: '2019 – 2023',
        description: '• GPA: 3.91/4.00 · John Harvard Scholar · Managing Editor, Harvard Economics Review.',
      },
    ],
    skills: [
      { category: 'Strategy & Analytics', items: ['Financial Modeling', 'SQL', 'Python', 'Pricing Strategy', 'Cohort Analysis', 'Executive Presentations'] },
      { category: 'ATS & Operations', items: ['Product Operations', 'GTM Planning', 'A/B Testing', 'Tableau', 'Looker', 'Excel'] },
    ],
  },
];

export const ROLE_PRESETS: Record<string, RolePreset> = Object.fromEntries(
  PRESET_SPECS.map((spec) => [spec.slug, makePreset(spec)]),
);

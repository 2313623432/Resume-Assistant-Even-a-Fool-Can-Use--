import type { Language } from '../types/resume';

export const TRANSLATIONS: Record<
  Language,
  {
    brand: string;
    tagline: string;
    navBuilder: string;
    navAi: string;
    navDeploy: string;
    btnImport: string;
    btnPdf: string;
    btnExportWebsite: string;
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    heroCtaAi: string;
    heroCtaWebsite: string;
    heroDismiss: string;
    tabSections: string;
    tabDesign: string;
    profileSection: string;
    addSection: string;
    templateLabel: string;
    accentColorLabel: string;
    fontLabel: string;
    fontSizeLabel: string;
    pageSizeLabel: string;
    viewResume: string;
    viewWebsite: string;
    undoAi: string;
    savedLocally: string;
  }
> = {
  en: {
    brand: 'ResumeCraft',
    tagline: 'Free Resume Builder & Resume-to-Website',
    navBuilder: 'Builder',
    navAi: 'AI Resume Optimizer',
    navDeploy: 'Deploy Guide',
    btnImport: 'Import',
    btnPdf: 'Download PDF',
    btnExportWebsite: 'Turn Resume into Website',
    heroBadge: '100% Free Resume Builder · Browser-Only · Zero Watermarks',
    heroTitle: 'Turn Your Resume into a Website in One Click — Free Builder & AI Optimizer',
    heroSubtitle:
      'Build an ATS-friendly resume for free, rank higher in AI resume search and recruiter screening using your own API key (OpenAI, DeepSeek, Gemini), and convert your resume into an animated HTML website instantly.',
    heroCtaAi: 'AI Resume Tailor (BYOK)',
    heroCtaWebsite: 'Turn Resume into Website',
    heroDismiss: 'Hide banner',
    tabSections: 'Sections',
    tabDesign: 'Design & Layout',
    profileSection: 'Contact & Header',
    addSection: 'Add Section',
    templateLabel: 'Resume & Website Theme',
    accentColorLabel: 'Accent Color',
    fontLabel: 'Typography',
    fontSizeLabel: 'Text Scale',
    pageSizeLabel: 'Paper Format',
    viewResume: 'Resume (PDF)',
    viewWebsite: 'Live Website HTML',
    undoAi: 'Undo AI Edit',
    savedLocally: 'Saved in browser',
  },
  zh: {
    brand: 'ResumeCraft',
    tagline: '免费制作简历 · 一键让简历变成网页',
    navBuilder: '编辑器',
    navAi: 'AI 简历优化',
    navDeploy: '上线部署指南',
    btnImport: '导入简历',
    btnPdf: '导出 PDF',
    btnExportWebsite: '一键把简历变成网页',
    heroBadge: '100% 免费制作简历 · 纯本地运行 · 无水印',
    heroTitle: '免费制作海外标准简历 · AI 简历搜索优化 · 一键让简历变成炫酷网页',
    heroSubtitle:
      '零费用打造符合海外 ATS 与 AI 简历搜索筛选标准的简历，填入你自己的 OpenAI / DeepSeek / Gemini API Key 精准匹配 JD，并一键将简历转换成带动画的独立 HTML 个人网站上线。',
    heroCtaAi: '填入 API Key 优化简历',
    heroCtaWebsite: '一键将简历转为网页',
    heroDismiss: '收起横幅',
    tabSections: '模块管理',
    tabDesign: '模板与风格',
    profileSection: '基本信息与链接',
    addSection: '添加模块',
    templateLabel: '简历与网站主题风格',
    accentColorLabel: '主题强调色',
    fontLabel: '字体风格',
    fontSizeLabel: '字号比例',
    pageSizeLabel: '纸张规格',
    viewResume: '简历预览 (PDF)',
    viewWebsite: '个人网站预览 (HTML)',
    undoAi: '撤销 AI 修改',
    savedLocally: '已自动保存至浏览器',
  },
};

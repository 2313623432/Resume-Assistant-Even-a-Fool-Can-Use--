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
    tagline: 'Free AI Resume & Portfolio Studio',
    navBuilder: 'Builder',
    navAi: 'AI Tailor (BYOK)',
    navDeploy: 'Deploy Guide',
    btnImport: 'Import',
    btnPdf: 'Download PDF',
    btnExportWebsite: 'Export Website HTML',
    heroBadge: '100% Free · Browser-Only · No Signup Required',
    heroTitle: 'Build Your Resume. Tailor with Your Own AI Key. Launch as a Live Website.',
    heroSubtitle:
      'Create an ATS-ready US/global resume in minutes, optimize bullets to any job description using your own OpenAI/DeepSeek/Gemini key, and export a deploy-ready portfolio HTML in one click.',
    heroCtaAi: 'Tailor with AI (BYOK)',
    heroCtaWebsite: 'Convert Resume to Website',
    heroDismiss: 'Hide banner',
    tabSections: 'Sections',
    tabDesign: 'Design & Layout',
    profileSection: 'Contact & Header',
    addSection: 'Add Section',
    templateLabel: 'Resume Template',
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
    tagline: '免费 AI 简历与个人网站生成器',
    navBuilder: '编辑器',
    navAi: 'AI 简历优化',
    navDeploy: '上线部署指南',
    btnImport: '导入简历',
    btnPdf: '导出 PDF',
    btnExportWebsite: '导出个人网站 HTML',
    heroBadge: '100% 免费 · 纯本地运行 · 无需注册',
    heroTitle: '免费制作海外标准简历 · 自带 Key AI 定制 · 一键生成可上线个人网站',
    heroSubtitle:
      '几分钟打造符合海外 ATS 标准的英文简历，填入你自己的 OpenAI / DeepSeek / Gemini API Key 精准匹配岗位 JD，并一键导出响应式个人主页 HTML 免费部署上线。',
    heroCtaAi: '填入 API Key 优化简历',
    heroCtaWebsite: '将简历转为 HTML 网站',
    heroDismiss: '收起横幅',
    tabSections: '模块管理',
    tabDesign: '模板与排版',
    profileSection: '基本信息与链接',
    addSection: '添加模块',
    templateLabel: '简历模板风格',
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

import { CheckCircle2, ChevronDown, FileText, Globe, KeyRound, Rocket } from 'lucide-react';
import { useState } from 'react';
import type { Language } from '../types/resume';

interface SeoSectionsProps {
  language: Language;
  onOpenAi: () => void;
  onExportWebsite: () => void;
}

const FAQS_EN = [
  {
    q: 'How do I turn my resume into a website in one click?',
    a: 'Edit your resume or import an existing PDF/Word file, pick any of the 8 themed portfolio styles under Design & Layout, preview it in Live Website HTML mode, and click "Turn Resume into Website" to download an animated, deploy-ready index.html or ZIP package.',
  },
  {
    q: 'Is ResumeCraft really a 100% free resume builder with no paywalls?',
    a: 'Yes. You can build unlimited resumes, use all 8 templates, export ATS-clean vector PDFs, and turn your resume into a website completely free with zero accounts or watermarks.',
  },
  {
    q: 'How does BYOK AI optimization help with AI resume search and ATS screening?',
    a: 'Recruiters increasingly rely on AI resume search and semantic ATS ranking. Paste your target Job Description and connect your own OpenAI, DeepSeek, Google Gemini, or OpenRouter key to align skills and rewrite bullets with measurable impact while keeping your key 100% local in your browser.',
  },
  {
    q: 'Where can I host my exported resume HTML webpage for free?',
    a: 'Drag and drop your exported folder onto Netlify Drop (app.netlify.com/drop) or Cloudflare Pages Direct Upload for an instant HTTPS website in under 30 seconds—or deploy on Vercel or GitHub Pages.',
  },
];

const FAQS_ZH = [
  {
    q: '如何一键把简历变成网页？',
    a: '填写或导入你的简历后，在「模板与风格」中选择任意喜欢的样式并切换到「个人网站预览 (HTML)」，点击「一键把简历变成网页」即可导出带完整动效的独立 index.html 或建站 ZIP 包。',
  },
  {
    q: 'ResumeCraft 真的可以完全免费制作简历且无水印吗？',
    a: '是的，所有 8 套海外模板、矢量 PDF 导出以及简历转网页功能完全免费，无需注册账号，也没有任何隐藏收费。',
  },
  {
    q: '自带 API Key 如何提升 AI 简历搜索与 ATS 匹配度？',
    a: '填入你自己的 OpenAI / DeepSeek / Gemini API Key 并粘贴目标岗位 JD，系统会自动提取高频关键词、按 Google XYZ 法则优化工作亮点，让简历更容易通过海外 ATS 与 AI 简历搜索筛选。',
  },
];

export function SeoSections({
  language,
  onOpenAi,
  onExportWebsite,
}: SeoSectionsProps) {
  const isEn = language === 'en';
  const faqs = isEn ? FAQS_EN : FAQS_ZH;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="no-print border-t border-slate-200 bg-white">
      {/* Core Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {isEn
              ? 'Free Resume Builder, AI Resume Search Optimization & One-Click Resume-to-Website'
              : '免费制作简历 · AI 简历搜索优化 · 一键让简历变成网页'}
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            {isEn
              ? 'Go from a blank page or old PDF to an ATS-optimized resume and an animated live personal website in minutes.'
              : '无论从零开始还是导入旧简历，几分钟即可同时拥有海外 ATS 简历与高颜值动效个人主页。'}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Globe className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-['Plus_Jakarta_Sans'] text-lg font-bold text-slate-900">
              {isEn ? '1. Turn Resume into Website in 1 Click' : '1. 一键让简历变成炫酷网页'}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {isEn
                ? 'Instantly convert your resume into a responsive, interactive HTML website with smooth animations, dark/light themes, and 8 distinct visual layouts ready for free hosting.'
                : '一键把简历转换成自带交互动效、明暗双主题切换、8 种差异化排版的独立 HTML 网页，拿到即可免费托管上线。'}
            </p>
            <button
              type="button"
              onClick={onExportWebsite}
              className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              {isEn ? 'Turn Resume into Website Now →' : '立即将简历转为网页 →'}
            </button>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <FileText className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-['Plus_Jakarta_Sans'] text-lg font-bold text-slate-900">
              {isEn ? '2. 100% Free Resume Builder' : '2. 100% 免费制作海外标准简历'}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {isEn
                ? 'Build unlimited US Letter or A4 resumes with 8 polished templates including Harvard ATS, Swiss Grid, and Silicon Valley Tech. Export crisp vector PDFs with no watermarks.'
                : '完全免费制作不限次数的英文/双语简历，支持 Harvard ATS、瑞士双栏等 8 套精修模板与无水印矢量 PDF 导出。'}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <KeyRound className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-['Plus_Jakarta_Sans'] text-lg font-bold text-slate-900">
              {isEn ? '3. AI Resume Search & ATS Tailoring' : '3. AI 简历搜索与 ATS 精准调优'}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {isEn
                ? 'Use your own OpenAI, DeepSeek, or Gemini API key to align your experience with target job descriptions, improve AI resume search discoverability, and keep keys private in-browser.'
                : '填入自有 OpenAI / DeepSeek / Gemini Key，针对岗位 JD 自动补全行业关键词并量化经历，提升 AI 简历搜索与 ATS 通过率。'}
            </p>
            <button
              type="button"
              onClick={onOpenAi}
              className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              {isEn ? 'Optimize for AI Resume Search →' : '打开 AI 简历优化 →'}
            </button>
          </article>
        </div>
      </section>

      {/* Deployment Tutorial Section */}
      <section
        id="deploy-tutorial"
        className="border-y border-slate-200 bg-slate-50/80 py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                <Rocket className="h-3.5 w-3.5" />
                {isEn ? 'ONE-CLICK RESUME TO WEBSITE GUIDE' : '一键上线个人网页教程'}
              </span>
              <h2 className="mt-3 font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-slate-900">
                {isEn
                  ? 'Turn Your Resume into a Live Website in 30 Seconds (Free Hosting)'
                  : '拿到简历 HTML 后，30 秒免费发布成公网个人网站'}
              </h2>
            </div>
            <a
              href="/deploy-guide.html"
              className="text-sm font-semibold text-indigo-600 hover:underline"
            >
              {isEn ? 'Read full deployment guide →' : '查看完整部署指南页面 →'}
            </a>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: 'Netlify Drop',
                tag: '10s Drag & Drop',
                desc: isEn
                  ? 'Unzip your export, open app.netlify.com/drop, and drag the folder into your browser to get an instant HTTPS URL.'
                  : '解压导出的 ZIP，打开 app.netlify.com/drop 直接拖入文件夹，10 秒生成 HTTPS 网址。',
              },
              {
                name: 'Cloudflare Pages',
                tag: 'Unlimited Bandwidth',
                desc: isEn
                  ? 'Go to Workers & Pages -> Direct Upload in Cloudflare Dashboard and upload your exported ZIP or index.html.'
                  : '在 Cloudflare 后台选择 Pages -> Direct Upload，直接上传 ZIP 或 index.html 即可全球加速上线。',
              },
              {
                name: 'Vercel',
                tag: 'CLI / GitHub',
                desc: isEn
                  ? 'Run "npx vercel --prod" inside your exported folder or import a GitHub repo containing index.html.'
                  : '在导出目录终端执行 npx vercel --prod，或关联 GitHub 仓库一键自动部署。',
              },
              {
                name: 'GitHub Pages',
                tag: 'username.github.io',
                desc: isEn
                  ? 'Upload index.html to a repo named <username>.github.io and enable Pages from the main branch in Settings.'
                  : '将 index.html 上传到 <用户名>.github.io 仓库，在 Settings -> Pages 开启即可。',
              },
            ].map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-900">{item.name}</h3>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="mt-0.5 text-[11px] font-semibold text-indigo-600">
                  {item.tag}
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2026 Industry Guides & Free Resume-to-Website Hub */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              {isEn ? '2026 ROLE PLAYBOOKS · 20 INDUSTRIES' : '2026 细分行业模板与建站指南 · 20 个专栏'}
            </span>
            <h2 className="mt-3 font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-slate-900">
              {isEn
                ? 'Free Resume Builder & One-Click Resume-to-Website Guides by Role'
                : '按行业免费制作简历 & 一键把简历变成个人网站'}
            </h2>
          </div>
          <a
            href="/resume-to-website-guides.html"
            className="text-sm font-semibold text-indigo-600 hover:underline"
          >
            {isEn ? 'Browse all 20 industry guides →' : '查看全部 20 个行业指南 →'}
          </a>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { href: '/software-engineer-resume-website.html', title: 'Software Engineer', tag: 'Tech Terminal' },
            { href: '/frontend-developer-resume-website.html', title: 'Frontend Developer', tag: 'Aurora Glass' },
            { href: '/data-scientist-resume-website.html', title: 'Data Scientist & ML', tag: 'Tech Terminal' },
            { href: '/product-manager-resume-website.html', title: 'Product Manager', tag: 'Aurora Glass' },
            { href: '/ux-designer-resume-website.html', title: 'UX / Product Designer', tag: 'Nordic Bento' },
            { href: '/digital-marketing-resume-website.html', title: 'Digital Marketing', tag: 'Nordic Bento' },
            { href: '/seo-specialist-resume-website.html', title: 'SEO & GEO Specialist', tag: 'Minimal Studio' },
            { href: '/academic-cv-to-website.html', title: 'Academic & PhD CV', tag: 'Harvard Ivory' },
            { href: '/cs-student-resume-website.html', title: 'CS Student & New Grad', tag: 'Tech Terminal' },
            { href: '/freelancer-resume-website.html', title: 'Freelancer & Indie', tag: 'Swiss 2-Col' },
          ].map((g) => (
            <a
              key={g.href}
              href={g.href}
              className="group rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 transition hover:border-indigo-300 hover:bg-indigo-50/40"
            >
              <div className="text-[11px] font-semibold text-indigo-600">{g.tag}</div>
              <div className="mt-0.5 text-sm font-bold text-slate-900 group-hover:text-indigo-700">
                {g.title} &rarr;
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="text-center font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-slate-900">
          {isEn ? 'Frequently Asked Questions' : '常见问题 (FAQ)'}
        </h2>
        <div className="mt-8 space-y-3">
          {faqs.map((item, idx) => {
            const open = openFaq === idx;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {open && (
                  <div className="border-t border-slate-100 px-5 py-3.5 text-sm leading-relaxed text-slate-600">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Global Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-slate-500 sm:flex-row sm:px-6">
          <div>
            &copy; {new Date().getFullYear()} ResumeCraft &middot; Free Resume Builder &amp; One-Click Resume-to-Website Studio
          </div>
          <div className="flex flex-wrap items-center gap-5 font-medium text-slate-600">
            <a href="/resume-to-website-guides.html" className="hover:text-indigo-600">
              Industry Guides (20 Roles)
            </a>
            <a href="/deploy-guide.html" className="hover:text-indigo-600">
              Turn Resume into Website Guide
            </a>
            <a href="/privacy.html" className="hover:text-indigo-600">
              Privacy Policy
            </a>
            <a href="/terms.html" className="hover:text-indigo-600">
              Terms of Service
            </a>
            <a
              href="https://github.com/2313623432/Resume-Assistant-Even-a-Fool-Can-Use--"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

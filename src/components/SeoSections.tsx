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
    q: 'Is ResumeCraft really 100% free with no watermarks or subscriptions?',
    a: 'Yes. Every template, PDF export, and Resume-to-Website HTML export is completely free without accounts, subscriptions, or watermarks.',
  },
  {
    q: 'Is my resume data or AI API key sent to your servers?',
    a: 'No. ResumeCraft runs 100% in your browser. Your resume stays in localStorage, and your BYOK AI API key communicates directly with OpenAI, DeepSeek, Google Gemini, OpenRouter, or your custom endpoint.',
  },
  {
    q: 'How do I deploy my exported resume HTML website online for free?',
    a: 'Click "Export Website HTML" to download index.html or a ready-to-host ZIP package, then drag and drop it onto Netlify Drop (app.netlify.com/drop) or Cloudflare Pages Direct Upload for an instant HTTPS link in under 30 seconds.',
  },
  {
    q: 'Are the PDFs exported by ResumeCraft ATS-friendly?',
    a: 'Yes. Printing via Download PDF uses native browser vector rendering rather than rasterized screenshots, so Applicant Tracking Systems (Greenhouse, Lever, Workday) parse all text and links cleanly.',
  },
];

const FAQS_ZH = [
  {
    q: 'ResumeCraft 真的完全免费、没有水印或付费解锁吗？',
    a: '是的，所有 8 套海外模板、PDF 导出以及简历一键转个人网站 HTML 均完全免费，无需注册登录。',
  },
  {
    q: '我填入的 API Key 和简历隐私数据安全吗？',
    a: '完全安全。网站纯前端运行，简历内容仅保存在你的浏览器 localStorage 中；你填入的 API Key 只会直接请求你选择的 AI 服务商，不经过任何后端中转。',
  },
  {
    q: '导出的简历 HTML 怎么免费部署成公网个人网站？',
    a: '点击右上角「导出个人网站 HTML」，下载 ZIP 包并解压后，直接把文件夹拖入 Netlify Drop (app.netlify.com/drop) 或 Cloudflare Pages，不到 30 秒即可生成免费 HTTPS 网址。',
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
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {isEn
              ? 'Everything You Need to Land Interviews & Own Your Online Presence'
              : '三大核心能力：免费做简历、自带 Key AI 优化、一键建个人主页'}
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            {isEn
              ? 'Built for global job seekers, engineers, designers, and founders who want speed, privacy, and zero paywalls.'
              : '专为海外求职与开发者打造，兼具排版美感、隐私安全与零门槛免费建站。'}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <FileText className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-['Plus_Jakarta_Sans'] text-lg font-bold text-slate-900">
              {isEn ? '1. Free ATS Resume Builder' : '1. 免费海外标准简历制作'}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {isEn
                ? 'Choose from 8 refined US/Global templates including Harvard ATS, Executive Classic, and Silicon Valley Tech. Export crisp vector US Letter or A4 PDFs with zero watermarks.'
                : '内置 8 套精致海外模板（含哈佛 ATS 标准、硅谷技术风等），支持 US Letter / A4 矢量 PDF 导出，完全免费无水印。'}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <KeyRound className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-['Plus_Jakarta_Sans'] text-lg font-bold text-slate-900">
              {isEn ? '2. Private BYOK AI Tailoring' : '2. 自带 API Key 智能改简历'}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {isEn
                ? 'Plug in your own OpenAI, DeepSeek, Gemini, or OpenRouter API key. Paste a Job Description to rewrite bullets using the Google XYZ formula and boost ATS keyword match.'
                : '填入你自己的 OpenAI / DeepSeek / Gemini API Key，粘贴目标岗位 JD，AI 即刻按 Google XYZ 法则润色经历并补齐关键词。'}
            </p>
            <button
              type="button"
              onClick={onOpenAi}
              className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              {isEn ? 'Open AI Tailor Studio →' : '打开 AI 优化弹窗 →'}
            </button>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Globe className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-['Plus_Jakarta_Sans'] text-lg font-bold text-slate-900">
              {isEn ? '3. Resume-to-Website HTML' : '3. 免费把简历转为个人网站'}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {isEn
                ? 'Convert your resume into a responsive, dark-mode-ready standalone index.html portfolio website. Zero backend needed—host it free forever on Netlify, Cloudflare, or Vercel.'
                : '一键将简历转换为响应式独立 HTML 网站（带暗黑模式与 SEO 标签），拿到文件即可免费托管上线。'}
            </p>
            <button
              type="button"
              onClick={onExportWebsite}
              className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              {isEn ? 'Export Website & View Deploy Steps →' : '导出网站并查看部署教程 →'}
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
                {isEn ? 'STEP-BY-STEP DEPLOYMENT' : '保姆级上线部署教程'}
              </span>
              <h2 className="mt-3 font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-slate-900">
                {isEn
                  ? 'Got Your HTML File? Publish Your Resume Website Free in 30 Seconds'
                  : '拿到简历 HTML 后，如何 30 秒免费一键部署上线？'}
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
            &copy; {new Date().getFullYear()} ResumeCraft &middot; Free Browser-First Resume &amp; Portfolio Studio
          </div>
          <div className="flex flex-wrap items-center gap-5 font-medium text-slate-600">
            <a href="/deploy-guide.html" className="hover:text-indigo-600">
              Deployment Guide
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

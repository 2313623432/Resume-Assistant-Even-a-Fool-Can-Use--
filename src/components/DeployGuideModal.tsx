import { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  FileCode2,
  FolderArchive,
  Globe,
  Rocket,
  X,
} from 'lucide-react';
import type { Language, ResumeData } from '../types/resume';
import { downloadWebsiteHtml, downloadWebsiteZip } from '../utils/exportWebsite';

interface DeployGuideModalProps {
  isOpen: boolean;
  language: Language;
  resume: ResumeData;
  onClose: () => void;
}

type HostTab = 'netlify' | 'cloudflare' | 'vercel' | 'github';

const HOST_GUIDES: Record<
  HostTab,
  {
    name: string;
    badge: string;
    url: string;
    urlLabel: string;
    stepsEn: string[];
    stepsZh: string[];
  }
> = {
  netlify: {
    name: 'Netlify Drop',
    badge: 'Fastest · 10 Seconds · No Git',
    url: 'https://app.netlify.com/drop',
    urlLabel: 'Open Netlify Drop',
    stepsEn: [
      'Click "Download Website ZIP" below and unzip the folder (it contains your ready-to-host index.html).',
      'Open app.netlify.com/drop in your browser.',
      'Drag and drop the unzipped folder directly onto the Netlify upload box.',
      'Your resume website is live immediately with a free HTTPS URL (you can claim & customize the subdomain anytime).',
    ],
    stepsZh: [
      '点击下方「下载建站 ZIP 包」并解压（内含完整独立的 index.html）。',
      '打开 app.netlify.com/drop。',
      '将解压后的文件夹直接拖拽进网页上传框。',
      '约 5 秒即可获得免费 HTTPS 个人网站链接，可随时绑定自己的域名。',
    ],
  },
  cloudflare: {
    name: 'Cloudflare Pages',
    badge: 'Unlimited Free Bandwidth',
    url: 'https://dash.cloudflare.com/',
    urlLabel: 'Open Cloudflare Dashboard',
    stepsEn: [
      'Download the Website ZIP package below.',
      'Sign in to Cloudflare Dashboard -> Workers & Pages -> Create -> Pages -> Direct Upload.',
      'Enter your preferred subdomain (e.g. alex-morgan.pages.dev) and upload the ZIP file.',
      'Click Deploy Site — your resume site goes live globally on Cloudflare Edge.',
    ],
    stepsZh: [
      '点击下方下载「建站 ZIP 包」。',
      '登录 Cloudflare 控制台 -> Workers & Pages -> Create -> Pages -> Direct Upload（直接上传）。',
      '填写项目名称（即访问域名 xxx.pages.dev），直接上传 ZIP 包。',
      '点击 Deploy site，即刻免费全球加速上线。',
    ],
  },
  vercel: {
    name: 'Vercel',
    badge: '1-Command CLI or GitHub',
    url: 'https://vercel.com/new',
    urlLabel: 'Open Vercel New Project',
    stepsEn: [
      'Download index.html into an empty folder on your computer.',
      'Open a terminal in that folder and run: npx vercel --prod (or push the folder to GitHub and import at vercel.com/new).',
      'Accept the default prompts — Vercel publishes your site at https://your-name.vercel.app.',
    ],
    stepsZh: [
      '下载 index.html 并放入一个空文件夹。',
      '在该文件夹打开终端执行 npx vercel --prod（或上传到 GitHub 后在 vercel.com/new 一键导入）。',
      '一路回车确认即可生成免费 HTTPS 网站。',
    ],
  },
  github: {
    name: 'GitHub Pages',
    badge: 'Free .github.io Domain',
    url: 'https://github.com/new',
    urlLabel: 'Create GitHub Repo',
    stepsEn: [
      'Create a public repository named <your-username>.github.io (or any project name).',
      'Upload the downloaded index.html file to the root of the main branch.',
      'Go to Settings -> Pages -> Deploy from a branch -> main / (root) -> Save.',
      'Your site goes live within 1 minute at https://<your-username>.github.io.',
    ],
    stepsZh: [
      '新建公开仓库，命名为 <你的用户名>.github.io。',
      '把导出的 index.html 上传到仓库根目录。',
      '进入仓库 Settings -> Pages，选择从 main 分支根目录部署并保存。',
      '1 分钟内即可访问 https://<你的用户名>.github.io。',
    ],
  },
};

export function DeployGuideModal({
  isOpen,
  language,
  resume,
  onClose,
}: DeployGuideModalProps) {
  const isEn = language === 'en';
  const [activeHost, setActiveHost] = useState<HostTab>('netlify');

  if (!isOpen) return null;

  const guide = HOST_GUIDES[activeHost];
  const steps = isEn ? guide.stepsEn : guide.stepsZh;

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="studio-scroll max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Rocket className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-slate-900">
                {isEn
                  ? 'Export Resume Website & Publish Free in 30s'
                  : '导出个人网站 HTML 并 30 秒免费上线'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEn
                  ? 'Self-contained HTML with dark mode, SEO tags, and print-to-PDF support.'
                  : '导出的单页网站内置夜间模式、SEO 元标签与打印 PDF 按钮，无需服务器。'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {/* Download Actions */}
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => downloadWebsiteZip(resume)}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <FolderArchive className="h-4 w-4" />
              {isEn ? 'Download Website ZIP (Recommended)' : '下载建站 ZIP 包（推荐）'}
            </button>
            <button
              type="button"
              onClick={() => downloadWebsiteHtml(resume)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              <FileCode2 className="h-4 w-4 text-indigo-600" />
              {isEn ? 'Download index.html Only' : '仅下载单个 index.html'}
            </button>
          </div>

          {/* Hosting Tabs */}
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Globe className="h-3.5 w-3.5 text-indigo-600" />
              <span>
                {isEn
                  ? 'Choose a Free 1-Click Hosting Platform:'
                  : '拿到 HTML / ZIP 后，选择任意免费平台一键部署：'}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3">
              {(Object.keys(HOST_GUIDES) as HostTab[]).map((key) => {
                const active = activeHost === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveHost(key)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {HOST_GUIDES[key].name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Guide */}
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{guide.name}</h3>
                <span className="text-[11px] font-semibold text-indigo-600">{guide.badge}</span>
              </div>
              <a
                href={guide.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-2xs hover:bg-indigo-50"
              >
                {guide.urlLabel}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <ol className="space-y-2 pt-1">
              {steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    <strong className="text-slate-900">Step {idx + 1}:</strong> {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

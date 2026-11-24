import {
  FileDown,
  FileText,
  Globe,
  Languages,
  Rocket,
  Sparkles,
  Upload,
} from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import type { Language } from '../types/resume';

interface NavbarProps {
  language: Language;
  onToggleLanguage: () => void;
  onOpenImport: () => void;
  onOpenAi: () => void;
  onPrintPdf: () => void;
  onExportWebsite: () => void;
  onOpenDeployGuide: () => void;
}

export function Navbar({
  language,
  onToggleLanguage,
  onOpenImport,
  onOpenAi,
  onPrintPdf,
  onExportWebsite,
  onOpenDeployGuide,
}: NavbarProps) {
  const t = TRANSLATIONS[language];

  return (
    <header className="no-print sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <a href="#top" className="flex items-center gap-2.5 text-slate-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <span className="block font-['Plus_Jakarta_Sans'] text-base font-bold tracking-tight text-slate-900">
                {t.brand}
              </span>
              <span className="hidden text-[11px] font-medium text-slate-500 sm:block">
                {t.tagline}
              </span>
            </div>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            <a
              href="#builder-workspace"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {t.navBuilder}
            </a>
            <button
              type="button"
              onClick={onOpenAi}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t.navAi}
            </button>
            <button
              type="button"
              onClick={onOpenDeployGuide}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Rocket className="h-3.5 w-3.5" />
              {t.navDeploy}
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleLanguage}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            title="Switch Language (English / 中文)"
          >
            <Languages className="h-3.5 w-3.5 text-slate-500" />
            <span>{language === 'en' ? 'EN' : '中文'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenImport}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:text-sm"
          >
            <Upload className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">{t.btnImport}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAi}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 sm:text-sm lg:hidden"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI</span>
          </button>

          <button
            type="button"
            onClick={onPrintPdf}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-50 sm:text-sm"
          >
            <FileDown className="h-4 w-4 text-slate-600" />
            <span className="hidden md:inline">{t.btnPdf}</span>
          </button>

          <button
            type="button"
            onClick={onExportWebsite}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:text-sm"
          >
            <Globe className="h-4 w-4" />
            <span>{t.btnExportWebsite}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

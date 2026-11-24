import { Globe, ShieldCheck, Sparkles, X } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import type { Language } from '../types/resume';

interface HeroBannerProps {
  language: Language;
  onDismiss: () => void;
  onOpenAi: () => void;
  onExportWebsite: () => void;
}

export function HeroBanner({
  language,
  onDismiss,
  onOpenAi,
  onExportWebsite,
}: HeroBannerProps) {
  const t = TRANSLATIONS[language];

  return (
    <section
      id="top"
      className="no-print border-b border-slate-200 bg-gradient-to-br from-white via-indigo-50/40 to-slate-50"
    >
      <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-center">
        <div className="max-w-3xl space-y-2.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{t.heroBadge}</span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {t.heroTitle}
          </h1>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            {t.heroSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenAi}
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-xs transition hover:border-indigo-300 hover:bg-indigo-50"
          >
            <Sparkles className="h-4 w-4" />
            {t.heroCtaAi}
          </button>
          <button
            type="button"
            onClick={onExportWebsite}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Globe className="h-4 w-4 text-emerald-400" />
            {t.heroCtaWebsite}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            aria-label={t.heroDismiss}
            title={t.heroDismiss}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

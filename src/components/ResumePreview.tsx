import { useMemo, useState } from 'react';
import { FileDown, FileText, Globe, RotateCcw } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import type { ResumeData, ResumeSection } from '../types/resume';
import { generatePortfolioHtml } from '../utils/exportWebsite';

interface ResumePreviewProps {
  data: ResumeData;
  canUndoAi: boolean;
  onUndoAi: () => void;
  onPrintPdf: () => void;
  onExportWebsite: () => void;
}

function splitBullets(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[•\-*]\s*/, '').trim())
    .filter(Boolean);
}

export function ResumePreview({
  data,
  canUndoAi,
  onUndoAi,
  onPrintPdf,
  onExportWebsite,
}: ResumePreviewProps) {
  const t = TRANSLATIONS[data.language];
  const [viewMode, setViewMode] = useState<'resume' | 'website'>('resume');
  const [zoom, setZoom] = useState<0.75 | 0.9 | 1>(0.9);

  const websiteHtml = useMemo(
    () => (viewMode === 'website' ? generatePortfolioHtml(data) : ''),
    [data, viewMode],
  );

  const { basics, sections, theme } = data;
  const visibleSections = sections.filter((s) => s.visible);
  const accent = theme.accentColor;

  const fontStack =
    theme.fontFamily === 'merriweather'
      ? "'Merriweather', Georgia, serif"
      : theme.fontFamily === 'mono'
        ? "'JetBrains Mono', ui-monospace, monospace"
        : "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

  const baseSizeClass =
    theme.fontSize === 'sm' ? 'text-[11px]' : theme.fontSize === 'lg' ? 'text-[13.5px]' : 'text-[12.2px]';

  const sheetWidth = theme.pageSize === 'letter' ? '8.5in' : '210mm';
  const sheetMinHeight = theme.pageSize === 'letter' ? '11in' : '297mm';

  const isDarkHeader = theme.template === 'slate';
  const isTech = theme.template === 'tech';
  const isHarvard = theme.template === 'harvard';
  const isEditorial = theme.template === 'editorial';
  const isSwiss = theme.template === 'swiss';
  const isNordic = theme.template === 'nordic';

  const contactItems = [
    basics.location,
    basics.email,
    basics.phone,
    basics.website,
    basics.linkedin,
    basics.github,
  ].filter(Boolean);

  const renderSectionContent = (sec: ResumeSection) => {
    if ((sec.type === 'summary' || sec.type === 'custom') && sec.textContent) {
      return (
        <p className="whitespace-pre-line leading-relaxed text-slate-700">{sec.textContent}</p>
      );
    }

    if ((sec.type === 'experience' || sec.type === 'education') && sec.timelineItems?.length) {
      return (
        <div className="space-y-3">
          {sec.timelineItems.map((item) => {
            const bullets = splitBullets(item.description);
            return (
              <div key={item.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-900">{item.subtitle || item.title}</span>
                    {item.subtitle && item.title && (
                      <span className="font-medium text-slate-700"> — {item.title}</span>
                    )}
                    {item.location && (
                      <span className="text-slate-500"> · {item.location}</span>
                    )}
                  </div>
                  <span className="text-[0.9em] font-medium whitespace-nowrap text-slate-500">
                    {item.date}
                  </span>
                </div>
                {bullets.length > 0 && (
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 leading-snug text-slate-700">
                    {bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (sec.type === 'projects' && sec.projectItems?.length) {
      return (
        <div className="space-y-2.5">
          {sec.projectItems.map((proj) => {
            const bullets = splitBullets(proj.description);
            return (
              <div key={proj.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-900">{proj.name}</span>
                    {proj.role && <span className="text-slate-600"> · {proj.role}</span>}
                    {proj.url && (
                      <span className="ml-1.5 text-[0.88em] text-slate-500">({proj.url})</span>
                    )}
                  </div>
                  {proj.date && (
                    <span className="text-[0.9em] font-medium text-slate-500">{proj.date}</span>
                  )}
                </div>
                {bullets.length > 0 && (
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 leading-snug text-slate-700">
                    {bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                )}
                {proj.techStack.length > 0 && (
                  <div className="mt-1 text-[0.88em] text-slate-500">
                    <span className="font-semibold text-slate-600">Stack:</span>{' '}
                    {proj.techStack.join(' · ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (sec.type === 'skills' && sec.skillGroups?.length) {
      return (
        <div className="space-y-1.5">
          {sec.skillGroups.map((g) => (
            <div key={g.id} className="leading-snug text-slate-700">
              <span className="font-semibold text-slate-900">{g.category}: </span>
              <span>{g.items.join(', ')}</span>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const renderSectionHeading = (title: string) => {
    if (isHarvard) {
      return (
        <h2 className="mb-2 border-b border-slate-900 pb-0.5 text-[1.05em] font-bold tracking-wide text-slate-900 uppercase">
          {title}
        </h2>
      );
    }
    if (isEditorial) {
      return (
        <h2
          className="mb-2 border-b pb-1 text-[1.05em] font-bold tracking-wider uppercase"
          style={{ color: accent, borderColor: `${accent}33` }}
        >
          {title}
        </h2>
      );
    }
    if (isTech) {
      return (
        <h2
          className="mb-2 flex items-center gap-2 text-[1em] font-bold tracking-wider uppercase"
          style={{ color: accent }}
        >
          <span className="inline-block h-2 w-2 rounded-xs" style={{ backgroundColor: accent }} />
          {title}
        </h2>
      );
    }
    return (
      <h2
        className="mb-2 border-b border-slate-200 pb-1 text-[1em] font-bold tracking-wider uppercase"
        style={{ color: accent }}
      >
        {title}
      </h2>
    );
  };

  const sidebarSections = isSwiss
    ? visibleSections.filter((s) => s.type === 'skills' || s.type === 'education')
    : [];
  const mainSections = isSwiss
    ? visibleSections.filter((s) => s.type !== 'skills' && s.type !== 'education')
    : visibleSections;

  return (
    <div className="flex h-full flex-col bg-slate-100/90">
      {/* Preview Toolbar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setViewMode('resume')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              viewMode === 'resume'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            {t.viewResume}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('website')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              viewMode === 'website'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            {t.viewWebsite}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {canUndoAi && (
            <button
              type="button"
              onClick={onUndoAi}
              className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t.undoAi}
            </button>
          )}

          {viewMode === 'resume' && (
            <div className="hidden items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5 sm:flex">
              {([0.75, 0.9, 1] as const).map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setZoom(z)}
                  className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
                    zoom === z ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  {Math.round(z * 100)}%
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={viewMode === 'resume' ? onPrintPdf : onExportWebsite}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <FileDown className="h-3.5 w-3.5" />
            {viewMode === 'resume' ? t.btnPdf : t.btnExportWebsite}
          </button>
        </div>
      </div>

      {/* Stage */}
      <div id="preview-stage" className="studio-scroll flex-1 overflow-auto p-6">
        {viewMode === 'website' ? (
          <div className="mx-auto h-full min-h-[680px] max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <iframe
              title="Live Portfolio Website Preview"
              srcDoc={websiteHtml}
              className="h-full min-h-[680px] w-full border-0"
              sandbox="allow-scripts allow-modals"
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              id="resume-print-sheet"
              className={`bg-white text-slate-900 shadow-lg ring-1 ring-slate-200/80 transition-transform ${baseSizeClass}`}
              style={{
                width: sheetWidth,
                minHeight: sheetMinHeight,
                fontFamily: fontStack,
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
              }}
            >
              {/* Header */}
              <header
                className={
                  isDarkHeader
                    ? 'bg-slate-900 px-9 py-7 text-white'
                    : isHarvard
                      ? 'px-9 pt-8 pb-4 text-center'
                      : isNordic
                        ? 'border-b border-slate-100 bg-slate-50/70 px-9 py-7'
                        : 'border-b border-slate-200 px-9 pt-8 pb-5'
                }
                style={
                  !isDarkHeader && !isHarvard && !isNordic
                    ? { borderTop: `4px solid ${accent}` }
                    : undefined
                }
              >
                <div
                  className={`flex items-center gap-5 ${
                    isHarvard ? 'justify-center text-center' : 'justify-between'
                  }`}
                >
                  <div className="flex-1">
                    <h1
                      className={`font-bold tracking-tight ${
                        isHarvard ? 'text-[2.1em] uppercase' : 'text-[2em]'
                      }`}
                    >
                      {basics.name}
                    </h1>
                    {basics.title && (
                      <p
                        className="mt-0.5 text-[1.1em] font-semibold"
                        style={{ color: isDarkHeader ? '#a5b4fc' : accent }}
                      >
                        {basics.title}
                      </p>
                    )}
                    <div
                      className={`mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[0.9em] ${
                        isDarkHeader ? 'text-slate-300' : 'text-slate-600'
                      } ${isHarvard ? 'justify-center' : ''}`}
                    >
                      {contactItems.map((c, idx) => (
                        <span key={`${c}-${idx}`}>
                          {idx > 0 && <span className="mr-3 text-slate-300">|</span>}
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {basics.showAvatar && basics.avatar && (
                    <img
                      src={basics.avatar}
                      alt={basics.name}
                      className="h-16 w-16 rounded-full border border-slate-200 object-cover"
                    />
                  )}
                </div>
              </header>

              {/* Body */}
              {isSwiss ? (
                <div className="grid grid-cols-12 gap-6 px-9 py-6">
                  <div className="col-span-4 space-y-5 border-r border-slate-200 pr-5">
                    {sidebarSections.map((sec) => (
                      <section key={sec.id}>
                        {renderSectionHeading(sec.title)}
                        {renderSectionContent(sec)}
                      </section>
                    ))}
                  </div>
                  <div className="col-span-8 space-y-5">
                    {mainSections.map((sec) => (
                      <section key={sec.id}>
                        {renderSectionHeading(sec.title)}
                        {renderSectionContent(sec)}
                      </section>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4.5 px-9 py-6">
                  {visibleSections.map((sec) => (
                    <section key={sec.id}>
                      {renderSectionHeading(sec.title)}
                      {renderSectionContent(sec)}
                    </section>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

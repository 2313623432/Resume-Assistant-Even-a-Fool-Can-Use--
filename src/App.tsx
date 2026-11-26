import { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink, Eye, PenLine, RotateCcw, Sparkles } from 'lucide-react';
import { AITailorModal } from './components/AITailorModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { HeroBanner } from './components/HeroBanner';
import { ImportModal } from './components/ImportModal';
import { Navbar } from './components/Navbar';
import { ResumeEditor } from './components/ResumeEditor';
import { ResumePreview } from './components/ResumePreview';
import { SeoSections } from './components/SeoSections';
import { Sidebar } from './components/Sidebar';
import { DEFAULT_AI_CONFIG, DEFAULT_RESUME_DATA } from './data/defaultResume';
import { ROLE_PRESETS, type RolePreset } from './data/rolePresets';
import type {
  AIConfig,
  AITailorResult,
  BasicInfo,
  ResumeData,
  ResumeSection,
  SectionType,
  ThemeConfig,
} from './types/resume';
import { applyTailorResult } from './utils/aiOptimizer';

const STORAGE_DATA_KEY = 'resumecraft_v2_data';
const STORAGE_AI_KEY = 'resumecraft_v2_ai';

function getInitialQueryParams(): { preset: RolePreset | null; isEmbed: boolean } {
  if (typeof window === 'undefined') {
    return { preset: null, isEmbed: false };
  }
  const params = new URLSearchParams(window.location.search);
  const presetKey = params.get('preset') ?? '';
  const isEmbed = params.get('embed') === '1';
  return {
    preset: presetKey && ROLE_PRESETS[presetKey] ? ROLE_PRESETS[presetKey] : null,
    isEmbed,
  };
}

function loadSavedDraftOrNull(): ResumeData | null {
  try {
    const raw = localStorage.getItem(STORAGE_DATA_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ResumeData>;
    if (!parsed.basics || !Array.isArray(parsed.sections)) {
      return null;
    }
    return {
      ...DEFAULT_RESUME_DATA,
      ...parsed,
      basics: { ...DEFAULT_RESUME_DATA.basics, ...parsed.basics },
      theme: { ...DEFAULT_RESUME_DATA.theme, ...(parsed.theme ?? {}) },
      sections: parsed.sections,
    };
  } catch {
    return null;
  }
}

function loadInitialAiConfig(): AIConfig {
  try {
    const raw = localStorage.getItem(STORAGE_AI_KEY);
    if (!raw) return DEFAULT_AI_CONFIG;
    return { ...DEFAULT_AI_CONFIG, ...(JSON.parse(raw) as Partial<AIConfig>) };
  } catch {
    return DEFAULT_AI_CONFIG;
  }
}

export default function App() {
  const [{ preset: initialPreset, isEmbed }] = useState(getInitialQueryParams);
  const [previousDraft, setPreviousDraft] = useState<ResumeData | null>(() =>
    initialPreset ? loadSavedDraftOrNull() : null,
  );
  const [activePreset, setActivePreset] = useState<RolePreset | null>(initialPreset);
  const [dirtyFromPreset, setDirtyFromPreset] = useState(false);

  const [resume, setResume] = useState<ResumeData>(() =>
    initialPreset ? initialPreset.data : loadSavedDraftOrNull() ?? DEFAULT_RESUME_DATA,
  );
  const [aiConfig, setAiConfig] = useState<AIConfig>(loadInitialAiConfig);
  const [activeTarget, setActiveTarget] = useState<'basics' | string>('basics');
  const [showHero, setShowHero] = useState(!isEmbed && !initialPreset);
  const [mobilePane, setMobilePane] = useState<'edit' | 'preview'>('edit');

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const [aiHistory, setAiHistory] = useState<ResumeData | null>(null);
  const [toast, setToast] = useState<string>('');

  useEffect(() => {
    // Protect returning users' saved resumes when merely viewing a preset or embedded iframe.
    if (activePreset && !dirtyFromPreset) return;
    try {
      localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(resume));
    } catch {
      // Ignore quota errors
    }
  }, [resume, activePreset, dirtyFromPreset]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_AI_KEY, JSON.stringify(aiConfig));
    } catch {
      // Ignore quota errors
    }
  }, [aiConfig]);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => {
      setToast((prev) => (prev === msg ? '' : prev));
    }, 3000);
  };

  const updateResume = (updater: (prev: ResumeData) => ResumeData) => {
    setDirtyFromPreset(true);
    setResume(updater);
  };

  const handleRestorePreviousDraft = () => {
    if (!previousDraft) return;
    setResume(previousDraft);
    setPreviousDraft(null);
    setActivePreset(null);
    setDirtyFromPreset(true);
    notify(
      resume.language === 'en'
        ? 'Restored your previous local resume draft.'
        : '已恢复你之前保存的本地简历草稿。',
    );
  };

  const handleToggleLanguage = () => {
    updateResume((prev) => ({
      ...prev,
      language: prev.language === 'en' ? 'zh' : 'en',
    }));
  };

  const handleUpdateBasics = (patch: Partial<BasicInfo>) => {
    updateResume((prev) => ({
      ...prev,
      basics: { ...prev.basics, ...patch },
    }));
  };

  const handleUpdateTheme = (patch: Partial<ThemeConfig>) => {
    updateResume((prev) => ({
      ...prev,
      theme: { ...prev.theme, ...patch },
    }));
  };

  const handleUpdateSection = (id: string, patch: Partial<ResumeSection>) => {
    updateResume((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  };

  const handleReorderSections = (fromIndex: number, toIndex: number) => {
    updateResume((prev) => {
      const next = [...prev.sections];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return { ...prev, sections: next };
    });
  };

  const handleToggleVisibility = (id: string) => {
    updateResume((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === id ? { ...s, visible: !s.visible } : s,
      ),
    }));
  };

  const handleDeleteSection = (id: string) => {
    updateResume((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== id),
    }));
    if (activeTarget === id) {
      setActiveTarget('basics');
    }
  };

  const handleAddSection = (type: SectionType, title: string) => {
    const id = `sec-${Date.now()}`;
    const created: ResumeSection = {
      id,
      type,
      title,
      visible: true,
      ...(type === 'custom' || type === 'summary' ? { textContent: '' } : {}),
      ...(type === 'experience' || type === 'education'
        ? {
            timelineItems: [
              {
                id: `tl-${Date.now()}`,
                title: 'Organization',
                subtitle: 'Role / Title',
                location: 'Remote',
                date: '2025',
                description: '• Key highlight or achievement.',
              },
            ],
          }
        : {}),
      ...(type === 'projects'
        ? {
            projectItems: [
              {
                id: `proj-${Date.now()}`,
                name: 'Project Name',
                role: 'Creator',
                date: '2025',
                url: '',
                techStack: ['TypeScript'],
                description: '• Summary of what you built and shipped.',
              },
            ],
          }
        : {}),
      ...(type === 'skills'
        ? {
            skillGroups: [
              {
                id: `sk-${Date.now()}`,
                category: 'Core Skills',
                items: ['Communication', 'Leadership'],
              },
            ],
          }
        : {}),
    };

    updateResume((prev) => ({
      ...prev,
      sections: [...prev.sections, created],
    }));
    setActiveTarget(id);
  };

  const handleApplyAiResult = (result: AITailorResult) => {
    setAiHistory(resume);
    updateResume((prev) => applyTailorResult(prev, result));
    notify(
      resume.language === 'en'
        ? 'AI tailored suggestions applied! You can undo anytime.'
        : 'AI 优化内容已应用，可随时撤销恢复。',
    );
  };

  const handleUndoAi = () => {
    if (!aiHistory) return;
    setDirtyFromPreset(true);
    setResume(aiHistory);
    setAiHistory(null);
    notify(resume.language === 'en' ? 'Reverted previous AI edit.' : '已撤销上次 AI 修改。');
  };

  const handlePrintPdf = () => {
    setMobilePane('preview');
    window.setTimeout(() => {
      window.print();
    }, 80);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar
        language={resume.language}
        onToggleLanguage={handleToggleLanguage}
        onOpenImport={() => setImportModalOpen(true)}
        onOpenAi={() => setAiModalOpen(true)}
        onPrintPdf={handlePrintPdf}
        onExportWebsite={() => setDeployModalOpen(true)}
        onOpenDeployGuide={() => setDeployModalOpen(true)}
      />

      {activePreset && (
        <div className="no-print border-b border-indigo-200/80 bg-indigo-50/90 px-4 py-2 text-xs">
          <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-indigo-950">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span className="font-bold">
                {resume.language === 'en'
                  ? `Free ${activePreset.label} Template Loaded`
                  : `已加载免费「${activePreset.label}」行业模板`}
              </span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200">
                {activePreset.badge}
              </span>
              <span className="hidden text-indigo-700/80 sm:inline">
                {resume.language === 'en'
                  ? '· Edit freely, export vector PDF, or click Turn Resume into Website.'
                  : '· 可直接修改、免费导出 PDF，或点击「一键把简历变成网页」。'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {previousDraft && (
                <button
                  type="button"
                  onClick={handleRestorePreviousDraft}
                  className="inline-flex items-center gap-1 rounded-lg border border-indigo-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-indigo-800 hover:bg-indigo-100"
                >
                  <RotateCcw className="h-3 w-3" />
                  {resume.language === 'en' ? 'Restore My Draft' : '恢复我之前的草稿'}
                </button>
              )}
              {isEmbed && (
                <a
                  href={`/?preset=${encodeURIComponent(activePreset.slug)}`}
                  target="_top"
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-indigo-700"
                >
                  <span>{resume.language === 'en' ? 'Open Full-Screen' : '全屏打开'}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {showHero && !isEmbed && (
        <HeroBanner
          language={resume.language}
          onDismiss={() => setShowHero(false)}
          onOpenAi={() => setAiModalOpen(true)}
          onExportWebsite={() => setDeployModalOpen(true)}
        />
      )}

      {/* Mobile Edit / Preview Switcher */}
      <div className="no-print flex border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
        <div className="grid w-full grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMobilePane('edit')}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold ${
              mobilePane === 'edit' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            <PenLine className="h-3.5 w-3.5" />
            {resume.language === 'en' ? 'Edit Resume' : '编辑内容'}
          </button>
          <button
            type="button"
            onClick={() => setMobilePane('preview')}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold ${
              mobilePane === 'preview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            {resume.language === 'en' ? 'Live Preview' : '实时预览'}
          </button>
        </div>
      </div>

      {/* Main 3-Pane Studio Workspace */}
      <main
        id="builder-workspace"
        className="mx-auto grid max-w-[1600px] border-b border-slate-200 bg-white lg:h-[calc(100vh-4rem)] lg:grid-cols-[260px_minmax(380px,460px)_1fr]"
      >
        <div className={`${mobilePane === 'edit' ? 'block' : 'hidden'} lg:block lg:h-full lg:overflow-hidden`}>
          <Sidebar
            language={resume.language}
            sections={resume.sections}
            activeTarget={activeTarget}
            theme={resume.theme}
            onSelectTarget={(target) => {
              setActiveTarget(target);
              setMobilePane('edit');
            }}
            onReorderSections={handleReorderSections}
            onToggleSectionVisibility={handleToggleVisibility}
            onDeleteSection={handleDeleteSection}
            onAddSection={handleAddSection}
            onUpdateTheme={handleUpdateTheme}
          />
        </div>

        <div
          className={`${mobilePane === 'edit' ? 'block' : 'hidden'} border-slate-200 lg:block lg:h-full lg:overflow-hidden lg:border-r`}
        >
          <ResumeEditor
            language={resume.language}
            activeTarget={activeTarget}
            basics={resume.basics}
            sections={resume.sections}
            onUpdateBasics={handleUpdateBasics}
            onUpdateSection={handleUpdateSection}
            onOpenAi={() => setAiModalOpen(true)}
          />
        </div>

        <div className={`${mobilePane === 'preview' ? 'block' : 'hidden'} lg:block lg:h-full lg:overflow-hidden`}>
          <ResumePreview
            data={resume}
            canUndoAi={aiHistory !== null}
            onUndoAi={handleUndoAi}
            onPrintPdf={handlePrintPdf}
            onExportWebsite={() => setDeployModalOpen(true)}
          />
        </div>
      </main>

      {!isEmbed && (
        <SeoSections
          language={resume.language}
          onOpenAi={() => setAiModalOpen(true)}
          onExportWebsite={() => setDeployModalOpen(true)}
        />
      )}

      {/* Modals */}
      <AITailorModal
        isOpen={aiModalOpen}
        language={resume.language}
        resume={resume}
        aiConfig={aiConfig}
        canUndo={aiHistory !== null}
        onClose={() => setAiModalOpen(false)}
        onUpdateAiConfig={setAiConfig}
        onApplyResult={handleApplyAiResult}
        onUndo={handleUndoAi}
      />

      <DeployGuideModal
        isOpen={deployModalOpen}
        language={resume.language}
        resume={resume}
        onClose={() => setDeployModalOpen(false)}
      />

      <ImportModal
        isOpen={importModalOpen}
        language={resume.language}
        resume={resume}
        onClose={() => setImportModalOpen(false)}
        onImported={(next) => {
          setDirtyFromPreset(true);
          setResume(next);
          notify(
            resume.language === 'en'
              ? 'Resume imported locally!'
              : '简历已成功导入到本地！',
          );
        }}
        onResetSample={() => {
          setActivePreset(null);
          setPreviousDraft(null);
          setDirtyFromPreset(true);
          setResume(DEFAULT_RESUME_DATA);
          setAiHistory(null);
          notify(
            resume.language === 'en'
              ? 'Reset to overseas sample resume (Alex Morgan).'
              : '已恢复默认海外英文示例简历。',
          );
        }}
      />

      {/* Toast */}
      {toast && (
        <div className="no-print fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

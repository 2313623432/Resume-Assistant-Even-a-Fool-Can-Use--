import { useState } from 'react';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { AI_PROVIDER_PRESETS } from '../data/defaultResume';
import type {
  AIConfig,
  AIProviderId,
  AITailorResult,
  Language,
  ResumeData,
} from '../types/resume';
import { tailorResumeWithAI } from '../utils/aiOptimizer';

interface AITailorModalProps {
  isOpen: boolean;
  language: Language;
  resume: ResumeData;
  aiConfig: AIConfig;
  canUndo: boolean;
  onClose: () => void;
  onUpdateAiConfig: (next: AIConfig) => void;
  onApplyResult: (result: AITailorResult) => void;
  onUndo: () => void;
}

export function AITailorModal({
  isOpen,
  language,
  resume,
  aiConfig,
  canUndo,
  onClose,
  onUpdateAiConfig,
  onApplyResult,
  onUndo,
}: AITailorModalProps) {
  const isEn = language === 'en';
  const [jd, setJd] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AITailorResult | null>(null);

  if (!isOpen) return null;

  const handleProviderChange = (provider: AIProviderId) => {
    const preset = AI_PROVIDER_PRESETS[provider];
    onUpdateAiConfig({
      ...aiConfig,
      provider,
      apiUrl: preset.apiUrl,
      model: preset.defaultModel,
    });
  };

  const handleRunTailor = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await tailorResumeWithAI(resume, jd, aiConfig);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to tailor resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="studio-scroll max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-slate-900">
                {isEn ? 'AI Resume Tailor (Bring Your Own Key)' : 'AI 简历精准优化（自带 API Key）'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEn
                  ? 'Rewrite bullets with Google XYZ impact formula & match ATS keywords.'
                  : '基于岗位 JD 自动匹配 ATS 关键词并用 XYZ 量化公式重构简历要点。'}
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
          {/* Privacy Badge */}
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5 text-xs text-emerald-900">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <span>
              {isEn
                ? 'Your API key is saved only in your browser localStorage and sent directly from your browser to the provider you choose. We never see or proxy your key.'
                : '你的 API Key 仅存储在本地浏览器 localStorage 中，请求直接由浏览器发往目标接口，不经过任何第三方中转服务器。'}
            </span>
          </div>

          {/* Provider Presets */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              {isEn ? 'AI Provider Preset' : 'AI 服务商预设'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(AI_PROVIDER_PRESETS) as AIProviderId[]).map((pid) => {
                const active = aiConfig.provider === pid;
                return (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => handleProviderChange(pid)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                      active
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {AI_PROVIDER_PRESETS[pid].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* API Key & Model */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 flex items-center gap-1 text-xs font-semibold text-slate-700">
                <KeyRound className="h-3.5 w-3.5 text-slate-400" />
                {isEn ? 'Your API Key' : '填入你的 API Key'}
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={aiConfig.apiKey}
                  onChange={(e) =>
                    onUpdateAiConfig({ ...aiConfig, apiKey: e.target.value })
                  }
                  placeholder={AI_PROVIDER_PRESETS[aiConfig.provider].keyHint}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-9 pl-3 text-sm outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((s) => !s)}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                {isEn ? 'Model Name' : '模型名称'}
              </label>
              <input
                type="text"
                value={aiConfig.model}
                onChange={(e) =>
                  onUpdateAiConfig({ ...aiConfig, model: e.target.value })
                }
                placeholder="gpt-4o-mini"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              {isEn ? 'API Endpoint URL' : 'API 接口地址 (OpenAI 兼容)'}
            </label>
            <input
              type="url"
              value={aiConfig.apiUrl}
              onChange={(e) =>
                onUpdateAiConfig({ ...aiConfig, apiUrl: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          {/* Target JD */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              {isEn ? 'Target Job Description (JD)' : '粘贴目标岗位描述 (JD)'}
            </label>
            <textarea
              rows={5}
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder={
                isEn
                  ? 'Paste the full job description here (requirements, responsibilities, tech stack)...'
                  : '在此粘贴目标岗位的职责要求与技能关键词...'
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-3 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-950">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {isEn ? 'Tailored Preview Ready' : 'AI 优化方案已生成'}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-700 shadow-2xs">
                  ATS Match: {result.atsScoreBefore}% &rarr; {result.atsScoreAfter}%
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-700">{result.rationale}</p>

              {result.matchedKeywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {result.matchedKeywords.slice(0, 10).map((kw) => (
                    <span
                      key={kw}
                      className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onApplyResult(result);
                    onClose();
                  }}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  {isEn ? 'Apply Tailored Changes' : '一键应用到简历'}
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
            {canUndo ? (
              <button
                type="button"
                onClick={onUndo}
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {isEn ? 'Undo Previous AI Edit' : '撤销上次 AI 修改'}
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {isEn ? 'Close' : '关闭'}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleRunTailor}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isEn ? 'Tailoring...' : '正在分析优化...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-indigo-300" />
                    {isEn ? 'Analyze & Tailor Resume' : '开始 AI 优化'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

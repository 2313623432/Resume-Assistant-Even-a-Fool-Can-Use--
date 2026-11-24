import { useState } from 'react';
import { Download, FileUp, Loader2, RotateCcw, X } from 'lucide-react';
import type { Language, ResumeData } from '../types/resume';
import { downloadResumeJson } from '../utils/exportWebsite';
import { importResumeFile } from '../utils/fileImport';

interface ImportModalProps {
  isOpen: boolean;
  language: Language;
  resume: ResumeData;
  onClose: () => void;
  onImported: (next: ResumeData) => void;
  onResetSample: () => void;
}

export function ImportModal({
  isOpen,
  language,
  resume,
  onClose,
  onImported,
  onResetSample,
}: ImportModalProps) {
  const isEn = language === 'en';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError('');
    setLoading(true);
    try {
      const next = await importResumeFile(file, resume);
      onImported(next);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-slate-900">
            {isEn ? 'Import, Backup & Reset' : '导入简历 / 备份与重置'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 px-6 py-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50/30">
            {loading ? (
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-indigo-600" />
            ) : (
              <FileUp className="mb-2 h-8 w-8 text-indigo-600" />
            )}
            <span className="text-sm font-semibold text-slate-800">
              {isEn ? 'Upload PDF, Word (.docx), or JSON Backup' : '上传 PDF、Word (.docx) 或 JSON 备份'}
            </span>
            <span className="mt-1 text-xs text-slate-500">
              {isEn
                ? 'Parsed 100% locally in your browser. Zero server uploads.'
                : '纯浏览器本地解析，不会上传至任何服务器。'}
            </span>
            <input
              type="file"
              accept=".pdf,.docx,.json"
              onChange={(e) => handleFile(e.target.files?.[0])}
              className="hidden"
            />
          </label>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          <div className="grid gap-2.5 pt-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => downloadResumeJson(resume)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4 text-indigo-600" />
              {isEn ? 'Download JSON Backup' : '下载 JSON 数据备份'}
            </button>

            <button
              type="button"
              onClick={() => {
                onResetSample();
                onClose();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
            >
              <RotateCcw className="h-4 w-4" />
              {isEn ? 'Reset to Sample Resume' : '恢复海外示例简历'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

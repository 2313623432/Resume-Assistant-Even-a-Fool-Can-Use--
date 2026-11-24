import { useState } from 'react';
import {
  Eye,
  EyeOff,
  GripVertical,
  LayoutGrid,
  Palette,
  Plus,
  Trash2,
  UserCircle2,
} from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import type {
  FontFamilyId,
  Language,
  PageSize,
  ResumeSection,
  SectionType,
  TemplateId,
  ThemeConfig,
} from '../types/resume';

interface SidebarProps {
  language: Language;
  sections: ResumeSection[];
  activeTarget: 'basics' | string;
  theme: ThemeConfig;
  onSelectTarget: (target: 'basics' | string) => void;
  onReorderSections: (fromIndex: number, toIndex: number) => void;
  onToggleSectionVisibility: (id: string) => void;
  onDeleteSection: (id: string) => void;
  onAddSection: (type: SectionType, title: string) => void;
  onUpdateTheme: (patch: Partial<ThemeConfig>) => void;
}

const TEMPLATES: Array<{ id: TemplateId; name: string; tag: string }> = [
  { id: 'executive', name: 'Executive Classic', tag: 'Clean' },
  { id: 'harvard', name: 'Harvard ATS', tag: 'ATS #1' },
  { id: 'minimal', name: 'Modern Minimal', tag: 'Crisp' },
  { id: 'tech', name: 'Silicon Valley Tech', tag: 'Tech' },
  { id: 'editorial', name: 'Editorial Serif', tag: 'Serif' },
  { id: 'swiss', name: 'Swiss Grid', tag: '2-Col' },
  { id: 'nordic', name: 'Nordic Clean', tag: 'Airy' },
  { id: 'slate', name: 'Slate Dark Header', tag: 'Bold' },
];

const ACCENT_COLORS = [
  { name: 'Indigo', value: '#4F46E5' },
  { name: 'Cobalt', value: '#2563EB' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Slate', value: '#0F172A' },
  { name: 'Crimson', value: '#DC2626' },
  { name: 'Teal', value: '#0D9488' },
];

export function Sidebar({
  language,
  sections,
  activeTarget,
  theme,
  onSelectTarget,
  onReorderSections,
  onToggleSectionVisibility,
  onDeleteSection,
  onAddSection,
  onUpdateTheme,
}: SidebarProps) {
  const t = TRANSLATIONS[language];
  const [tab, setTab] = useState<'sections' | 'design'>('sections');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<SectionType>('custom');

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    onAddSection(newType, title);
    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <aside className="no-print flex h-full flex-col border-b border-slate-200 bg-white lg:border-r lg:border-b-0">
      {/* Studio Tabs */}
      <div className="grid grid-cols-2 border-b border-slate-200 p-1.5">
        <button
          type="button"
          onClick={() => setTab('sections')}
          className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
            tab === 'sections'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          {t.tabSections}
        </button>
        <button
          type="button"
          onClick={() => setTab('design')}
          className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
            tab === 'design'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          {t.tabDesign}
        </button>
      </div>

      <div className="studio-scroll flex-1 overflow-y-auto p-3.5">
        {tab === 'sections' ? (
          <div className="space-y-2">
            {/* Fixed Profile Item */}
            <button
              type="button"
              onClick={() => onSelectTarget('basics')}
              className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition ${
                activeTarget === 'basics'
                  ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <UserCircle2 className="h-4 w-4 shrink-0 text-indigo-600" />
              <span className="truncate">{t.profileSection}</span>
            </button>

            <div className="pt-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              {language === 'en' ? 'Drag to reorder sections' : '拖拽调整模块顺序'}
            </div>

            {/* Draggable Sections */}
            <div className="space-y-1.5">
              {sections.map((sec, idx) => {
                const isSelected = activeTarget === sec.id;
                return (
                  <div
                    key={sec.id}
                    draggable
                    onDragStart={() => setDragIndex(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragIndex !== null && dragIndex !== idx) {
                        onReorderSections(dragIndex, idx);
                      }
                      setDragIndex(null);
                    }}
                    onDragEnd={() => setDragIndex(null)}
                    className={`group flex items-center justify-between gap-2 rounded-xl border px-2.5 py-2 transition ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    } ${dragIndex === idx ? 'opacity-50' : ''}`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectTarget(sec.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-slate-400" />
                      <span
                        className={`truncate text-sm font-medium ${
                          !sec.visible ? 'text-slate-400 line-through' : ''
                        }`}
                      >
                        {sec.title}
                      </span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onToggleSectionVisibility(sec.id)}
                        title={sec.visible ? 'Hide section' : 'Show section'}
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
                      >
                        {sec.visible ? (
                          <Eye className="h-3.5 w-3.5" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSection(sec.id)}
                        title="Delete section"
                        className="rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {showAddForm ? (
              <form
                onSubmit={handleCreateSection}
                className="mt-3 space-y-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 p-3"
              >
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={language === 'en' ? 'e.g. Certifications, Awards' : '例如：荣誉奖项、证书'}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-indigo-500"
                  autoFocus
                />
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as SectionType)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none"
                >
                  <option value="custom">Text / List (Certifications, Awards)</option>
                  <option value="experience">Timeline (Experience, Volunteering)</option>
                  <option value="projects">Project Cards</option>
                  <option value="skills">Skill Tags</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-400 hover:bg-indigo-50/40 hover:text-indigo-700"
              >
                <Plus className="h-3.5 w-3.5" />
                {t.addSection}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {/* Template Picker */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700">
                {t.templateLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((tpl) => {
                  const active = theme.template === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => onUpdateTheme({ template: tpl.id })}
                      className={`rounded-xl border p-2.5 text-left transition ${
                        active
                          ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-bold text-indigo-600">{tpl.tag}</span>
                      </div>
                      <div className="mt-0.5 text-xs font-semibold text-slate-900">{tpl.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700">
                {t.accentColorLabel}
              </label>
              <div className="flex flex-wrap gap-2">
                {ACCENT_COLORS.map((c) => {
                  const active = theme.accentColor.toLowerCase() === c.value.toLowerCase();
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => onUpdateTheme({ accentColor: c.value })}
                      title={c.name}
                      className={`h-7 w-7 rounded-full border-2 transition ${
                        active ? 'scale-110 border-slate-900 ring-2 ring-indigo-200' : 'border-white shadow-xs'
                      }`}
                      style={{ backgroundColor: c.value }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                {t.fontLabel}
              </label>
              <select
                value={theme.fontFamily}
                onChange={(e) => onUpdateTheme({ fontFamily: e.target.value as FontFamilyId })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500"
              >
                <option value="inter">Inter (Modern Sans)</option>
                <option value="merriweather">Merriweather (Executive Serif)</option>
                <option value="mono">JetBrains Mono (Developer)</option>
              </select>
            </div>

            {/* Font Scale */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                {t.fontSizeLabel}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['sm', 'md', 'lg'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => onUpdateTheme({ fontSize: sz })}
                    className={`rounded-lg border py-1.5 text-xs font-semibold uppercase transition ${
                      theme.fontSize === sz
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Page Size */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                {t.pageSizeLabel}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    { id: 'letter', label: 'US Letter (8.5×11")' },
                    { id: 'a4', label: 'A4 (210×297mm)' },
                  ] as Array<{ id: PageSize; label: string }>
                ).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onUpdateTheme({ pageSize: p.id })}
                    className={`rounded-lg border px-2 py-1.5 text-[11px] font-semibold transition ${
                      theme.pageSize === p.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

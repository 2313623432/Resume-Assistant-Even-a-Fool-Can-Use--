import { ArrowDown, ArrowUp, Plus, Sparkles, Trash2, Upload } from 'lucide-react';
import type {
  BasicInfo,
  Language,
  ProjectItem,
  ResumeSection,
  SkillGroup,
  TimelineItem,
} from '../types/resume';

interface ResumeEditorProps {
  language: Language;
  activeTarget: 'basics' | string;
  basics: BasicInfo;
  sections: ResumeSection[];
  onUpdateBasics: (patch: Partial<BasicInfo>) => void;
  onUpdateSection: (id: string, patch: Partial<ResumeSection>) => void;
  onOpenAi: () => void;
}

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15';
const labelCls = 'mb-1 block text-xs font-semibold text-slate-600';

export function ResumeEditor({
  language,
  activeTarget,
  basics,
  sections,
  onUpdateBasics,
  onUpdateSection,
  onOpenAi,
}: ResumeEditorProps) {
  const isEn = language === 'en';
  const activeSection =
    activeTarget === 'basics' ? null : sections.find((s) => s.id === activeTarget) ?? sections[0];

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateBasics({ avatar: reader.result, showAvatar: true });
      }
    };
    reader.readAsDataURL(file);
  };

  if (activeTarget === 'basics' || !activeSection) {
    return (
      <div className="no-print studio-scroll h-full overflow-y-auto bg-slate-50/70 p-5">
        <div className="mx-auto max-w-2xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-slate-900">
                {isEn ? 'Contact & Header' : '个人基本信息与社交链接'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEn
                  ? 'US/Global ATS standard hides photos by default. Enable avatar only for EU/portfolio sites.'
                  : '欧美 ATS 简历默认不展示头像，如需制作展示型个人网站可开启头像开关。'}
              </p>
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:grid-cols-2">
            <div>
              <label className={labelCls}>{isEn ? 'Full Name' : '姓名'}</label>
              <input
                className={inputCls}
                value={basics.name}
                onChange={(e) => onUpdateBasics({ name: e.target.value })}
                placeholder="Alex Morgan"
              />
            </div>
            <div>
              <label className={labelCls}>{isEn ? 'Headline / Target Role' : '目标职位'}</label>
              <input
                className={inputCls}
                value={basics.title}
                onChange={(e) => onUpdateBasics({ title: e.target.value })}
                placeholder="Senior Full-Stack Product Engineer"
              />
            </div>
            <div>
              <label className={labelCls}>{isEn ? 'Email' : '邮箱'}</label>
              <input
                className={inputCls}
                value={basics.email}
                onChange={(e) => onUpdateBasics({ email: e.target.value })}
                placeholder="alex.morgan@example.com"
              />
            </div>
            <div>
              <label className={labelCls}>{isEn ? 'Phone' : '电话'}</label>
              <input
                className={inputCls}
                value={basics.phone}
                onChange={(e) => onUpdateBasics({ phone: e.target.value })}
                placeholder="+1 (415) 555-0194"
              />
            </div>
            <div>
              <label className={labelCls}>{isEn ? 'Location' : '所在城市'}</label>
              <input
                className={inputCls}
                value={basics.location}
                onChange={(e) => onUpdateBasics({ location: e.target.value })}
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <label className={labelCls}>{isEn ? 'Personal Website' : '个人网站'}</label>
              <input
                className={inputCls}
                value={basics.website}
                onChange={(e) => onUpdateBasics({ website: e.target.value })}
                placeholder="alexmorgan.dev"
              />
            </div>
            <div>
              <label className={labelCls}>LinkedIn</label>
              <input
                className={inputCls}
                value={basics.linkedin}
                onChange={(e) => onUpdateBasics({ linkedin: e.target.value })}
                placeholder="linkedin.com/in/alexmorgan"
              />
            </div>
            <div>
              <label className={labelCls}>GitHub</label>
              <input
                className={inputCls}
                value={basics.github}
                onChange={(e) => onUpdateBasics({ github: e.target.value })}
                placeholder="github.com/alexmorgan"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={basics.showAvatar}
                onChange={(e) => onUpdateBasics({ showAvatar: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>{isEn ? 'Show profile photo on resume & website' : '在简历与个人网站中显示头像'}</span>
            </label>

            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
              <Upload className="h-3.5 w-3.5" />
              <span>{isEn ? 'Upload Photo' : '上传头像'}</span>
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    );
  }

  const updateTimelineItem = (itemId: string, patch: Partial<TimelineItem>) => {
    const next = (activeSection.timelineItems ?? []).map((item) =>
      item.id === itemId ? { ...item, ...patch } : item,
    );
    onUpdateSection(activeSection.id, { timelineItems: next });
  };

  const moveTimelineItem = (index: number, delta: -1 | 1) => {
    const items = [...(activeSection.timelineItems ?? [])];
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    onUpdateSection(activeSection.id, { timelineItems: items });
  };

  const addTimelineItem = () => {
    const next: TimelineItem = {
      id: `tl-${Date.now()}`,
      title: activeSection.type === 'education' ? 'University Name' : 'Company Name',
      subtitle: activeSection.type === 'education' ? 'B.S. in Computer Science' : 'Senior Engineer',
      location: 'Remote',
      date: '2024 – Present',
      description: '• Quantified impact using action verbs and measurable results.',
    };
    onUpdateSection(activeSection.id, {
      timelineItems: [...(activeSection.timelineItems ?? []), next],
    });
  };

  const removeTimelineItem = (itemId: string) => {
    onUpdateSection(activeSection.id, {
      timelineItems: (activeSection.timelineItems ?? []).filter((i) => i.id !== itemId),
    });
  };

  const updateProjectItem = (itemId: string, patch: Partial<ProjectItem>) => {
    const next = (activeSection.projectItems ?? []).map((item) =>
      item.id === itemId ? { ...item, ...patch } : item,
    );
    onUpdateSection(activeSection.id, { projectItems: next });
  };

  const addProjectItem = () => {
    const next: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: 'New Project',
      role: 'Creator',
      date: '2025',
      url: 'https://github.com/username/project',
      techStack: ['TypeScript', 'React'],
      description: '• Built and shipped an open-source solution solving a key workflow bottleneck.',
    };
    onUpdateSection(activeSection.id, {
      projectItems: [...(activeSection.projectItems ?? []), next],
    });
  };

  const removeProjectItem = (itemId: string) => {
    onUpdateSection(activeSection.id, {
      projectItems: (activeSection.projectItems ?? []).filter((i) => i.id !== itemId),
    });
  };

  const updateSkillGroup = (groupId: string, patch: Partial<SkillGroup>) => {
    const next = (activeSection.skillGroups ?? []).map((g) =>
      g.id === groupId ? { ...g, ...patch } : g,
    );
    onUpdateSection(activeSection.id, { skillGroups: next });
  };

  const addSkillGroup = () => {
    const next: SkillGroup = {
      id: `sk-${Date.now()}`,
      category: 'Tools & Cloud',
      items: ['Docker', 'Kubernetes'],
    };
    onUpdateSection(activeSection.id, {
      skillGroups: [...(activeSection.skillGroups ?? []), next],
    });
  };

  const removeSkillGroup = (groupId: string) => {
    onUpdateSection(activeSection.id, {
      skillGroups: (activeSection.skillGroups ?? []).filter((g) => g.id !== groupId),
    });
  };

  return (
    <div className="no-print studio-scroll h-full overflow-y-auto bg-slate-50/70 p-5">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <input
            value={activeSection.title}
            onChange={(e) => onUpdateSection(activeSection.id, { title: e.target.value })}
            className="rounded-lg border border-transparent bg-transparent px-1.5 py-1 font-['Plus_Jakarta_Sans'] text-lg font-bold text-slate-900 outline-none hover:border-slate-300 focus:border-indigo-500 focus:bg-white"
          />
          <button
            type="button"
            onClick={onOpenAi}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {isEn ? 'Tailor with AI' : 'AI 针对性润色'}
          </button>
        </div>

        {(activeSection.type === 'summary' || activeSection.type === 'custom') && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <label className={labelCls}>
              {isEn ? 'Section Content (one line per bullet if needed)' : '模块内容'}
            </label>
            <textarea
              rows={7}
              value={activeSection.textContent ?? ''}
              onChange={(e) =>
                onUpdateSection(activeSection.id, { textContent: e.target.value })
              }
              className={inputCls}
            />
          </div>
        )}

        {(activeSection.type === 'experience' || activeSection.type === 'education') && (
          <div className="space-y-4">
            {(activeSection.timelineItems ?? []).map((item, idx) => (
              <div
                key={item.id}
                className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-500">
                    #{idx + 1} &middot; {item.title || 'Entry'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveTimelineItem(idx, -1)}
                      className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveTimelineItem(idx, 1)}
                      className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeTimelineItem(item.id)}
                      className="rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>
                      {activeSection.type === 'education'
                        ? isEn
                          ? 'Institution'
                          : '学校名称'
                        : isEn
                          ? 'Company'
                          : '公司名称'}
                    </label>
                    <input
                      className={inputCls}
                      value={item.title}
                      onChange={(e) => updateTimelineItem(item.id, { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      {activeSection.type === 'education'
                        ? isEn
                          ? 'Degree & Major'
                          : '学历与专业'
                        : isEn
                          ? 'Job Title'
                          : '担任职位'}
                    </label>
                    <input
                      className={inputCls}
                      value={item.subtitle}
                      onChange={(e) => updateTimelineItem(item.id, { subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>{isEn ? 'Location' : '地点'}</label>
                    <input
                      className={inputCls}
                      value={item.location}
                      onChange={(e) => updateTimelineItem(item.id, { location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>{isEn ? 'Dates' : '起止时间'}</label>
                    <input
                      className={inputCls}
                      value={item.date}
                      onChange={(e) => updateTimelineItem(item.id, { date: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>
                    {isEn ? 'Impact Bullets (one per line)' : '工作成果要点（每行一条）'}
                  </label>
                  <textarea
                    rows={4}
                    className={inputCls}
                    value={item.description}
                    onChange={(e) =>
                      updateTimelineItem(item.id, { description: e.target.value })
                    }
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addTimelineItem}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-400 hover:text-indigo-700"
            >
              <Plus className="h-4 w-4" />
              {isEn ? 'Add Entry' : '新增一条记录'}
            </button>
          </div>
        )}

        {activeSection.type === 'projects' && (
          <div className="space-y-4">
            {(activeSection.projectItems ?? []).map((proj) => (
              <div
                key={proj.id}
                className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-600">{proj.name}</span>
                  <button
                    type="button"
                    onClick={() => removeProjectItem(proj.id)}
                    className="rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>{isEn ? 'Project Name' : '项目名称'}</label>
                    <input
                      className={inputCls}
                      value={proj.name}
                      onChange={(e) => updateProjectItem(proj.id, { name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>{isEn ? 'Role / Subtitle' : '角色 / 亮点'}</label>
                    <input
                      className={inputCls}
                      value={proj.role}
                      onChange={(e) => updateProjectItem(proj.id, { role: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>{isEn ? 'Project URL' : '项目链接'}</label>
                    <input
                      className={inputCls}
                      value={proj.url}
                      onChange={(e) => updateProjectItem(proj.id, { url: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>{isEn ? 'Year / Date' : '时间'}</label>
                    <input
                      className={inputCls}
                      value={proj.date}
                      onChange={(e) => updateProjectItem(proj.id, { date: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>
                    {isEn ? 'Tech Stack (comma separated)' : '技术栈（英文逗号分隔）'}
                  </label>
                  <input
                    className={inputCls}
                    value={proj.techStack.join(', ')}
                    onChange={(e) =>
                      updateProjectItem(proj.id, {
                        techStack: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>

                <div>
                  <label className={labelCls}>{isEn ? 'Description' : '项目描述'}</label>
                  <textarea
                    rows={3}
                    className={inputCls}
                    value={proj.description}
                    onChange={(e) =>
                      updateProjectItem(proj.id, { description: e.target.value })
                    }
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addProjectItem}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-400 hover:text-indigo-700"
            >
              <Plus className="h-4 w-4" />
              {isEn ? 'Add Project' : '新增项目'}
            </button>
          </div>
        )}

        {activeSection.type === 'skills' && (
          <div className="space-y-4">
            {(activeSection.skillGroups ?? []).map((group) => (
              <div
                key={group.id}
                className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    className={inputCls}
                    value={group.category}
                    onChange={(e) =>
                      updateSkillGroup(group.id, { category: e.target.value })
                    }
                    placeholder="Category"
                  />
                  <button
                    type="button"
                    onClick={() => removeSkillGroup(group.id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className={labelCls}>
                    {isEn ? 'Skills (comma separated)' : '技能标签（逗号分隔）'}
                  </label>
                  <input
                    className={inputCls}
                    value={group.items.join(', ')}
                    onChange={(e) =>
                      updateSkillGroup(group.id, {
                        items: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((skill, idx) => (
                    <span
                      key={`${skill}-${idx}`}
                      className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addSkillGroup}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-400 hover:text-indigo-700"
            >
              <Plus className="h-4 w-4" />
              {isEn ? 'Add Skill Group' : '新增技能分组'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

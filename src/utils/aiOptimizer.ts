import type { AIConfig, AITailorResult, ResumeData } from '../types/resume';

function extractJsonObject(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : raw;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Model response did not contain valid JSON.');
  }
  return candidate.slice(start, end + 1);
}

export async function tailorResumeWithAI(
  resume: ResumeData,
  jobDescription: string,
  config: AIConfig,
): Promise<AITailorResult> {
  const apiUrl = config.apiUrl.trim();
  const model = config.model.trim();
  const apiKey = config.apiKey.trim();

  if (!apiUrl) {
    throw new Error('Please enter an API endpoint URL.');
  }
  if (!model) {
    throw new Error('Please enter a model name.');
  }
  if (!jobDescription.trim()) {
    throw new Error('Please paste a target job description.');
  }

  const summarySec = resume.sections.find((s) => s.type === 'summary');
  const expSec = resume.sections.find((s) => s.type === 'experience');
  const projSec = resume.sections.find((s) => s.type === 'projects');
  const skillsSec = resume.sections.find((s) => s.type === 'skills');

  const compactResume = {
    title: resume.basics.title,
    summary: summarySec?.textContent ?? '',
    experience: (expSec?.timelineItems ?? []).map((item) => ({
      id: item.id,
      company: item.title,
      role: item.subtitle,
      description: item.description,
    })),
    projects: (projSec?.projectItems ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      techStack: item.techStack,
      description: item.description,
    })),
    skills: (skillsSec?.skillGroups ?? []).flatMap((g) => g.items),
  };

  const systemPrompt = `You are a senior US/global tech recruiter and ATS resume optimization expert.
Tailor the candidate's resume to the target Job Description (JD) WITHOUT fabricating employers, degrees, dates, or fake metrics.
Use the Google XYZ impact formula ("Accomplished [X] as measured by [Y], by doing [Z]") where supported by existing context, and integrate relevant ATS keywords naturally.
Match the language of the Job Description (typically English for overseas roles).
Return ONLY a valid JSON object matching this exact schema:
{
  "atsScoreBefore": number (0-100),
  "atsScoreAfter": number (0-100),
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "rationale": string (concise 1-2 sentence summary of improvements),
  "updatedSummary": string,
  "updatedExperience": [{ "id": string, "description": string }],
  "updatedProjects": [{ "id": string, "description": string }],
  "suggestedSkillsToAdd": string[]
}`;

  const userPrompt = `TARGET JOB DESCRIPTION:\n${jobDescription.trim()}\n\nCURRENT RESUME JSON:\n${JSON.stringify(compactResume, null, 2)}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      temperature: 0.35,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(
      `AI API error (${response.status}): ${errText.slice(0, 220) || response.statusText}`,
    );
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('AI API returned an empty response.');
  }

  const parsed = JSON.parse(extractJsonObject(content)) as AITailorResult;
  return {
    atsScoreBefore: Number(parsed.atsScoreBefore) || 65,
    atsScoreAfter: Number(parsed.atsScoreAfter) || 88,
    matchedKeywords: Array.isArray(parsed.matchedKeywords) ? parsed.matchedKeywords : [],
    missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
    rationale: parsed.rationale || 'Optimized bullet points and aligned terminology with the JD.',
    updatedSummary: parsed.updatedSummary,
    updatedExperience: Array.isArray(parsed.updatedExperience) ? parsed.updatedExperience : [],
    updatedProjects: Array.isArray(parsed.updatedProjects) ? parsed.updatedProjects : [],
    suggestedSkillsToAdd: Array.isArray(parsed.suggestedSkillsToAdd)
      ? parsed.suggestedSkillsToAdd
      : [],
  };
}

export function applyTailorResult(resume: ResumeData, result: AITailorResult): ResumeData {
  const nextSections = resume.sections.map((sec) => {
    if (sec.type === 'summary' && result.updatedSummary) {
      return { ...sec, textContent: result.updatedSummary };
    }
    if (sec.type === 'experience' && result.updatedExperience?.length && sec.timelineItems) {
      const map = new Map(result.updatedExperience.map((e) => [e.id, e.description]));
      return {
        ...sec,
        timelineItems: sec.timelineItems.map((item) =>
          map.has(item.id) ? { ...item, description: map.get(item.id)! } : item,
        ),
      };
    }
    if (sec.type === 'projects' && result.updatedProjects?.length && sec.projectItems) {
      const map = new Map(result.updatedProjects.map((p) => [p.id, p.description]));
      return {
        ...sec,
        projectItems: sec.projectItems.map((item) =>
          map.has(item.id) ? { ...item, description: map.get(item.id)! } : item,
        ),
      };
    }
    if (sec.type === 'skills' && result.suggestedSkillsToAdd?.length && sec.skillGroups?.length) {
      const existing = new Set(
        sec.skillGroups.flatMap((g) => g.items.map((s) => s.toLowerCase())),
      );
      const additions = result.suggestedSkillsToAdd.filter(
        (s) => s.trim() && !existing.has(s.trim().toLowerCase()),
      );
      if (!additions.length) return sec;
      const updatedGroups = sec.skillGroups.map((g, idx) =>
        idx === 0 ? { ...g, items: [...g.items, ...additions] } : g,
      );
      return { ...sec, skillGroups: updatedGroups };
    }
    return sec;
  });

  return {
    ...resume,
    sections: nextSections,
  };
}

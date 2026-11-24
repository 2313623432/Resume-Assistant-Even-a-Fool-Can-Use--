import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { DEFAULT_RESUME_DATA } from '../data/defaultResume';
import type { ResumeData } from '../types/resume';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
  const pdf = await loadingTask.promise;
  const pages: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const lines = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .filter(Boolean)
      .join(' ');
    pages.push(lines);
  }
  return pages.join('\n');
}

function parseRawResumeText(rawText: string, base: ResumeData): ResumeData {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(
    /(\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/,
  );
  const linkedinMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[^\s,;)]+/i);
  const githubMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+/i);

  const candidateName = lines[0]?.slice(0, 60) || base.basics.name;
  const candidateTitle =
    lines[1] && !lines[1].includes('@') && lines[1].length < 80
      ? lines[1]
      : base.basics.title;

  const summaryChunk = lines.slice(2, 8).join(' ').slice(0, 500);
  const importedBody = lines.join('\n');

  const sections = base.sections.map((sec) => {
    if (sec.type === 'summary' && summaryChunk) {
      return { ...sec, textContent: summaryChunk };
    }
    if (sec.type === 'experience' && sec.timelineItems?.length) {
      return {
        ...sec,
        timelineItems: [
          {
            id: `exp-imp-${Date.now()}`,
            title: 'Imported Experience (Review & Organize)',
            subtitle: candidateTitle,
            location: '',
            date: 'Imported',
            description: importedBody.slice(0, 2200),
          },
        ],
      };
    }
    return sec;
  });

  return {
    ...base,
    basics: {
      ...base.basics,
      name: candidateName,
      title: candidateTitle,
      email: emailMatch ? emailMatch[0] : base.basics.email,
      phone: phoneMatch ? phoneMatch[0] : base.basics.phone,
      linkedin: linkedinMatch ? linkedinMatch[0].replace(/^https?:\/\//i, '') : base.basics.linkedin,
      github: githubMatch ? githubMatch[0].replace(/^https?:\/\//i, '') : base.basics.github,
    },
    sections,
  };
}

export async function importResumeFile(
  file: File,
  currentData: ResumeData,
): Promise<ResumeData> {
  const lower = file.name.toLowerCase();

  if (lower.endsWith('.json')) {
    const text = await file.text();
    const parsed = JSON.parse(text) as Partial<ResumeData>;
    if (!parsed.basics || !Array.isArray(parsed.sections)) {
      throw new Error('Invalid ResumeCraft JSON backup file.');
    }
    return {
      ...DEFAULT_RESUME_DATA,
      ...parsed,
      basics: { ...DEFAULT_RESUME_DATA.basics, ...parsed.basics },
      theme: { ...DEFAULT_RESUME_DATA.theme, ...(parsed.theme ?? {}) },
      sections: parsed.sections,
    };
  }

  if (lower.endsWith('.docx')) {
    const buffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
    if (!value.trim()) {
      throw new Error('Could not extract text from this DOCX file.');
    }
    return parseRawResumeText(value, currentData);
  }

  if (lower.endsWith('.pdf')) {
    const buffer = await file.arrayBuffer();
    const text = await extractPdfText(buffer);
    if (!text.trim()) {
      throw new Error('Could not extract selectable text from this PDF.');
    }
    return parseRawResumeText(text, currentData);
  }

  throw new Error('Unsupported file format. Please upload a .pdf, .docx, or .json file.');
}

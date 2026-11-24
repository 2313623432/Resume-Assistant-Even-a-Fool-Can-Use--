# ResumeCraft — Free AI Resume Builder & Resume-to-Website Generator

> Build ATS-ready resumes for free, tailor bullets to any job description using your own AI API key (BYOK), and convert your resume into a clean, deploy-ready personal website HTML in one click.

## Key Features

- **100% Free & Browser-Only**: Zero accounts, zero paywalls, zero watermarks. All data persists locally in `localStorage`.
- **Overseas & ATS-Ready Defaults**: English-first interface (`EN / 中文` switcher), US Letter / A4 formats, 8 refined Western templates (*Executive Classic*, *Harvard ATS*, *Modern Minimal*, *Silicon Valley Tech*, *Editorial Serif*, *Swiss Grid*, *Nordic Clean*, *Slate Dark Header*).
- **Bring-Your-Own-Key (BYOK) AI Tailoring**: Supports OpenAI, DeepSeek, Google Gemini, OpenRouter, or custom OpenAI-compatible endpoints (including local Ollama). Rewrites impact bullets and tracks ATS keyword match with 1-click Undo.
- **Resume-to-Website HTML Generator**: Instantly preview and export a standalone, dark-mode-ready `index.html` (or ZIP bundle with `README-DEPLOY.txt`) ready for free hosting on Netlify Drop, Cloudflare Pages, Vercel, or GitHub Pages.
- **File Import & Vector PDF Export**: Import `.pdf`, `.docx`, or `.json` backups directly in the browser, and print/save crisp vector ATS-parseable PDFs.
- **SEO & Compliance Pages**: Includes `robots.txt`, `sitemap.xml`, JSON-LD structured data, `/deploy-guide.html`, `/privacy.html`, and `/terms.html`.

## Tech Stack

- **Frontend**: Vite, React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Client-side Parsers & Bundlers**: `pdfjs-dist`, `mammoth`, `jszip`
- **Deployment**: Pure static build (`dist/`) — compatible with Vercel, Netlify, Cloudflare Pages, and GitHub Pages.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run typecheck
npm run build
```

---

**License**: MIT · **Contact**: cjhyqf233@qq.com

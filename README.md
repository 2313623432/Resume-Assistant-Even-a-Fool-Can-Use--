# ResumeCraft — Turn Resume into Website in One Click & Free Resume Builder

> **Live App**: [Turn Resume into Website in One Click (cvpromax.top)](https://www.cvpromax.top/) · [Free 30-Second Hosting Guide](https://www.cvpromax.top/deploy-guide.html)

Build ATS-ready resumes for free, tailor bullet points for **AI resume search** and recruiter screening using your own AI API key (BYOK), and **turn your resume into a website** with rich animations and 8 distinct visual themes in one click.

## Key Features

- **Turn Resume into Website in One Click**: Instantly preview and export an animated, responsive `index.html` portfolio website (or ZIP package with `README-DEPLOY.txt`) across 8 distinct themes (*Executive Aurora*, *Silicon Valley Tech Terminal*, *Slate Dark Header*, *Harvard Parchment*, *Modern Minimal*, *Editorial Magazine*, *Swiss 2-Column*, *Nordic Bento*), ready for free hosting on Netlify Drop, Cloudflare Pages, Vercel, or GitHub Pages.
- **100% Free Resume Builder**: Zero accounts, zero paywalls, zero watermarks. All drafts save locally in `localStorage`.
- **BYOK AI Resume Optimizer & AI Resume Search Alignment**: Plug in your own OpenAI, DeepSeek, Google Gemini, OpenRouter, or local Ollama API key to match job descriptions and boost ATS & AI resume search keyword ranking with 1-click Undo.
- **Overseas & ATS-Ready Defaults**: English-first interface (`EN / 中文` switcher), US Letter / A4 formats, vector PDF export, `.pdf` / `.docx` / `.json` local import, and Enter-to-auto-bullet editing (`• `).
- **SEO & Compliance Ready**: Includes `robots.txt`, `sitemap.xml`, `HowTo` + `WebApplication` + `FAQPage` JSON-LD, `/deploy-guide.html`, `/privacy.html`, and `/terms.html`.

## Tech Stack

- **Frontend**: Vite, React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Client-side Parsers & Bundlers**: `pdfjs-dist`, `mammoth`, `jszip`
- **Deployment**: Pure static build (`dist/`) — hosted at [https://www.cvpromax.top/](https://www.cvpromax.top/)

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

**License**: MIT · **Live Site**: [https://www.cvpromax.top/](https://www.cvpromax.top/) · **Contact**: cjhyqf233@qq.com

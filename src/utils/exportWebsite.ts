import JSZip from 'jszip';
import type { ResumeData } from '../types/resume';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function renderBulletLines(text: string): string {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[•\-*]\s*/, '').trim())
    .filter(Boolean);
  if (!lines.length) return '';
  return `<ul class="bullets">${lines.map((l) => `<li>${escapeHtml(l)}</li>`).join('')}</ul>`;
}

export function generatePortfolioHtml(data: ResumeData): string {
  const { basics, sections, theme } = data;
  const accent = /^#[0-9A-Fa-f]{6}$/.test(theme.accentColor) ? theme.accentColor : '#4F46E5';
  const safeName = escapeHtml(basics.name || 'Portfolio');
  const safeTitle = escapeHtml(basics.title || '');
  const summarySec = sections.find((s) => s.visible && s.type === 'summary');
  const metaDesc = escapeHtml(
    summarySec?.textContent?.slice(0, 155) || `${basics.name} — ${basics.title}`,
  );

  const contactChips: string[] = [];
  if (basics.location) {
    contactChips.push(`<span class="chip">${escapeHtml(basics.location)}</span>`);
  }
  if (basics.email) {
    contactChips.push(
      `<a class="chip link" href="mailto:${escapeHtml(basics.email)}">${escapeHtml(basics.email)}</a>`,
    );
  }
  if (basics.phone) {
    contactChips.push(
      `<a class="chip link" href="tel:${escapeHtml(basics.phone)}">${escapeHtml(basics.phone)}</a>`,
    );
  }
  if (basics.website) {
    contactChips.push(
      `<a class="chip link" href="${escapeHtml(normalizeUrl(basics.website))}" target="_blank" rel="noopener noreferrer">${escapeHtml(basics.website)}</a>`,
    );
  }
  if (basics.linkedin) {
    contactChips.push(
      `<a class="chip link" href="${escapeHtml(normalizeUrl(basics.linkedin))}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`,
    );
  }
  if (basics.github) {
    contactChips.push(
      `<a class="chip link" href="${escapeHtml(normalizeUrl(basics.github))}" target="_blank" rel="noopener noreferrer">GitHub</a>`,
    );
  }

  const sectionBlocks = sections
    .filter((sec) => sec.visible)
    .map((sec) => {
      if (sec.type === 'summary' || sec.type === 'custom') {
        if (!sec.textContent?.trim()) return '';
        return `
        <section class="card" aria-labelledby="sec-${escapeHtml(sec.id)}">
          <h2 id="sec-${escapeHtml(sec.id)}">${escapeHtml(sec.title)}</h2>
          <p class="prose">${escapeHtml(sec.textContent).replace(/\n/g, '<br />')}</p>
        </section>`;
      }

      if ((sec.type === 'experience' || sec.type === 'education') && sec.timelineItems?.length) {
        const itemsHtml = sec.timelineItems
          .map(
            (item) => `
            <article class="timeline-item">
              <div class="item-head">
                <div>
                  <h3>${escapeHtml(item.subtitle || item.title)}</h3>
                  <div class="org">${escapeHtml(item.title)}${item.location ? ` &middot; ${escapeHtml(item.location)}` : ''}</div>
                </div>
                <span class="date">${escapeHtml(item.date)}</span>
              </div>
              ${renderBulletLines(item.description)}
            </article>`,
          )
          .join('');
        return `
        <section class="card" aria-labelledby="sec-${escapeHtml(sec.id)}">
          <h2 id="sec-${escapeHtml(sec.id)}">${escapeHtml(sec.title)}</h2>
          <div class="timeline">${itemsHtml}</div>
        </section>`;
      }

      if (sec.type === 'projects' && sec.projectItems?.length) {
        const projHtml = sec.projectItems
          .map(
            (proj) => `
            <article class="proj-card">
              <div class="item-head">
                <div>
                  <h3>${
                    proj.url
                      ? `<a href="${escapeHtml(normalizeUrl(proj.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(proj.name)} &nearr;</a>`
                      : escapeHtml(proj.name)
                  }</h3>
                  ${proj.role ? `<div class="org">${escapeHtml(proj.role)}</div>` : ''}
                </div>
                ${proj.date ? `<span class="date">${escapeHtml(proj.date)}</span>` : ''}
              </div>
              ${renderBulletLines(proj.description)}
              ${
                proj.techStack.length
                  ? `<div class="tags">${proj.techStack
                      .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
                      .join('')}</div>`
                  : ''
              }
            </article>`,
          )
          .join('');
        return `
        <section class="card" aria-labelledby="sec-${escapeHtml(sec.id)}">
          <h2 id="sec-${escapeHtml(sec.id)}">${escapeHtml(sec.title)}</h2>
          <div class="proj-grid">${projHtml}</div>
        </section>`;
      }

      if (sec.type === 'skills' && sec.skillGroups?.length) {
        const groupsHtml = sec.skillGroups
          .map(
            (g) => `
            <div class="skill-group">
              <h3>${escapeHtml(g.category)}</h3>
              <div class="tags">${g.items.map((s) => `<span class="tag">${escapeHtml(s)}</span>`).join('')}</div>
            </div>`,
          )
          .join('');
        return `
        <section class="card" aria-labelledby="sec-${escapeHtml(sec.id)}">
          <h2 id="sec-${escapeHtml(sec.id)}">${escapeHtml(sec.title)}</h2>
          <div class="skills-wrap">${groupsHtml}</div>
        </section>`;
      }

      return '';
    })
    .join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeName}${safeTitle ? ` — ${safeTitle}` : ''}</title>
    <meta name="description" content="${metaDesc}" />
    <meta property="og:title" content="${safeName}${safeTitle ? ` — ${safeTitle}` : ''}" />
    <meta property="og:description" content="${metaDesc}" />
    <meta property="og:type" content="profile" />
    <style>
      :root {
        --bg: #f8fafc;
        --surface: #ffffff;
        --text: #0f172a;
        --muted: #475569;
        --border: #e2e8f0;
        --chip-bg: #f1f5f9;
        --accent: ${accent};
      }
      html[data-theme="dark"] {
        --bg: #0b1120;
        --surface: #111827;
        --text: #f8fafc;
        --muted: #94a3b8;
        --border: #1e293b;
        --chip-bg: #1e293b;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: var(--bg);
        color: var(--text);
        line-height: 1.65;
        padding: 32px 20px 64px;
        transition: background 0.2s ease, color 0.2s ease;
      }
      .wrap { max-width: 900px; margin: 0 auto; }
      .topbar {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-bottom: 18px;
      }
      .btn {
        appearance: none;
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--text);
        padding: 8px 14px;
        border-radius: 9px;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
      }
      .btn.primary {
        background: var(--accent);
        color: #ffffff;
        border-color: var(--accent);
      }
      .hero {
        background: var(--surface);
        border: 1px solid var(--border);
        border-top: 4px solid var(--accent);
        border-radius: 16px;
        padding: 36px;
        margin-bottom: 20px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 24px;
      }
      .avatar {
        width: 84px;
        height: 84px;
        border-radius: 999px;
        object-fit: cover;
        border: 2px solid var(--border);
      }
      h1 { font-size: 2.1rem; letter-spacing: -0.025em; line-height: 1.15; }
      .role { color: var(--accent); font-size: 1.1rem; font-weight: 600; margin-top: 4px; }
      .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
      .chip {
        background: var(--chip-bg);
        color: var(--muted);
        padding: 5px 12px;
        border-radius: 999px;
        font-size: 0.85rem;
        text-decoration: none;
      }
      .chip.link:hover { color: var(--accent); }
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 28px 32px;
        margin-bottom: 18px;
      }
      h2 {
        font-size: 0.82rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--accent);
        margin-bottom: 18px;
      }
      .prose { color: var(--muted); font-size: 0.98rem; }
      .timeline { display: flex; flex-direction: column; gap: 22px; }
      .timeline-item + .timeline-item {
        padding-top: 20px;
        border-top: 1px solid var(--border);
      }
      .item-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 8px;
      }
      h3 { font-size: 1.05rem; font-weight: 700; }
      h3 a { color: inherit; text-decoration: none; }
      h3 a:hover { color: var(--accent); }
      .org { color: var(--muted); font-size: 0.92rem; font-weight: 500; }
      .date { font-size: 0.85rem; color: var(--muted); white-space: nowrap; }
      .bullets { padding-left: 18px; color: var(--muted); font-size: 0.95rem; }
      .bullets li + li { margin-top: 5px; }
      .proj-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
      .proj-card {
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 18px;
        background: var(--bg);
      }
      .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
      .tag {
        background: var(--chip-bg);
        color: var(--text);
        font-size: 0.78rem;
        font-weight: 500;
        padding: 3px 10px;
        border-radius: 6px;
      }
      .skills-wrap { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; }
      .skill-group h3 { font-size: 0.92rem; margin-bottom: 8px; }
      .site-footer {
        text-align: center;
        color: var(--muted);
        font-size: 0.82rem;
        margin-top: 28px;
      }
      @media print {
        body { background: #ffffff; color: #0f172a; padding: 0; }
        .topbar, .site-footer { display: none; }
        .hero, .card { border: none; border-radius: 0; padding: 14px 0; margin-bottom: 8px; }
      }
      @media (max-width: 640px) {
        .hero, .card { padding: 22px; }
        h1 { font-size: 1.65rem; }
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="topbar">
        <button class="btn" id="themeBtn" type="button">Toggle Dark Mode</button>
        <button class="btn primary" type="button" onclick="window.print()">Print / Save PDF</button>
      </div>
      <header class="hero">
        ${basics.showAvatar && basics.avatar ? `<img class="avatar" src="${escapeHtml(basics.avatar)}" alt="${safeName}" />` : ''}
        <div>
          <h1>${safeName}</h1>
          ${safeTitle ? `<p class="role">${safeTitle}</p>` : ''}
          <div class="chips">${contactChips.join('')}</div>
        </div>
      </header>
      <main>
        ${sectionBlocks}
      </main>
      <footer class="site-footer">
        Built with <a href="https://resume-assistant-even-a-fool-can-us.vercel.app/" target="_blank" rel="noopener noreferrer" style="color:var(--accent);text-decoration:none;">ResumeCraft</a>
      </footer>
    </div>
    <script>
      (function () {
        var btn = document.getElementById('themeBtn');
        var root = document.documentElement;
        btn.addEventListener('click', function () {
          var isDark = root.getAttribute('data-theme') === 'dark';
          root.setAttribute('data-theme', isDark ? 'light' : 'dark');
          btn.textContent = isDark ? 'Toggle Dark Mode' : 'Toggle Light Mode';
        });
      })();
    </script>
  </body>
</html>`;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadWebsiteHtml(data: ResumeData) {
  const html = generatePortfolioHtml(data);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  triggerDownload(blob, 'index.html');
}

export async function downloadWebsiteZip(data: ResumeData) {
  const zip = new JSZip();
  const folderName =
    (data.basics.name || 'resume-website')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'resume-website';

  const root = zip.folder(folderName) ?? zip;
  root.file('index.html', generatePortfolioHtml(data));
  root.file(
    'README-DEPLOY.txt',
    `How to publish your resume website online for FREE in under 30 seconds:\n\n1. NETLIFY DROP (Fastest - No Git needed)\n   - Unzip this folder\n   - Open https://app.netlify.com/drop\n   - Drag and drop the unzipped folder onto the page\n   - You immediately get a live HTTPS URL!\n\n2. CLOUDFLARE PAGES (Unlimited free bandwidth)\n   - Open https://dash.cloudflare.com -> Workers & Pages -> Create -> Pages -> Direct Upload\n   - Upload this ZIP or the folder containing index.html\n\n3. VERCEL\n   - Run "npx vercel --prod" inside the unzipped folder\n\n4. GITHUB PAGES\n   - Upload index.html to a repo named <your-username>.github.io and enable Pages in Settings.\n`,
  );

  const blob = await zip.generateAsync({ type: 'blob' });
  triggerDownload(blob, `${folderName}-website.zip`);
}

export function downloadResumeJson(data: ResumeData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const slug = (data.basics.name || 'resume').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  triggerDownload(blob, `${slug}-backup.json`);
}

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

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'RC';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getHandleSlug(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'user'
  );
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
  const accent = /^#[0-9A-Fa-f]{6}$/.test(theme.accentColor) ? theme.accentColor : '#6366F1';
  const safeName = escapeHtml(basics.name || 'Portfolio');
  const safeTitle = escapeHtml(basics.title || '');
  const initials = escapeHtml(getInitials(basics.name || 'Portfolio'));
  const slug = escapeHtml(getHandleSlug(basics.name || 'portfolio'));
  const styleId = theme.template;

  // Only Executive and Tech default to full-dark mode; Slate uses a high-contrast dark hero + crisp white body.
  const isDarkDefault = styleId === 'executive' || styleId === 'tech';
  const defaultThemeMode = isDarkDefault ? 'dark' : 'light';
  const toggleBtnInitialLabel = isDarkDefault ? 'Light Mode' : 'Dark Mode';

  const baseFontStack =
    styleId === 'tech' || theme.fontFamily === 'mono'
      ? "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace"
      : styleId === 'editorial' || styleId === 'harvard' || theme.fontFamily === 'merriweather'
        ? "'Merriweather', Georgia, serif"
        : "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  const visibleSections = sections.filter((s) => s.visible);
  const summarySec = visibleSections.find((s) => s.type === 'summary');
  const metaDesc = escapeHtml(
    summarySec?.textContent?.slice(0, 155) || `${basics.name} — ${basics.title}`,
  );

  const expCount = visibleSections
    .filter((s) => s.type === 'experience')
    .reduce((acc, s) => acc + (s.timelineItems?.length ?? 0), 0);
  const projCount = visibleSections
    .filter((s) => s.type === 'projects')
    .reduce((acc, s) => acc + (s.projectItems?.length ?? 0), 0);
  const skillCount = visibleSections
    .filter((s) => s.type === 'skills')
    .reduce(
      (acc, s) =>
        acc + (s.skillGroups?.reduce((gAcc, g) => gAcc + g.items.length, 0) ?? 0),
      0,
    );

  const navLinks = visibleSections
    .map(
      (s) =>
        `<a class="nav-link" href="#sec-${escapeHtml(s.id)}" data-target="sec-${escapeHtml(s.id)}">${escapeHtml(s.title)}</a>`,
    )
    .join('');

  const socialPills: string[] = [];
  if (basics.linkedin) {
    socialPills.push(
      `<a class="pill" href="${escapeHtml(normalizeUrl(basics.linkedin))}" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">&nearr;</span></a>`,
    );
  }
  if (basics.github) {
    socialPills.push(
      `<a class="pill" href="${escapeHtml(normalizeUrl(basics.github))}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">&nearr;</span></a>`,
    );
  }
  if (basics.website) {
    socialPills.push(
      `<a class="pill" href="${escapeHtml(normalizeUrl(basics.website))}" target="_blank" rel="noopener noreferrer">${escapeHtml(basics.website)} <span aria-hidden="true">&nearr;</span></a>`,
    );
  }
  if (basics.phone) {
    socialPills.push(
      `<a class="pill" href="tel:${escapeHtml(basics.phone)}">${escapeHtml(basics.phone)}</a>`,
    );
  }

  const sectionBlocks = visibleSections
    .map((sec, sIdx) => {
      const secId = `sec-${escapeHtml(sec.id)}`;
      const secTitle = escapeHtml(sec.title);
      const numPrefix = String(sIdx + 1).padStart(2, '0');
      const eyebrow = (label: string) => {
        if (styleId === 'tech') return `// ${numPrefix}_${label}`;
        if (styleId === 'editorial') return `SECTION ${numPrefix} &mdash; ${label}`;
        return label;
      };

      if (sec.type === 'summary') {
        if (!sec.textContent?.trim()) return '';
        return `
        <section id="${secId}" class="section reveal">
          <div class="section-head">
            <span class="eyebrow">${eyebrow('ABOUT')}</span>
            <h2>${secTitle}</h2>
          </div>
          <div class="glow-card spotlight-card">
            <p class="lead-prose">${escapeHtml(sec.textContent).replace(/\n/g, '<br />')}</p>
          </div>
        </section>`;
      }

      if (sec.type === 'custom') {
        if (!sec.textContent?.trim()) return '';
        return `
        <section id="${secId}" class="section reveal">
          <div class="section-head">
            <span class="eyebrow">${eyebrow('HIGHLIGHTS')}</span>
            <h2>${secTitle}</h2>
          </div>
          <div class="glow-card glass-card">
            <p class="prose">${escapeHtml(sec.textContent).replace(/\n/g, '<br />')}</p>
          </div>
        </section>`;
      }

      if (sec.type === 'experience' && sec.timelineItems?.length) {
        const itemsHtml = sec.timelineItems
          .map(
            (item, idx) => `
            <article class="tl-item reveal" style="--delay:${Math.min(idx * 90, 360)}ms">
              <div class="tl-node" aria-hidden="true"></div>
              <div class="glow-card tl-card">
                <div class="card-top">
                  <div>
                    <h3>${escapeHtml(item.subtitle || item.title)}</h3>
                    <div class="org">${escapeHtml(item.title)}${item.location ? ` &middot; <span>${escapeHtml(item.location)}</span>` : ''}</div>
                  </div>
                  <span class="badge-date">${escapeHtml(item.date)}</span>
                </div>
                ${renderBulletLines(item.description)}
              </div>
            </article>`,
          )
          .join('');
        return `
        <section id="${secId}" class="section">
          <div class="section-head reveal">
            <span class="eyebrow">${eyebrow('CAREER')}</span>
            <h2>${secTitle}</h2>
          </div>
          <div class="timeline-track">${itemsHtml}</div>
        </section>`;
      }

      if (sec.type === 'education' && sec.timelineItems?.length) {
        const itemsHtml = sec.timelineItems
          .map(
            (item, idx) => `
            <article class="glow-card glass-card reveal" style="--delay:${Math.min(idx * 90, 360)}ms">
              <div class="card-top">
                <div>
                  <h3>${escapeHtml(item.subtitle || item.title)}</h3>
                  <div class="org">${escapeHtml(item.title)}${item.location ? ` &middot; ${escapeHtml(item.location)}` : ''}</div>
                </div>
                <span class="badge-date">${escapeHtml(item.date)}</span>
              </div>
              ${renderBulletLines(item.description)}
            </article>`,
          )
          .join('');
        return `
        <section id="${secId}" class="section">
          <div class="section-head reveal">
            <span class="eyebrow">${eyebrow('ACADEMIC')}</span>
            <h2>${secTitle}</h2>
          </div>
          <div class="stack-cards">${itemsHtml}</div>
        </section>`;
      }

      if (sec.type === 'projects' && sec.projectItems?.length) {
        const projHtml = sec.projectItems
          .map(
            (proj, idx) => `
            <article class="glow-card proj-card reveal" style="--delay:${Math.min(idx * 90, 360)}ms">
              <div>
                <div class="card-top">
                  <div>
                    <h3>${
                      proj.url
                        ? `<a class="proj-link" href="${escapeHtml(normalizeUrl(proj.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(proj.name)} <span class="arrow">&nearr;</span></a>`
                        : escapeHtml(proj.name)
                    }</h3>
                    ${proj.role ? `<div class="org">${escapeHtml(proj.role)}</div>` : ''}
                  </div>
                  ${proj.date ? `<span class="badge-date">${escapeHtml(proj.date)}</span>` : ''}
                </div>
                ${renderBulletLines(proj.description)}
              </div>
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
        <section id="${secId}" class="section">
          <div class="section-head reveal">
            <span class="eyebrow">${eyebrow('WORK')}</span>
            <h2>${secTitle}</h2>
          </div>
          <div class="proj-grid">${projHtml}</div>
        </section>`;
      }

      if (sec.type === 'skills' && sec.skillGroups?.length) {
        const groupsHtml = sec.skillGroups
          .map(
            (g, idx) => `
            <div class="glow-card skill-card reveal" style="--delay:${Math.min(idx * 80, 320)}ms">
              <h3>${escapeHtml(g.category)}</h3>
              <div class="tags">${g.items.map((s) => `<span class="tag interactive-tag">${escapeHtml(s)}</span>`).join('')}</div>
            </div>`,
          )
          .join('');
        return `
        <section id="${secId}" class="section">
          <div class="section-head reveal">
            <span class="eyebrow">${eyebrow('STACK')}</span>
            <h2>${secTitle}</h2>
          </div>
          <div class="skills-grid">${groupsHtml}</div>
        </section>`;
      }

      return '';
    })
    .join('\n');

  const safeEmail = escapeHtml(basics.email || '');
  const statusLabel =
    styleId === 'tech'
      ? `$ whoami · ${basics.location ? escapeHtml(basics.location) : 'remote-ready'}`
      : basics.location
        ? escapeHtml(basics.location)
        : 'Open to Opportunities';

  const terminalChrome =
    styleId === 'tech'
      ? `<div class="term-bar" aria-hidden="true">
           <span class="term-dot r"></span>
           <span class="term-dot y"></span>
           <span class="term-dot g"></span>
           <span class="term-title">${slug}@portfolio: ~/resume</span>
         </div>`
      : '';

  return `<!doctype html>
<html lang="en" data-theme="${defaultThemeMode}" data-style="${escapeHtml(styleId)}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeName}${safeTitle ? ` — ${safeTitle}` : ''}</title>
    <meta name="description" content="${metaDesc}" />
    <meta property="og:title" content="${safeName}${safeTitle ? ` — ${safeTitle}` : ''}" />
    <meta property="og:description" content="${metaDesc}" />
    <meta property="og:type" content="profile" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&family=Merriweather:ital,wght@0,400;0,700;1,700&display=swap"
      rel="stylesheet"
    />
    <style>
      :root {
        --accent: ${accent};
        --accent-soft: color-mix(in srgb, ${accent} 16%, transparent);
        --accent-glow: color-mix(in srgb, ${accent} 42%, transparent);
        --radius: 18px;
        --font-main: ${baseFontStack};
      }

      /* Base Dark & Light palettes */
      html[data-theme="dark"] {
        --bg: #070b14;
        --bg-elev: rgba(15, 23, 42, 0.8);
        --surface: rgba(17, 25, 40, 0.84);
        --surface-solid: #111827;
        --text: #f8fafc;
        --muted: #94a3b8;
        --border: rgba(148, 163, 184, 0.16);
        --chip-bg: rgba(30, 41, 59, 0.78);
        --grid-line: rgba(148, 163, 184, 0.05);
        --orb-opacity: 0.44;
      }
      html[data-theme="light"] {
        --bg: #f8fafc;
        --bg-elev: rgba(255, 255, 255, 0.9);
        --surface: #ffffff;
        --surface-solid: #ffffff;
        --text: #0f172a;
        --muted: #475569;
        --border: rgba(15, 23, 42, 0.1);
        --chip-bg: #f1f5f9;
        --grid-line: rgba(15, 23, 42, 0.03);
        --orb-opacity: 0.16;
      }

      /* 1. EXECUTIVE: Obsidian Aurora Glass (default dark) */
      html[data-style="executive"][data-theme="dark"] {
        --bg: #070b14;
        --orb-opacity: 0.48;
      }

      /* 2. TECH: Pitch-black Terminal CLI */
      html[data-style="tech"] {
        --radius: 6px;
      }
      html[data-style="tech"][data-theme="dark"] {
        --bg: #030806;
        --surface: #07110d;
        --surface-solid: #07110d;
        --border: rgba(16, 185, 129, 0.28);
        --chip-bg: rgba(16, 185, 129, 0.1);
        --grid-line: rgba(16, 185, 129, 0.08);
        --orb-opacity: 0.22;
      }

      /* 3. SLATE: Bold Dark Hero Banner + Clean White Body */
      html[data-style="slate"] {
        --radius: 14px;
        --orb-opacity: 0.08;
      }
      html[data-style="slate"][data-theme="light"] {
        --bg: #f1f5f9;
        --surface: #ffffff;
        --grid-line: transparent;
      }

      /* 4. HARVARD: Classic Academic Ivory Parchment */
      html[data-style="harvard"][data-theme="light"] {
        --bg: #faf8f4;
        --surface: #fffefb;
        --text: #111827;
        --muted: #374151;
        --border: #d8d3c8;
        --chip-bg: #f2efe8;
        --radius: 4px;
        --orb-opacity: 0;
        --grid-line: transparent;
      }

      /* 5. MINIMAL: Stark Pure White Monochrome Studio */
      html[data-style="minimal"] {
        --radius: 8px;
        --orb-opacity: 0;
        --grid-line: transparent;
      }
      html[data-style="minimal"][data-theme="light"] {
        --bg: #ffffff;
        --surface: #ffffff;
        --border: #e5e7eb;
        --chip-bg: #f4f4f5;
      }

      /* 6. EDITORIAL: Warm Champagne Magazine */
      html[data-style="editorial"][data-theme="light"] {
        --bg: #f6efe6;
        --surface: #fffdf9;
        --border: #e4d8c8;
        --chip-bg: #efe4d6;
        --radius: 14px;
        --orb-opacity: 0.1;
        --grid-line: transparent;
      }

      /* 7. SWISS: 2-Column Sticky-Sidebar Split */
      html[data-style="swiss"] {
        --radius: 12px;
        --orb-opacity: 0.12;
      }
      html[data-style="swiss"][data-theme="light"] {
        --bg: #f8fafc;
        --surface: #ffffff;
      }

      /* 8. NORDIC: Soft Pastel Mesh Floating Bento */
      html[data-style="nordic"] {
        --radius: 28px;
      }
      html[data-style="nordic"][data-theme="light"] {
        --bg: linear-gradient(135deg, #eef2ff 0%, #f0fdf4 52%, #fdf2f8 100%);
        --surface: rgba(255, 255, 255, 0.92);
        --chip-bg: #e8eff7;
        --border: rgba(148, 163, 184, 0.22);
        --orb-opacity: 0.26;
        --grid-line: transparent;
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }

      body {
        font-family: var(--font-main);
        background: var(--bg);
        color: var(--text);
        line-height: 1.65;
        min-height: 100vh;
        overflow-x: hidden;
        transition: background 0.35s ease, color 0.35s ease;
      }

      .ambient-bg {
        position: fixed;
        inset: 0;
        z-index: -1;
        overflow: hidden;
        pointer-events: none;
        background-image:
          linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
          linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px);
        background-size: 38px 38px;
      }
      .orb {
        position: absolute;
        border-radius: 999px;
        filter: blur(92px);
        opacity: var(--orb-opacity);
        animation: floatOrb 16s ease-in-out infinite alternate;
      }
      .orb-1 { width: 420px; height: 420px; top: -120px; left: -100px; background: var(--accent); }
      .orb-2 { width: 360px; height: 360px; top: 25%; right: -120px; background: #06b6d4; animation-delay: -6s; }
      .orb-3 { width: 320px; height: 320px; bottom: -100px; left: 30%; background: #8b5cf6; animation-delay: -11s; }

      @keyframes floatOrb {
        0% { transform: translate3d(0, 0, 0) scale(1); }
        50% { transform: translate3d(38px, 28px, 0) scale(1.08); }
        100% { transform: translate3d(-24px, 46px, 0) scale(0.95); }
      }

      .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        width: 0%;
        z-index: 100;
        background: linear-gradient(90deg, var(--accent), #06b6d4, #a855f7);
        box-shadow: 0 0 12px var(--accent-glow);
        transition: width 0.08s linear;
      }

      /* Sticky Navbar — Scrollbar hidden cleanly */
      .nav-wrap {
        position: sticky;
        top: 12px;
        z-index: 60;
        max-width: 1080px;
        margin: 12px auto 0;
        padding: 0 16px;
      }
      .navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 8px 14px;
        border-radius: var(--radius);
        background: var(--bg-elev);
        border: 1px solid var(--border);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      }
      .brand-pill {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        text-decoration: none;
        color: var(--text);
        font-weight: 700;
        font-size: 0.88rem;
        white-space: nowrap;
        flex-shrink: 0;
      }
      .monogram {
        width: 30px;
        height: 30px;
        border-radius: 9px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.74rem;
        font-weight: 800;
        color: #fff;
        background: linear-gradient(135deg, var(--accent), #06b6d4);
      }
      .nav-links {
        display: flex;
        align-items: center;
        gap: 2px;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .nav-links::-webkit-scrollbar { display: none; }
      .nav-link {
        color: var(--muted);
        text-decoration: none;
        font-size: 0.76rem;
        font-weight: 600;
        padding: 5px 9px;
        border-radius: 8px;
        white-space: nowrap;
        transition: color 0.2s, background 0.2s;
      }
      .nav-link:hover, .nav-link.active { color: var(--text); background: var(--accent-soft); }
      .nav-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
      .icon-btn {
        appearance: none;
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--text);
        padding: 6px 11px;
        border-radius: 9px;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;
        transition: transform 0.2s ease, border-color 0.2s ease;
      }
      .icon-btn:hover { transform: translateY(-1px); border-color: var(--accent); }
      .icon-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }

      /* Main Layout Container */
      .container {
        max-width: 1060px;
        margin: 0 auto;
        padding: 36px 20px 88px;
      }

      /* SWISS: 2-Column Sticky Sidebar starting at 620px so iframe previews show split immediately */
      @media (min-width: 620px) {
        html[data-style="swiss"] .layout-shell {
          display: grid;
          grid-template-columns: 270px 1fr;
          gap: 28px;
          align-items: start;
        }
        html[data-style="swiss"] .hero {
          position: sticky;
          top: 76px;
          grid-template-columns: 1fr;
          padding: 24px 20px;
          border-left: 4px solid var(--accent);
        }
        html[data-style="swiss"] .hero-title { font-size: 1.75rem; }
        html[data-style="swiss"] .hero-right { align-items: flex-start; }
        html[data-style="swiss"] .bento-stats { width: 100%; }
        html[data-style="swiss"] .content-flow > .section:first-child { margin-top: 0; }
      }

      /* Hero Base */
      .hero {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 24px;
        align-items: center;
        padding: 38px 34px;
        border-radius: var(--radius);
        background: var(--surface);
        border: 1px solid var(--border);
        backdrop-filter: blur(16px);
        position: relative;
        overflow: hidden;
        animation: fadeUpBlur 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      /* TECH Terminal Window Hero */
      html[data-style="tech"] .hero {
        padding-top: 58px;
        border: 1px solid rgba(16, 185, 129, 0.45);
        box-shadow: 0 0 40px rgba(16, 185, 129, 0.08);
      }
      .term-bar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 36px;
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 0 14px;
        background: rgba(16, 185, 129, 0.09);
        border-bottom: 1px solid rgba(16, 185, 129, 0.25);
      }
      .term-dot { width: 10px; height: 10px; border-radius: 999px; }
      .term-dot.r { background: #ef4444; }
      .term-dot.y { background: #f59e0b; }
      .term-dot.g { background: #10b981; }
      .term-title {
        margin-left: 8px;
        font-size: 0.74rem;
        color: #10b981;
        font-weight: 600;
      }
      html[data-style="tech"] .hero-title::after {
        content: "█";
        margin-left: 6px;
        font-size: 0.78em;
        color: #10b981;
        animation: blinkCaret 1.1s steps(2, start) infinite;
      }
      @keyframes blinkCaret { to { visibility: hidden; } }

      /* SLATE: High-Contrast Dark Header Banner + Crisp Light Body */
      html[data-style="slate"] .hero {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: #f8fafc;
        border: none;
        border-top: 5px solid var(--accent);
        box-shadow: 0 18px 42px rgba(15, 23, 42, 0.22);
      }
      html[data-style="slate"] .hero .hero-title {
        background: none;
        color: #ffffff;
        -webkit-text-fill-color: #ffffff;
        animation: none;
      }
      html[data-style="slate"] .hero .hero-role { color: #cbd5e1; }
      html[data-style="slate"] .hero .status-pill {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
        color: #f8fafc;
      }
      html[data-style="slate"] .hero .pill {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.18);
        color: #f8fafc;
      }
      html[data-style="slate"] .hero .stat-box {
        background: rgba(15, 23, 42, 0.55);
        border-color: rgba(255, 255, 255, 0.16);
      }
      html[data-style="slate"] .hero .stat-num { color: #ffffff; }
      html[data-style="slate"] .hero .stat-lbl { color: #94a3b8; }
      html[data-style="slate"] .glow-card { border-left: 4px solid var(--accent); }

      /* HARVARD: Centered Double-Ruled Ivory */
      html[data-style="harvard"] .hero {
        grid-template-columns: 1fr;
        text-align: center;
        border-top: 5px double #111827;
        border-bottom: 2px solid #111827;
      }
      html[data-style="harvard"] .hero-cta,
      html[data-style="harvard"] .hero-right { justify-content: center; align-items: center; }

      /* MINIMAL: Borderless Stark Monochrome */
      html[data-style="minimal"] .hero {
        border: none;
        border-bottom: 1px solid var(--border);
        border-radius: 0;
        padding: 18px 0 34px;
        background: transparent;
      }
      html[data-style="minimal"] .cta-primary {
        background: #0f172a;
        box-shadow: none;
      }
      html[data-style="minimal"] .glow-card {
        box-shadow: none;
      }

      /* EDITORIAL: Champagne Magazine Centered Italic */
      html[data-style="editorial"] .hero {
        grid-template-columns: 1fr;
        text-align: center;
        padding: 48px 34px;
        border-top: 3px solid var(--accent);
      }
      html[data-style="editorial"] .hero-cta,
      html[data-style="editorial"] .hero-right { justify-content: center; align-items: center; }
      html[data-style="editorial"] .hero-title { font-style: italic; font-size: clamp(2.3rem, 4.8vw, 3.6rem); }

      /* NORDIC: Soft Rounded Floating Cards */
      html[data-style="nordic"] .hero {
        box-shadow: 0 20px 50px rgba(15, 23, 42, 0.06);
      }
      html[data-style="nordic"] .glow-card {
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.045);
      }

      .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 5px 13px;
        border-radius: 999px;
        font-size: 0.76rem;
        font-weight: 600;
        background: var(--accent-soft);
        border: 1px solid var(--border);
        color: var(--text);
        margin-bottom: 14px;
      }
      .pulse-dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: #10b981;
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
        animation: pulseRing 2s infinite;
      }
      @keyframes pulseRing {
        0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
        70% { box-shadow: 0 0 0 9px rgba(16, 185, 129, 0); }
        100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
      }

      .hero-title {
        font-size: clamp(2rem, 4vw, 3.15rem);
        font-weight: 800;
        letter-spacing: -0.035em;
        line-height: 1.08;
      }
      html[data-style="executive"] .hero-title {
        background: linear-gradient(110deg, var(--text) 15%, var(--accent) 55%, #06b6d4 85%, var(--text) 100%);
        background-size: 220% auto;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: textShimmer 7s linear infinite;
      }
      html[data-style="tech"] .hero-title { color: #10b981; }
      @keyframes textShimmer { to { background-position: 220% center; } }

      .hero-role {
        margin-top: 8px;
        font-size: clamp(1rem, 1.8vw, 1.2rem);
        font-weight: 600;
        color: var(--muted);
      }
      .hero-cta { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 20px; }
      .cta-primary {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        border-radius: 10px;
        background: linear-gradient(135deg, var(--accent), #06b6d4);
        color: #fff;
        font-weight: 700;
        font-size: 0.84rem;
        text-decoration: none;
        box-shadow: 0 10px 24px var(--accent-glow);
        transition: transform 0.22s ease;
      }
      .cta-primary:hover { transform: translateY(-2px); }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        border-radius: 9px;
        border: 1px solid var(--border);
        background: var(--chip-bg);
        color: var(--text);
        font-size: 0.8rem;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
        transition: transform 0.2s ease, border-color 0.2s ease;
      }
      .pill:hover { transform: translateY(-2px); border-color: var(--accent); }

      .hero-right { display: flex; flex-direction: column; align-items: flex-end; gap: 14px; }
      .avatar {
        width: 102px;
        height: 102px;
        border-radius: var(--radius);
        object-fit: cover;
        border: 2px solid var(--accent-glow);
      }
      .bento-stats { display: grid; grid-template-columns: repeat(3, minmax(70px, 1fr)); gap: 9px; }
      .stat-box {
        padding: 10px 8px;
        border-radius: 12px;
        border: 1px solid var(--border);
        background: var(--bg-elev);
        text-align: center;
      }
      .stat-num { display: block; font-size: 1.25rem; font-weight: 800; color: var(--text); line-height: 1.1; }
      .stat-lbl {
        display: block;
        font-size: 0.65rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--muted);
        margin-top: 3px;
      }

      /* Sections */
      .section { margin-top: 46px; }
      .section-head { margin-bottom: 18px; }
      html[data-style="editorial"] .section-head {
        display: flex;
        align-items: baseline;
        gap: 14px;
        border-bottom: 1px solid var(--border);
        padding-bottom: 8px;
      }
      .eyebrow {
        display: inline-block;
        font-size: 0.71rem;
        font-weight: 700;
        letter-spacing: 0.14em;
        color: var(--accent);
        text-transform: uppercase;
        margin-bottom: 4px;
      }
      html[data-style="tech"] .eyebrow { color: #10b981; }
      h2 { font-size: 1.45rem; font-weight: 800; letter-spacing: -0.025em; }

      .glow-card {
        position: relative;
        border-radius: var(--radius);
        border: 1px solid var(--border);
        background: var(--surface);
        backdrop-filter: blur(14px);
        overflow: hidden;
        transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.26s ease, box-shadow 0.26s ease;
      }
      .glow-card::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(360px circle at var(--x, 50%) var(--y, 50%), var(--accent-soft), transparent 65%);
        opacity: 0;
        transition: opacity 0.26s ease;
        pointer-events: none;
      }
      .glow-card:hover {
        transform: translateY(-4px);
        border-color: var(--accent-glow);
        box-shadow: 0 14px 32px rgba(0, 0, 0, 0.12);
      }
      .glow-card:hover::before { opacity: 1; }

      .spotlight-card { padding: 24px 28px; border-left: 4px solid var(--accent); }
      .lead-prose { font-size: 1.01rem; color: var(--muted); line-height: 1.78; }
      .glass-card { padding: 22px 26px; }
      .prose { color: var(--muted); }
      .stack-cards { display: flex; flex-direction: column; gap: 15px; }

      /* Timeline */
      .timeline-track {
        position: relative;
        padding-left: 28px;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }
      .timeline-track::before {
        content: "";
        position: absolute;
        left: 8px;
        top: 10px;
        bottom: 10px;
        width: 2px;
        background: linear-gradient(to bottom, var(--accent), rgba(6, 182, 212, 0.35), transparent);
      }
      .tl-item { position: relative; }
      .tl-node {
        position: absolute;
        left: -27px;
        top: 24px;
        width: 14px;
        height: 14px;
        border-radius: 999px;
        background: var(--bg);
        border: 3px solid var(--accent);
        box-shadow: 0 0 12px var(--accent-glow);
        transition: transform 0.25s ease;
      }
      .tl-item:hover .tl-node { transform: scale(1.25); }
      .tl-card { padding: 22px 24px; }

      .card-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 10px;
      }
      h3 { font-size: 1.05rem; font-weight: 700; color: var(--text); }
      .org { color: var(--muted); font-size: 0.9rem; font-weight: 500; margin-top: 2px; }
      .badge-date {
        font-size: 0.76rem;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 999px;
        background: var(--chip-bg);
        border: 1px solid var(--border);
        color: var(--muted);
        white-space: nowrap;
      }
      .bullets { padding-left: 18px; color: var(--muted); font-size: 0.92rem; }
      .bullets li + li { margin-top: 5px; }

      /* Projects & Skills */
      .proj-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
      .proj-card { padding: 22px; display: flex; flex-direction: column; justify-content: space-between; }
      .proj-link { color: var(--text); text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
      .proj-link .arrow { display: inline-block; color: var(--accent); transition: transform 0.2s ease; }
      .proj-card:hover .proj-link .arrow { transform: translate(3px, -3px); }

      .tags { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 14px; }
      .tag {
        background: var(--chip-bg);
        border: 1px solid var(--border);
        color: var(--text);
        font-size: 0.74rem;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 8px;
        transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
      }
      .interactive-tag:hover {
        transform: translateY(-2px);
        border-color: var(--accent);
        background: var(--accent-soft);
      }
      .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
      .skill-card { padding: 20px; }
      .skill-card h3 { font-size: 0.93rem; margin-bottom: 4px; }

      /* Reveal */
      @keyframes fadeUpBlur {
        from { opacity: 0; transform: translateY(20px); filter: blur(6px); }
        to { opacity: 1; transform: translateY(0); filter: blur(0); }
      }
      .reveal {
        opacity: 0;
        transform: translateY(22px);
        transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1) var(--delay, 0ms),
                    transform 0.65s cubic-bezier(0.22, 1, 0.36, 1) var(--delay, 0ms);
      }
      .reveal.is-visible { opacity: 1; transform: translateY(0); }

      .toast {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translate(-50%, 16px);
        opacity: 0;
        pointer-events: none;
        background: var(--surface-solid);
        color: var(--text);
        border: 1px solid var(--accent);
        padding: 10px 18px;
        border-radius: 999px;
        font-size: 0.84rem;
        font-weight: 600;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28);
        transition: opacity 0.25s ease, transform 0.25s ease;
        z-index: 90;
      }
      .toast.show { opacity: 1; transform: translate(-50%, 0); }

      .back-top {
        position: fixed;
        right: 22px;
        bottom: 22px;
        width: 40px;
        height: 40px;
        border-radius: 12px;
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--text);
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
        backdrop-filter: blur(12px);
        transition: opacity 0.25s ease, transform 0.25s ease;
        z-index: 70;
      }
      .back-top.visible { opacity: 1; pointer-events: auto; }
      .back-top:hover { transform: translateY(-3px); border-color: var(--accent); }

      .site-footer {
        margin-top: 64px;
        padding-top: 22px;
        border-top: 1px solid var(--border);
        text-align: center;
        color: var(--muted);
        font-size: 0.82rem;
      }
      .site-footer a { color: var(--accent); text-decoration: none; font-weight: 600; }

      @media (max-width: 680px) {
        .hero { grid-template-columns: 1fr; padding: 26px 20px; }
        html[data-style="tech"] .hero { padding-top: 52px; }
        .hero-right { align-items: flex-start; }
        .nav-links { display: none; }
        .timeline-track { padding-left: 22px; }
        .tl-node { left: -20px; }
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        .reveal { opacity: 1; transform: none; }
      }

      @media print {
        .ambient-bg, .scroll-progress, .nav-wrap, .back-top, .toast, .site-footer, .term-bar { display: none !important; }
        html, body { background: #fff !important; color: #0f172a !important; }
        .container { padding: 0; max-width: 100%; }
        html[data-style="swiss"] .layout-shell { display: block; }
        .hero, .glow-card {
          background: #fff !important;
          border: 1px solid #e2e8f0 !important;
          box-shadow: none !important;
          transform: none !important;
          color: #0f172a !important;
        }
        .hero-title { color: #0f172a !important; -webkit-text-fill-color: #0f172a !important; }
        .reveal { opacity: 1 !important; transform: none !important; }
      }
    </style>
  </head>
  <body>
    <div class="scroll-progress" id="scrollProgress"></div>
    <div class="ambient-bg" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <div class="nav-wrap">
      <nav class="navbar" aria-label="Primary">
        <a class="brand-pill" href="#top">
          <span class="monogram">${initials}</span>
          <span>${safeName}</span>
        </a>
        <div class="nav-links">${navLinks}</div>
        <div class="nav-actions">
          <button class="icon-btn" id="themeBtn" type="button">${toggleBtnInitialLabel}</button>
          <button class="icon-btn primary" type="button" onclick="window.print()">Save PDF</button>
        </div>
      </nav>
    </div>

    <main class="container" id="top">
      <div class="layout-shell">
        <header class="hero">
          ${terminalChrome}
          <div>
            <div class="status-pill">
              <span class="pulse-dot" aria-hidden="true"></span>
              <span>${statusLabel}</span>
            </div>
            <h1 class="hero-title">${safeName}</h1>
            ${safeTitle ? `<p class="hero-role">${safeTitle}</p>` : ''}
            <div class="hero-cta">
              ${
                safeEmail
                  ? `<a class="cta-primary" href="mailto:${safeEmail}">Contact Me</a>
                     <button class="pill" id="copyEmailBtn" type="button" data-email="${safeEmail}">Copy Email</button>`
                  : ''
              }
              ${socialPills.join('')}
            </div>
          </div>

          <div class="hero-right">
            ${basics.showAvatar && basics.avatar ? `<img class="avatar" src="${escapeHtml(basics.avatar)}" alt="${safeName}" />` : ''}
            <div class="bento-stats">
              <div class="stat-box">
                <span class="stat-num" data-count="${expCount}">${expCount}</span>
                <span class="stat-lbl">Roles</span>
              </div>
              <div class="stat-box">
                <span class="stat-num" data-count="${projCount}">${projCount}</span>
                <span class="stat-lbl">Projects</span>
              </div>
              <div class="stat-box">
                <span class="stat-num" data-count="${skillCount}">${skillCount}</span>
                <span class="stat-lbl">Skills</span>
              </div>
            </div>
          </div>
        </header>

        <div class="content-flow">
          ${sectionBlocks}
        </div>
      </div>

      <footer class="site-footer">
        Interactive Portfolio powered by <a href="https://www.cvpromax.top/" target="_blank" rel="noopener noreferrer">ResumeCraft</a>
      </footer>
    </main>

    <button class="back-top" id="backTop" type="button" aria-label="Back to top">&uarr;</button>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>

    <script>
      (function () {
        var root = document.documentElement;
        var themeBtn = document.getElementById('themeBtn');
        var progressBar = document.getElementById('scrollProgress');
        var backTop = document.getElementById('backTop');
        var toastEl = document.getElementById('toast');
        var copyBtn = document.getElementById('copyEmailBtn');

        function showToast(msg) {
          if (!toastEl) return;
          toastEl.textContent = msg;
          toastEl.classList.add('show');
          window.clearTimeout(toastEl._t);
          toastEl._t = window.setTimeout(function () {
            toastEl.classList.remove('show');
          }, 2200);
        }

        if (themeBtn) {
          themeBtn.addEventListener('click', function () {
            var isDark = root.getAttribute('data-theme') !== 'light';
            root.setAttribute('data-theme', isDark ? 'light' : 'dark');
            themeBtn.textContent = isDark ? 'Dark Mode' : 'Light Mode';
          });
        }

        if (copyBtn) {
          copyBtn.addEventListener('click', function () {
            var email = copyBtn.getAttribute('data-email') || '';
            if (navigator.clipboard && email) {
              navigator.clipboard.writeText(email).then(function () {
                showToast('Copied: ' + email);
              });
            }
          });
        }

        var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
        var sections = navLinks.map(function (a) {
          return document.getElementById(a.getAttribute('data-target') || '');
        });

        function onScroll() {
          var docHeight = document.documentElement.scrollHeight - window.innerHeight;
          var pct = docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0;
          if (progressBar) progressBar.style.width = pct.toFixed(1) + '%';
          if (backTop) {
            if (window.scrollY > 280) backTop.classList.add('visible');
            else backTop.classList.remove('visible');
          }
          var activeIdx = 0;
          sections.forEach(function (sec, idx) {
            if (sec && sec.getBoundingClientRect().top <= 160) activeIdx = idx;
          });
          navLinks.forEach(function (link, idx) {
            link.classList.toggle('active', idx === activeIdx);
          });
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        if (backTop) {
          backTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        }

        var reveals = document.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window) {
          var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
              }
            });
          }, { threshold: 0.1 });
          reveals.forEach(function (el) { io.observe(el); });
        } else {
          reveals.forEach(function (el) { el.classList.add('is-visible'); });
        }

        var cards = document.querySelectorAll('.glow-card');
        cards.forEach(function (card) {
          card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            card.style.setProperty('--x', (e.clientX - rect.left) + 'px');
            card.style.setProperty('--y', (e.clientY - rect.top) + 'px');
          });
        });

        document.querySelectorAll('.stat-num[data-count]').forEach(function (el) {
          var target = parseInt(el.getAttribute('data-count') || '0', 10);
          if (!target || target <= 0) return;
          var start = 0;
          var step = Math.max(1, Math.ceil(target / 18));
          var timer = window.setInterval(function () {
            start = Math.min(target, start + step);
            el.textContent = String(start);
            if (start >= target) window.clearInterval(timer);
          }, 32);
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

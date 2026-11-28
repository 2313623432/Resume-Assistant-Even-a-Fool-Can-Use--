import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE_URL, HIGH_INTENT_PAGES, LANDING_PAGES, TODAY } from './landing-pages-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '../public');

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeJsonLd(obj) {
  return JSON.stringify(obj, null, 2).replace(/<\//g, '<\\/');
}

const GTM_HEAD = `    <!-- Google Tag Manager -->
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
    </script>
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-MB3V7PSM');</script>
    <!-- End Google Tag Manager -->`;

const GTM_NOSCRIPT = `    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MB3V7PSM"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->`;

const SHARED_CSS = `      :root {
        --bg: #f8fafc;
        --surface: #ffffff;
        --text: #0f172a;
        --muted: #475569;
        --border: #e2e8f0;
        --accent: #4f46e5;
        --accent-soft: #eef2ff;
        --emerald: #059669;
        --emerald-soft: #ecfdf5;
        --rose: #dc2626;
        --rose-soft: #fef2f2;
      }
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body {
        margin: 0;
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: var(--bg);
        color: var(--text);
        line-height: 1.7;
      }
      a { color: var(--accent); text-decoration: none; }
      a:hover { text-decoration: underline; }
      header.site-header {
        position: sticky;
        top: 0;
        z-index: 40;
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--border);
        padding: 12px 24px;
      }
      .nav-inner {
        max-width: 1180px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
      }
      .brand {
        font-weight: 800;
        font-size: 1.05rem;
        color: var(--text);
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .brand:hover { text-decoration: none; }
      .brand-dot {
        width: 28px;
        height: 28px;
        border-radius: 8px;
        background: var(--accent);
        color: #fff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.78rem;
        font-weight: 800;
      }
      .nav-links {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        font-size: 0.875rem;
        font-weight: 600;
      }
      .nav-links a { color: var(--muted); }
      .nav-links a:hover { color: var(--accent); text-decoration: none; }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 10px 18px;
        border-radius: 10px;
        font-size: 0.88rem;
        font-weight: 700;
        transition: background 0.18s ease, transform 0.18s ease;
        text-decoration: none !important;
      }
      .btn:hover { transform: translateY(-1px); }
      .btn-primary { background: var(--accent); color: #fff; }
      .btn-primary:hover { background: #4338ca; }
      .btn-dark { background: #0f172a; color: #fff; }
      .btn-dark:hover { background: #1e293b; }
      .btn-outline { background: #fff; color: var(--text); border: 1px solid var(--border); }
      .btn-outline:hover { background: #f1f5f9; }
      main.container {
        max-width: 1120px;
        margin: 0 auto;
        padding: 36px 20px 64px;
      }
      .crumbs {
        font-size: 0.82rem;
        color: var(--muted);
        margin-bottom: 16px;
      }
      .hero-box {
        background: linear-gradient(135deg, #ffffff 0%, #eef2ff 100%);
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 36px;
        margin-bottom: 24px;
      }
      .badge {
        display: inline-block;
        background: var(--accent-soft);
        color: var(--accent);
        font-size: 0.74rem;
        font-weight: 700;
        padding: 4px 12px;
        border-radius: 999px;
        letter-spacing: 0.03em;
        margin-bottom: 12px;
      }
      h1 {
        margin: 0 0 14px;
        font-size: clamp(1.75rem, 3.2vw, 2.45rem);
        line-height: 1.18;
        letter-spacing: -0.025em;
      }
      .hero-desc {
        margin: 0 0 22px;
        font-size: 1.05rem;
        color: var(--muted);
        max-width: 780px;
      }
      .cta-row { display: flex; flex-wrap: wrap; gap: 10px; }
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 28px;
        margin-bottom: 22px;
      }
      .tldr-box {
        border-left: 4px solid var(--accent);
        background: #ffffff;
      }
      h2 { margin: 0 0 14px; font-size: 1.38rem; letter-spacing: -0.015em; }
      h3 { margin: 0 0 8px; font-size: 1.04rem; }
      p { margin: 0 0 12px; color: var(--muted); }
      p:last-child { margin-bottom: 0; }
      .truth-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 16px;
        margin-top: 14px;
      }
      .truth-card {
        background: #f8fafc;
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 18px;
      }
      .roast-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 14px;
        font-size: 0.92rem;
      }
      .roast-table th, .roast-table td {
        border: 1px solid var(--border);
        padding: 12px 14px;
        text-align: left;
        vertical-align: top;
      }
      .roast-table th { background: #f8fafc; font-weight: 700; }
      .bad-cell { background: var(--rose-soft); color: #7f1d1d; }
      .good-cell { background: var(--emerald-soft); color: #064e3b; font-weight: 500; }
      .sample-box {
        background: #f8fafc;
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 22px;
      }
      .sample-name { font-size: 1.25rem; font-weight: 800; color: var(--text); }
      .sample-role { font-size: 0.96rem; font-weight: 700; color: var(--accent); margin-top: 2px; }
      .sample-meta { font-size: 0.85rem; color: var(--muted); margin: 6px 0 14px; }
      .sample-list { margin: 0 0 14px; padding-left: 20px; color: #334155; }
      .sample-list li + li { margin-top: 6px; }
      .tags { display: flex; flex-wrap: wrap; gap: 7px; }
      .tag {
        background: #e2e8f0;
        color: #1e293b;
        font-size: 0.78rem;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 999px;
      }
      .studio-shell {
        border: 1px solid var(--border);
        border-radius: 18px;
        overflow: hidden;
        background: #fff;
        box-shadow: 0 12px 34px rgba(15, 23, 42, 0.08);
        margin-top: 16px;
      }
      .studio-topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        padding: 12px 18px;
        background: #0f172a;
        color: #f8fafc;
        font-size: 0.84rem;
      }
      .studio-frame {
        width: 100%;
        height: 780px;
        border: 0;
        display: block;
      }
      .faq-item {
        border-top: 1px solid var(--border);
        padding: 16px 0;
      }
      .faq-item:first-of-type { border-top: none; padding-top: 4px; }
      .related-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
        margin-top: 14px;
      }
      .related-card {
        display: block;
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 14px 16px;
        background: #f8fafc;
        color: var(--text);
        font-weight: 700;
        font-size: 0.9rem;
      }
      .related-card span {
        display: block;
        font-size: 0.75rem;
        color: var(--accent);
        margin-bottom: 3px;
      }
      .related-card:hover { border-color: var(--accent); background: var(--accent-soft); text-decoration: none; }
      footer.site-footer {
        border-top: 1px solid var(--border);
        background: #fff;
        padding: 28px 24px;
        font-size: 0.85rem;
        color: var(--muted);
      }
      .footer-inner {
        max-width: 1120px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 16px;
      }
      .footer-links { display: flex; flex-wrap: wrap; gap: 18px; }
      .footer-links a { color: var(--muted); font-weight: 600; }
      @media (max-width: 720px) {
        .hero-box, .card { padding: 20px; }
        .studio-frame { height: 680px; }
      }`;

const pageBySlug = new Map(LANDING_PAGES.map((p) => [p.slug, p]));
const highIntentBySlug = new Map(HIGH_INTENT_PAGES.map((p) => [p.slug, p]));

const ORG_JSON_LD = {
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'ResumeCraft',
  alternateName: 'CV Pro Max',
  url: `${BASE_URL}/`,
  logo: `${BASE_URL}/logo.png`,
  sameAs: ['https://github.com/2313623432/Resume-Assistant-Even-a-Fool-Can-Use--'],
};

function renderRolePage(page) {
  const canonicalUrl = `${BASE_URL}/${page.slug}.html`;
  const fullStudioUrl = `/?preset=${encodeURIComponent(page.presetKey)}`;
  const embedStudioUrl = `/?preset=${encodeURIComponent(page.presetKey)}&embed=1`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_JSON_LD,
      {
        '@type': 'Article',
        headline: page.h1,
        description: page.description,
        datePublished: TODAY,
        dateModified: TODAY,
        mainEntityOfPage: canonicalUrl,
        image: `${BASE_URL}/og-image.png`,
        author: { '@id': `${BASE_URL}/#organization` },
        publisher: { '@id': `${BASE_URL}/#organization` },
      },
      {
        '@type': 'HowTo',
        name: `How to Build a Free ${page.roleName} Resume and Turn It into a Website`,
        description: `Create an ATS-clean ${page.roleName} resume for free and convert it into a live HTML website in one click.`,
        step: [
          {
            '@type': 'HowToStep',
            name: `Load the Free ${page.roleName} Resume Template`,
            text: `Open the embedded ResumeCraft workspace pre-loaded with the ${page.roleName} template or upload an existing PDF/DOCX resume.`,
          },
          {
            '@type': 'HowToStep',
            name: 'Quantify Impact & Tailor with Optional BYOK AI',
            text: 'Edit bullet points using measurable metrics (Enter auto-formats • bullets) and optionally tailor with your own OpenAI, DeepSeek, or Gemini key.',
          },
          {
            '@type': 'HowToStep',
            name: 'Export ATS PDF & Turn Resume into Website in One Click',
            text: `Download your vector US Letter/A4 PDF and export your ${page.themeLabel} HTML portfolio website to publish free on Netlify Drop, Cloudflare Pages, Vercel, or GitHub Pages.`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: '2026 Industry Resume & Website Guides',
            item: `${BASE_URL}/resume-to-website-guides.html`,
          },
          { '@type': 'ListItem', position: 3, name: page.roleName, item: canonicalUrl },
        ],
      },
    ],
  };

  const truthsHtml = page.unpopularTruths
    .map(
      (t, idx) => `
          <div class="truth-card">
            <h3>${idx + 1}. ${esc(t.title)}</h3>
            <p>${esc(t.body)}</p>
          </div>`,
    )
    .join('');

  const roastHtml = page.roastRows
    .map(
      (r) => `
          <tr>
            <td class="bad-cell">${esc(r.bad)}</td>
            <td class="good-cell">${esc(r.good)}</td>
          </tr>`,
    )
    .join('');

  const relatedHtml = page.related
    .map((relSlug) => pageBySlug.get(relSlug))
    .filter(Boolean)
    .map(
      (rel) => `
          <a class="related-card" href="/${esc(rel.slug)}.html">
            <span>${esc(rel.cluster)}</span>
            ${esc(rel.roleName)} Resume &amp; Website &rarr;
          </a>`,
    )
    .join('');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
${GTM_HEAD}
    <title>${esc(page.title)}</title>
    <meta name="description" content="${esc(page.description)}" />
    <meta name="keywords" content="${esc(page.keywords)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${esc(canonicalUrl)}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="ResumeCraft" />
    <meta property="og:title" content="${esc(page.title)}" />
    <meta property="og:description" content="${esc(page.description)}" />
    <meta property="og:url" content="${esc(canonicalUrl)}" />
    <meta property="og:image" content="${BASE_URL}/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(page.title)}" />
    <meta name="twitter:description" content="${esc(page.description)}" />
    <meta name="twitter:image" content="${BASE_URL}/og-image.png" />
    <script type="application/ld+json">
${safeJsonLd(jsonLd)}
    </script>
    <style>
${SHARED_CSS}
    </style>
  </head>
  <body>
${GTM_NOSCRIPT}
    <header class="site-header">
      <div class="nav-inner">
        <a class="brand" href="/">
          <span class="brand-dot">RC</span>
          <span>ResumeCraft</span>
        </a>
        <nav class="nav-links" aria-label="Navigation">
          <a href="/">Free Resume Builder</a>
          <a href="/resume-to-website-guides.html">20 Industry Guides</a>
          <a href="/deploy-guide.html">Free Hosting Guide</a>
          <a class="btn btn-primary" href="${esc(fullStudioUrl)}">Open ${esc(page.roleName)} Builder &rarr;</a>
        </nav>
      </div>
    </header>

    <main class="container">
      <div class="crumbs">
        <a href="/">Home</a> &rsaquo; <a href="/resume-to-website-guides.html">2026 Role Guides</a> &rsaquo; ${esc(page.roleName)}
      </div>

      <section class="hero-box">
        <span class="badge">2026 PLAYBOOK &middot; FREE RESUME BUILDER + 1-CLICK WEBSITE</span>
        <h1>${esc(page.h1)}</h1>
        <p class="hero-desc">${esc(page.description)}</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="#live-studio">Use Free ${esc(page.roleName)} Builder Below &darr;</a>
          <a class="btn btn-dark" href="${esc(fullStudioUrl)}">Launch Full-Screen &amp; Turn into Website &rarr;</a>
          <a class="btn btn-outline" href="/deploy-guide.html">30s Free Hosting Guide</a>
        </div>
      </section>

      <section class="card tldr-box" aria-label="Direct Summary">
        <h2>Quick Answer (2026): How to Write a ${esc(page.roleName)} Resume &amp; Launch Your Website</h2>
        <p>${esc(page.tldr)}</p>
      </section>

      <section class="card">
        <h2>Unpopular Truths Hiring Teams Won&apos;t Put in Job Descriptions</h2>
        <div class="truth-grid">${truthsHtml}
        </div>
      </section>

      <section class="card">
        <h2>Delete This &rarr; Ship This: ${esc(page.roleName)} Bullet Makeovers</h2>
        <p>Compare vague fluff against 2026 ATS &amp; AI-search-friendly bullets written with measurable impact:</p>
        <table class="roast-table">
          <thead>
            <tr>
              <th>Delete This (Instant Skip)</th>
              <th>Ship This (2026 High-Conversion Bullet)</th>
            </tr>
          </thead>
          <tbody>${roastHtml}
          </tbody>
        </table>
      </section>

      <section class="card">
        <h2>Why Turn Your ${esc(page.roleName)} Resume into a Website?</h2>
        <p>${esc(page.websiteStrategy)}</p>
        <p style="margin-top:12px;">
          <strong>Recommended Website Theme:</strong> ${esc(page.themeLabel)} &middot;
          <strong>Free Hosting:</strong> <a href="/deploy-guide.html">Netlify Drop, Cloudflare Pages, Vercel, or GitHub Pages</a>
        </p>
      </section>

      <section class="card">
        <h2>Included Free ${esc(page.roleName)} Template Preview</h2>
        <div class="sample-box">
          <div class="sample-name">${esc(page.samplePreview.name)}</div>
          <div class="sample-role">${esc(page.samplePreview.headline)}</div>
          <div class="sample-meta">${esc(page.samplePreview.meta)}</div>
          <ul class="sample-list">
            ${page.samplePreview.bullets.map((b) => `<li>${esc(b)}</li>`).join('\n            ')}
          </ul>
          <div class="tags">
            ${page.samplePreview.skills.map((s) => `<span class="tag">${esc(s)}</span>`).join('')}
          </div>
        </div>
      </section>

      <section id="live-studio" class="card">
        <h2>Interactive Free ${esc(page.roleName)} Resume Builder &amp; Website Converter</h2>
        <p>
          Edit directly below (your existing local resume draft is protected until you make edits), switch to
          <strong>Live Website HTML</strong> to preview your animated personal webpage, or export an ATS vector PDF for free.
        </p>
        <div class="studio-shell">
          <div class="studio-topbar">
            <span>Pre-loaded: <strong>${esc(page.roleName)}</strong> &middot; Theme: <strong>${esc(page.themeLabel)}</strong></span>
            <a class="btn btn-primary" style="padding:6px 12px;font-size:0.78rem;" href="${esc(fullStudioUrl)}">Open Full-Screen Studio &nearr;</a>
          </div>
          <iframe
            class="studio-frame"
            src="${esc(embedStudioUrl)}"
            title="Interactive ${esc(page.roleName)} Resume Builder and Website Converter"
            loading="lazy"
          ></iframe>
        </div>
      </section>

      <section class="card">
        <h2>Frequently Asked Questions (${esc(page.roleName)} &middot; 2026)</h2>
        ${page.faqs
          .map(
            (f) => `
        <div class="faq-item">
          <h3>${esc(f.q)}</h3>
          <p>${esc(f.a)}</p>
        </div>`,
          )
          .join('')}
      </section>

      <section class="card">
        <h2>Explore Related 2026 Resume &amp; Website Guides</h2>
        <div class="related-grid">${relatedHtml}
        </div>
        <p style="margin-top:16px;">
          <a href="/resume-to-website-guides.html">View all 20 industry resume guides &amp; free templates &rarr;</a>
        </p>
      </section>
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <div>&copy; 2026 ResumeCraft &middot; Free Resume Builder &amp; One-Click Resume-to-Website Studio</div>
        <div class="footer-links">
          <a href="/">Home</a>
          <a href="/resume-to-website-guides.html">All 20 Industry Guides</a>
          <a href="/deploy-guide.html">Free Hosting Guide</a>
          <a href="/privacy.html">Privacy Policy</a>
          <a href="/terms.html">Terms of Service</a>
        </div>
      </div>
    </footer>
  </body>
</html>
`;
}

function renderHighIntentPage(page) {
  const canonicalUrl = `${BASE_URL}/${page.slug}.html`;
  const fullStudioUrl = `/?preset=${encodeURIComponent(page.presetKey)}`;
  const embedStudioUrl = `/?preset=${encodeURIComponent(page.presetKey)}&embed=1`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_JSON_LD,
      {
        '@type': 'Article',
        headline: page.h1,
        description: page.description,
        datePublished: TODAY,
        dateModified: TODAY,
        mainEntityOfPage: canonicalUrl,
        image: `${BASE_URL}/og-image.png`,
        author: { '@id': `${BASE_URL}/#organization` },
        publisher: { '@id': `${BASE_URL}/#organization` },
      },
      {
        '@type': 'HowTo',
        name: page.howToName,
        description: page.description,
        step: page.howToSteps.map((s) => ({
          '@type': 'HowToStep',
          name: s.name,
          text: s.text,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Free Resume Guides & Alternatives',
            item: `${BASE_URL}/resume-to-website-guides.html`,
          },
          { '@type': 'ListItem', position: 3, name: page.shortLabel, item: canonicalUrl },
        ],
      },
    ],
  };

  const highlightsHtml = page.highlights
    .map(
      (h, idx) => `
          <div class="truth-card">
            <h3>${idx + 1}. ${esc(h.title)}</h3>
            <p>${esc(h.body)}</p>
          </div>`,
    )
    .join('');

  const headersHtml = page.comparisonHeaders.map((h) => `<th>${esc(h)}</th>`).join('');
  const rowsHtml = page.comparisonRows
    .map(
      (row) => `
          <tr>
            ${row
              .map((cell, idx) =>
                idx === 1
                  ? `<td class="good-cell">${esc(cell)}</td>`
                  : `<td>${esc(cell)}</td>`,
              )
              .join('')}
          </tr>`,
    )
    .join('');

  const relatedHighHtml = (page.relatedHighIntent ?? [])
    .map((slug) => highIntentBySlug.get(slug))
    .filter(Boolean)
    .map(
      (rel) => `
          <a class="related-card" href="/${esc(rel.slug)}.html">
            <span>Free Tool / Alternative</span>
            ${esc(rel.shortLabel)} &rarr;
          </a>`,
    )
    .join('');

  const relatedRoleHtml = (page.relatedRoles ?? [])
    .map((slug) => pageBySlug.get(slug))
    .filter(Boolean)
    .map(
      (rel) => `
          <a class="related-card" href="/${esc(rel.slug)}.html">
            <span>${esc(rel.cluster)}</span>
            ${esc(rel.roleName)} Resume &amp; Website &rarr;
          </a>`,
    )
    .join('');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
${GTM_HEAD}
    <title>${esc(page.title)}</title>
    <meta name="description" content="${esc(page.description)}" />
    <meta name="keywords" content="${esc(page.keywords)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${esc(canonicalUrl)}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="ResumeCraft" />
    <meta property="og:title" content="${esc(page.title)}" />
    <meta property="og:description" content="${esc(page.description)}" />
    <meta property="og:url" content="${esc(canonicalUrl)}" />
    <meta property="og:image" content="${BASE_URL}/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(page.title)}" />
    <meta name="twitter:description" content="${esc(page.description)}" />
    <meta name="twitter:image" content="${BASE_URL}/og-image.png" />
    <script type="application/ld+json">
${safeJsonLd(jsonLd)}
    </script>
    <style>
${SHARED_CSS}
    </style>
  </head>
  <body>
${GTM_NOSCRIPT}
    <header class="site-header">
      <div class="nav-inner">
        <a class="brand" href="/">
          <span class="brand-dot">RC</span>
          <span>ResumeCraft</span>
        </a>
        <nav class="nav-links" aria-label="Navigation">
          <a href="/">Free Resume Builder</a>
          <a href="/resume-to-website-guides.html">All Guides &amp; Alternatives</a>
          <a href="/deploy-guide.html">Free Hosting Guide</a>
          <a class="btn btn-primary" href="${esc(fullStudioUrl)}">Open Full Builder &rarr;</a>
        </nav>
      </div>
    </header>

    <main class="container">
      <div class="crumbs">
        <a href="/">Home</a> &rsaquo; <a href="/resume-to-website-guides.html">Guides &amp; Alternatives</a> &rsaquo; ${esc(page.shortLabel)}
      </div>

      <section class="hero-box">
        <span class="badge">${esc(page.badge)}</span>
        <h1>${esc(page.h1)}</h1>
        <p class="hero-desc">${esc(page.description)}</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="#live-studio">Use Free Builder Below &darr;</a>
          <a class="btn btn-dark" href="${esc(fullStudioUrl)}">Open Full-Screen Studio &rarr;</a>
          <a class="btn btn-outline" href="/deploy-guide.html">30s Free Hosting Guide</a>
        </div>
      </section>

      <section class="card tldr-box" aria-label="Direct Summary">
        <h2>Quick Answer (2026): ${esc(page.shortLabel)}</h2>
        <p>${esc(page.directAnswer)}</p>
      </section>

      <section class="card">
        <h2>${esc(page.comparisonTitle)}</h2>
        <table class="roast-table">
          <thead>
            <tr>${headersHtml}</tr>
          </thead>
          <tbody>${rowsHtml}
          </tbody>
        </table>
      </section>

      <section class="card">
        <h2>Why Job Seekers Switch to ResumeCraft (cvpromax.top)</h2>
        <div class="truth-grid">${highlightsHtml}
        </div>
      </section>

      <section id="live-studio" class="card">
        <h2>Try It Free Now — No Sign Up, No Credit Card, No Watermark</h2>
        <p>
          Edit directly below or import your existing PDF / Word (.docx) file locally inside your browser. Export a clean ATS vector PDF or click
          <strong>Turn Resume into Website</strong> to download a standalone <code>index.html</code> portfolio.
        </p>
        <div class="studio-shell">
          <div class="studio-topbar">
            <span>Template: <strong>${esc(page.themeLabel)}</strong> &middot; 100% Free &amp; Local in Browser</span>
            <a class="btn btn-primary" style="padding:6px 12px;font-size:0.78rem;" href="${esc(fullStudioUrl)}">Open Full-Screen Studio &nearr;</a>
          </div>
          <iframe
            class="studio-frame"
            src="${esc(embedStudioUrl)}"
            title="${esc(page.shortLabel)} Interactive Builder"
            loading="lazy"
          ></iframe>
        </div>
      </section>

      <section class="card">
        <h2>Frequently Asked Questions (${esc(page.shortLabel)} &middot; 2026)</h2>
        ${page.faqs
          .map(
            (f) => `
        <div class="faq-item">
          <h3>${esc(f.q)}</h3>
          <p>${esc(f.a)}</p>
        </div>`,
          )
          .join('')}
      </section>

      <section class="card">
        <h2>Related Free Tools &amp; 2026 Role Templates</h2>
        <div class="related-grid">${relatedHighHtml}${relatedRoleHtml}
        </div>
        <p style="margin-top:16px;">
          <a href="/resume-to-website-guides.html">View all 30 free guides, alternatives &amp; industry templates &rarr;</a>
        </p>
      </section>
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <div>&copy; 2026 ResumeCraft &middot; Free Resume Builder &amp; One-Click Resume-to-Website Studio</div>
        <div class="footer-links">
          <a href="/">Home</a>
          <a href="/resume-to-website-guides.html">All Guides &amp; Alternatives</a>
          <a href="/deploy-guide.html">Free Hosting Guide</a>
          <a href="/privacy.html">Privacy Policy</a>
          <a href="/terms.html">Terms of Service</a>
        </div>
      </div>
    </footer>
  </body>
</html>
`;
}

function renderHubPage() {
  const canonicalUrl = `${BASE_URL}/resume-to-website-guides.html`;
  const clusters = [];
  const seen = new Map();
  for (const p of LANDING_PAGES) {
    if (!seen.has(p.cluster)) {
      const group = { name: p.cluster, items: [] };
      seen.set(p.cluster, group);
      clusters.push(group);
    }
    seen.get(p.cluster).items.push(p);
  }

  const allGuides = [...HIGH_INTENT_PAGES, ...LANDING_PAGES];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_JSON_LD,
      {
        '@type': 'CollectionPage',
        name: 'Free Resume Builder Alternatives, Harvard ATS & 20 Industry Guides (2026) — ResumeCraft',
        url: canonicalUrl,
        description:
          'Explore 20 industry resume guides plus 10 free Zety/Resume.io/Canva alternatives, Harvard ATS templates & PDF-to-HTML converters—no signup or paywalls.',
        dateModified: TODAY,
        publisher: { '@id': `${BASE_URL}/#organization` },
      },
      {
        '@type': 'ItemList',
        itemListElement: allGuides.map((p, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: p.shortLabel ? p.title : `${p.roleName} Free Resume Builder & Website Guide`,
          url: `${BASE_URL}/${p.slug}.html`,
        })),
      },
    ],
  };

  const highIntentSection = `
      <section class="card">
        <h2>Free Alternatives, Harvard ATS Template &amp; PDF-to-Website Converters (No Paywall)</h2>
        <div class="truth-grid">
          ${HIGH_INTENT_PAGES.map(
            (p) => `
          <div class="truth-card">
            <span class="badge" style="margin-bottom:8px;">${esc(p.themeLabel)}</span>
            <h3><a href="/${esc(p.slug)}.html">${esc(p.shortLabel)}</a></h3>
            <p style="font-size:0.88rem;margin-bottom:12px;">${esc(p.description)}</p>
            <div class="cta-row">
              <a class="btn btn-primary" style="padding:7px 12px;font-size:0.78rem;" href="/${esc(p.slug)}.html">Compare &amp; Open &rarr;</a>
              <a class="btn btn-outline" style="padding:7px 12px;font-size:0.78rem;" href="/?preset=${esc(p.presetKey)}">Load Template</a>
            </div>
          </div>`,
          ).join('')}
        </div>
      </section>`;

  const clusterSections = clusters
    .map(
      (c) => `
      <section class="card">
        <h2>${esc(c.name)}</h2>
        <div class="truth-grid">
          ${c.items
            .map(
              (p) => `
          <div class="truth-card">
            <span class="badge" style="margin-bottom:8px;">${esc(p.themeLabel)}</span>
            <h3><a href="/${esc(p.slug)}.html">${esc(p.roleName)} Resume &amp; Website Guide</a></h3>
            <p style="font-size:0.88rem;margin-bottom:12px;">${esc(p.description)}</p>
            <div class="cta-row">
              <a class="btn btn-primary" style="padding:7px 12px;font-size:0.78rem;" href="/${esc(p.slug)}.html">Read Guide &amp; Edit &rarr;</a>
              <a class="btn btn-outline" style="padding:7px 12px;font-size:0.78rem;" href="/?preset=${esc(p.presetKey)}">Load Template</a>
            </div>
          </div>`,
            )
            .join('')}
        </div>
      </section>`,
    )
    .join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
${GTM_HEAD}
    <title>30 Free Resume Guides, Alternatives &amp; Website Converters (2026) — ResumeCraft</title>
    <meta
      name="description"
      content="Explore 20 industry resume guides plus 10 free Zety/Resume.io/Canva alternatives, Harvard ATS templates &amp; PDF-to-HTML converters—no signup or paywalls."
    />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${esc(canonicalUrl)}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="30 Free Resume Guides, Alternatives &amp; Website Converters (2026)" />
    <meta property="og:url" content="${esc(canonicalUrl)}" />
    <meta property="og:image" content="${BASE_URL}/og-image.png" />
    <script type="application/ld+json">
${safeJsonLd(jsonLd)}
    </script>
    <style>
${SHARED_CSS}
    </style>
  </head>
  <body>
${GTM_NOSCRIPT}
    <header class="site-header">
      <div class="nav-inner">
        <a class="brand" href="/">
          <span class="brand-dot">RC</span>
          <span>ResumeCraft</span>
        </a>
        <nav class="nav-links" aria-label="Navigation">
          <a href="/">Free Resume Builder</a>
          <a href="/deploy-guide.html">Free Hosting Guide</a>
          <a class="btn btn-primary" href="/">Open Full Studio &rarr;</a>
        </nav>
      </div>
    </header>

    <main class="container">
      <section class="hero-box">
        <span class="badge">2026 DIRECTORY &middot; 10 FREE ALTERNATIVES + 20 ROLE PLAYBOOKS</span>
        <h1>Free Resume Builder Alternatives, Harvard ATS &amp; 20 Industry Guides (2026)</h1>
        <p class="hero-desc">
          Compare zero-paywall resume builders, convert a LinkedIn or Canva PDF into an ATS resume and personal website, or pick your profession below to edit free in your browser.
        </p>
        <div class="cta-row">
          <a class="btn btn-primary" href="/">Start with Blank / Default Studio &rarr;</a>
          <a class="btn btn-outline" href="/deploy-guide.html">30s Free Hosting Guide</a>
        </div>
      </section>

${highIntentSection}

${clusterSections}
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <div>&copy; 2026 ResumeCraft &middot; Free Resume Builder &amp; One-Click Resume-to-Website Studio</div>
        <div class="footer-links">
          <a href="/">Home</a>
          <a href="/deploy-guide.html">Free Hosting Guide</a>
          <a href="/privacy.html">Privacy Policy</a>
          <a href="/terms.html">Terms of Service</a>
        </div>
      </div>
    </footer>
  </body>
</html>
`;
}

function renderSitemap() {
  const staticUrls = [
    { loc: `${BASE_URL}/`, changefreq: 'weekly', priority: '1.0' },
    { loc: `${BASE_URL}/resume-to-website-guides.html`, changefreq: 'weekly', priority: '0.9' },
    { loc: `${BASE_URL}/deploy-guide.html`, changefreq: 'monthly', priority: '0.9' },
    ...HIGH_INTENT_PAGES.map((p) => ({
      loc: `${BASE_URL}/${p.slug}.html`,
      changefreq: 'weekly',
      priority: '0.9',
    })),
    ...LANDING_PAGES.map((p) => ({
      loc: `${BASE_URL}/${p.slug}.html`,
      changefreq: 'monthly',
      priority: '0.8',
    })),
    { loc: `${BASE_URL}/llms.txt`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${BASE_URL}/privacy.html`, changefreq: 'yearly', priority: '0.5' },
    { loc: `${BASE_URL}/terms.html`, changefreq: 'yearly', priority: '0.5' },
  ];

  const entries = staticUrls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

function renderLlmsTxt() {
  const highIntentLines = HIGH_INTENT_PAGES.map(
    (p) => `- [${p.title}](${BASE_URL}/${p.slug}.html): ${p.description}`,
  ).join('\n');

  const guideLines = LANDING_PAGES.map(
    (p) =>
      `- [${p.roleName} Resume Builder & Website Guide (2026)](${BASE_URL}/${p.slug}.html): ${p.description}`,
  ).join('\n');

  return `# ResumeCraft (CV Pro Max)

> Free online resume builder, BYOK AI resume optimizer, and one-click resume-to-HTML personal website generator.

ResumeCraft (hosted exclusively at \`${BASE_URL}/\` — unrelated to third-party domains such as \`cvpromax.com\`) is a 100% free, privacy-first, open-source, browser-only web application for global job seekers, software engineers, designers, marketers, researchers, and students. Users can build ATS-friendly US Letter or A4 resumes with zero account signup or download paywalls, import existing PDF or Word (\`.docx\`) resumes locally, tailor bullet points to job descriptions using their own AI API key (OpenAI, DeepSeek, Google Gemini, OpenRouter, or local Ollama), and convert any resume into a standalone animated HTML personal website in one click.

## Core Tools & Guides

- [Free Resume Builder & One-Click Resume-to-Website Studio](${BASE_URL}/): Create ATS-ready resumes across 8 distinct templates, export vector PDFs with zero watermarks, and convert your resume to a responsive standalone HTML portfolio website.
- [2026 Resume Guides, Free Alternatives & Website Converters Directory](${BASE_URL}/resume-to-website-guides.html): Browse 10 zero-paywall comparisons/converters and 20 specialized role templates across tech, product, design, marketing, finance, academia, and remote roles.
- [How to Turn Your Resume into a Website & Host It Free in 30 Seconds](${BASE_URL}/deploy-guide.html): Step-by-step instructions to deploy your exported \`index.html\` or ZIP bundle for free on Netlify Drop, Cloudflare Pages, Vercel, or GitHub Pages.

## Free Alternatives, Harvard ATS Template & PDF-to-Website Converters

${highIntentLines}

## 2026 Industry Resume Builders & Resume-to-Website Guides

${guideLines}

## Key Capabilities

- **Free Resume Builder (No Sign Up, No Paywall)**: 8 Western ATS & modern templates (Executive Classic, Harvard ATS, Modern Minimal, Silicon Valley Tech, Editorial Serif, Swiss 2-Column Grid, Nordic Clean, Slate Dark Header), US Letter & A4 vector PDF export, zero signups, zero credit cards, zero watermarks.
- **Free Resume to HTML Converter**: Instantly converts PDF/DOCX/edited resume sections into a self-contained \`index.html\` webpage with dark/light mode, scroll animations, interactive project cards, and SEO Open Graph tags.
- **One-Click Personal Website Builder**: Download a ready-to-publish HTML file or ZIP package and launch a live HTTPS personal website in under 30 seconds.
- **BYOK AI Resume Tailoring**: Connect your own OpenAI, DeepSeek, Google Gemini, OpenRouter, or local Ollama API key (stored strictly in browser \`localStorage\`) to rewrite bullets with the Google XYZ impact formula and boost ATS & AI resume search match scores.

## Legal & Open Source

- [Privacy Policy](${BASE_URL}/privacy.html): Explains 100% client-side local storage and direct browser-to-provider BYOK AI requests.
- [Terms of Service](${BASE_URL}/terms.html): Free personal and commercial usage terms; users retain 100% ownership of resumes and exported HTML websites.
- [GitHub Repository](https://github.com/2313623432/Resume-Assistant-Even-a-Fool-Can-Use--): Open-source React + TypeScript + Vite source code (MIT License).
`;
}

for (const page of LANDING_PAGES) {
  fs.writeFileSync(path.join(PUBLIC_DIR, `${page.slug}.html`), renderRolePage(page), 'utf8');
}
for (const page of HIGH_INTENT_PAGES) {
  fs.writeFileSync(path.join(PUBLIC_DIR, `${page.slug}.html`), renderHighIntentPage(page), 'utf8');
}
fs.writeFileSync(path.join(PUBLIC_DIR, 'resume-to-website-guides.html'), renderHubPage(), 'utf8');
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), renderSitemap(), 'utf8');
fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), renderLlmsTxt(), 'utf8');

console.log(
  `Generated ${LANDING_PAGES.length} role pages, ${HIGH_INTENT_PAGES.length} blue-ocean pages, hub page, sitemap.xml (${3 + HIGH_INTENT_PAGES.length + LANDING_PAGES.length + 3} URLs), and llms.txt.`,
);

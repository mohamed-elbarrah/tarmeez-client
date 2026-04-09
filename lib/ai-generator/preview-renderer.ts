/**
 * @deprecated
 * This module generated a self-contained static HTML document for the preview
 * iframe.  It has been superseded by the `/merchant/preview-sandbox` Next.js
 * route, which renders the actual React section components (AIPageRenderer)
 * with real Tailwind CSS, Cairo font, and theme CSS variables — eliminating
 * the visual discrepancy between the preview and the live store.
 *
 * The file is kept to avoid breaking any remaining imports during the transition.
 * Remove it (and any remaining usages) once the migration is complete.
 */

// ─── Section renderers ────────────────────────────────────────

function escHtml(str: unknown): string {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderSection(section: Record<string, any>): string {
  const type = section.type as string;
  const headline = escHtml(section.headline);
  const subheadline = escHtml(section.subheadline);
  const description = escHtml(section.description);

  switch (type) {
    case "hero":
      return `
        <section class="section hero">
          ${section.badgeText ? `<span class="badge">${escHtml(section.badgeText)}</span>` : ""}
          <h1>${headline}</h1>
          ${subheadline ? `<p class="subheadline">${subheadline}</p>` : ""}
          ${section.ctaText ? `<a class="cta-btn">${escHtml(section.ctaText)}</a>` : ""}
        </section>`;

    case "problem":
      return `
        <section class="section">
          <h2>${headline}</h2>
          ${description ? `<p>${description}</p>` : ""}
          ${
            Array.isArray(section.painPoints)
              ? `<ul class="feature-list">${(section.painPoints as any[]).map((p: any) => `<li><span class="icon">${escHtml(p.icon ?? "•")}</span><div><strong>${escHtml(p.title)}</strong><p>${escHtml(p.description)}</p></div></li>`).join("")}</ul>`
              : ""
          }
        </section>`;

    case "solution":
      return `
        <section class="section alt">
          <h2>${headline}</h2>
          ${description ? `<p>${description}</p>` : ""}
          ${
            Array.isArray(section.points)
              ? `<ul class="feature-list">${(section.points as any[]).map((p: any) => `<li><span class="icon">${escHtml(p.icon ?? "✓")}</span><div><strong>${escHtml(p.title)}</strong><p>${escHtml(p.description)}</p></div></li>`).join("")}</ul>`
              : ""
          }
          ${section.ctaText ? `<a class="cta-btn secondary">${escHtml(section.ctaText)}</a>` : ""}
        </section>`;

    case "features":
      return `
        <section class="section">
          <h2>${headline}</h2>
          ${description ? `<p class="section-desc">${description}</p>` : ""}
          ${
            Array.isArray(section.features)
              ? `<div class="grid">${(section.features as any[]).map((f: any) => `<div class="card"><div class="icon-lg">${escHtml(f.icon ?? "⭐")}</div><strong>${escHtml(f.title)}</strong><p>${escHtml(f.description)}</p></div>`).join("")}</div>`
              : ""
          }
        </section>`;

    case "benefits":
      return `
        <section class="section alt">
          <h2>${headline}</h2>
          ${
            Array.isArray(section.benefits)
              ? `<div class="grid">${(section.benefits as any[]).map((b: any) => `<div class="card"><div class="icon-lg">${escHtml(b.icon ?? "✅")}</div><strong>${escHtml(b.title)}</strong><p>${escHtml(b.description)}</p></div>`).join("")}</div>`
              : ""
          }
        </section>`;

    case "testimonials":
      return `
        <section class="section">
          <h2>${headline}</h2>
          ${
            Array.isArray(section.testimonials)
              ? `<div class="grid">${(section.testimonials as any[]).map((t: any) => `<div class="card testimonial"><p class="quote">"${escHtml(t.quote)}"</p><strong>${escHtml(t.name)}</strong>${t.rating ? `<span class="stars">${"★".repeat(Number(t.rating))}</span>` : ""}</div>`).join("")}</div>`
              : ""
          }
        </section>`;

    case "offer":
      return `
        <section class="section offer">
          <h2>${headline}</h2>
          <div class="price-block">
            <span class="price">${escHtml(section.price)}</span>
            ${section.originalPrice ? `<span class="original-price">${escHtml(section.originalPrice)}</span>` : ""}
          </div>
          ${section.guarantee ? `<p class="guarantee">🛡 ${escHtml(section.guarantee)}</p>` : ""}
          ${section.urgencyText ? `<p class="urgency">⚡ ${escHtml(section.urgencyText)}</p>` : ""}
          ${section.ctaText ? `<a class="cta-btn">${escHtml(section.ctaText)}</a>` : ""}
        </section>`;

    case "faq":
      return `
        <section class="section">
          <h2>${headline}</h2>
          ${
            Array.isArray(section.questions)
              ? `<div class="faq-list">${(section.questions as any[]).map((q: any) => `<details class="faq-item"><summary>${escHtml(q.question)}</summary><p>${escHtml(q.answer)}</p></details>`).join("")}</div>`
              : ""
          }
        </section>`;

    case "finalCta":
      return `
        <section class="section hero final-cta">
          <h2>${headline}</h2>
          ${subheadline ? `<p>${subheadline}</p>` : ""}
          ${section.ctaText ? `<a class="cta-btn">${escHtml(section.ctaText)}</a>` : ""}
        </section>`;

    case "trust":
      return `
        <section class="section alt">
          <h2>${headline}</h2>
          ${
            Array.isArray(section.stats)
              ? `<div class="stats">${(section.stats as any[]).map((s: any) => `<div class="stat"><strong>${escHtml(s.value)}</strong><span>${escHtml(s.label)}</span></div>`).join("")}</div>`
              : ""
          }
        </section>`;

    default:
      return `
        <section class="section">
          <h2>${headline || escHtml(type)}</h2>
          ${description ? `<p>${description}</p>` : ""}
        </section>`;
  }
}

// ─── Styles ───────────────────────────────────────────────────

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: #f8f9fa;
    color: #1a1a2e;
    direction: rtl;
    font-size: 16px;
    line-height: 1.6;
  }
  .section {
    padding: 56px 32px;
    max-width: 900px;
    margin: 0 auto;
    border-bottom: 1px solid #e9ecef;
  }
  .section.alt { background: #fff; max-width: 100%; padding: 56px calc(50% - 450px + 32px); }
  .section.hero {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #fff;
    text-align: center;
    max-width: 100%;
    padding: 80px 32px;
    border-bottom: none;
  }
  .section.offer {
    background: #fff8e1;
    text-align: center;
    max-width: 100%;
    padding: 64px 32px;
  }
  .section.final-cta {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  h1 { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; margin-bottom: 16px; }
  h2 { font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 700; margin-bottom: 24px; color: #1a1a2e; }
  .hero h2 { color: #fff; }
  .final-cta h2 { color: #fff; }
  .subheadline { font-size: 1.1rem; opacity: 0.85; max-width: 560px; margin: 0 auto 28px; }
  .section-desc { color: #666; max-width: 600px; margin: -12px auto 28px; text-align: center; }
  .badge {
    display: inline-block; background: rgba(255,255,255,0.2);
    color: #fff; padding: 4px 14px; border-radius: 20px;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em;
    margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.3);
  }
  .cta-btn {
    display: inline-block; background: #6366f1; color: #fff;
    padding: 14px 36px; border-radius: 8px; font-weight: 700;
    font-size: 1rem; margin-top: 24px; cursor: pointer;
    transition: background 0.2s; text-decoration: none;
    border: none; letter-spacing: 0.02em;
  }
  .cta-btn:hover { background: #4f46e5; }
  .cta-btn.secondary { background: transparent; border: 2px solid #6366f1; color: #6366f1; }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 12px;
  }
  .card {
    background: #fff;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    padding: 20px;
    transition: box-shadow 0.2s;
  }
  .section.alt .card { background: #f8f9fa; }
  .card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .icon-lg { font-size: 2rem; margin-bottom: 10px; }
  .card strong { display: block; font-size: 0.95rem; margin-bottom: 6px; color: #1a1a2e; }
  .card p { font-size: 0.85rem; color: #666; line-height: 1.5; }
  .feature-list { list-style: none; display: flex; flex-direction: column; gap: 16px; margin-top: 12px; }
  .feature-list li { display: flex; gap: 14px; align-items: flex-start; }
  .feature-list .icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 2px; }
  .feature-list strong { display: block; margin-bottom: 4px; }
  .feature-list p { font-size: 0.875rem; color: #555; margin: 0; }
  .testimonial { position: relative; }
  .quote { font-style: italic; color: #444; margin-bottom: 12px; font-size: 0.9rem; line-height: 1.6; }
  .stars { color: #f59e0b; font-size: 0.85rem; display: block; margin-top: 4px; }
  .price-block { margin: 20px 0; }
  .price { font-size: 2.5rem; font-weight: 800; color: #1a1a2e; }
  .original-price { font-size: 1.2rem; text-decoration: line-through; color: #999; margin-right: 12px; }
  .guarantee { color: #16a34a; font-weight: 600; margin-bottom: 8px; }
  .urgency { color: #dc2626; font-weight: 600; margin-bottom: 12px; }
  .stats { display: flex; justify-content: center; gap: 48px; flex-wrap: wrap; }
  .stat { text-align: center; }
  .stat strong { display: block; font-size: 2rem; font-weight: 800; color: #6366f1; }
  .stat span { font-size: 0.875rem; color: #666; }
  .faq-list { display: flex; flex-direction: column; gap: 12px; max-width: 700px; margin: 0 auto; }
  .faq-item {
    border: 1px solid #e9ecef; border-radius: 8px;
    overflow: hidden; background: #fff;
  }
  .faq-item summary {
    padding: 16px 20px; cursor: pointer; font-weight: 600;
    font-size: 0.95rem; user-select: none;
  }
  .faq-item summary:hover { background: #f8f9fa; }
  .faq-item p { padding: 0 20px 16px; color: #555; font-size: 0.9rem; line-height: 1.6; }
  .empty-state {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; height: 100vh;
    color: #999; gap: 16px; text-align: center; padding: 20px;
  }
  .empty-state svg { opacity: 0.3; }
  .empty-state h3 { font-size: 1.2rem; color: #ccc; font-weight: 600; }
  .empty-state p { font-size: 0.875rem; max-width: 280px; }
`;

// ─── Empty state HTML ─────────────────────────────────────────

const EMPTY_HTML = `<!DOCTYPE html>
<html dir="rtl">
<head><meta charset="utf-8"><style>${CSS}</style></head>
<body>
  <div class="empty-state">
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M9.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9.5L14.5 3H9.5z"/>
      <polyline points="14 3 14 9 20 9"/>
      <line x1="8" y1="13" x2="16" y2="13"/>
      <line x1="8" y1="17" x2="12" y2="17"/>
    </svg>
    <h3>المعاينة ستظهر هنا</h3>
    <p>أنشئ صفحة الهبوط وستظهر في هذه المنطقة فوراً</p>
  </div>
</body>
</html>`;

// ─── Main generator ───────────────────────────────────────────

export function generatePreviewHtml(
  content: Record<string, any> | null,
): string {
  if (!content) return EMPTY_HTML;

  const sections: Record<string, any>[] = Array.isArray(content.sections)
    ? content.sections
    : Object.values(content).filter(
        (v): v is Record<string, any> =>
          typeof v === "object" && v !== null && "type" in (v as any),
      );

  if (sections.length === 0) return EMPTY_HTML;

  const sectionsHtml = sections.map(renderSection).join("\n");

  // The postMessage listener allows the parent to push updates without reload
  const script = `
    (function() {
      window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'UPDATE_CONTENT') {
          try {
            var content = event.data.content;
            var sections = Array.isArray(content.sections) ? content.sections : [];
            document.getElementById('preview-root').innerHTML = sections.length === 0 ? '<div class="empty-state"><h3>لا يوجد محتوى</h3></div>' : '';
            // For simplicity, signal parent to regenerate srcDoc
            window.parent.postMessage({ type: 'CONTENT_RECEIVED' }, '*');
          } catch(e) {}
        }
      });
    })();
  `;

  return `<!DOCTYPE html>
<html dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>معاينة الصفحة</title>
  <style>${CSS}</style>
</head>
<body>
  <div id="preview-root">
${sectionsHtml}
  </div>
  <script>${script}</script>
</body>
</html>`;
}

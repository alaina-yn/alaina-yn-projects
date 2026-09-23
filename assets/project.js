const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const params = new URLSearchParams(window.location.search);
const projectId = params.get('id');
const target = document.querySelector('[data-project-detail]');

const list = (items = []) => `<ul class="detail-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
const tags = (items = []) => `<div class="tags">${items.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join('')}</div>`;

fetch('data/projects.json')
  .then((response) => {
    if (!response.ok) throw new Error('Unable to load project data.');
    return response.json();
  })
  .then((projects) => {
    const project = projects.find((item) => item.id === projectId) || projects[0];
    if (!project) throw new Error('No project data is available.');
    document.title = `${project.shortTitle} — alaina-yn`;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = `https://alaina-yn-projects.pages.dev/project.html?id=${encodeURIComponent(project.id)}`;

    const liveButton = project.actions?.live ? `<a class="button primary" href="${escapeHtml(project.actions.live)}">Launch live app <span aria-hidden="true">↗</span></a>` : '';
    const repoButton = project.actions?.repo ? `<a class="button ${project.actions?.live ? 'ghost' : 'primary'}" href="${escapeHtml(project.actions.repo)}">View repository <span aria-hidden="true">↗</span></a>` : '';

    target.innerHTML = `
      <div class="detail-breadcrumb"><a href="./">Project workspace</a><span aria-hidden="true">/</span><span>${escapeHtml(project.shortTitle)}</span></div>
      <header class="detail-header">
        <div>
          <p class="eyebrow">${escapeHtml(project.type)} · ${escapeHtml(project.status)}</p>
          <h1>${escapeHtml(project.title)}</h1>
          <p class="summary">${escapeHtml(project.summary)}</p>
          ${tags(project.domains)}
          <div class="hero-actions">${liveButton}${repoButton}</div>
        </div>
        <div class="detail-meta">
          <div class="meta-row"><span>Frameworks</span><strong>${escapeHtml(project.frameworks.join(' · '))}</strong></div>
          <div class="meta-row"><span>Primary outcome</span><strong>Decision traceability</strong></div>
          <div class="meta-row"><span>Review path</span><strong>Problem → Evidence → Decision</strong></div>
        </div>
      </header>
      <div class="detail-grid">
        <nav class="detail-nav" aria-label="Case study sections">
          <a href="#problem">Problem</a><a href="#assessment">Assessment</a><a href="#evidence">Evidence</a><a href="#findings">Findings</a><a href="#remediation">Remediation</a><a href="#decision">Decision</a>
        </nav>
        <div class="detail-content">
          <section class="detail-section" id="problem"><p class="eyebrow">01 · Problem</p><h2>What needs to be made governable?</h2><p>${escapeHtml(project.problem)}</p></section>
          <section class="detail-section" id="assessment"><p class="eyebrow">02 · Assessment</p><h2>How the review is structured.</h2>${list(project.assessment)}</section>
          <section class="detail-section" id="evidence"><p class="eyebrow">03 · Evidence</p><h2>What a reviewer should inspect.</h2>${list(project.evidence)}</section>
          <section class="detail-section" id="findings"><p class="eyebrow">04 · Findings</p><h2>What the workflow is designed to surface.</h2>${list(project.findings)}</section>
          <section class="detail-section" id="remediation"><p class="eyebrow">05 · Remediation</p><h2>How gaps move toward closure.</h2>${list(project.remediation)}</section>
          <section class="detail-section" id="decision"><p class="eyebrow">06 · Executive decision</p><div class="decision-panel"><strong>Management conclusion</strong><p>${escapeHtml(project.decision)}</p></div></section>
          <section class="detail-section"><p class="eyebrow">Implementation building blocks</p><h2>Reusable, not framework-locked.</h2>${tags(project.tools)}</section>
        </div>
      </div>`;
  })
  .catch((error) => {
    target.innerHTML = `<div class="empty-state">${escapeHtml(error.message)} <a href="./">Return to the project workspace.</a></div>`;
  });

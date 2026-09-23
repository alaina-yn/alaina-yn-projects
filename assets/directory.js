const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

let projects = [];
let activeFilter = 'All';

function pickPrimaryAction(project) {
  if (project.actions?.live) return { label: 'Launch live app', href: project.actions.live };
  if (project.actions?.caseStudy) return { label: 'Read case study', href: project.actions.caseStudy };
  if (project.actions?.artifact) return { label: 'Open artifact', href: project.actions.artifact };
  if (project.actions?.repo) return { label: 'View repository', href: project.actions.repo };
  return null;
}

function render() {
  const grid = document.querySelector('[data-project-grid]');
  const count = document.querySelector('[data-project-count]');
  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter((p) => p.type === activeFilter || p.domains.includes(activeFilter));

  if (count) count.textContent = `${filtered.length} of ${projects.length} systems`;
  if (!grid) return;
  if (!filtered.length) {
    grid.innerHTML = '<div class="empty-state">No projects match this filter.</div>';
    return;
  }

  grid.innerHTML = filtered.map((project, index) => {
    const primary = pickPrimaryAction(project);
    const tags = project.domains.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
    const primaryButton = primary ? `<a class="button primary" href="${escapeHtml(primary.href)}">${escapeHtml(primary.label)} <span aria-hidden="true">↗</span></a>` : '';
    const repoButton = project.actions?.repo && primary?.href !== project.actions.repo
      ? `<a class="button ghost" href="${escapeHtml(project.actions.repo)}">Repository <span aria-hidden="true">↗</span></a>`
      : '';
    return `
      <article class="project-card ${index === 0 && activeFilter === 'All' ? 'featured' : ''}">
        <span class="card-kicker">${escapeHtml(project.type)} · ${escapeHtml(project.status)}</span>
        <h3>${escapeHtml(project.shortTitle)}</h3>
        <p>${escapeHtml(project.outcome)}</p>
        <div class="tags">${tags}</div>
        <div class="card-actions">${primaryButton}${repoButton}</div>
      </article>`;
  }).join('');
}

fetch('data/projects.json')
  .then((response) => {
    if (!response.ok) throw new Error('Unable to load project data.');
    return response.json();
  })
  .then((data) => {
    projects = data;
    const values = new Set(['All']);
    data.forEach((p) => p.domains.forEach((d) => values.add(d)));
    const filters = document.querySelector('[data-filters]');
    if (filters) {
      filters.innerHTML = [...values].map((filter) => `<button type="button" class="filter-button" aria-pressed="${filter === 'All'}" data-filter="${escapeHtml(filter)}">${escapeHtml(filter)}</button>`).join('');
      filters.addEventListener('click', (event) => {
        const button = event.target.closest('[data-filter]');
        if (!button) return;
        activeFilter = button.dataset.filter;
        filters.querySelectorAll('[data-filter]').forEach((el) => el.setAttribute('aria-pressed', String(el === button)));
        render();
      });
    }
    render();
  })
  .catch((error) => {
    const grid = document.querySelector('[data-project-grid]');
    if (grid) grid.innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;
  });

(() => {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (preferredDark ? 'dark' : 'light');
  root.dataset.theme = initial;

  const button = document.querySelector('[data-theme-toggle]');
  const syncLabel = () => {
    if (!button) return;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    button.setAttribute('aria-label', `Switch to ${next} theme`);
    button.textContent = root.dataset.theme === 'dark' ? 'Light' : 'Dark';
  };
  syncLabel();

  button?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', root.dataset.theme);
    syncLabel();
  });

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();

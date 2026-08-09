
(() => {
  const root = document.documentElement;
  const saved = localStorage.getItem('soselab-theme');
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.dataset.theme = saved || preferred;
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const icons = { dark: '<svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></svg>', light: '<svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>' };
  function paintTheme() { if (themeBtn) { themeBtn.innerHTML = icons[root.dataset.theme]; const en = root.lang === 'en'; themeBtn.setAttribute('aria-label', root.dataset.theme === 'dark' ? (en ? 'Use light mode' : '切換為淺色模式') : (en ? 'Use dark mode' : '切換為深色模式')); } }
  paintTheme();
  themeBtn?.addEventListener('click', () => { root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('soselab-theme', root.dataset.theme); paintTheme(); });
  const menuBtn = document.querySelector('[data-menu-toggle]'), mobileNav = document.querySelector('[data-mobile-nav]');
  menuBtn?.addEventListener('click', () => { mobileNav?.classList.toggle('open'); const en = root.lang === 'en'; menuBtn.setAttribute('aria-expanded', mobileNav?.classList.contains('open') ? 'true' : 'false'); menuBtn.setAttribute('aria-label', mobileNav?.classList.contains('open') ? (en ? 'Close menu' : '關閉選單') : (en ? 'Open menu' : '開啟選單')); }); mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));
  const q = document.querySelector('[data-search]'), filter = document.querySelector('[data-filter]'), items = [...document.querySelectorAll('[data-search-item]')], empty = document.querySelector('[data-empty]');
  function runFilter() { const term = (q?.value || '').trim().toLowerCase(), cat = filter?.value || 'all'; let shown = 0; items.forEach(el => { const hit = el.textContent.toLowerCase().includes(term) && (cat === 'all' || el.dataset.category === cat); el.style.display = hit ? '' : 'none'; if (hit) shown++ }); if (empty) empty.style.display = shown ? 'none' : 'block'; }
  q?.addEventListener('input', runFilter); filter?.addEventListener('change', runFilter);
  const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }), { threshold: .08 }); document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


// Stable chronological sorting. The visible record number never changes because
// it is assigned permanently from oldest to newest in the HTML.
document.querySelectorAll('[data-sort-control]').forEach((control) => {
  const targetSelector = control.dataset.sortTarget;
  const target = targetSelector ? document.querySelector(targetSelector) : null;
  if (!target) return;
  const sortItems = () => {
    const direction = control.value === 'desc' ? -1 : 1;
    const items = Array.from(target.querySelectorAll(':scope > [data-sort-item]'));
    items.sort((a, b) => {
      const aOrder = Number(a.dataset.order || 0);
      const bOrder = Number(b.dataset.order || 0);
      const primary = (aOrder - bOrder) * direction;
      if (primary !== 0) return primary;
      return Number(a.dataset.permanentNumber || 0) - Number(b.dataset.permanentNumber || 0);
    });
    items.forEach((item) => target.appendChild(item));
  };
  control.addEventListener('change', sortItems);
  sortItems();
});

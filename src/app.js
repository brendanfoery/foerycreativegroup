import { render as renderOverview }  from './pages/overview.js';
import { render as renderRevenue }   from './pages/revenue.js';
import { render as renderExpenses }  from './pages/expenses.js';
import { render as renderArtists }   from './pages/artists.js';

const PAGES = {
  overview: { render: renderOverview,  title: 'Overview',    subtitle: 'Fiscal Year 2025 · All figures in USD' },
  revenue:  { render: renderRevenue,   title: 'Revenue',     subtitle: 'All revenue streams · FY 2025' },
  expenses: { render: renderExpenses,  title: 'Expenses',    subtitle: 'All expenditure · FY 2025' },
  artists:  { render: renderArtists,   title: 'Artist P&L',  subtitle: 'Profit & loss by artist · FY 2025' },
};

function navigate(hash) {
  const id = (hash || '').replace('#', '') || 'overview';
  const page = PAGES[id] || PAGES.overview;
  const key  = PAGES[id] ? id : 'overview';

  document.querySelectorAll('[data-page]').forEach(link => {
    const active = link.dataset.page === key;
    link.classList.toggle('active',   active);
    link.classList.toggle('text-white', active);
    link.classList.toggle('text-gray-400', !active);
  });

  document.getElementById('page-title').textContent    = page.title;
  document.getElementById('page-subtitle').textContent = page.subtitle;
  page.render(document.getElementById('content'));
}

window.addEventListener('hashchange', () => navigate(window.location.hash));
navigate(window.location.hash);

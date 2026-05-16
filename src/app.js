import { render as renderOverview }       from './pages/overview.js';
import { render as renderRevenue }        from './pages/revenue.js';
import { render as renderExpenses }       from './pages/expenses.js';
import { render as renderSubscriptions }  from './pages/subscriptions.js';

const PAGES = {
  overview:      { render: renderOverview,       title: 'Overview',       subtitle: 'FCG Accounting 2026 · Jan – May · All figures in USD' },
  revenue:       { render: renderRevenue,        title: 'Revenue',        subtitle: 'Income received · Jan – May 2026' },
  expenses:      { render: renderExpenses,       title: 'Expenses',       subtitle: 'All expenditure · Jan – May 2026' },
  subscriptions: { render: renderSubscriptions,  title: 'Subscriptions',  subtitle: 'Active recurring costs & one-time purchases' },
};

function navigate(hash) {
  const id   = (hash || '').replace('#', '') || 'overview';
  const key  = PAGES[id] ? id : 'overview';
  const page = PAGES[key];

  document.querySelectorAll('[data-page]').forEach(link => {
    const active = link.dataset.page === key;
    link.classList.toggle('active',       active);
    link.classList.toggle('text-white',   active);
    link.classList.toggle('text-gray-400', !active);
  });

  document.getElementById('page-title').textContent    = page.title;
  document.getElementById('page-subtitle').textContent = page.subtitle;
  page.render(document.getElementById('content'));
}

window.addEventListener('hashchange', () => navigate(window.location.hash));
navigate(window.location.hash);

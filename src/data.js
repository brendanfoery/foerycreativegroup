// ================================================================
// FCG Accounting 2026 — First Fruits Records
//
// TO ADD A NEW MONTH:
//   1. Copy any month block below and paste it at the bottom.
//   2. Update the date, vendor, amount.
//   3. Keep type as: 'monthly' | 'annual' | 'one-time' | 'income'
//   4. Pick a category from the CATEGORIES list below.
// ================================================================

export const CATEGORY_COLORS = {
  'Creative Tools':  '#f59e0b',
  'Distribution':    '#3b82f6',
  'Web & Hosting':   '#10b981',
  'Business Tools':  '#8b5cf6',
  'Equipment':       '#ef4444',
  'Music Services':  '#f97316',
  'E-Commerce':      '#06b6d4',
  'Memberships':     '#84cc16',
  'Client Work':     '#22c55e',
};

export const transactions = [

  // ── JANUARY 2026 ───────────────────────────────────────────
  { date:'2026-01-02', vendor:'Xero',             category:'Business Tools', type:'one-time',  amount:   1.25, note:'Trial for accounting software' },
  { date:'2026-01-03', vendor:'DistroKid Extras', category:'Distribution',   type:'monthly',   amount:   4.95 },
  { date:'2026-01-03', vendor:'Adobe',            category:'Creative Tools', type:'monthly',   amount:  12.83 },
  { date:'2026-01-07', vendor:'Walgreens',         category:'Equipment',      type:'one-time',  amount: 200.00, note:'Cash for camera' },
  { date:'2026-01-07', vendor:'Sony 35mm Lens',   category:'Equipment',      type:'one-time',  amount: 475.00 },
  { date:'2026-01-09', vendor:'Amazon',           category:'Equipment',      type:'one-time',  amount:  28.15 },
  { date:'2026-01-09', vendor:'Output',           category:'Creative Tools', type:'monthly',   amount:  12.99 },
  { date:'2026-01-10', vendor:'DistroKid Extras', category:'Distribution',   type:'annual',    amount:   0.99 },
  { date:'2026-01-15', vendor:'DistroKid',        category:'Distribution',   type:'annual',    amount: 157.99 },
  { date:'2026-01-16', vendor:'Atansio Music',    category:'Creative Tools', type:'monthly',   amount:   6.99 },
  { date:'2026-01-16', vendor:'Splice',           category:'Creative Tools', type:'monthly',   amount:  12.99 },
  { date:'2026-01-17', vendor:'DistroKid Extras', category:'Distribution',   type:'monthly',   amount:  12.99 },
  { date:'2026-01-18', vendor:'DistroKid Extras', category:'Distribution',   type:'annual',    amount:   0.99 },
  { date:'2026-01-23', vendor:'DistroKid Extras', category:'Distribution',   type:'monthly',   amount:   5.94 },
  { date:'2026-01-30', vendor:'Spotify',          category:'Music Services', type:'monthly',   amount:  12.99 },

  // ── FEBRUARY 2026 ──────────────────────────────────────────
  { date:'2026-02-02', vendor:'Bandzoogle',       category:'Web & Hosting',  type:'annual',    amount: 169.57, note:'BF Website Hosting + Domain' },
  { date:'2026-02-02', vendor:'Xero',             category:'Business Tools', type:'monthly',   amount:   0.49 },
  { date:'2026-02-03', vendor:'Adobe',            category:'Creative Tools', type:'monthly',   amount:  12.83 },
  { date:'2026-02-09', vendor:'Output',           category:'Creative Tools', type:'monthly',   amount:  12.99 },
  { date:'2026-02-13', vendor:'Navarr Enterprises',category:'Client Work',   type:'income',    amount: 171.94 },
  { date:'2026-02-15', vendor:'Sqsp Domain',      category:'Web & Hosting',  type:'annual',    amount:  20.00, note:'FFR Domain' },
  { date:'2026-02-16', vendor:'DistroKid Extras', category:'Distribution',   type:'monthly',   amount:   0.99 },
  { date:'2026-02-16', vendor:'Splice',           category:'Creative Tools', type:'monthly',   amount:  12.99 },
  { date:'2026-02-24', vendor:'DistroKid Extras', category:'Distribution',   type:'monthly',   amount:   5.94 },
  { date:'2026-02-28', vendor:'Spotify',          category:'Music Services', type:'monthly',   amount:  12.99 },

  // ── MARCH 2026 ─────────────────────────────────────────────
  { date:'2026-03-03', vendor:'Adobe',            category:'Creative Tools', type:'monthly',   amount:  12.83 },
  { date:'2026-03-09', vendor:'Output',           category:'Creative Tools', type:'monthly',   amount:  12.99 },
  { date:'2026-03-16', vendor:'Splice',           category:'Creative Tools', type:'monthly',   amount:  12.99 },
  { date:'2026-03-19', vendor:'DistroKid Extras', category:'Distribution',   type:'annual',    amount:   0.99 },
  { date:'2026-03-20', vendor:'DistroKid Extras', category:'Distribution',   type:'annual',    amount:   0.99 },
  { date:'2026-03-23', vendor:'DistroKid Extras', category:'Distribution',   type:'annual',    amount:   0.99 },
  { date:'2026-03-25', vendor:'DistroKid Extras', category:'Distribution',   type:'monthly',   amount:  12.99 },
  { date:'2026-03-27', vendor:'DistroKid Extras', category:'Distribution',   type:'annual',    amount:   0.99 },
  { date:'2026-03-27', vendor:'DistroKid Extras', category:'Distribution',   type:'monthly',   amount:   5.94 },
  { date:'2026-03-30', vendor:'Spotify',          category:'Music Services', type:'monthly',   amount:  12.99 },

  // ── APRIL 2026 ─────────────────────────────────────────────
  { date:'2026-04-03', vendor:'Adobe',            category:'Creative Tools', type:'monthly',   amount:  12.83 },
  { date:'2026-04-04', vendor:'FastSpring',       category:'Business Tools', type:'annual',    amount:  99.00 },
  { date:'2026-04-09', vendor:'Output',           category:'Creative Tools', type:'monthly',   amount:  12.99 },
  { date:'2026-04-16', vendor:'DistroKid Extras', category:'Distribution',   type:'monthly',   amount:  12.00 },
  { date:'2026-04-16', vendor:'Splice',           category:'Creative Tools', type:'monthly',   amount:  12.99 },
  { date:'2026-04-22', vendor:'DistroKid Extras', category:'Distribution',   type:'annual',    amount:   0.99 },
  { date:'2026-04-24', vendor:'DistroKid Extras', category:'Distribution',   type:'monthly',   amount:   5.94 },
  { date:'2026-04-25', vendor:'Big Cartel',       category:'E-Commerce',     type:'annual',    amount: 144.00, note:'FFR Merch Hosting' },
  { date:'2026-04-25', vendor:'Claude',           category:'Business Tools', type:'monthly',   amount:  21.66 },
  { date:'2026-04-30', vendor:'Spotify',          category:'Music Services', type:'monthly',   amount:  12.99 },

  // ── MAY 2026 ───────────────────────────────────────────────
  { date:'2026-05-03', vendor:'Adobe',            category:'Creative Tools', type:'monthly',   amount:  12.83 },
  { date:'2026-05-03', vendor:'Netlify',          category:'Web & Hosting',  type:'monthly',   amount:   9.68 },
  { date:'2026-05-05', vendor:'MusiCares',        category:'Memberships',    type:'annual',    amount: 150.00, note:'Recording Academy Membership' },
  { date:'2026-05-06', vendor:'DistroKid Extras', category:'Distribution',   type:'annual',    amount:   0.99 },
  { date:'2026-05-09', vendor:'Bandzoogle',       category:'Web & Hosting',  type:'annual',    amount:  14.95, note:'Lanier domain' },
  { date:'2026-05-09', vendor:'Bandzoogle',       category:'Web & Hosting',  type:'monthly',   amount:   7.53, note:'Lanier EPK Site' },
  { date:'2026-05-09', vendor:'Output',           category:'Creative Tools', type:'monthly',   amount:  12.99 },
  { date:'2026-05-10', vendor:'Replit',           category:'Business Tools', type:'monthly',   amount:  21.66 },
  { date:'2026-05-13', vendor:'DistroKid',        category:'Distribution',   type:'income',    amount: 109.38 },

];

// ── Derived totals (auto-calculated — do not edit) ──────────

const _exp = transactions.filter(t => t.type !== 'income');
const _inc = transactions.filter(t => t.type === 'income');

export const totalExpenses = _exp.reduce((s,t) => s+t.amount, 0);
export const totalIncome   = _inc.reduce((s,t) => s+t.amount, 0);
export const netProfit     = totalIncome - totalExpenses;

// Returns array of { label, monthly, annual, oneTime, income, total } per month
export function getMonthlyBreakdown() {
  const keys = ['2026-01','2026-02','2026-03','2026-04','2026-05'];
  const labels = ['Jan','Feb','Mar','Apr','May'];
  return keys.map((ym, i) => {
    const tx = transactions.filter(t => t.date.startsWith(ym));
    const sum = type => tx.filter(t=>t.type===type).reduce((s,t)=>s+t.amount,0);
    const monthly = sum('monthly');
    const annual  = sum('annual');
    const oneTime = sum('one-time');
    const income  = sum('income');
    return { label: labels[i], monthly, annual, oneTime, income, total: monthly+annual+oneTime };
  });
}

// Returns sorted array of [category, total]
export function getCategoryTotals() {
  const map = {};
  _exp.forEach(t => { map[t.category] = (map[t.category]||0) + t.amount; });
  return Object.entries(map).sort((a,b) => b[1]-a[1]);
}

// Returns sorted array of { vendor, category, total, types[] }
export function getVendorTotals() {
  const map = {};
  _exp.forEach(t => {
    if (!map[t.vendor]) map[t.vendor] = { vendor:t.vendor, category:t.category, total:0, types:new Set() };
    map[t.vendor].total += t.amount;
    map[t.vendor].types.add(t.type);
  });
  return Object.values(map)
    .map(v => ({ ...v, types:[...v.types] }))
    .sort((a,b) => b.total-a.total);
}

// Income transactions only
export function getIncome() {
  return _inc.slice().sort((a,b) => b.date.localeCompare(a.date));
}

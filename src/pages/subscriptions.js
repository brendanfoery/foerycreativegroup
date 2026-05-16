import { transactions, CATEGORY_COLORS } from '../data.js';

const fmt = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2}).format(n);

const TYPE_STYLE = {
  'monthly':  { badge:'bg-amber-100 text-amber-700',  bar:'#f59e0b' },
  'annual':   { badge:'bg-blue-100 text-blue-700',    bar:'#3b82f6' },
  'one-time': { badge:'bg-red-100 text-red-700',      bar:'#ef4444' },
};

let _charts = [];

export function render(el) {
  _kill();

  const expenses = transactions.filter(t => t.type !== 'income');

  // Active monthly subscriptions = vendors with type:'monthly' in the most recent month (May)
  const mayMonthly = transactions.filter(t => t.date.startsWith('2026-05') && t.type === 'monthly');

  // Vendors seen in April but NOT May (possibly still active)
  const mayVendors = new Set(mayMonthly.map(t=>t.vendor));
  const aprMonthly = transactions.filter(t => t.date.startsWith('2026-04') && t.type === 'monthly');
  const staleSubs  = aprMonthly.filter(t => !mayVendors.has(t.vendor));

  // All annual charges (unique per vendor, most recent)
  const annualMap = {};
  expenses.filter(t=>t.type==='annual').forEach(t=>{
    if (!annualMap[t.vendor]||t.date>annualMap[t.vendor].date) annualMap[t.vendor]=t;
  });
  const annuals = Object.values(annualMap).sort((a,b)=>b.amount-a.amount);

  // One-time purchases
  const oneOffs = expenses.filter(t=>t.type==='one-time').sort((a,b)=>b.amount-a.amount);

  const monthlyBurn  = mayMonthly.reduce((s,t)=>s+t.amount,0);
  const annualCommit = annuals.reduce((s,t)=>s+t.amount,0);
  const totalOneTime = oneOffs.reduce((s,t)=>s+t.amount,0);

  el.innerHTML = `
    <!-- Summary cards -->
    <div class="grid grid-cols-3 gap-5 mb-7">
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Est. Monthly Burn</div>
        <div class="text-2xl font-bold text-amber-600">${fmt(monthlyBurn)}</div>
        <div class="text-xs text-gray-400 mt-2">Based on ${mayMonthly.length} active subscriptions in May</div>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Annual Commitments</div>
        <div class="text-2xl font-bold text-blue-600">${fmt(annualCommit)}</div>
        <div class="text-xs text-gray-400 mt-2">${annuals.length} annual charges recorded YTD</div>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">One-Time Purchases</div>
        <div class="text-2xl font-bold text-red-500">${fmt(totalOneTime)}</div>
        <div class="text-xs text-gray-400 mt-2">${oneOffs.length} one-off purchases YTD</div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-5 mb-7">

      <!-- Active monthly subs -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-semibold text-gray-700">Active Monthly Subscriptions</h3>
            <p class="text-xs text-gray-400 mt-0.5">Confirmed in May 2026</p>
          </div>
          <span class="text-sm font-bold text-amber-600">${fmt(monthlyBurn)}/mo</span>
        </div>
        <div class="divide-y divide-gray-50">
          ${mayMonthly.sort((a,b)=>b.amount-a.amount).map(t=>{
            const barW = Math.max(4,(t.amount/monthlyBurn*100)).toFixed(0);
            return `<div class="px-6 py-3.5">
              <div class="flex items-center justify-between mb-1.5">
                <div>
                  <span class="text-sm font-medium text-gray-800">${t.vendor}</span>
                  <span class="ml-2 text-xs text-gray-400">${t.category}</span>
                  ${t.note?`<span class="ml-1 text-xs text-gray-300">· ${t.note}</span>`:''}
                </div>
                <span class="text-sm font-semibold text-gray-900">${fmt(t.amount)}</span>
              </div>
              <div class="bg-gray-100 rounded-full h-1">
                <div class="bg-amber-400 h-1 rounded-full" style="width:${barW}%"></div>
              </div>
            </div>`;
          }).join('')}
        </div>
        <div class="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
          Monthly total: <strong>${fmt(monthlyBurn)}</strong> · Annualized: <strong>${fmt(monthlyBurn*12)}</strong>
        </div>
      </div>

      <!-- Possibly still active (last seen April) -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700">Possibly Still Active</h3>
          <p class="text-xs text-gray-400 mt-0.5">Monthly charges last seen in April — verify if still running</p>
        </div>
        ${staleSubs.length===0
          ? `<div class="px-6 py-8 text-center text-sm text-gray-400">All April subscriptions are accounted for in May.</div>`
          : `<div class="divide-y divide-gray-50">
              ${staleSubs.map(t=>`
                <div class="px-6 py-3.5 flex items-center justify-between">
                  <div>
                    <span class="text-sm font-medium text-gray-700">${t.vendor}</span>
                    <span class="ml-2 text-xs text-gray-400">${t.category}</span>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-semibold text-gray-500">${fmt(t.amount)}/mo</div>
                    <div class="text-xs text-orange-400 mt-0.5">Last seen Apr 2026</div>
                  </div>
                </div>`).join('')}
            </div>
            <div class="px-6 py-3 bg-orange-50 border-t border-orange-100 text-xs text-orange-600">
              Unconfirmed monthly total: <strong>${fmt(staleSubs.reduce((s,t)=>s+t.amount,0))}</strong> — add to May data once confirmed
            </div>`
        }
      </div>
    </div>

    <!-- Annual charges & one-time grid -->
    <div class="grid grid-cols-2 gap-5">

      <!-- Annual charges -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-700">Annual Charges (YTD)</h3>
          <span class="text-xs font-bold text-blue-600">${fmt(annualCommit)} total</span>
        </div>
        <div class="divide-y divide-gray-50">
          ${annuals.map(t=>`
            <div class="px-6 py-3 flex items-center justify-between">
              <div>
                <div class="text-sm font-medium text-gray-800">${t.vendor}</div>
                <div class="text-xs text-gray-400">${t.date} · ${t.category}${t.note?' · '+t.note:''}</div>
              </div>
              <span class="text-sm font-semibold text-blue-600">${fmt(t.amount)}</span>
            </div>`).join('')}
        </div>
      </div>

      <!-- One-time purchases -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-700">One-Time Purchases (YTD)</h3>
          <span class="text-xs font-bold text-red-500">${fmt(totalOneTime)} total</span>
        </div>
        ${oneOffs.length===0
          ? `<div class="px-6 py-8 text-center text-sm text-gray-400">No one-time purchases recorded.</div>`
          : `<div class="divide-y divide-gray-50">
              ${oneOffs.map(t=>`
                <div class="px-6 py-3 flex items-center justify-between">
                  <div>
                    <div class="text-sm font-medium text-gray-800">${t.vendor}</div>
                    <div class="text-xs text-gray-400">${t.date} · ${t.category}${t.note?' · '+t.note:''}</div>
                  </div>
                  <span class="text-sm font-semibold text-red-500">${fmt(t.amount)}</span>
                </div>`).join('')}
            </div>`
        }
      </div>
    </div>`;
}

function _kill() { _charts.forEach(c=>c.destroy()); _charts=[]; }

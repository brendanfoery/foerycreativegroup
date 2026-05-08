import { months, monthlyExpenses, totalExpenses, expensesByCategory, expenseTransactions } from '../data.js';

const fmt = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);

const CATEGORY = {
  'Studio & Recording': { badge:'bg-red-100 text-red-700',     dot:'#ef4444' },
  'Marketing & Promo':  { badge:'bg-orange-100 text-orange-700', dot:'#f97316' },
  'Artist Advances':    { badge:'bg-purple-100 text-purple-700', dot:'#8b5cf6' },
  'Distribution Fees':  { badge:'bg-gray-100 text-gray-600',    dot:'#6b7280' },
};
const CAT_COLORS = ['#ef4444','#f97316','#8b5cf6','#6b7280'];

let _charts = [];

export function render(el) {
  _destroyCharts();

  el.innerHTML = `
    <div class="grid grid-cols-4 gap-5 mb-7">
      ${Object.entries(expensesByCategory).map(([label,val],i)=>`
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-2.5 h-2.5 rounded-full" style="background:${CAT_COLORS[i]}"></div>
            <span class="text-xs font-medium text-gray-400 uppercase tracking-wide">${label}</span>
          </div>
          <div class="text-2xl font-bold text-gray-900">${fmt(val)}</div>
          <div class="text-xs text-gray-400 mt-1">${((val/totalExpenses)*100).toFixed(1)}% of total</div>
        </div>`).join('')}
    </div>

    <div class="grid grid-cols-5 gap-5 mb-7">
      <div class="col-span-3 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Monthly Expense Trend</h3>
        <div style="position:relative;height:230px"><canvas id="exp-bar"></canvas></div>
      </div>
      <div class="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Expense Breakdown</h3>
        <div style="position:relative;height:170px"><canvas id="exp-donut"></canvas></div>
        <div class="mt-4 space-y-2">
          ${Object.entries(expensesByCategory).map(([label,val],i)=>`
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full" style="background:${CAT_COLORS[i]}"></div>
                <span class="text-gray-500">${label}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-gray-400">${((val/totalExpenses)*100).toFixed(0)}%</span>
                <span class="font-semibold text-gray-800">${fmt(val)}</span>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-sm font-semibold text-gray-700">Recent Transactions</h3>
        <span class="text-xs text-gray-400">${expenseTransactions.length} records</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-xs font-medium text-gray-400 uppercase tracking-wide bg-gray-50">
              <th class="text-left px-6 py-3">Date</th>
              <th class="text-left px-6 py-3">Description</th>
              <th class="text-left px-6 py-3">Artist / Project</th>
              <th class="text-left px-6 py-3">Category</th>
              <th class="text-right px-6 py-3">Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            ${expenseTransactions.map(t=>{
              const c = CATEGORY[t.category] || {badge:'bg-gray-100 text-gray-600'};
              return `<tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-3.5 text-gray-400 text-xs whitespace-nowrap">${t.date}</td>
                <td class="px-6 py-3.5 text-gray-800 font-medium">${t.description}</td>
                <td class="px-6 py-3.5 text-gray-500 text-sm">${t.artist}</td>
                <td class="px-6 py-3.5">
                  <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${c.badge}">${t.category}</span>
                </td>
                <td class="px-6 py-3.5 text-right font-semibold text-red-500">${fmt(t.amount)}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;

  requestAnimationFrame(()=>{
    const bar = document.getElementById('exp-bar');
    if (bar) _charts.push(new Chart(bar, {
      type:'bar',
      data: {
        labels: months,
        datasets:[{
          label:'Expenses', data: monthlyExpenses,
          backgroundColor:'rgba(239,68,68,0.75)', borderRadius:4, borderSkipped:false,
        }],
      },
      options: {
        responsive:true, maintainAspectRatio:false,
        plugins: {
          legend:{display:false},
          tooltip:{ callbacks:{ label: c=>` Expenses: ${fmt(c.raw)}` } },
        },
        scales: {
          x:{ grid:{display:false}, ticks:{font:{size:10}} },
          y:{ grid:{color:'#f1f5f9'}, ticks:{font:{size:10}, callback:v=>'$'+(v/1000)+'k'} },
        },
      },
    }));

    const donut = document.getElementById('exp-donut');
    if (donut) _charts.push(new Chart(donut, {
      type:'doughnut',
      data: {
        labels: Object.keys(expensesByCategory),
        datasets:[{ data: Object.values(expensesByCategory), backgroundColor: CAT_COLORS, borderWidth:2, borderColor:'#fff' }],
      },
      options: {
        responsive:true, maintainAspectRatio:false, cutout:'68%',
        plugins: {
          legend:{display:false},
          tooltip:{ callbacks:{ label: c=>` ${c.label}: ${fmt(c.raw)}` } },
        },
      },
    }));
  });
}

function _destroyCharts() { _charts.forEach(c=>c.destroy()); _charts=[]; }

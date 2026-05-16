import { transactions, totalExpenses, getMonthlyBreakdown, getCategoryTotals, getVendorTotals, CATEGORY_COLORS } from '../data.js';

const fmt = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2}).format(n);

const TYPE_STYLE = {
  'monthly':  { badge:'bg-amber-100 text-amber-700',  dot:'#f59e0b', label:'Monthly' },
  'annual':   { badge:'bg-blue-100 text-blue-700',    dot:'#3b82f6', label:'Annual'  },
  'one-time': { badge:'bg-red-100 text-red-700',      dot:'#ef4444', label:'One-Time'},
};

let _charts = [];

export function render(el) {
  _kill();

  const monthly  = getMonthlyBreakdown();
  const catTotals = getCategoryTotals();
  const vendors  = getVendorTotals();
  const expenses = transactions.filter(t=>t.type!=='income').sort((a,b)=>b.date.localeCompare(a.date));

  const recurringTotal = monthly.reduce((s,m)=>s+m.monthly,0);
  const annualTotal    = monthly.reduce((s,m)=>s+m.annual,0);
  const oneTimeTotal   = monthly.reduce((s,m)=>s+m.oneTime,0);

  el.innerHTML = `
    <!-- Type cards -->
    <div class="grid grid-cols-3 gap-5 mb-7">
      ${typeCard('Monthly Recurring', recurringTotal, totalExpenses, '#f59e0b', 'Subscriptions paid every month')}
      ${typeCard('Annual / Periodic',  annualTotal,   totalExpenses, '#3b82f6', 'Yearly fees & periodic charges')}
      ${typeCard('One-Time Purchases', oneTimeTotal,  totalExpenses, '#ef4444', 'Equipment, trials & single charges')}
    </div>

    <!-- Charts row -->
    <div class="grid grid-cols-5 gap-5 mb-7">
      <div class="col-span-3 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Monthly Spend by Type</h3>
        <div style="position:relative;height:230px"><canvas id="exp-monthly"></canvas></div>
      </div>
      <div class="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">By Category</h3>
        <div style="position:relative;height:180px"><canvas id="exp-cat"></canvas></div>
        <div class="mt-3 space-y-1.5">
          ${catTotals.map(([cat,val])=>`
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" style="background:${CATEGORY_COLORS[cat]||'#9ca3af'}"></div>
                <span class="text-gray-500">${cat}</span>
              </div>
              <span class="font-medium text-gray-800">${fmt(val)}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Vendor table -->
    <div class="grid grid-cols-5 gap-5 mb-7">
      <div class="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700">Top Vendors by Spend</h3>
        </div>
        <div class="divide-y divide-gray-50">
          ${vendors.map((v,i)=>`
            <div class="flex items-center justify-between px-5 py-3">
              <div class="flex items-center gap-3">
                <span class="text-xs text-gray-300 w-4 text-right">${i+1}</span>
                <div>
                  <div class="text-sm font-medium text-gray-800">${v.vendor}</div>
                  <div class="text-xs text-gray-400">${v.category}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-gray-900">${fmt(v.total)}</div>
                <div class="flex gap-1 mt-0.5 justify-end">
                  ${v.types.map(t=>`<span class="text-xs px-1 py-0 rounded ${(TYPE_STYLE[t]||{badge:'bg-gray-100 text-gray-500'}).badge}">${(TYPE_STYLE[t]||{label:t}).label}</span>`).join('')}
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Transaction log -->
      <div class="col-span-3 bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-700">All Expense Transactions</h3>
          <span class="text-xs text-gray-400">${expenses.length} entries</span>
        </div>
        <div class="overflow-y-auto" style="max-height:480px">
          <table class="w-full text-sm">
            <thead class="sticky top-0 bg-white">
              <tr class="text-xs font-medium text-gray-400 uppercase tracking-wide bg-gray-50">
                <th class="text-left px-5 py-3">Date</th>
                <th class="text-left px-5 py-3">Vendor</th>
                <th class="text-left px-5 py-3">Type</th>
                <th class="text-right px-5 py-3">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              ${expenses.map(t=>{
                const s = TYPE_STYLE[t.type]||{badge:'bg-gray-100 text-gray-600',label:t.type};
                return `<tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">${t.date}</td>
                  <td class="px-5 py-3">
                    <div class="text-gray-800 font-medium text-xs">${t.vendor}</div>
                    ${t.note?`<div class="text-gray-400 text-xs">${t.note}</div>`:''}
                  </td>
                  <td class="px-5 py-3">
                    <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${s.badge}">${s.label}</span>
                  </td>
                  <td class="px-5 py-3 text-right font-semibold text-red-500">${fmt(t.amount)}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
        <div class="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-between text-sm">
          <span class="font-semibold text-gray-700">Total</span>
          <span class="font-bold text-red-500">${fmt(totalExpenses)}</span>
        </div>
      </div>
    </div>`;

  requestAnimationFrame(()=>{
    const mc = document.getElementById('exp-monthly');
    if (mc) _charts.push(new Chart(mc, {
      type:'bar',
      data:{
        labels: monthly.map(m=>m.label),
        datasets:[
          { label:'Recurring', data:monthly.map(m=>m.monthly), backgroundColor:'rgba(245,158,11,0.85)', borderRadius:3, stack:'s' },
          { label:'Annual',    data:monthly.map(m=>m.annual),  backgroundColor:'rgba(59,130,246,0.8)',  borderRadius:3, stack:'s' },
          { label:'One-Time',  data:monthly.map(m=>m.oneTime), backgroundColor:'rgba(239,68,68,0.8)',   borderRadius:3, stack:'s' },
        ],
      },
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ position:'top', labels:{ font:{size:10}, boxWidth:10, padding:12 } },
          tooltip:{ callbacks:{ label:c=>` ${c.dataset.label}: ${fmt(c.raw)}` } } },
        scales:{
          x:{ stacked:true, grid:{display:false}, ticks:{font:{size:10}} },
          y:{ stacked:true, grid:{color:'#f1f5f9'}, ticks:{font:{size:10}, callback:v=>'$'+(v/1000).toFixed(0)+'k'} },
        },
      },
    }));

    const cc = document.getElementById('exp-cat');
    if (cc) _charts.push(new Chart(cc, {
      type:'doughnut',
      data:{
        labels:catTotals.map(([c])=>c),
        datasets:[{ data:catTotals.map(([,v])=>v), backgroundColor:catTotals.map(([c])=>CATEGORY_COLORS[c]||'#9ca3af'), borderWidth:2, borderColor:'#fff' }],
      },
      options:{ responsive:true, maintainAspectRatio:false, cutout:'66%',
        plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:c=>` ${c.label}: ${fmt(c.raw)}` } } } },
    }));
  });
}

function typeCard(label, val, total, color, sub) {
  const pct = total>0?((val/total)*100).toFixed(0):0;
  return `<div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
    <div class="flex items-center gap-2 mb-3">
      <div class="w-2.5 h-2.5 rounded-full" style="background:${color}"></div>
      <span class="text-xs font-medium text-gray-400 uppercase tracking-wide">${label}</span>
    </div>
    <div class="text-2xl font-bold text-gray-900">${fmt(val)}</div>
    <div class="text-xs text-gray-400 mt-1">${pct}% of total spend</div>
    <div class="text-xs text-gray-400 mt-0.5">${sub}</div>
  </div>`;
}

function _kill() { _charts.forEach(c=>c.destroy()); _charts=[]; }

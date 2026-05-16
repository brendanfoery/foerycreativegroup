import { getIncome, totalIncome, getMonthlyBreakdown } from '../data.js';

const fmt = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2}).format(n);

const SOURCE_STYLE = {
  'Client Work':  { badge:'bg-green-100 text-green-700',  dot:'#22c55e' },
  'Distribution': { badge:'bg-blue-100 text-blue-700',    dot:'#3b82f6' },
};

let _charts = [];

export function render(el) {
  _kill();

  const income  = getIncome();
  const monthly = getMonthlyBreakdown();

  // Group income by source category
  const bySource = {};
  income.forEach(t => { bySource[t.category]=(bySource[t.category]||0)+t.amount; });

  el.innerHTML = `
    <!-- KPI cards -->
    <div class="grid grid-cols-3 gap-5 mb-7">
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Total YTD Income</div>
        <div class="text-2xl font-bold text-green-600">${fmt(totalIncome)}</div>
        <div class="text-xs text-gray-400 mt-2">${income.length} income entries · Jan–May 2026</div>
      </div>
      ${Object.entries(bySource).map(([cat,val])=>{
        const s = SOURCE_STYLE[cat]||{badge:'bg-gray-100 text-gray-600',dot:'#9ca3af'};
        return `<div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-2.5 h-2.5 rounded-full" style="background:${s.dot}"></div>
            <span class="text-xs font-medium text-gray-400 uppercase tracking-wide">${cat}</span>
          </div>
          <div class="text-2xl font-bold text-gray-900">${fmt(val)}</div>
          <div class="text-xs text-gray-400 mt-1">${((val/totalIncome)*100).toFixed(0)}% of total income</div>
        </div>`;
      }).join('')}
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-3 gap-5 mb-7">
      <div class="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-1">Monthly Income vs. Spend</h3>
        <p class="text-xs text-gray-400 mb-4">Income is currently well below monthly spend — tracking here shows the gap clearly.</p>
        <div style="position:relative;height:230px"><canvas id="rev-chart"></canvas></div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Income Sources</h3>
        ${Object.keys(bySource).length > 0
          ? `<div style="position:relative;height:180px"><canvas id="rev-donut"></canvas></div>
             <div class="mt-4 space-y-2">
               ${Object.entries(bySource).map(([cat,val])=>{
                 const s = SOURCE_STYLE[cat]||{dot:'#9ca3af'};
                 return `<div class="flex items-center justify-between text-xs">
                   <div class="flex items-center gap-2">
                     <div class="w-2.5 h-2.5 rounded-full" style="background:${s.dot}"></div>
                     <span class="text-gray-500">${cat}</span>
                   </div>
                   <span class="font-semibold text-gray-800">${fmt(val)}</span>
                 </div>`;
               }).join('')}
             </div>`
          : '<p class="text-sm text-gray-400">No income recorded yet.</p>'
        }
      </div>
    </div>

    <!-- Income log -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-sm font-semibold text-gray-700">Income Log</h3>
        <span class="text-xs text-gray-400">${income.length} entries</span>
      </div>
      ${income.length === 0
        ? `<div class="px-6 py-10 text-center text-sm text-gray-400">No income recorded yet. Add entries in <code class="bg-gray-100 px-1 rounded">src/data.js</code> with type: 'income'.</div>`
        : `<table class="w-full text-sm">
             <thead>
               <tr class="text-xs font-medium text-gray-400 uppercase tracking-wide bg-gray-50">
                 <th class="text-left px-6 py-3">Date</th>
                 <th class="text-left px-6 py-3">Source / Client</th>
                 <th class="text-left px-6 py-3">Category</th>
                 <th class="text-left px-6 py-3">Notes</th>
                 <th class="text-right px-6 py-3">Amount</th>
               </tr>
             </thead>
             <tbody class="divide-y divide-gray-50">
               ${income.map(t=>{
                 const s = SOURCE_STYLE[t.category]||{badge:'bg-gray-100 text-gray-600'};
                 return `<tr class="hover:bg-gray-50 transition-colors">
                   <td class="px-6 py-3.5 text-gray-400 text-xs whitespace-nowrap">${t.date}</td>
                   <td class="px-6 py-3.5 font-medium text-gray-800">${t.vendor}</td>
                   <td class="px-6 py-3.5">
                     <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${s.badge}">${t.category}</span>
                   </td>
                   <td class="px-6 py-3.5 text-gray-400 text-xs">${t.note||'—'}</td>
                   <td class="px-6 py-3.5 text-right font-semibold text-green-600">${fmt(t.amount)}</td>
                 </tr>`;
               }).join('')}
             </tbody>
             <tfoot class="border-t-2 border-gray-200 bg-gray-50">
               <tr>
                 <td colspan="4" class="px-6 py-3 text-sm font-semibold text-gray-700">Total</td>
                 <td class="px-6 py-3 text-right font-bold text-green-600">${fmt(totalIncome)}</td>
               </tr>
             </tfoot>
           </table>`
      }
    </div>`;

  requestAnimationFrame(()=>{
    const ctx = document.getElementById('rev-chart');
    if (ctx) _charts.push(new Chart(ctx, {
      type:'bar',
      data:{
        labels: monthly.map(m=>m.label),
        datasets:[
          { label:'Total Expenses', data:monthly.map(m=>m.total), backgroundColor:'rgba(239,68,68,0.55)', borderRadius:4 },
          { label:'Income',         data:monthly.map(m=>m.income), backgroundColor:'rgba(34,197,94,0.85)', borderRadius:4 },
        ],
      },
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ position:'top', labels:{ font:{size:10}, boxWidth:10, padding:12 } },
          tooltip:{ callbacks:{ label: c=>` ${c.dataset.label}: ${fmt(c.raw)}` } } },
        scales:{
          x:{ grid:{display:false}, ticks:{font:{size:10}} },
          y:{ grid:{color:'#f1f5f9'}, ticks:{font:{size:10}, callback:v=>'$'+(v/1000).toFixed(0)+'k'} },
        },
      },
    }));

    const pie = document.getElementById('rev-donut');
    if (pie && Object.keys(bySource).length>0) _charts.push(new Chart(pie, {
      type:'doughnut',
      data:{
        labels:Object.keys(bySource),
        datasets:[{ data:Object.values(bySource), backgroundColor:Object.keys(bySource).map(c=>(SOURCE_STYLE[c]||{dot:'#9ca3af'}).dot), borderWidth:2, borderColor:'#fff' }],
      },
      options:{ responsive:true, maintainAspectRatio:false, cutout:'68%',
        plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:c=>` ${c.label}: ${fmt(c.raw)}` } } } },
    }));
  });
}

function _kill() { _charts.forEach(c=>c.destroy()); _charts=[]; }

import { months, monthlyRevenue, totalRevenue, revenueBySource, revenueTransactions } from '../data.js';

const fmt = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);

const SOURCE = {
  'Streaming':      { badge:'bg-amber-100 text-amber-700', dot:'#f59e0b' },
  'Sync Licensing': { badge:'bg-blue-100 text-blue-700',   dot:'#3b82f6' },
  'Merchandise':    { badge:'bg-green-100 text-green-700', dot:'#10b981' },
  'Live Events':    { badge:'bg-purple-100 text-purple-700', dot:'#8b5cf6' },
};
const SOURCE_COLORS = ['#f59e0b','#3b82f6','#10b981','#8b5cf6'];

let _charts = [];

export function render(el) {
  _destroyCharts();

  el.innerHTML = `
    <div class="grid grid-cols-4 gap-5 mb-7">
      ${Object.entries(revenueBySource).map(([label,val],i)=>`
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-2.5 h-2.5 rounded-full" style="background:${SOURCE_COLORS[i]}"></div>
            <span class="text-xs font-medium text-gray-400 uppercase tracking-wide">${label}</span>
          </div>
          <div class="text-2xl font-bold text-gray-900">${fmt(val)}</div>
          <div class="text-xs text-gray-400 mt-1">${((val/totalRevenue)*100).toFixed(1)}% of total</div>
        </div>`).join('')}
    </div>

    <div class="grid grid-cols-5 gap-5 mb-7">
      <div class="col-span-3 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Monthly Revenue Trend</h3>
        <div style="position:relative;height:230px"><canvas id="rev-line"></canvas></div>
      </div>
      <div class="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Revenue Mix</h3>
        <div style="position:relative;height:170px"><canvas id="rev-donut"></canvas></div>
        <div class="mt-4 space-y-2">
          ${Object.entries(revenueBySource).map(([label,val],i)=>`
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full" style="background:${SOURCE_COLORS[i]}"></div>
                <span class="text-gray-500">${label}</span>
              </div>
              <span class="font-semibold text-gray-800">${fmt(val)}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-sm font-semibold text-gray-700">Recent Transactions</h3>
        <span class="text-xs text-gray-400">${revenueTransactions.length} records</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-xs font-medium text-gray-400 uppercase tracking-wide bg-gray-50">
              <th class="text-left px-6 py-3">Date</th>
              <th class="text-left px-6 py-3">Description</th>
              <th class="text-left px-6 py-3">Artist</th>
              <th class="text-left px-6 py-3">Source</th>
              <th class="text-right px-6 py-3">Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            ${revenueTransactions.map(t=>{
              const s = SOURCE[t.source] || {badge:'bg-gray-100 text-gray-600'};
              return `<tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-3.5 text-gray-400 text-xs whitespace-nowrap">${t.date}</td>
                <td class="px-6 py-3.5 text-gray-800 font-medium">${t.description}</td>
                <td class="px-6 py-3.5 text-gray-500 text-sm">${t.artist}</td>
                <td class="px-6 py-3.5">
                  <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${s.badge}">${t.source}</span>
                </td>
                <td class="px-6 py-3.5 text-right font-semibold text-green-600">${fmt(t.amount)}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;

  requestAnimationFrame(()=>{
    const line = document.getElementById('rev-line');
    if (line) _charts.push(new Chart(line, {
      type:'line',
      data: {
        labels: months,
        datasets: [{
          label:'Revenue', data: monthlyRevenue,
          borderColor:'#f59e0b', backgroundColor:'rgba(245,158,11,0.08)',
          fill:true, tension:0.4, pointBackgroundColor:'#f59e0b', pointRadius:4, pointHoverRadius:6,
        }],
      },
      options: {
        responsive:true, maintainAspectRatio:false,
        plugins: {
          legend:{display:false},
          tooltip:{ callbacks:{ label: c=>` Revenue: ${fmt(c.raw)}` } },
        },
        scales: {
          x:{ grid:{display:false}, ticks:{font:{size:10}} },
          y:{ grid:{color:'#f1f5f9'}, ticks:{font:{size:10}, callback:v=>'$'+(v/1000)+'k'} },
        },
      },
    }));

    const donut = document.getElementById('rev-donut');
    if (donut) _charts.push(new Chart(donut, {
      type:'doughnut',
      data: {
        labels: Object.keys(revenueBySource),
        datasets:[{ data: Object.values(revenueBySource), backgroundColor: SOURCE_COLORS, borderWidth:2, borderColor:'#fff' }],
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

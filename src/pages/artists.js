import { artists, totalRevenue, totalExpenses, netProfit } from '../data.js';

const fmt = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const fmtStreams = n => n >= 1000000 ? (n/1000000).toFixed(1)+'M' : (n/1000).toFixed(0)+'K';

const COLOR_MAP = { amber:'#f59e0b', blue:'#3b82f6', green:'#10b981', purple:'#8b5cf6', rose:'#f43f5e' };
const AVATAR_BG = { amber:'background:#f59e0b', blue:'background:#3b82f6', green:'background:#10b981', purple:'background:#8b5cf6', rose:'background:#f43f5e' };

let _charts = [];

export function render(el) {
  _destroyCharts();

  const sorted = [...artists].sort((a,b)=>b.profit-a.profit);
  const totalNet = totalRevenue - totalExpenses;

  el.innerHTML = `
    <div class="grid grid-cols-5 gap-4 mb-7">
      ${sorted.map(a=>{
        const margin = ((a.profit/a.revenue)*100).toFixed(1);
        const pos = a.profit >= 0;
        return `<div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div class="flex items-center gap-2.5 mb-4">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style="${AVATAR_BG[a.color]}">${a.avatar}</div>
            <div>
              <div class="text-xs font-semibold text-gray-900 leading-tight">${a.name}</div>
              <div class="text-xs text-gray-400">${a.genre}</div>
            </div>
          </div>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between">
              <span class="text-gray-400">Revenue</span>
              <span class="font-medium text-gray-700">${fmt(a.revenue)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Expenses</span>
              <span class="font-medium text-gray-700">${fmt(a.expenses)}</span>
            </div>
            <div class="flex justify-between pt-2 border-t border-gray-100">
              <span class="text-gray-500 font-semibold">Net P&L</span>
              <span class="font-bold ${pos?'text-green-600':'text-red-500'}">${pos?'+':''}${fmt(a.profit)}</span>
            </div>
          </div>
          <div class="mt-3 flex items-center justify-between text-xs">
            <span class="text-gray-400">${fmtStreams(a.streams)} streams</span>
            <span class="font-medium ${pos?'text-green-600':'text-red-500'}">${margin}% margin</span>
          </div>
          <div class="mt-1.5 bg-gray-100 rounded-full h-1">
            <div class="${pos?'bg-green-500':'bg-red-400'} h-1 rounded-full" style="width:${Math.min(Math.abs(parseFloat(margin)),100)}%"></div>
          </div>
        </div>`;
      }).join('')}
    </div>

    <div class="grid grid-cols-3 gap-5 mb-7">
      <div class="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Revenue vs. Expenses by Artist</h3>
        <div style="position:relative;height:250px"><canvas id="art-bar"></canvas></div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Revenue Share</h3>
        <div style="position:relative;height:175px"><canvas id="art-donut"></canvas></div>
        <div class="mt-4 space-y-2">
          ${artists.map(a=>`
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" style="background:${COLOR_MAP[a.color]}"></div>
                <span class="text-gray-500">${a.name.split(' ')[0]}</span>
              </div>
              <span class="font-medium text-gray-700">${((a.revenue/totalRevenue)*100).toFixed(0)}%</span>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700">Full P&L Breakdown</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-xs font-medium text-gray-400 uppercase tracking-wide bg-gray-50">
              <th class="text-left px-6 py-3">Artist</th>
              <th class="text-left px-6 py-3">Genre</th>
              <th class="text-left px-6 py-3">Projects</th>
              <th class="text-right px-6 py-3">Streams</th>
              <th class="text-right px-6 py-3">Revenue</th>
              <th class="text-right px-6 py-3">Expenses</th>
              <th class="text-right px-6 py-3">Net P&L</th>
              <th class="text-right px-6 py-3">Margin</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            ${sorted.map(a=>{
              const margin = ((a.profit/a.revenue)*100).toFixed(1);
              const pos = a.profit >= 0;
              return `<tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style="${AVATAR_BG[a.color]}">${a.avatar}</div>
                    <span class="font-medium text-gray-900">${a.name}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-400 text-xs">${a.genre}</td>
                <td class="px-6 py-4 text-gray-400 text-xs">${a.projects.join(', ')}</td>
                <td class="px-6 py-4 text-right text-gray-500 text-xs">${fmtStreams(a.streams)}</td>
                <td class="px-6 py-4 text-right font-medium text-gray-800">${fmt(a.revenue)}</td>
                <td class="px-6 py-4 text-right font-medium text-gray-800">${fmt(a.expenses)}</td>
                <td class="px-6 py-4 text-right font-bold ${pos?'text-green-600':'text-red-500'}">${pos?'+':''}${fmt(a.profit)}</td>
                <td class="px-6 py-4 text-right">
                  <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${pos?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}">${margin}%</span>
                </td>
              </tr>`;
            }).join('')}
            <tr class="bg-gray-50 border-t-2 border-gray-200">
              <td class="px-6 py-3.5 font-semibold text-gray-800" colspan="4">Label Total</td>
              <td class="px-6 py-3.5 text-right font-bold text-gray-900">${fmt(totalRevenue)}</td>
              <td class="px-6 py-3.5 text-right font-bold text-gray-900">${fmt(totalExpenses)}</td>
              <td class="px-6 py-3.5 text-right font-bold text-green-600">+${fmt(totalNet)}</td>
              <td class="px-6 py-3.5 text-right">
                <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">${((totalNet/totalRevenue)*100).toFixed(1)}%</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>`;

  requestAnimationFrame(()=>{
    const bar = document.getElementById('art-bar');
    if (bar) _charts.push(new Chart(bar, {
      type:'bar',
      data: {
        labels: artists.map(a=>a.name),
        datasets:[
          { label:'Revenue',  data: artists.map(a=>a.revenue),  backgroundColor:'#f59e0b', borderRadius:4, borderSkipped:false },
          { label:'Expenses', data: artists.map(a=>a.expenses), backgroundColor:'#ef4444', borderRadius:4, borderSkipped:false },
        ],
      },
      options: {
        responsive:true, maintainAspectRatio:false,
        plugins: {
          legend:{ position:'top', labels:{ font:{size:11}, boxWidth:12, padding:14 } },
          tooltip:{ callbacks:{ label: c=>` ${c.dataset.label}: ${fmt(c.raw)}` } },
        },
        scales: {
          x:{ grid:{display:false}, ticks:{font:{size:9}} },
          y:{ grid:{color:'#f1f5f9'}, ticks:{font:{size:10}, callback:v=>'$'+(v/1000)+'k'} },
        },
      },
    }));

    const donut = document.getElementById('art-donut');
    if (donut) _charts.push(new Chart(donut, {
      type:'doughnut',
      data: {
        labels: artists.map(a=>a.name),
        datasets:[{ data: artists.map(a=>a.revenue), backgroundColor: artists.map(a=>COLOR_MAP[a.color]), borderWidth:2, borderColor:'#fff' }],
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

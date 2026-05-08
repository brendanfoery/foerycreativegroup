import {
  months, monthlyRevenue, monthlyExpenses,
  totalRevenue, totalExpenses, netProfit, profitMargin,
  revenueBySource, expensesByCategory,
} from '../data.js';

const fmt = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);

const SOURCE_COLORS = ['#f59e0b','#3b82f6','#10b981','#8b5cf6'];
const EXPENSE_COLORS = ['#ef4444','#f97316','#8b5cf6','#6b7280'];

let _charts = [];

export function render(el) {
  _destroyCharts();

  const ytdRev = monthlyRevenue.slice(0,5).reduce((a,b)=>a+b,0);
  const ytdExp = monthlyExpenses.slice(0,5).reduce((a,b)=>a+b,0);
  const ytdNet = ytdRev - ytdExp;

  const kpis = [
    { label:'Total Revenue',  value: fmt(totalRevenue),  delta:'+18.4% vs last year', up:true  },
    { label:'Total Expenses',  value: fmt(totalExpenses), delta:'+12.1% vs last year', up:false },
    { label:'Net Profit',      value: fmt(netProfit),     delta:'+29.7% vs last year', up:true, green:true },
    { label:'Profit Margin',   value: profitMargin+'%',   delta:'Up from 28.1% last year', up:true },
  ];

  el.innerHTML = `
    <div class="grid grid-cols-4 gap-5 mb-7">
      ${kpis.map(k=>`
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">${k.label}</div>
          <div class="text-2xl font-bold ${k.green?'text-green-600':'text-gray-900'}">${k.value}</div>
          <div class="mt-2 flex items-center gap-1 text-xs font-medium ${k.up?'text-green-600':'text-red-500'}">
            ${k.up
              ? `<svg style="width:12px;height:12px" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>`
              : `<svg style="width:12px;height:12px" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`
            }
            ${k.delta}
          </div>
        </div>`).join('')}
    </div>

    <div class="grid grid-cols-3 gap-5 mb-7">
      <div class="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Monthly Revenue vs. Expenses</h3>
        <div style="position:relative;height:250px"><canvas id="ov-monthly"></canvas></div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Revenue by Source</h3>
        <div style="position:relative;height:170px"><canvas id="ov-source"></canvas></div>
        <div class="mt-4 space-y-2">
          ${Object.entries(revenueBySource).map(([label,val],i)=>`
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full" style="background:${SOURCE_COLORS[i]}"></div>
                <span class="text-gray-500">${label}</span>
              </div>
              <span class="font-medium text-gray-700">${((val/totalRevenue)*100).toFixed(0)}%</span>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-5">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Expenses by Category</h3>
        <div style="position:relative;height:200px"><canvas id="ov-expenses"></canvas></div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Year-to-Date (Jan – May 2025)</h3>
        <div class="space-y-4">
          ${[
            {label:'Revenue', val:ytdRev, total:totalRevenue, color:'bg-amber-500'},
            {label:'Expenses', val:ytdExp, total:totalExpenses, color:'bg-red-400'},
            {label:'Net Profit', val:ytdNet, total:netProfit, color:'bg-green-500'},
          ].map(r=>`
            <div>
              <div class="flex justify-between text-sm mb-1.5">
                <span class="text-gray-500">${r.label}</span>
                <span class="font-semibold text-gray-800">${fmt(r.val)}</span>
              </div>
              <div class="bg-gray-100 rounded-full h-1.5">
                <div class="${r.color} h-1.5 rounded-full" style="width:${Math.max(0,(r.val/r.total*100)).toFixed(0)}%"></div>
              </div>
            </div>`).join('')}
        </div>
        <div class="mt-6 pt-4 border-t border-gray-100">
          <div class="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">Full-Year Projection</div>
          <div class="grid grid-cols-3 gap-2">
            <div class="text-center p-3 bg-amber-50 rounded-xl">
              <div class="text-xs text-gray-400 mb-1">Revenue</div>
              <div class="text-sm font-bold text-amber-600">${fmt(totalRevenue)}</div>
            </div>
            <div class="text-center p-3 bg-red-50 rounded-xl">
              <div class="text-xs text-gray-400 mb-1">Expenses</div>
              <div class="text-sm font-bold text-red-500">${fmt(totalExpenses)}</div>
            </div>
            <div class="text-center p-3 bg-green-50 rounded-xl">
              <div class="text-xs text-gray-400 mb-1">Profit</div>
              <div class="text-sm font-bold text-green-600">${fmt(netProfit)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  requestAnimationFrame(_renderCharts);
}

function _renderCharts() {
  const monthly = document.getElementById('ov-monthly');
  if (monthly) _charts.push(new Chart(monthly, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        { label:'Revenue',  data: monthlyRevenue,  backgroundColor:'rgba(245,158,11,0.85)', borderRadius:4, borderSkipped:false },
        { label:'Expenses', data: monthlyExpenses, backgroundColor:'rgba(239,68,68,0.75)',  borderRadius:4, borderSkipped:false },
      ],
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins: {
        legend: { position:'top', labels:{ font:{size:11}, boxWidth:12, padding:14 } },
        tooltip: { callbacks:{ label: c=>` ${c.dataset.label}: ${fmt(c.raw)}` } },
      },
      scales: {
        x: { grid:{display:false}, ticks:{font:{size:10}} },
        y: { grid:{color:'#f1f5f9'}, ticks:{font:{size:10}, callback:v=>'$'+(v/1000)+'k'} },
      },
    },
  }));

  const source = document.getElementById('ov-source');
  if (source) _charts.push(new Chart(source, {
    type: 'doughnut',
    data: {
      labels: Object.keys(revenueBySource),
      datasets: [{ data: Object.values(revenueBySource), backgroundColor: SOURCE_COLORS, borderWidth:2, borderColor:'#fff' }],
    },
    options: {
      responsive:true, maintainAspectRatio:false, cutout:'68%',
      plugins: {
        legend: { display:false },
        tooltip: { callbacks:{ label: c=>` ${c.label}: ${fmt(c.raw)}` } },
      },
    },
  }));

  const exp = document.getElementById('ov-expenses');
  if (exp) _charts.push(new Chart(exp, {
    type: 'bar',
    data: {
      labels: Object.keys(expensesByCategory),
      datasets: [{ data: Object.values(expensesByCategory), backgroundColor: EXPENSE_COLORS, borderRadius:6, borderSkipped:false }],
    },
    options: {
      responsive:true, maintainAspectRatio:false, indexAxis:'y',
      plugins: {
        legend: { display:false },
        tooltip: { callbacks:{ label: c=>` ${fmt(c.raw)}` } },
      },
      scales: {
        x: { grid:{color:'#f1f5f9'}, ticks:{font:{size:10}, callback:v=>'$'+(v/1000)+'k'} },
        y: { grid:{display:false}, ticks:{font:{size:10}} },
      },
    },
  }));
}

function _destroyCharts() { _charts.forEach(c=>c.destroy()); _charts=[]; }

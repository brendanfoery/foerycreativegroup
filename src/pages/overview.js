import {
  totalExpenses, totalIncome, netProfit,
  getMonthlyBreakdown, getCategoryTotals, CATEGORY_COLORS,
} from '../data.js';

const fmt  = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2}).format(n);
const fmtS = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);

let _charts = [];

export function render(el) {
  _kill();

  const monthly    = getMonthlyBreakdown();
  const catTotals  = getCategoryTotals();
  const monthlyBurn = totalExpenses / monthly.length;
  const isProfit   = netProfit >= 0;

  // Expense type subtotals
  const recurringTotal = monthly.reduce((s,m)=>s+m.monthly,0);
  const annualTotal    = monthly.reduce((s,m)=>s+m.annual,0);
  const oneTimeTotal   = monthly.reduce((s,m)=>s+m.oneTime,0);

  el.innerHTML = `
    <!-- KPI Cards -->
    <div class="grid grid-cols-4 gap-5 mb-7">
      ${kpi('Total Income',   fmt(totalIncome),   'text-green-600', '+$281.32 YTD 2026',  true)}
      ${kpi('Total Expenses', fmt(totalExpenses),  'text-gray-900',  `${monthly.length} months tracked`, false)}
      ${kpi('Net P&L',        fmt(netProfit),      isProfit?'text-green-600':'text-red-500', isProfit?'Profitable':'In the red', isProfit)}
      ${kpi('Avg Monthly Burn', fmtS(monthlyBurn), 'text-gray-900',  'Per month YTD', null)}
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-3 gap-5 mb-7">
      <div class="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-1">Monthly Spend by Type</h3>
        <p class="text-xs text-gray-400 mb-4">Stacked bars = expenses · Green dots = income received</p>
        <div style="position:relative;height:250px"><canvas id="ov-monthly"></canvas></div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Spend by Category</h3>
        <div style="position:relative;height:180px"><canvas id="ov-cat"></canvas></div>
        <div class="mt-4 space-y-1.5">
          ${catTotals.slice(0,5).map(([cat,val])=>`
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full" style="background:${CATEGORY_COLORS[cat]||'#9ca3af'}"></div>
                <span class="text-gray-500">${cat}</span>
              </div>
              <span class="font-medium text-gray-800">${fmt(val)}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="grid grid-cols-3 gap-5">
      <!-- Expense type breakdown -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Expense Type Breakdown</h3>
        <div class="space-y-4">
          ${typeBar('Monthly Recurring', recurringTotal, totalExpenses, '#f59e0b')}
          ${typeBar('Annual / Periodic', annualTotal,    totalExpenses, '#3b82f6')}
          ${typeBar('One-Time Purchases', oneTimeTotal,  totalExpenses, '#ef4444')}
        </div>
        <div class="mt-5 pt-4 border-t border-gray-100 text-xs text-gray-400">
          Total: <span class="font-semibold text-gray-700">${fmt(totalExpenses)}</span>
        </div>
      </div>

      <!-- Monthly detail table -->
      <div class="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Month-by-Month Summary</h3>
        <table class="w-full text-sm">
          <thead>
            <tr class="text-xs font-medium text-gray-400 uppercase tracking-wide">
              <th class="text-left pb-2">Month</th>
              <th class="text-right pb-2">Recurring</th>
              <th class="text-right pb-2">Annual</th>
              <th class="text-right pb-2">One-Time</th>
              <th class="text-right pb-2">Income</th>
              <th class="text-right pb-2">Net</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            ${monthly.map(m=>{
              const net = m.income - m.total;
              return `<tr class="hover:bg-gray-50">
                <td class="py-2.5 font-medium text-gray-800">${m.label} 2026</td>
                <td class="py-2.5 text-right text-gray-600">${fmt(m.monthly)}</td>
                <td class="py-2.5 text-right text-gray-600">${m.annual>0?fmt(m.annual):'-'}</td>
                <td class="py-2.5 text-right text-gray-600">${m.oneTime>0?fmt(m.oneTime):'-'}</td>
                <td class="py-2.5 text-right ${m.income>0?'text-green-600 font-medium':'text-gray-300'}">${m.income>0?fmt(m.income):'-'}</td>
                <td class="py-2.5 text-right font-semibold ${net>=0?'text-green-600':'text-red-500'}">${fmt(net)}</td>
              </tr>`;
            }).join('')}
          </tbody>
          <tfoot class="border-t-2 border-gray-200">
            <tr class="font-semibold text-gray-900">
              <td class="pt-3">YTD Total</td>
              <td class="pt-3 text-right">${fmt(recurringTotal)}</td>
              <td class="pt-3 text-right">${fmt(annualTotal)}</td>
              <td class="pt-3 text-right">${fmt(oneTimeTotal)}</td>
              <td class="pt-3 text-right text-green-600">${fmt(totalIncome)}</td>
              <td class="pt-3 text-right ${isProfit?'text-green-600':'text-red-500'}">${fmt(netProfit)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>`;

  requestAnimationFrame(()=>{
    _monthlyChart(monthly);
    _catChart(catTotals);
  });
}

function kpi(label, value, color, sub, up) {
  const arrow = up===true
    ? `<svg style="width:12px;height:12px;flex-shrink:0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>`
    : up===false
      ? `<svg style="width:12px;height:12px;flex-shrink:0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`
      : '';
  const subColor = up===true ? 'text-green-600' : up===false ? 'text-red-500' : 'text-gray-400';
  return `<div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
    <div class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">${label}</div>
    <div class="text-2xl font-bold ${color}">${value}</div>
    <div class="mt-2 flex items-center gap-1 text-xs font-medium ${subColor}">${arrow}${sub}</div>
  </div>`;
}

function typeBar(label, val, total, color) {
  const pct = total>0 ? ((val/total)*100).toFixed(0) : 0;
  return `<div>
    <div class="flex justify-between text-xs mb-1.5">
      <span class="text-gray-500">${label}</span>
      <span class="font-semibold text-gray-800">${new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2}).format(val)} <span class="text-gray-400 font-normal">(${pct}%)</span></span>
    </div>
    <div class="bg-gray-100 rounded-full h-1.5">
      <div class="h-1.5 rounded-full" style="width:${pct}%;background:${color}"></div>
    </div>
  </div>`;
}

function _monthlyChart(monthly) {
  const ctx = document.getElementById('ov-monthly');
  if (!ctx) return;
  _charts.push(new Chart(ctx, {
    type:'bar',
    data: {
      labels: monthly.map(m=>m.label),
      datasets:[
        { label:'Recurring',  data:monthly.map(m=>m.monthly), backgroundColor:'rgba(245,158,11,0.85)', borderRadius:3, stack:'exp' },
        { label:'Annual',     data:monthly.map(m=>m.annual),  backgroundColor:'rgba(59,130,246,0.8)',  borderRadius:3, stack:'exp' },
        { label:'One-Time',   data:monthly.map(m=>m.oneTime), backgroundColor:'rgba(239,68,68,0.8)',   borderRadius:3, stack:'exp' },
        {
          label:'Income', data:monthly.map(m=>m.income),
          type:'line', borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.15)',
          pointBackgroundColor:'#22c55e', pointRadius:5, pointHoverRadius:7,
          fill:false, tension:0, yAxisID:'y',
        },
      ],
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{ position:'top', labels:{ font:{size:10}, boxWidth:10, padding:12 } },
        tooltip:{ callbacks:{ label: c=>` ${c.dataset.label}: ${new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2}).format(c.raw)}` } },
      },
      scales:{
        x:{ stacked:true, grid:{display:false}, ticks:{font:{size:10}} },
        y:{ stacked:true, grid:{color:'#f1f5f9'}, ticks:{font:{size:10}, callback:v=>'$'+(v/1000).toFixed(0)+'k'} },
      },
    },
  }));
}

function _catChart(catTotals) {
  const ctx = document.getElementById('ov-cat');
  if (!ctx) return;
  _charts.push(new Chart(ctx, {
    type:'doughnut',
    data:{
      labels: catTotals.map(([c])=>c),
      datasets:[{
        data: catTotals.map(([,v])=>v),
        backgroundColor: catTotals.map(([c])=>CATEGORY_COLORS[c]||'#9ca3af'),
        borderWidth:2, borderColor:'#fff',
      }],
    },
    options:{
      responsive:true, maintainAspectRatio:false, cutout:'66%',
      plugins:{
        legend:{display:false},
        tooltip:{ callbacks:{ label: c=>` ${c.label}: ${new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2}).format(c.raw)}` } },
      },
    },
  }));
}

function _kill() { _charts.forEach(c=>c.destroy()); _charts=[]; }

import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { useApp } from '../AppContext';
import { computeSummary, formatINR, getMonthsBack, CAT_COLORS, CAT_EMOJI } from '../data';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg border border-border-2 rounded-xl p-3 text-sm font-mono shadow-card">
      <p className="text-ink-3 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill }} className="font-semibold">{p.name}: {formatINR(p.value)}</p>
      ))}
    </div>
  );
};

export default function InsightsPage() {
  const { state } = useApp();
  const { transactions } = state;

  const now = new Date();
  const expenses = transactions.filter(t => t.type === 'expense');

  const byCat = useMemo(() => {
    const m = {};
    expenses.forEach(t => { m[t.category] = (m[t.category] || 0) + t.amount; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const topCat = byCat[0] || ['N/A', 0];
  const totalExp = expenses.reduce((s, t) => s + t.amount, 0);
  const { income: totalInc } = computeSummary(transactions);
  const savRate = totalInc ? Math.round(((totalInc - totalExp) / totalInc) * 100) : 0;

  const thisMonthExp = expenses.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((s, t) => s + t.amount, 0);

  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthExp = expenses.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear();
  }).reduce((s, t) => s + t.amount, 0);

  const momDiff = lastMonthExp ? Math.round(((thisMonthExp - lastMonthExp) / lastMonthExp) * 100) : 0;

  
  const monthlyData = useMemo(() => {
    return getMonthsBack(6).map(m => {
      const inc = transactions.filter(t => t.type === 'income' && new Date(t.date).getMonth() === m.month && new Date(t.date).getFullYear() === m.year).reduce((s, t) => s + t.amount, 0);
      const exp = transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === m.month && new Date(t.date).getFullYear() === m.year).reduce((s, t) => s + t.amount, 0);
      return { name: m.label, Income: inc, Expenses: exp };
    });
  }, [transactions]);

  const topCategories = byCat.slice(0, 7);
  const maxCatVal = topCategories[0]?.[1] || 1;

  const InsightCard = ({ icon, title, value, sub, valueColor, barWidth, barColor, delay }) => (
    <div className="card p-5 fade-in" style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}>
      <div className="text-2xl mb-3">{icon}</div>
      <p className="text-[11px] uppercase tracking-widest font-bold text-ink-3 mb-1">{title}</p>
      <p className="text-xl font-extrabold font-syne" style={{ color: valueColor }}>{value}</p>
      <p className="text-xs text-ink-3 mt-1 mb-3">{sub}</p>
      {barWidth !== undefined && (
        <div className="h-1.5 bg-bg-4 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(barWidth, 100)}%`, background: barColor }} />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 page-enter">
     
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InsightCard
          icon={CAT_EMOJI[topCat[0]] || '🏷️'}
          title="Top Spending Category"
          value={topCat[0]}
          sub={`${formatINR(topCat[1])} total · ${totalExp ? Math.round(topCat[1] / totalExp * 100) : 0}% of spending`}
          valueColor={CAT_COLORS[topCat[0]] || '#888'}
          barWidth={totalExp ? topCat[1] / totalExp * 100 : 0}
          barColor={CAT_COLORS[topCat[0]] || '#888'}
          delay={0}
        />
        <InsightCard
          icon={momDiff > 0 ? '📈' : '📉'}
          title="Month-over-Month Expenses"
          value={`${momDiff > 0 ? '↑' : '↓'} ${Math.abs(momDiff)}%`}
          sub={`vs last month (${formatINR(lastMonthExp)})`}
          valueColor={momDiff > 10 ? '#ff4d6d' : momDiff < 0 ? '#00d2a0' : '#f5b942'}
          barWidth={Math.min(Math.abs(momDiff), 100)}
          barColor={momDiff > 10 ? '#ff4d6d' : '#00d2a0'}
          delay={80}
        />
        <InsightCard
          icon="◑"
          title="Overall Savings Rate"
          value={`${savRate}%`}
          sub={savRate >= 30 ? '🎉 Excellent — you\'re a savings champion!' : savRate >= 15 ? '👍 Good progress, keep it up!' : '📌 Consider reducing expenses'}
          valueColor={savRate >= 30 ? '#00d2a0' : savRate >= 15 ? '#f5b942' : '#ff4d6d'}
          barWidth={Math.min(savRate, 100)}
          barColor={savRate >= 30 ? '#00d2a0' : '#f5b942'}
          delay={160}
        />
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-4">
        {/* Monthly bar chart */}
        <div className="card p-5">
          <h3 className="font-syne font-bold text-base text-ink mb-0.5">Monthly Comparison</h3>
          <p className="text-xs text-ink-3 mb-5">Income vs Expenses — last 6 months</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#55556a', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#55556a', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false}
                tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'k'} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Income" fill="#00d2a0" radius={[5, 5, 0, 0]} name="Income" />
              <Bar dataKey="Expenses" fill="#ff4d6d" radius={[5, 5, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-ink-2"><span className="w-2.5 h-2.5 rounded-full bg-[#00d2a0]"/>Income</span>
            <span className="flex items-center gap-1.5 text-xs text-ink-2"><span className="w-2.5 h-2.5 rounded-full bg-[#ff4d6d]"/>Expenses</span>
          </div>
        </div>

        
        <div className="card p-5">
          <h3 className="font-syne font-bold text-base text-ink mb-0.5">Category Breakdown</h3>
          <p className="text-xs text-ink-3 mb-5">Top spending areas — all time</p>
          <div className="space-y-3">
            {topCategories.map(([cat, val]) => (
              <div key={cat} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-2">{CAT_EMOJI[cat]} {cat}</span>
                  <span className="font-mono text-ink">{formatINR(val)}</span>
                </div>
                <div className="h-1.5 bg-bg-4 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.round(val / maxCatVal * 100)}%`, background: CAT_COLORS[cat] || '#888' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="card p-5">
        <h3 className="font-syne font-bold text-base text-ink mb-4">💡 Quick Observations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Avg Monthly Expense', value: formatINR(Math.round(totalExp / 6)) },
            { label: 'Highest Single Expense', value: formatINR(Math.max(...expenses.map(t => t.amount), 0)) },
            { label: 'Total Transactions', value: transactions.length },
            { label: 'Expense Categories Used', value: byCat.length },
            { label: 'Income Sources', value: [...new Set(transactions.filter(t => t.type === 'income').map(t => t.category))].length },
            { label: 'Months Tracked', value: [...new Set(transactions.map(t => t.date.slice(0, 7)))].length },
          ].map(obs => (
            <div key={obs.label} className="bg-bg-3 rounded-xl p-4 border border-border">
              <p className="text-xs text-ink-3 mb-1.5">{obs.label}</p>
              <p className="text-lg font-extrabold font-mono text-ink">{obs.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

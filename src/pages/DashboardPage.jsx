import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend,
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { useApp } from '../AppContext';
import StatCard from '../components/StatCard';
import { computeSummary, formatINR, getMonthsBack, CAT_COLORS, CAT_EMOJI } from '../data';

const PERIODS = [{ key: '6m', label: '6M' }, { key: '3m', label: '3M' }, { key: '1m', label: '1M' }];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg border border-border-2 rounded-xl p-3 text-sm font-mono shadow-card">
      <p className="text-ink-3 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">{formatINR(p.value)}</p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { state, dispatch } = useApp();
  const { transactions, chartPeriod } = state;

  const now = new Date();
  const thisMonth = useMemo(() => transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }), [transactions]);

  const allSummary = useMemo(() => computeSummary(transactions), [transactions]);
  const monthSummary = useMemo(() => computeSummary(thisMonth), [thisMonth]);

  const months = useMemo(() => getMonthsBack(chartPeriod === '6m' ? 6 : chartPeriod === '3m' ? 3 : 2), [chartPeriod]);
  const trendData = useMemo(() => months.map(m => {
    const before = transactions.filter(t => new Date(t.date) <= new Date(m.endDate));
    const { income, expense } = computeSummary(before);
    return { name: m.label, balance: income - expense, income: before.filter(t => t.type==='income' && new Date(t.date).getMonth()===m.month).reduce((s,t)=>s+t.amount,0) };
  }), [months, transactions]);

  
  const donutData = useMemo(() => {
    const byCat = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      byCat[t.category] = (byCat[t.category] || 0) + t.amount;
    });
    return Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 6)
      .map(([cat, value]) => ({ name: cat, value, color: CAT_COLORS[cat] || '#888' }));
  }, [transactions]);

  const totalSpent = donutData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6 page-enter">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<Wallet size={20} className="text-accent-2" />}
          label="Total Balance"
          value={formatINR(allSummary.balance)}
          sub="Lifetime net balance"
          trend="4.2%"
          trendUp={allSummary.balance >= 0}
          glowColor="rgba(108,92,231,0.15)"
          delay={0}
        />
        <StatCard
          icon={<TrendingUp size={20} className="text-emerald-400" />}
          label="Monthly Income"
          value={formatINR(monthSummary.income)}
          sub="This calendar month"
          trend="8.1%"
          trendUp
          glowColor="rgba(0,210,160,0.12)"
          delay={60}
        />
        <StatCard
          icon={<TrendingDown size={20} className="text-rose-400" />}
          label="Monthly Expenses"
          value={formatINR(monthSummary.expense)}
          sub="This calendar month"
          trend="3.5%"
          trendUp={false}
          glowColor="rgba(255,77,109,0.12)"
          delay={120}
        />
        <StatCard
          icon={<PiggyBank size={20} className="text-amber-400" />}
          label="Savings Rate"
          value={`${monthSummary.savingsRate}%`}
          sub={monthSummary.savingsRate >= 30 ? '🎉 Excellent savings!' : monthSummary.savingsRate >= 15 ? '👍 Keep it up' : '📈 Improve savings'}
          trend={`${monthSummary.savingsRate}%`}
          trendUp={monthSummary.savingsRate >= 20}
          glowColor="rgba(245,185,66,0.12)"
          delay={180}
        />
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-4">
       
        <div className="card p-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-syne font-bold text-base text-ink">Balance Trend</h3>
              <p className="text-xs text-ink-3 mt-0.5">Cumulative balance over time</p>
            </div>
            <div className="flex gap-1">
              {PERIODS.map(p => (
                <button
                  key={p.key}
                  onClick={() => dispatch({ type: 'SET_CHART_PERIOD', payload: p.key })}
                  className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all font-mono
                    ${chartPeriod === p.key
                      ? 'bg-accent/20 border-accent/30 text-accent-2'
                      : 'bg-bg-3 border-border text-ink-3 hover:text-ink'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c5ce7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6c5ce7" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#55556a', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#55556a', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false}
                tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'k'} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="balance" stroke="#6c5ce7" strokeWidth={2.5}
                fill="url(#balGrad)" dot={{ fill: '#6c5ce7', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        
        <div className="card p-5">
          <div className="mb-4">
            <h3 className="font-syne font-bold text-base text-ink">Spending Breakdown</h3>
            <p className="text-xs text-ink-3 mt-0.5">By category — all time</p>
          </div>
          <div className="relative">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                  dataKey="value" paddingAngle={3} stroke="none">
                  {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v) => formatINR(v)} contentStyle={{ background: '#111119', border: '1px solid #25253a', borderRadius: 12, fontFamily: 'DM Mono' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="font-mono text-base font-bold text-ink">{formatINR(totalSpent)}</p>
              <p className="text-[10px] text-ink-3 uppercase tracking-wider">Total Spent</p>
            </div>
          </div>
          <div className="space-y-2 mt-2">
            {donutData.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-ink-2 flex-1">{CAT_EMOJI[d.name]} {d.name}</span>
                <span className="font-mono text-ink">{formatINR(d.value)}</span>
                <span className="font-mono text-ink-3">{Math.round(d.value / totalSpent * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

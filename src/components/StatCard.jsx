import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ icon, label, value, sub, trend, trendUp, glowColor, delay = 0 }) {
  return (
    <div
      className="stat-card fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
     
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(circle at top right, ${glowColor}, transparent 65%)` }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{ background: glowColor }}
          >
            {icon}
          </div>
          {trend !== undefined && (
            <span className={`flex items-center gap-1 text-xs font-bold font-mono px-2 py-0.5 rounded-full
              ${trendUp ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
              {trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {trend}
            </span>
          )}
        </div>
        <p className="text-[11px] uppercase tracking-widest text-ink-3 font-bold mb-1">{label}</p>
        <p className="text-2xl font-extrabold font-syne tracking-tight text-ink leading-none">{value}</p>
        {sub && <p className="text-xs text-ink-3 mt-2">{sub}</p>}
      </div>
    </div>
  );
}

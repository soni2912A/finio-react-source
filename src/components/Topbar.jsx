import { Sun, Moon, Download, Menu, User } from 'lucide-react';
import { useApp } from '../AppContext';

const PAGE_META = {
  dashboard:    { title: 'Dashboard',    sub: 'Overview' },
  transactions: { title: 'Transactions', sub: 'All records' },
  insights:     { title: 'Insights',     sub: 'Analysis' },
};

export default function Topbar({ onMobileMenu }) {
  const { state, dispatch, showToast } = useApp();
  const { page, theme, role, sidebarCollapsed } = state;
  const { title, sub } = PAGE_META[page];

  const toggleTheme = () => dispatch({ type: 'TOGGLE_THEME' });

  const exportCSV = () => {
    if (role !== 'admin') { showToast('Viewer role cannot export', 'error'); return; }
    const rows = ['Date,Type,Category,Merchant,Amount,Note',
      ...state.transactions.map(t => `${t.date},${t.type},${t.category},"${t.merchant}",${t.amount},"${t.note || ''}"`)
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows], { type: 'text/csv' }));
    a.download = 'finio_transactions.csv';
    a.click();
    showToast('CSV exported successfully!', 'success');
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 h-16 bg-bg-2 border-b border-border">
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenu}
          className="md:hidden w-9 h-9 rounded-xl bg-bg-3 border border-border flex items-center justify-center text-ink-2 hover:text-ink transition-colors"
        >
          <Menu size={17} />
        </button>
        <div>
          <h1 className="font-syne font-bold text-lg text-ink leading-none">
            {title}
            <span className="text-ink-3 font-normal text-sm ml-2">{sub}</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden sm:block font-mono text-xs text-ink-3 bg-bg-3 border border-border rounded-lg px-3 py-1.5">
          {new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric', day: '2-digit' })}
        </span>

        <button
          onClick={exportCSV}
          className={`hidden sm:flex items-center gap-1.5 font-syne text-xs font-semibold px-3 py-1.5 rounded-lg bg-bg-3 border border-border transition-colors
            ${role === 'admin' ? 'text-ink-2 hover:text-ink hover:border-border-2' : 'text-ink-3 cursor-not-allowed opacity-50'}`}
        >
          <Download size={14} /> Export
        </button>

        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl bg-bg-3 border border-border flex items-center justify-center text-ink-2 hover:text-ink transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-[#00d2a0] flex items-center justify-center text-white text-sm font-bold cursor-pointer">
          AS
        </div>
      </div>
    </header>
  );
}

import { LayoutDashboard, ArrowLeftRight, Lightbulb, ChevronLeft, ShieldCheck, Eye } from 'lucide-react';
import { useApp } from '../AppContext';

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',     Icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions',  Icon: ArrowLeftRight },
  { id: 'insights',     label: 'Insights',      Icon: Lightbulb },
];

export default function Sidebar() {
  const { state, dispatch, showToast } = useApp();
  const { page, sidebarCollapsed, role, transactions } = state;
  const col = sidebarCollapsed;

  const navigate = (p) => dispatch({ type: 'SET_PAGE', payload: p });
  const changeRole = (r) => {
    dispatch({ type: 'SET_ROLE', payload: r });
    showToast(r === 'admin' ? '⬡ Switched to Admin mode' : '◌ Switched to Viewer (read-only)', 'info');
  };

  return (
    <aside className={`
      fixed top-0 left-0 h-full z-50 flex flex-col
      bg-bg-2 border-r border-border
      transition-all duration-300 ease-in-out
      ${col ? 'w-[68px]' : 'w-[240px]'}
    `}>
      
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center flex-shrink-0 shadow-glow text-white font-bold text-lg">
          ◈
        </div>
        {!col && (
          <span className="font-syne text-xl font-extrabold tracking-tight text-ink">
            Fin<span className="text-accent-2">io</span>
          </span>
        )}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className={`ml-auto w-7 h-7 rounded-lg bg-bg-3 border border-border flex items-center justify-center text-ink-3 hover:text-ink transition-colors flex-shrink-0 ${col ? 'rotate-180' : ''}`}
        >
          <ChevronLeft size={14} />
        </button>
      </div>

    
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {!col && <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-ink-3 px-3 pb-2 pt-1">Menu</p>}
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => navigate(id)}
            className={`nav-item w-full ${page === id ? 'nav-item-active' : ''}`}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!col && <span className="flex-1 text-left">{label}</span>}
            {!col && id === 'transactions' && (
              <span className="badge bg-accent/20 text-accent-2">{transactions.length}</span>
            )}
            {col && page === id && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-accent rounded-r-full" />
            )}
          </button>
        ))}
      </nav>

      
      <div className="p-3 border-t border-border">
        <div className="bg-bg-3 border border-border rounded-xl p-3 space-y-2">
          {!col && <p className="text-[10px] font-bold uppercase tracking-[1px] text-ink-3">Active Role</p>}
          {!col ? (
            <select
              value={role}
              onChange={e => changeRole(e.target.value)}
              className="input-base text-xs py-1.5"
            >
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          ) : null}
          <div className={`flex items-center gap-1.5 ${col ? 'justify-center' : ''}`}>
            {role === 'admin'
              ? <><ShieldCheck size={13} className="text-accent-2" />{!col && <span className="text-xs font-bold text-accent-2">Admin</span>}</>
              : <><Eye size={13} className="text-sky-400" />{!col && <span className="text-xs font-bold text-sky-400">Viewer</span>}</>
            }
          </div>
        </div>
      </div>
    </aside>
  );
}

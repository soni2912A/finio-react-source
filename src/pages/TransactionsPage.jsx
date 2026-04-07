import { useState, useMemo } from 'react';
import { Search, Plus, ArrowUpDown, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../AppContext';
import TransactionModal from '../components/TransactionModal';
import { CAT_COLORS, CAT_EMOJI, formatINR, formatDate, CATEGORIES } from '../data';

const SORT_FIELDS = ['date', 'merchant', 'category', 'type', 'amount'];

export default function TransactionsPage() {
  const { state, dispatch, showToast } = useApp();
  const { transactions, role, search, filterType, filterCat, filterMonth, sortField, sortDir, currentPage, perPage } = state;

  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState(null);


  const months = useMemo(() => [...new Set(transactions.map(t => t.date.slice(0, 7)))].sort().reverse(), [transactions]);

  const filtered = useMemo(() => {
    return transactions
      .filter(t => {
        if (filterType && t.type !== filterType) return false;
        if (filterCat && t.category !== filterCat) return false;
        if (filterMonth && !t.date.startsWith(filterMonth)) return false;
        if (search) {
          const q = search.toLowerCase();
          return t.merchant.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q) ||
            (t.note || '').toLowerCase().includes(q) ||
            String(t.amount).includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        let av = a[sortField], bv = b[sortField];
        if (sortField === 'amount') { av = Number(av); bv = Number(bv); }
        if (av < bv) return -sortDir;
        if (av > bv) return sortDir;
        return 0;
      });
  }, [transactions, filterType, filterCat, filterMonth, search, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const pageItems = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const openAdd = () => {
    if (role !== 'admin') { showToast('Viewer role cannot add transactions', 'error'); return; }
    setEditTx(null); setModalOpen(true);
  };
  const openEdit = (tx) => {
    if (role !== 'admin') return;
    setEditTx(tx); setModalOpen(true);
  };
  const deleteTx = (id) => {
    if (role !== 'admin') { showToast('Viewer role cannot delete', 'error'); return; }
    dispatch({ type: 'DELETE_TX', payload: id });
    showToast('Transaction deleted', 'success');
  };

  const SortIcon = ({ field }) => (
    <ArrowUpDown size={12} className={`inline ml-1 ${sortField === field ? 'text-accent-2' : 'text-ink-3'}`} />
  );

  return (
    <div className="space-y-4 page-enter">
     
      <div className="flex flex-wrap items-center gap-3">
        
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            className="input-base pl-9"
            placeholder="Search transactions…"
            value={search}
            onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
          />
        </div>

       
        <select className="input-base w-auto" value={filterType}
          onChange={e => dispatch({ type: 'SET_FILTER', key: 'filterType', payload: e.target.value })}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select className="input-base w-auto" value={filterCat}
          onChange={e => dispatch({ type: 'SET_FILTER', key: 'filterCat', payload: e.target.value })}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className="input-base w-auto" value={filterMonth}
          onChange={e => dispatch({ type: 'SET_FILTER', key: 'filterMonth', payload: e.target.value })}>
          <option value="">All Months</option>
          {months.map(m => {
            const [y, mo] = m.split('-');
            const label = new Date(y, mo - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
            return <option key={m} value={m}>{label}</option>;
          })}
        </select>

        <button
          onClick={openAdd}
          className={`btn-primary ${role !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Plus size={15} /> Add Transaction
        </button>
      </div>

      
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-bg-3 border-b border-border">
                {[
                  { key: 'date', label: 'Date' },
                  { key: 'merchant', label: 'Merchant' },
                  { key: 'category', label: 'Category' },
                  { key: 'type', label: 'Type' },
                  { key: 'amount', label: 'Amount' },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => dispatch({ type: 'SET_SORT', payload: col.key })}
                    className={`text-left px-4 py-3 text-[11px] uppercase tracking-widest font-bold cursor-pointer select-none transition-colors
                      ${sortField === col.key ? 'text-accent-2' : 'text-ink-3 hover:text-ink-2'}`}
                  >
                    {col.label}<SortIcon field={col.key} />
                  </th>
                ))}
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest font-bold text-ink-3">Note</th>
                {role === 'admin' && <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest font-bold text-ink-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-ink-3">
                    <div className="text-4xl mb-3">⬡</div>
                    <p className="font-bold text-ink-2 mb-1">No transactions found</p>
                    <p className="text-sm">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : pageItems.map(tx => (
                <tr key={tx.id} className="tx-row group">
                  <td className="px-4 py-3 font-mono text-xs text-ink-3">{formatDate(tx.date)}</td>
                  <td className="px-4 py-3 font-semibold text-sm text-ink">{tx.merchant}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: CAT_COLORS[tx.category] + '22', color: CAT_COLORS[tx.category] }}>
                      {CAT_EMOJI[tx.category]} {tx.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold font-mono ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.type === 'income' ? '▲ Income' : '▼ Expense'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-sm"
                    style={{ color: tx.type === 'income' ? '#00d2a0' : '#ff4d6d' }}>
                    {tx.type === 'income' ? '+' : '-'}{formatINR(tx.amount)}
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-3 max-w-[140px] truncate">{tx.note || '—'}</td>
                  {role === 'admin' && (
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(tx)}
                          className="w-7 h-7 rounded-lg bg-bg-3 border border-border flex items-center justify-center text-ink-3 hover:text-accent-2 hover:border-accent/30 transition-colors">
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => deleteTx(tx.id)}
                          className="w-7 h-7 rounded-lg bg-bg-3 border border-border flex items-center justify-center text-ink-3 hover:text-rose-400 hover:border-rose-500/30 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-ink-3 font-mono">
            {filtered.length === 0 ? '0 results' : `${(currentPage - 1) * perPage + 1}–${Math.min(currentPage * perPage, filtered.length)} of ${filtered.length}`}
          </p>
          <div className="flex gap-1.5 items-center">
            <button
              disabled={currentPage <= 1}
              onClick={() => dispatch({ type: 'SET_PAGE_NUM', payload: currentPage - 1 })}
              className="w-8 h-8 rounded-lg bg-bg-3 border border-border flex items-center justify-center text-ink-2 hover:text-ink disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = i + 1;
              return (
                <button key={p} onClick={() => dispatch({ type: 'SET_PAGE_NUM', payload: p })}
                  className={`w-8 h-8 rounded-lg text-xs font-bold border transition-colors
                    ${currentPage === p ? 'bg-accent border-accent text-white' : 'bg-bg-3 border-border text-ink-2 hover:text-ink'}`}
                >
                  {p}
                </button>
              );
            })}
            <button
              disabled={currentPage >= totalPages}
              onClick={() => dispatch({ type: 'SET_PAGE_NUM', payload: currentPage + 1 })}
              className="w-8 h-8 rounded-lg bg-bg-3 border border-border flex items-center justify-center text-ink-2 hover:text-ink disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {modalOpen && <TransactionModal editTx={editTx} onClose={() => setModalOpen(false)} />}
    </div>
  );
}

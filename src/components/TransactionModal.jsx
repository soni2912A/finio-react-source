import { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../AppContext';
import { CATEGORIES, CAT_EMOJI } from '../data';

export default function TransactionModal({ editTx, onClose }) {
  const { dispatch, showToast } = useApp();
  const isEdit = !!editTx;

  const [form, setForm] = useState({
    type: 'income',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Salary',
    merchant: '',
    note: '',
  });

  useEffect(() => {
    if (editTx) setForm({ ...editTx, amount: String(editTx.amount) });
  }, [editTx]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = () => {
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) { showToast('Enter a valid amount', 'error'); return; }
    if (!form.date) { showToast('Select a date', 'error'); return; }
    if (!form.merchant.trim()) { showToast('Enter merchant name', 'error'); return; }

    const payload = { ...form, amount, merchant: form.merchant.trim() };
    if (isEdit) {
      dispatch({ type: 'UPDATE_TX', payload });
      showToast('Transaction updated!', 'success');
    } else {
      dispatch({ type: 'ADD_TX', payload });
      showToast('Transaction added!', 'success');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="modal-enter bg-bg-2 border border-border-2 rounded-2xl p-6 w-full max-w-md shadow-card">

       
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-syne text-lg font-extrabold text-ink">
            {isEdit ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-bg-3 border border-border flex items-center justify-center text-ink-3 hover:text-rose-400 hover:border-rose-500/30 transition-colors">
            <X size={16} />
          </button>
        </div>

       
        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            onClick={() => set('type', 'income')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm border transition-all
              ${form.type === 'income'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-bg-3 border-border text-ink-3 hover:text-ink'}`}
          >
            <TrendingUp size={15} /> Income
          </button>
          <button
            onClick={() => set('type', 'expense')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm border transition-all
              ${form.type === 'expense'
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                : 'bg-bg-3 border-border text-ink-3 hover:text-ink'}`}
          >
            <TrendingDown size={15} /> Expense
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-1.5">Amount (₹)</label>
            <input className="input-base" type="number" min="0" placeholder="0.00"
              value={form.amount} onChange={e => set('amount', e.target.value)} />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-1.5">Date</label>
            <input className="input-base" type="date"
              value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-1.5">Category</label>
            <select className="input-base" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{CAT_EMOJI[c]} {c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-1.5">Merchant</label>
            <input className="input-base" type="text" placeholder="e.g. Swiggy"
              value={form.merchant} onChange={e => set('merchant', e.target.value)} />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-1.5">Note (optional)</label>
          <textarea className="input-base resize-none" rows={2} placeholder="Add a short note…"
            value={form.note} onChange={e => set('note', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={onClose} className="btn-secondary justify-center">Cancel</button>
          <button onClick={save} className="btn-primary justify-center">{isEdit ? 'Save Changes' : 'Add Transaction'}</button>
        </div>
      </div>
    </div>
  );
}

import { useApp } from '../AppContext';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const ICONS = {
  success: <CheckCircle size={16} className="text-emerald-400" />,
  error:   <XCircle size={16} className="text-rose-400" />,
  info:    <Info size={16} className="text-sky-400" />,
};

export default function Toast() {
  const { state } = useApp();
  const { toast } = state;

  return (
    <div className={`
      fixed bottom-6 right-6 z-[200]
      flex items-center gap-3
      bg-bg-2 border border-border-2 rounded-2xl
      px-4 py-3 shadow-card
      font-syne text-sm font-semibold text-ink
      transition-all duration-300
      ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
    `}>
      {toast && ICONS[toast.type]}
      <span>{toast?.msg}</span>
    </div>
  );
}

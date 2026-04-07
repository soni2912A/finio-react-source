import { useState } from 'react';
import { AppProvider, useApp } from './AppContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Toast from './components/Toast';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage from './pages/InsightsPage';

function AppInner() {
  const { state } = useApp();
  const { page, sidebarCollapsed } = state;
  const [mobileOpen, setMobileOpen] = useState(false);

  const col = sidebarCollapsed;
  const sideW = col ? 68 : 240;

  return (
    <div className="min-h-screen font-syne bg-bg text-ink">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="fixed top-0 left-0 h-full z-50 hidden md:block">
        <Sidebar />
      </div>

      <div
        className={`fixed top-0 left-0 h-full z-50 md:hidden transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar />
      </div>

      <div
        className="min-h-screen flex flex-col transition-all duration-300"
        style={{ marginLeft: `${sideW}px` }}
      >
        <Topbar onMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {page === 'dashboard'    && <DashboardPage />}
          {page === 'transactions' && <TransactionsPage />}
          {page === 'insights'     && <InsightsPage />}
        </main>
      </div>

      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

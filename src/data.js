export const CAT_COLORS = {
  Food: '#ff6b6b',
  Transport: '#ffa94d',
  Shopping: '#ff9ff3',
  Health: '#a78bfa',
  Entertainment: '#22d3ee',
  Bills: '#f59e0b',
  Education: '#60a5fa',
  Salary: '#00d2a0',
  Freelance: '#a29bfe',
  Investment: '#f5b942',
  Other: '#94a3b8',
};

export const CAT_EMOJI = {
  Food: '🍕', Transport: '🚗', Shopping: '🛍️', Health: '💊',
  Entertainment: '🎬', Bills: '⚡', Education: '📚', Salary: '💼',
  Freelance: '💻', Investment: '📈', Other: '📦',
};

export const CATEGORIES = Object.keys(CAT_COLORS);

export const SEED_TRANSACTIONS = [
  { id: 1,  type: 'income',  amount: 85000, category: 'Salary',        merchant: 'TechCorp Ltd',     date: '2026-04-01', note: 'April salary' },
  { id: 2,  type: 'income',  amount: 18000, category: 'Freelance',     merchant: 'Client A',         date: '2026-04-05', note: 'Web project' },
  { id: 3,  type: 'expense', amount: 4200,  category: 'Food',          merchant: 'Swiggy',           date: '2026-04-03', note: 'Monthly groceries' },
  { id: 4,  type: 'expense', amount: 2800,  category: 'Transport',     merchant: 'Uber',             date: '2026-04-04', note: 'Office commute' },
  { id: 5,  type: 'expense', amount: 12000, category: 'Shopping',      merchant: 'Amazon',           date: '2026-04-06', note: 'Electronics' },
  { id: 6,  type: 'expense', amount: 3500,  category: 'Health',        merchant: 'Apollo Pharmacy',  date: '2026-04-07', note: 'Checkup + medicines' },
  { id: 7,  type: 'expense', amount: 1800,  category: 'Entertainment', merchant: 'Netflix',          date: '2026-04-08', note: 'Subscriptions' },
  { id: 8,  type: 'expense', amount: 6200,  category: 'Bills',         merchant: 'Utilities',        date: '2026-04-02', note: 'Electricity, internet' },
  { id: 9,  type: 'income',  amount: 5000,  category: 'Investment',    merchant: 'Zerodha',          date: '2026-04-10', note: 'Dividend payout' },
  { id: 10, type: 'expense', amount: 2000,  category: 'Education',     merchant: 'Udemy',            date: '2026-04-11', note: 'React course' },
  { id: 11, type: 'expense', amount: 3200,  category: 'Food',          merchant: 'Zomato',           date: '2026-03-28', note: 'Team lunch' },
  { id: 12, type: 'income',  amount: 80000, category: 'Salary',        merchant: 'TechCorp Ltd',     date: '2026-03-01', note: 'March salary' },
  { id: 13, type: 'expense', amount: 9500,  category: 'Shopping',      merchant: 'Flipkart',         date: '2026-03-15', note: 'Clothes' },
  { id: 14, type: 'expense', amount: 4800,  category: 'Bills',         merchant: 'Utilities',        date: '2026-03-05', note: 'Bills march' },
  { id: 15, type: 'expense', amount: 1500,  category: 'Entertainment', merchant: 'Spotify + Prime',  date: '2026-03-20', note: 'Subscriptions' },
  { id: 16, type: 'income',  amount: 12000, category: 'Freelance',     merchant: 'Client B',         date: '2026-03-22', note: 'Design project' },
  { id: 17, type: 'expense', amount: 3800,  category: 'Transport',     merchant: 'Rapido',           date: '2026-03-10', note: '' },
  { id: 18, type: 'expense', amount: 5600,  category: 'Food',          merchant: 'Blinkit',          date: '2026-02-25', note: 'Groceries' },
  { id: 19, type: 'income',  amount: 82000, category: 'Salary',        merchant: 'TechCorp Ltd',     date: '2026-02-01', note: 'Feb salary' },
  { id: 20, type: 'expense', amount: 7200,  category: 'Health',        merchant: 'Max Hospital',     date: '2026-02-14', note: 'Dental' },
  { id: 21, type: 'expense', amount: 2200,  category: 'Education',     merchant: 'Coursera',         date: '2026-02-20', note: 'Certificate' },
  { id: 22, type: 'expense', amount: 4100,  category: 'Shopping',      merchant: 'Myntra',           date: '2026-01-30', note: 'Sale shopping' },
  { id: 23, type: 'income',  amount: 79000, category: 'Salary',        merchant: 'TechCorp Ltd',     date: '2026-01-01', note: 'Jan salary' },
  { id: 24, type: 'expense', amount: 3300,  category: 'Bills',         merchant: 'Jio',              date: '2026-01-10', note: 'Recharge' },
  { id: 25, type: 'income',  amount: 20000, category: 'Investment',    merchant: 'Groww',            date: '2025-12-15', note: 'Mutual fund gain' },
  { id: 26, type: 'income',  amount: 78000, category: 'Salary',        merchant: 'TechCorp Ltd',     date: '2025-12-01', note: 'Dec salary' },
  { id: 27, type: 'expense', amount: 15000, category: 'Shopping',      merchant: 'Amazon',           date: '2025-12-25', note: 'Christmas gifts' },
  { id: 28, type: 'expense', amount: 8000,  category: 'Entertainment', merchant: 'Goa Trip',         date: '2025-12-20', note: 'Vacation' },
  { id: 29, type: 'expense', amount: 4500,  category: 'Food',          merchant: 'Zomato',           date: '2025-11-18', note: '' },
  { id: 30, type: 'income',  amount: 76000, category: 'Salary',        merchant: 'TechCorp Ltd',     date: '2025-11-01', note: 'Nov salary' },
];

export const formatINR = (val) => {
  const neg = val < 0;
  return (neg ? '-' : '') + '₹' + Math.abs(val).toLocaleString('en-IN');
};

export const formatDate = (d) => {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const getMonthsBack = (n) => {
  const res = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    res.push({
      label: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
      month: d.getMonth(),
      year: d.getFullYear(),
      endDate: end.toISOString().split('T')[0],
    });
  }
  return res;
};

export const computeSummary = (txList) => {
  let income = 0, expense = 0;
  txList.forEach(t => { if (t.type === 'income') income += t.amount; else expense += t.amount; });
  return { income, expense, balance: income - expense, savingsRate: income ? Math.round(((income - expense) / income) * 100) : 0 };
};

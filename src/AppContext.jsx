import { createContext, useContext, useReducer, useEffect } from 'react';
import { SEED_TRANSACTIONS } from './data';

const AppContext = createContext(null);

const loadTx = () => {
  try {
    const saved = localStorage.getItem('finio_tx');
    return saved ? JSON.parse(saved) : SEED_TRANSACTIONS;
  } catch {
    return SEED_TRANSACTIONS;
  }
};

const initialState = {
  transactions: loadTx(),
  nextId: 100,
  role: 'admin',         
  theme: 'dark',         
  page: 'dashboard',     
  sidebarCollapsed: false,
  toast: null,           
  search: '',
  filterType: '',
  filterCat: '',
  filterMonth: '',
  sortField: 'date',
  sortDir: -1,
  currentPage: 1,
  perPage: 8,
  chartPeriod: '6m',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE': return { ...state, page: action.payload, currentPage: 1 };
    case 'SET_ROLE': return { ...state, role: action.payload };
    case 'TOGGLE_THEME': return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    case 'TOGGLE_SIDEBAR': return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'SET_SEARCH': return { ...state, search: action.payload, currentPage: 1 };
    case 'SET_FILTER': return { ...state, [action.key]: action.payload, currentPage: 1 };
    case 'SET_SORT': return {
      ...state,
      sortField: action.payload,
      sortDir: state.sortField === action.payload ? state.sortDir * -1 : -1,
      currentPage: 1,
    };
    case 'SET_PAGE_NUM': return { ...state, currentPage: action.payload };
    case 'SET_CHART_PERIOD': return { ...state, chartPeriod: action.payload };
    case 'ADD_TX': {
      const tx = { ...action.payload, id: state.nextId };
      const txs = [tx, ...state.transactions];
      localStorage.setItem('finio_tx', JSON.stringify(txs));
      return { ...state, transactions: txs, nextId: state.nextId + 1 };
    }
    case 'UPDATE_TX': {
      const txs = state.transactions.map(t => t.id === action.payload.id ? action.payload : t);
      localStorage.setItem('finio_tx', JSON.stringify(txs));
      return { ...state, transactions: txs };
    }
    case 'DELETE_TX': {
      const txs = state.transactions.filter(t => t.id !== action.payload);
      localStorage.setItem('finio_tx', JSON.stringify(txs));
      return { ...state, transactions: txs };
    }
    case 'SHOW_TOAST': return { ...state, toast: action.payload };
    case 'CLEAR_TOAST': return { ...state, toast: null };
    default: return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  
  useEffect(() => {
    if (state.toast) {
      const t = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 2800);
      return () => clearTimeout(t);
    }
  }, [state.toast]);

  const showToast = (msg, type = 'success') => dispatch({ type: 'SHOW_TOAST', payload: { msg, type } });

  return (
    <AppContext.Provider value={{ state, dispatch, showToast }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { detectCurrency, convert, formatMoney, RATES } from '@/lib/currency';

interface CurrencyCtx {
  currency: string;
  setCurrency: (c: string) => void;
}

const Ctx = createContext<CurrencyCtx>({ currency: 'USD', setCurrency: () => {} });

const STORAGE_KEY = 'nego-dash-currency';

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState('USD');

  // On mount, prefer a saved choice, otherwise detect from the merchant's locale.
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    setCurrencyState(saved && RATES[saved] ? saved : detectCurrency());
  }, []);

  function setCurrency(c: string) {
    setCurrencyState(c);
    try { localStorage.setItem(STORAGE_KEY, c); } catch { /* ignore */ }
  }

  return <Ctx.Provider value={{ currency, setCurrency }}>{children}</Ctx.Provider>;
}

export const useCurrency = () => useContext(Ctx);

/** Renders a monetary amount (given in `base` currency) in the merchant's chosen currency. */
export function Money({ amount, base = 'USD' }: { amount: number; base?: string }) {
  const { currency } = useCurrency();
  return <>{formatMoney(convert(amount, base, currency), currency)}</>;
}

export function CurrencySelect({ className = '' }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  return (
    <select
      value={currency}
      onChange={e => setCurrency(e.target.value)}
      aria-label="Display currency"
      title="Display currency (based on your location)"
      className={`rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2.5 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 outline-none focus:border-green-500 cursor-pointer ${className}`}
    >
      {Object.keys(RATES).map(c => <option key={c} value={c}>{c}</option>)}
    </select>
  );
}

// Currency conversion + formatting for the merchant dashboard.
// Rates are approximate static values relative to USD — swap for a live FX API if needed.
export const RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, NGN: 1620, GHS: 15.8, KES: 129, ZAR: 18.6,
  MXN: 17.2, BRL: 5.1, CAD: 1.36, AUD: 1.53, INR: 83.5, JPY: 157, CNY: 7.24,
  AED: 3.67, SAR: 3.75,
};

export const SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', NGN: '₦', GHS: 'GH₵', KES: 'KSh', ZAR: 'R',
  MXN: 'MX$', BRL: 'R$', CAD: 'CA$', AUD: 'A$', INR: '₹', JPY: '¥', CNY: '¥',
  AED: 'AED ', SAR: 'SAR ',
};

// Map a locale region (e.g. "NG", "MX") to a currency code.
const LOCALE_CURRENCY: Record<string, string> = {
  NG: 'NGN', GH: 'GHS', KE: 'KES', ZA: 'ZAR', MX: 'MXN', BR: 'BRL', CA: 'CAD',
  AU: 'AUD', IN: 'INR', JP: 'JPY', CN: 'CNY', AE: 'AED', SA: 'SAR', GB: 'GBP',
  DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR', NL: 'EUR', BE: 'EUR', PT: 'EUR',
  AT: 'EUR', IE: 'EUR', US: 'USD',
};

/** Best-effort currency for the visitor based on their browser locale region. */
export function detectCurrency(): string {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale; // e.g. "en-NG"
    const region = locale.split('-')[1]?.toUpperCase();
    if (region && LOCALE_CURRENCY[region]) return LOCALE_CURRENCY[region];
  } catch { /* ignore */ }
  return 'USD';
}

export function convert(amount: number, from: string, to: string): number {
  const f = RATES[from] ?? 1;
  const t = RATES[to] ?? 1;
  return (amount / f) * t;
}

export function formatMoney(amount: number, currency: string): string {
  const symbol = SYMBOLS[currency] ?? `${currency} `;
  const fractionDigits = currency === 'JPY' ? 0 : 2;
  const value = amount.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return `${symbol}${value}`;
}

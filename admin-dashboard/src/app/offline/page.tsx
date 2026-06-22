import { WifiOff } from 'lucide-react';

export const metadata = { title: 'Offline — Nego Bot' };

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100 text-green-600 mb-5">
          <WifiOff className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">You&apos;re offline</h1>
        <p className="text-sm text-gray-500 mb-6">
          The Nego Bot dashboard needs an internet connection. Check your network and try again.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
        >
          Retry
        </a>
      </div>
    </div>
  );
}

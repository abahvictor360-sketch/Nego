'use client';

import { useEffect, useState } from 'react';
import { Download, Check, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallApp() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // iOS Safari
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setInstalled(standalone);
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  }

  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-3">
      <div className="flex items-center gap-2">
        <Download className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Install App</h2>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500">
        Install the dashboard on your device for quick, full-screen access — like a native app.
      </p>

      {installed ? (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 dark:text-green-300 dark:bg-green-500/10 dark:border-green-500/30 rounded-lg px-4 py-2.5">
          <Check className="w-4 h-4" /> The app is installed on this device.
        </div>
      ) : isIOS ? (
        <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700 rounded-lg px-4 py-3">
          <Share className="w-4 h-4 mt-0.5 shrink-0 text-violet-600 dark:text-violet-400" />
          <span>
            On iOS, tap the <strong>Share</strong> button in Safari, then choose{' '}
            <strong>&quot;Add to Home Screen&quot;</strong>.
          </span>
        </div>
      ) : deferred ? (
        <button
          onClick={handleInstall}
          className="inline-flex items-center gap-2 bg-violet-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-violet-700 transition-colors"
        >
          <Download className="w-4 h-4" /> Install Nego Bot
        </button>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Use your browser&apos;s <strong>Install</strong> option (usually in the address bar or menu)
          to add Nego Bot to your device.
        </p>
      )}
    </section>
  );
}

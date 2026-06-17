import { createRoot } from 'react-dom/client';
import './index.css';
import NegoWidget from './NegoWidget';

function mountAll() {
  document.querySelectorAll<HTMLElement>('[data-nego-product]').forEach(el => {
    const productId = el.dataset.negoProduct ?? '';
    const apiKey = el.dataset.negoApiKey ?? '';
    const apiUrl = el.dataset.negoApiUrl ?? '';
    const channel = (el.dataset.negoChannel ?? 'web') as 'web' | 'mobile' | 'instore_qr';
    const storeUrl = el.dataset.negoStoreUrl;
    const accentColor = el.dataset.negoColor;

    if (!productId || !apiKey || !apiUrl) return;

    createRoot(el).render(
      <NegoWidget
        productId={productId}
        apiKey={apiKey}
        apiUrl={apiUrl}
        channel={channel}
        storeUrl={storeUrl}
        accentColor={accentColor}
      />,
    );
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountAll);
} else {
  mountAll();
}

export { NegoWidget };

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import NegoWidget from './NegoWidget';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NegoWidget
      apiUrl={import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}
      apiKey={import.meta.env.VITE_API_KEY ?? ''}
      productId={import.meta.env.VITE_PRODUCT_ID ?? ''}
      channel="web"
    />
  </StrictMode>,
);

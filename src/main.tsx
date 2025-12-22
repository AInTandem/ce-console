import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Providers } from './providers';
import './index.css';

async function enableMocking() {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API !== 'false') {
    const { worker } = await import('./mocks/browser');
    // `worker.start()` returns a Promise that resolves
    // once the Service Worker is up and running.
    return worker.start();
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Providers>
        <App />
      </Providers>
    </React.StrictMode>
  );
});

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import './index.css';

// Patch global fetch to bypass ngrok browser warning headers
const originalFetch = window.fetch;
window.fetch = (input, init = {}) => {
  return originalFetch(input, {
    ...init,
    headers: { ...init?.headers, "ngrok-skip-browser-warning": "true" },
  });
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);

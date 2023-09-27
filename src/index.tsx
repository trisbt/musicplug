import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import './index.css';
import App from './App';
import { AuthProvider } from './components/Auth';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
const queryClient = new QueryClient();  // Create a new instance of QueryClient

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>  {/* Wrap your app with the QueryClientProvider */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

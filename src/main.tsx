import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Ensure the app loads properly
console.log('🚀 Starting Trade4Me App...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ Root element not found!');
} else {
  // Clear any loading content
  rootElement.innerHTML = '';
  
  try {
    const root = createRoot(rootElement);
    
    root.render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    );
    console.log('✅ Trade4Me app rendered successfully!');
  } catch (error) {
    console.error('❌ Error rendering app:', error);
    // Show a simple error message without auto-refresh
    rootElement.innerHTML = `
      <div style="color: white; padding: 20px; background: #111827; font-family: Arial; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
        <div style="text-align: center;">
          <div style="margin-bottom: 16px;">
            <img src="/trade4me-logo-final.png" alt="Trade4me" style="height: 80px; width: auto;" />
          </div>
          <p style="color: #9CA3AF; margin-bottom: 16px;">Loading application...</p>
          <button onclick="window.location.reload()" style="background: #3B82F6; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer;">
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
}
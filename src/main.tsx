import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Ensure the app loads properly
console.log('🚀 Starting ConnectX App...');

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
    console.log('✅ ConnectX app rendered successfully!');
  } catch (error) {
    console.error('❌ Error rendering app:', error);
    // Show a simple error message with reload button
    rootElement.innerHTML = `
      <div style="color: white; padding: 20px; background: #111827; font-family: Arial; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
        <div style="text-align: center;">
          <div style="margin-bottom: 16px;">
            <div style="font-size: 2rem; font-weight: bold; margin-bottom: 16px;">
              Connect<span style="color: #3B82F6;">X</span>
            </div>
          </div>
          <p style="color: #EF4444; margin-bottom: 16px; font-weight: bold;">Application Error</p>
          <p style="color: #9CA3AF; margin-bottom: 16px;">There was an error loading the application.</p>
          <button onclick="window.location.reload()" style="background: #3B82F6; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer;">
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
}
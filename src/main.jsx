import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Rendering the App component at the root of the DOM
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

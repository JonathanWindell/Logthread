// frontend/src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './pages/App.jsx';
import './style.css';
import { BrowserRouter } from "react-router-dom";

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    {/* AuthProvider och dess konfiguration är nu helt borttagna */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
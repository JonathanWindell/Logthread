import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './pages/App.jsx';
import './style.css';
import { AuthProvider } from "react-oidc-context";
import { BrowserRouter } from "react-router-dom";


const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_APP_BASE_URL,
  post_logout_redirect_uri: import.meta.env.VITE_APP_BASE_URL, 
  response_type: "code",
  scope: "phone openid email",
};

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);

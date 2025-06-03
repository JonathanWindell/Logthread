import React from 'react';
import { useAuth } from "react-oidc-context";
import { Routes, Route } from "react-router-dom";
import Dashboard from './Dashboard';
import PageNotFound from './PageNotFound';

function App() {
  const auth = useAuth();

  // Handle AWS Cognito logout with redirect to homepage
  const signOutRedirect = () => {
    const clientId = "46qchek76kro8ut5pfcld5nf72";
    const logoutUri = "http://localhost:5173";
    const cognitoDomain = "https://eu-north-1pyu6orclm.auth.eu-north-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  // Show loading state while auth is initializing
  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  // Show error state if auth fails
  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <Routes>
      {/* Home route - shows login page or welcome message based on auth status */}
      <Route path="/" element={
        auth.isAuthenticated ? (
          <div>
            <pre> Hello: {auth.user?.profile.email} </pre>
            <a href="/dashboard">Go to dashboard</a>
          </div>
        ) : (
          <div className="login-container">
            <h1>LogThread</h1>
            <div className="tagline">Weave through your logs seamlessly.</div>
            <p>Sign in or Register to access dashboard</p>
            <button className="btn" onClick={() => auth.signinRedirect()}>Register / Sign in</button>
          </div>
        )
      } />

      {/* Dashboard route */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Catch-all route for 404 pages */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
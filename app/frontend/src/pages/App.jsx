import React from 'react';
import { useAuth } from "react-oidc-context";
import { Routes, Route } from "react-router-dom";
import Dashboard from './Dashboard';

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "46qchek76kro8ut5pfcld5nf72";
    const logoutUri = "http://localhost:5173";
    const cognitoDomain = "https://eu-north-1pyu6orclm.auth.eu-north-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <Routes>
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
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
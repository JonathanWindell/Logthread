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
            <pre> ID Token: {auth.user?.id_token} </pre>
            <pre> Access Token: {auth.user?.access_token} </pre>
            <pre> Refresh Token: {auth.user?.refresh_token} </pre>
            <button onClick={() => auth.removeUser()}>Sign out</button>
            <a href="/dashboard">Gå till Dashboard</a>
          </div>
        ) : (
          <div>
            <button onClick={() => auth.signinRedirect()}>Sign in</button>
            <button onClick={() => signOutRedirect()}>Sign out</button>
          </div>
        )
      } />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
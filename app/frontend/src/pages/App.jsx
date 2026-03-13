import React from 'react';
import { useAuth } from "react-oidc-context";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from './Dashboard';
import PageNotFound from './PageNotFound';

/**
 * App
 *
 * Root application component responsible for authentication state handling
 * and top-level client-side routing.
 *
 * The component performs the following steps:
 * 1. Reads the current authentication state via the OIDC context hook.
 * 2. Renders a loading indicator while the OIDC provider is initializing.
 * 3. Renders an error message if the OIDC provider reports a failure.
 * 4. Once auth is ready, renders the route tree:
 *    - "/" — Conditionally shows a welcome view (authenticated) or a
 *             login/register landing page (unauthenticated).
 *    - "/dashboard" — Renders the main Dashboard component.
 *    - "*" — Catches all unmatched paths and renders a 404 page.
 *
 * Auth state (sourced from useAuth):
 *   isLoading       {boolean} - True while the OIDC provider is bootstrapping.
 *   error           {Error|null} - Populated if OIDC initialization fails.
 *   isAuthenticated {boolean} - True when a valid user session exists.
 *   user            {object|null} - OIDC user object; contains profile data when authenticated.
 *
 * Returns:
 *   JSX.Element - A React Router <Routes> tree, or a loading/error fallback element.
 */
function App() {
  const auth = useAuth();

  /* ── Early-return guards ───────────────────────────────────────────────── */

  // Show a loading indicator while the OIDC provider is still initializing.
  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  // Display the OIDC error message if authentication setup encountered a problem.
  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  /* ── Main render ───────────────────────────────────────────────────────── */

  return (
    <Routes>

      {/*
       * Home Route — "/"
       *
       * Conditionally renders one of two views depending on authentication status:
       *
       * Authenticated:
       *   - Greets the user by their OIDC profile email.
       *   - Provides a navigation link to the /dashboard route.
       *   - Renders a sign-out button that triggers an OIDC redirect logout.
       *
       * Unauthenticated:
       *   - Displays the application name and tagline.
       *   - Renders a Register / Sign in button that initiates the OIDC redirect login flow.
       */}
      <Route path="/" element={
        auth.isAuthenticated ? (
          <div>
            {/* Display the authenticated user's email from the OIDC profile */}
            <pre> Hello: {auth.user?.profile.email} </pre>

            {/* Navigation link to the protected dashboard page */}
            <Link to="/dashboard">Go to dashboard</Link>

            {/* Sign-out button — triggers OIDC redirect logout and clears the session */}
            <button className="btn" onClick={() => auth.signoutRedirect()}>Logga ut</button>
          </div>
        ) : (
          <div className="login-container">
            <h1>LogThread</h1>
            <div className="tagline">Weave through your logs seamlessly.</div>
            <p>Sign in or Register to access dashboard</p>

            {/* Sign-in / Register button — initiates the OIDC redirect login flow */}
            <button className="btn" onClick={() => auth.signinRedirect()}>Register / Sign in</button>
          </div>
        )
      } />

      {/* Dashboard Route — "/dashboard"
          Renders the main Dashboard component for authenticated users. */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Catch-all Route — "*"
          Matches any path not handled above and renders the 404 PageNotFound component. */}
      <Route path="*" element={<PageNotFound />} />

    </Routes>
  );
}

export default App;
// frontend/src/pages/App.jsx

import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from './Dashboard';
import ApiTable from './ApiTable'; // Se till att denna fil/komponent finns
import PageNotFound from './PageNotFound';

function App() {
  // All logik med useAuth, isLoading, isAuthenticated etc. är borttagen.
  // Vi renderar applikationen direkt, utan krav på inloggning.

  return (
    <div>
      <nav>
        {/* En enkel navigationsmeny */}
        <Link to="/">Home</Link> | <Link to="/dashboard">Dashboard</Link>
      </nav>
      <hr />
      <Routes>
        {/* Startsidan är nu en enkel välkomstsida */}
        <Route path="/" element={
          <div className="login-container">
            <h1>LogThread</h1>
            <div className="tagline">Weave through your logs seamlessly.</div>
            
            {/* Länk till dashboard som du föreslog */}
            <Link to="/dashboard" className="btn">To Dashboard</Link>
          </div>
        } />

        {/* Dashboard-sidan är nu direkt tillgänglig */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* (Exempel) En väg till alla loggar, om du har en sådan komponent */}
        <Route path="/logs" element={<ApiTable />} />

        {/* Fångar alla andra sidor och visar en 404-sida */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
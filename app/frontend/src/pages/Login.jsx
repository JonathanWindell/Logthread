import React from 'react';
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;

function Login() {
  const login = () => {
    window.location.href = `https://${DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${REDIRECT_URI}`;
  };

  return <button onClick={login}>Logga in med Cognito</button>;
}

export default Login;
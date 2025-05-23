import React from 'react';
const CLIENT_ID = "59dqniop3rslpov6lm5hti8tl";
const REDIRECT_URI = "http://localhost:5173/callback";
const DOMAIN = "eu-north-1cjgmxdbme.auth.eu-north-1.amazoncognito.com"; 

function Login() {
  const login = () => {
    window.location.href = `https://${DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${REDIRECT_URI}`;
  };

  return <button onClick={login}>Logga in med Cognito</button>;
}

export default Login;
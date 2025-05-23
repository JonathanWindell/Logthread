const CLIENT_ID = "DIN_CLIENT_ID";
const REDIRECT_URI = "http://localhost:5173/callback";
const DOMAIN = "DIN_COGNITO_DOMAIN"; // utan https://

function Login() {
  const login = () => {
    window.location.href = `https://${DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${REDIRECT_URI}`;
  };

  return <button onClick={login}>Logga in med Cognito</button>;
}

export default Login;
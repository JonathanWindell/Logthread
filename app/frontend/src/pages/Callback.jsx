import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      const fetchToken = async () => {
        const response = await fetch(`https://${DOMAIN}/oauth2/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            code: code,
          }),
        });

        const data = await response.json();
        localStorage.setItem("token", data.access_token);
      };

      (async () => {
        await fetchToken();
        navigate("/dashboard");
      })();
    }
  }, [navigate]);

  return <p>Autentiserar...</p>;
}

export default Callback;
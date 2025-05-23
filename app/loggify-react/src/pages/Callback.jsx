import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // Här skulle du skicka koden till din backend för att få access_token
      // Just nu simulerar vi bara
      console.log("Auth code:", code);
      navigate("/dashboard");
    }
  }, [navigate]);

  return <p>Autentiserar...</p>;
}

export default Callback;

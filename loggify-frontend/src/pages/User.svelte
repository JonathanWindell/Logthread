<script>
  const CLIENT_ID = "59dqniop3rslpov6lm5hti8tl";
  const REDIRECT_URI = "http://localhost:5173/dashboard";
  const DOMAIN = "https://eu-north-1cjgmxdbme.auth.eu-north-1.amazoncognito.com";

  function login() {
    const loginUrl = `https://${DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${REDIRECT_URI}`;
    window.location.href = loginUrl;
  }
</script>

<button on:click={login}>Log in through Cognito</button>

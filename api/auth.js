module.exports = (req, res) => {
  const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
  
  if (req.query.code) {
    // Exchange code for token
    fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: req.query.code
      })
    })
    .then(r => r.json())
    .then(data => {
      res.send(`
        <script>
          window.opener.postMessage(
            'authorization:github:success:${JSON.stringify(data)}',
            window.location.origin
          );
          window.close();
        </script>
      `);
    });
  } else {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo`
    );
  }
};
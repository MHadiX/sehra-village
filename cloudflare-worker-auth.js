// Cloudflare Workers Script for GitHub OAuth
// Deploy this at: https://oauth.sehravillage.workers.dev
// 100% FREE - Cloudflare Workers free tier: 100,000 requests/day

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // GitHub OAuth credentials
  const CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID'  // Replace with your Client ID
  const CLIENT_SECRET = 'YOUR_GITHUB_CLIENT_SECRET'  // Replace with your Client Secret
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  // Handle callback from GitHub
  if (url.pathname === '/callback') {
    const code = url.searchParams.get('code')
    
    if (!code) {
      return new Response('No code provided', { status: 400 })
    }
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code
      })
    })
    
    const data = await tokenResponse.json()
    
    // Send token back to CMS
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Authenticating...</title></head>
        <body>
          <script>
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify(data)}',
              window.location.origin
            );
            window.close();
          </script>
          <p>Authentication successful! You can close this window.</p>
        </body>
      </html>
    `
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        ...corsHeaders
      }
    })
  }
  
  // Handle auth redirect
  if (url.pathname === '/auth') {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user`
    return Response.redirect(authUrl, 302)
  }
  
  // Default response
  return new Response('Sehra Village GitHub OAuth Gateway', {
    headers: corsHeaders
  })
}

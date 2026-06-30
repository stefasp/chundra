// middleware.js — Chundra
// Protects /earnings.html with HTTP Basic Auth at the server level.
// Nobody can see the page content without the correct password —
// not even by viewing source, since the server blocks the request entirely.
//
// Setup in Vercel:
//   Settings → Environment Variables → add:
//     EARNINGS_USER = (choose a username, e.g. "stefania")
//     EARNINGS_PASS = (choose a strong password)

export const config = {
  matcher: '/earnings.html',
};

export default function middleware(request) {
  const auth = request.headers.get('authorization');

  const expectedUser = process.env.EARNINGS_USER;
  const expectedPass = process.env.EARNINGS_PASS;

  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = atob(encoded);
      const [user, pass] = decoded.split(':');
      if (user === expectedUser && pass === expectedPass) {
        return; // Let the request through
      }
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Chundra Earnings"',
    },
  });
}

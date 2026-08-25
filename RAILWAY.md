# Railway deployment

Railway builds the static Next.js export from `Dockerfile` and serves it through Nginx. No Railway variables are required.

## Service setup

1. Create a Railway service from `tommitoan/tommitoan.com` on branch `main-railway`.
2. Railway reads `railway.toml`; leave build and start commands empty.
3. Verify the generated Railway domain before changing DNS.

## Domain cutover

1. Add `tommitoan.com` as a custom domain in Railway and copy its CNAME and TXT verification records exactly.
2. If DNS is hosted by Cloudflare, use a proxied apex CNAME and set SSL/TLS mode to `Full`.
3. Verify Railway has issued the certificate before switching traffic away from Render.
4. Add `www.tommitoan.com` as a separate Railway custom domain if it must serve the site; configure a redirect to the canonical domain at the DNS edge.

Keep the Render service active until the Railway generated domain, all static routes, and the custom domain have been verified. Disable Render only after the cutover is stable.

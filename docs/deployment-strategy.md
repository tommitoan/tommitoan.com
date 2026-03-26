# Deployment Strategy

## Domain roles

- `tommitoan.com` - main public gateway
- `www.tommitoan.com` - redirect to root or mirror root
- `toanngo.cv` - separate CV property

## Hosting options

### Option 1 - Static host first

Examples:

- Cloudflare Pages
- Vercel
- Netlify

Pros:

- fastest launch
- simple rollback
- easy preview environments
- low operational friction

Cons:

- sits outside your homelab story

### Option 2 - Homelab deployment

Deploy via your k3s GitOps flow.

Pros:

- keeps the brand site inside your own platform story
- matches your self-hosting narrative
- can integrate with your current infra patterns

Cons:

- more setup work for initial launch
- domain and ingress work must be done carefully

## Recommended rollout

Recommended default:

1. launch on a static host for speed
2. stabilize design and content
3. migrate to homelab later if desired

Alternative:

If you want the launch itself to prove the homelab story, deploy directly on k3s once the app is stable.

## Infra implications

Current infra shows `*.tommitoan.space` patterns, but no `tommitoan.com` manifests were found during repo scan.

Expected work if deploying on homelab:

- DNS for `tommitoan.com` and possibly `www.tommitoan.com`
- ingress manifest for the new app
- TLS issuance for root domain
- Argo CD app config and overlay
- image build and publish flow if containerized

## SEO migration guidance

- `tommitoan.com` becomes the canonical brand root
- `toanngo.cv` remains canonical for CV-specific content
- avoid duplicating the same metadata and title intent across both properties

## Launch checklist

- root metadata configured
- route metadata configured
- social preview checked
- mobile and desktop verified
- external links verified
- `Portfolio` panel points to production `toanngo.cv`
- only public-safe products are linked
- analytics decision made if desired

## Post-launch ideas

- publish a short launch post
- add changelog or now page
- later integrate auth for private tools without changing the public-first homepage

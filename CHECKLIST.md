# Pre-Launch Checklist

## Functionality

- [ ] Waitlist signup works, email delivers
- [ ] Auth flow complete (register, login, logout)
- [ ] Discovery flow works for all tiers
- [ ] Generation returns valid outputs
- [ ] Copy buttons work
- [ ] Archetype wheel renders and selects
- [ ] Sprint save/load works (paid tiers)
- [ ] Fork creates new sprint with parent
- [ ] Export downloads markdown (dlytful max)

## Design

- [ ] All pages responsive
- [ ] Fonts loading correctly (Poppins, Fraunces)
- [ ] Colors consistent with brand
- [ ] Loading states present
- [ ] Error states helpful
- [ ] Toasts appearing correctly

## Edge Cases

- [ ] Empty states display properly
- [ ] Long text doesn't break layouts
- [ ] Free tier blocks work, show upgrade
- [ ] Session expiry handled gracefully
- [ ] API errors show user-friendly messages

## SEO/Meta

- [ ] Title and description set
- [ ] OG image displays in social previews
- [ ] Favicon visible

## Security

- [ ] RLS policies active on Supabase
- [ ] API routes validate auth
- [ ] No secrets exposed client-side
- [ ] Rate limiting on waitlist endpoint

## Assets Needed

- [ ] `/public/favicon.ico` — dlytful mark in dlytful-sun
- [ ] `/public/favicon-32x32.png` — 32x32 PNG favicon
- [ ] `/public/apple-touch-icon.png` — 180x180 Apple touch icon
- [ ] `/public/og-image.png` — 1200x630 Open Graph image
- [ ] `/public/brand-kit.pdf` — Free download for waitlist

## Environment Variables (Vercel)

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
RESEND_API_KEY=
NUXT_PUBLIC_APP_URL=https://dlytful.com
```

## Post-Launch

### Analytics (Phase 2)
- [ ] Add Plausible or Fathom
- [ ] Track: signups, sprint starts, completions, upgrades

### Error Tracking (Phase 2)
- [ ] Add Sentry
- [ ] Monitor API failures

### Stripe Integration (Phase 2)
- [ ] Create Stripe products for one/max tiers
- [ ] Implement checkout flow
- [ ] Set up webhook for subscription events
- [ ] Update tier on successful payment

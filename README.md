# dlytful

Brand translation for indie builders. Transform your app from generic template to memorable brand.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your credentials

# Run development server
npm run dev
```

## Environment Setup

Required environment variables:

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `ANTHROPIC_API_KEY` | Claude API key for generation |
| `RESEND_API_KEY` | Resend API key for emails |
| `NUXT_PUBLIC_APP_URL` | Your app URL (e.g., https://dlytful.com) |

## Database Setup

1. Create a new Supabase project
2. Run the migration in `supabase/migrations/001_initial_schema.sql`
3. See `supabase/README.md` for detailed instructions

## Tech Stack

- **Framework**: Nuxt 3
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI**: Claude (Anthropic)
- **Email**: Resend
- **State**: Pinia
- **Deployment**: Vercel

## Project Structure

```
├── app/                  # App entry point
├── components/
│   ├── ui/              # Reusable UI components
│   ├── discovery/       # Discovery flow components
│   ├── results/         # Results page components
│   ├── sprints/         # Sprint history components
│   ├── settings/        # Settings page components
│   ├── upgrade/         # Upgrade modal
│   └── waitlist/        # Waitlist form
├── composables/         # Vue composables
├── constants/           # App constants
├── layouts/             # Page layouts
├── middleware/          # Route middleware
├── pages/               # Page components
├── public/              # Static assets
├── server/
│   ├── api/            # API routes
│   └── utils/          # Server utilities
├── stores/              # Pinia stores
├── supabase/           # Database schema
└── types/              # TypeScript types
```

## Development

```bash
# Run dev server
npm run dev

# Type check
npm run typecheck

# Build for production
npm run build

# Preview production build
npm run preview

# Analyze bundle
npx nuxi analyze
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Environment Variables in Vercel

Add all variables from `.env.example` to your Vercel project settings.

## Tiers

| Feature | Free | One ($14/mo) | Max ($29/mo) |
|---------|------|--------------|--------------|
| Discovery questions | 3 | 11 | 12 |
| Archetypes | 1 | 6 | 12 |
| Rebrand prompt | ✓ | ✓ | ✓ |
| Foundation prompt | ✗ | ✓ | ✓ |
| Voice rules | ✗ | ✓ | ✓ |
| Sprint history | ✗ | ✓ | ✓ |
| Fork & iterate | ✗ | ✓ | ✓ |
| Discoverability | ✗ | ✗ | ✓ |
| Agent prompt | ✗ | ✗ | ✓ |
| Export | ✗ | ✗ | ✓ |

## License

Proprietary - All rights reserved

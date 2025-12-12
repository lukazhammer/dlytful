# Supabase Database Setup for dlytful

## Quick Start

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy and paste the contents of `migrations/001_initial_schema.sql`
4. Run the migration

## Tables Overview

| Table | Purpose |
|-------|---------|
| `waitlist` | Stores email signups from landing page |
| `users` | App user profiles (linked to auth.users) |
| `sprints` | Brand discovery sessions |

## Row Level Security (RLS)

All tables have RLS enabled:

- **waitlist**: Allows anonymous inserts (public signup)
- **users**: Users can only view/update their own profile
- **sprints**: Users can only CRUD their own sprints

## Automatic Triggers

1. **on_auth_user_created**: When a user signs up via Supabase Auth, a corresponding row is automatically created in `public.users`
2. **sprints_updated_at**: Automatically updates the `updated_at` timestamp when a sprint is modified

## Supabase Auth Configuration

1. Go to **Authentication > Providers**
2. Enable **Email** provider
3. (Optional) Disable "Confirm email" for faster local testing

4. Go to **Authentication > URL Configuration**
5. Set **Site URL**: `http://localhost:3000` (or your domain)
6. Add **Redirect URLs**:
   - `http://localhost:3000/confirm`
   - `https://your-production-domain.com/confirm`

## Environment Variables

Copy these from your Supabase project settings:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Note**: Never expose `SUPABASE_SERVICE_ROLE_KEY` on the client side.

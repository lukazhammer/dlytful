-- Create a cache table for LLM-generated brand copy assets
-- This allows us to maintain determinism for expensive/creative calls.
-- Keyed by spec_hash (SHA-256 of the strict BrandSpec).

create table if not exists public.copy_cache (
    spec_hash text primary key,
    assets jsonb not null,
    created_at timestamptz default now() not null,
    model_used text -- Track which model generated this (e.g. gemini-1.5-flash)
);

-- RLS Policies
alter table public.copy_cache enable row level security;

-- Everyone can read stats (public demo)
create policy "Allow public read access"
    on public.copy_cache
    for select
    using (true);

-- Allow insert for anon (demo users)
create policy "Allow insert for all"
    on public.copy_cache
    for insert
    with check (true);

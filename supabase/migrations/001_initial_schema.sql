-- dlytful Supabase Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================
-- PHASE 1: Waitlist
-- =====================

-- Waitlist table
create table public.waitlist (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  source text default 'landing',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.waitlist enable row level security;

-- Allow inserts from anon (for waitlist signups)
create policy "Allow anonymous waitlist signups" on public.waitlist
  for insert with check (true);


-- =====================
-- PHASE 2: Users
-- =====================

-- Users table
create table public.users (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  tier text default 'free' check (tier in ('free', 'one', 'max')),
  sprints_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.users enable row level security;

create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);


-- =====================
-- PHASE 3: Sprints
-- =====================

-- Sprints table
create table public.sprints (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users on delete cascade not null,
  parent_id uuid references public.sprints on delete set null,
  label text,
  inputs jsonb default '{}'::jsonb,
  outputs jsonb default '{}'::jsonb,
  archetype_primary text,
  archetype_secondary text,
  status text default 'draft' check (status in ('draft', 'complete')),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.sprints enable row level security;

create policy "Users can view own sprints" on public.sprints
  for select using (auth.uid() = user_id);

create policy "Users can insert own sprints" on public.sprints
  for insert with check (auth.uid() = user_id);

create policy "Users can update own sprints" on public.sprints
  for update using (auth.uid() = user_id);

create policy "Users can delete own sprints" on public.sprints
  for delete using (auth.uid() = user_id);


-- =====================
-- INDEXES
-- =====================

create index sprints_user_id_idx on public.sprints(user_id);
create index sprints_parent_id_idx on public.sprints(parent_id);
create index sprints_created_at_idx on public.sprints(created_at desc);


-- =====================
-- FUNCTIONS & TRIGGERS
-- =====================

-- Function to auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger for sprint updates
create trigger sprints_updated_at
  before update on public.sprints
  for each row execute procedure public.update_updated_at();

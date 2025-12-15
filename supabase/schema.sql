-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Sprints Table (Stores user sessions/projects)
create table sprints (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  inputs jsonb default '{}'::jsonb,
  current_step integer default 1,
  unlocks jsonb default '{}'::jsonb,
  brand_prompt text,
  is_complete boolean default false
);

-- RLS for Sprints
alter table sprints enable row level security;

create policy "Users can view own sprints" 
  on sprints for select 
  using (auth.uid() = user_id);

create policy "Users can insert own sprints" 
  on sprints for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own sprints" 
  on sprints for update 
  using (auth.uid() = user_id);

-- Waitlist Table
create table waitlist (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Waitlist (Public insert, no read)
alter table waitlist enable row level security;

create policy "Public can insert to waitlist" 
  on waitlist for insert 
  with check (true);

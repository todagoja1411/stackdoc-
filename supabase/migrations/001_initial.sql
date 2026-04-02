-- StackDoc initial schema
-- Run this in the Supabase SQL editor or via `supabase db push`

-- Scans table: stores every supplement analysis
create table if not exists public.scans (
  id                uuid        primary key default gen_random_uuid(),
  supplements_text  text,                         -- extracted or typed supplement list
  goal              text        not null,          -- user's health goal
  report_json       jsonb       not null,          -- full AI analysis
  stripe_session_id text        unique,            -- Stripe checkout session (null = free scan)
  paid              boolean     not null default false,
  created_at        timestamptz not null default now()
);

-- Index for report page lookups by ID (already covered by PK, but explicit)
create index if not exists scans_id_idx on public.scans (id);

-- Index for Stripe webhook lookups
create index if not exists scans_stripe_session_idx on public.scans (stripe_session_id)
  where stripe_session_id is not null;

-- Enable RLS
alter table public.scans enable row level security;

-- Anyone can insert a scan (free scan + paid scan after checkout)
create policy "Anyone can insert scans"
  on public.scans for insert
  with check (true);

-- Anyone can read any scan by ID (reports are public via link)
create policy "Anyone can read scans"
  on public.scans for select
  using (true);

-- Only service role can update scans (webhook marking paid)
-- No update policy needed for anon; service role bypasses RLS

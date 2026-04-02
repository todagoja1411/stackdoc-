/*
  Supabase schema — run this in the Supabase SQL editor:

  create table public.scans (
    id            uuid primary key default gen_random_uuid(),
    supplements_text text,
    goal          text not null,
    report_json   jsonb not null,
    stripe_session_id text,
    paid          boolean not null default false,
    created_at    timestamptz not null default now()
  );

  -- Allow anyone to insert (anon scans, no auth required)
  alter table public.scans enable row level security;

  create policy "Anyone can insert scans"
    on public.scans for insert
    with check (true);

  create policy "Anyone can read their own scan by id"
    on public.scans for select
    using (true);
*/

import { createClient } from '@supabase/supabase-js'
import type { Scan, AnalysisReport } from '@/types'

// Lazy getters — avoid build-time errors when env vars aren't present
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function createScan({
  supplementsText,
  goal,
  reportJson,
  stripeSessionId,
  paid,
}: {
  supplementsText: string | null
  goal: string
  reportJson: AnalysisReport
  stripeSessionId?: string | null
  paid: boolean
}): Promise<Scan> {
  const { data, error } = await getSupabaseAdmin()
    .from('scans')
    .insert({
      supplements_text: supplementsText,
      goal,
      report_json: reportJson,
      stripe_session_id: stripeSessionId ?? null,
      paid,
    })
    .select()
    .single()

  if (error) throw new Error(`Supabase insert error: ${error.message}`)
  return data as Scan
}

export async function getScanById(id: string): Promise<Scan | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('scans')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Scan
}

export async function markScanPaid(stripeSessionId: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from('scans')
    .update({ paid: true })
    .eq('stripe_session_id', stripeSessionId)

  if (error) throw new Error(`Failed to mark scan paid: ${error.message}`)
}

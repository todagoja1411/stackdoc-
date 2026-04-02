import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY

  const urlOk = !!url && url.length > 10
  const anonOk = !!anon && anon.length > 10
  const serviceOk = !!service && service.length > 10

  let selectResult = null
  let selectError = null

  try {
    const client = createClient(url!, anon!)
    const { data, error } = await client
      .from('scans')
      .select('id, goal, created_at')
      .limit(1)
    selectResult = data
    selectError = error?.message ?? null
  } catch (e) {
    selectError = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json({
    env: { urlOk, anonOk, serviceOk, urlPreview: url?.slice(0, 30) },
    select: { data: selectResult, error: selectError },
  })
}

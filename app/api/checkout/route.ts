import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { supplements, goal } = body as {
      supplements?: string
      goal: string
      hasImage?: boolean
    }

    if (!goal) {
      return NextResponse.json({ error: 'goal is required' }, { status: 400 })
    }

    const origin = req.headers.get('origin') ?? req.nextUrl.origin

    const url = await createCheckoutSession({
      origin,
      supplementsText: supplements,
      goal,
    })

    return NextResponse.json({ url })
  } catch (err: unknown) {
    console.error('[/api/checkout]', err)
    const message = err instanceof Error ? err.message : 'Failed to create checkout session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

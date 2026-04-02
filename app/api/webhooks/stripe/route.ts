import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { markScanPaid } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  // Reject payloads over 64KB — Stripe webhooks are never this large
  const contentLength = Number(req.headers.get('content-length') ?? 0)
  if (contentLength > 65536) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed'
    console.error('[stripe/webhook] verification failed:', message)
    return NextResponse.json({ error: message }, { status: 400 })
  }

  // Handle relevant events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      if (session.payment_status === 'paid' && session.id) {
        try {
          await markScanPaid(session.id)
        } catch (err) {
          // Scan may not exist yet if webhook fires before /api/analyze is called
          // This is fine — the analyze route also verifies payment directly
          console.log('[stripe/webhook] markScanPaid skipped (scan not yet created):', session.id)
        }
      }
      break
    }

    default:
      // Ignore other event types
      break
  }

  return NextResponse.json({ received: true })
}

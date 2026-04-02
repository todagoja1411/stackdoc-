import { NextRequest, NextResponse } from 'next/server'
import { analyzeStack, extractSupplementsFromImage } from '@/lib/anthropic'
import { createScan } from '@/lib/supabase'
import { getCheckoutSession } from '@/lib/stripe'
import { checkRateLimit, getClientIP } from '@/lib/ratelimit'
import { validateAnalyzeInput, sanitizeSupplementsText, safeErrorMessage } from '@/lib/validate'

// 5 requests per 10 minutes per IP
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 10 * 60 * 1000

export async function POST(req: NextRequest) {
  // 1. Rate limiting
  const ip = getClientIP(req)
  const rate = checkRateLimit(ip, RATE_LIMIT, RATE_WINDOW_MS)

  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${rate.resetInSeconds} seconds.` },
      {
        status: 429,
        headers: { 'Retry-After': String(rate.resetInSeconds) },
      }
    )
  }

  // 2. Parse body safely
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // 3. Validate all inputs
  const validation = validateAnalyzeInput(body)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { supplements, imageBase64, goal, sessionId, mode } = body as {
    supplements?: string
    imageBase64?: string
    goal: string
    sessionId?: string
    mode?: 'analyze' | 'recommend'
  }

  try {
    // 4. Verify Stripe payment if sessionId provided
    let paid = false
    let stripeSessionId: string | null = null

    if (sessionId) {
      // Validate sessionId format before hitting Stripe API
      if (typeof sessionId !== 'string' || !/^cs_[a-zA-Z0-9_]+$/.test(sessionId)) {
        return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 })
      }

      const session = await getCheckoutSession(sessionId)
      const isActive =
        session.status === 'complete' &&
        (session.payment_status === 'paid' || session.mode === 'subscription')

      if (!isActive) {
        return NextResponse.json({ error: 'Payment not completed' }, { status: 402 })
      }
      paid = true
      stripeSessionId = sessionId
    }

    // 5. Resolve supplements text
    // NOTE: Raw images are NEVER stored — only the extracted text reaches Supabase
    let supplementsText: string

    if (imageBase64) {
      supplementsText = await extractSupplementsFromImage(imageBase64)
      // Sanitize the vision-extracted text too
      supplementsText = sanitizeSupplementsText(supplementsText)
    } else {
      // Sanitize user text — removes prompt injection attempts
      supplementsText = sanitizeSupplementsText(supplements!)
    }

    // 6. Run AI analysis
    const report = await analyzeStack({ supplements: supplementsText, goal, mode: mode ?? 'analyze' })

    // 7. Save to Supabase (text only, never image data)
    const scan = await createScan({
      supplementsText,
      goal,
      reportJson: report,
      stripeSessionId,
      paid,
    })

    return NextResponse.json({ id: scan.id, report })
  } catch (err: unknown) {
    // Never expose internal errors to the client
    console.error('[/api/analyze]', err)
    return NextResponse.json({ error: safeErrorMessage(err) }, { status: 500 })
  }
}

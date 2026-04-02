import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const SUBSCRIPTION_PRICE_CENTS = 999 // $9.99/mo

export async function createCheckoutSession({
  origin,
  supplementsText,
  imageBase64,
  goal,
}: {
  origin: string
  supplementsText?: string
  imageBase64?: string
  goal: string
}): Promise<string> {
  // Store scan data in metadata (Stripe limits: 500 chars per value)
  // For large imageBase64, we truncate — client will re-send full data after redirect
  const metadataGoal = goal.slice(0, 500)
  const metadataSupplements = (supplementsText ?? '').slice(0, 500)
  const hasImage = imageBase64 ? 'true' : 'false'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'StackDoc Pro',
            description: 'Unlimited AI supplement stack analyses — cancel anytime',
            images: [],
          },
          unit_amount: SUBSCRIPTION_PRICE_CENTS,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${origin}/scan?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/scan`,
    metadata: {
      goal: metadataGoal,
      supplements_text: metadataSupplements,
      has_image: hasImage,
    },
  })

  return session.url!
}

export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.retrieve(sessionId)
}

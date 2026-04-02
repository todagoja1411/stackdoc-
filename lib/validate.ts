/**
 * Input validation and sanitization for all user-supplied data.
 * Called before anything touches Claude or Supabase.
 */

const ALLOWED_GOALS = [
  'Muscle & Performance',
  'Sleep & Recovery',
  'Weight Loss',
  'General Health & Immunity',
] as const

const MAX_SUPPLEMENTS_LENGTH = 2000   // ~200 supplements — more than enough
const MAX_IMAGE_BASE64_LENGTH = 1_400_000 // ~1MB decoded (~10MB raw PNG)
const MIN_SUPPLEMENTS_LENGTH = 3

export interface ValidationResult {
  valid: boolean
  error?: string
}

/** Sanitize supplements text — strip potential prompt injection attempts */
export function sanitizeSupplementsText(raw: string): string {
  return raw
    // Remove anything that looks like a prompt injection attempt
    .replace(/ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/gi, '')
    .replace(/system\s*:/gi, '')
    .replace(/assistant\s*:/gi, '')
    .replace(/human\s*:/gi, '')
    .replace(/\[INST\]|\[\/INST\]|<s>|<\/s>/g, '')
    // Strip HTML tags
    .replace(/<[^>]*>/g, '')
    // Normalize whitespace
    .replace(/\r\n/g, '\n')
    .replace(/\n{4,}/g, '\n\n')
    .trim()
}

export function validateAnalyzeInput(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' }
  }

  const { supplements, imageBase64, goal } = body as Record<string, unknown>

  // Goal is required and must be one of the allowed values
  if (!goal || typeof goal !== 'string') {
    return { valid: false, error: 'goal is required' }
  }
  if (!ALLOWED_GOALS.includes(goal as (typeof ALLOWED_GOALS)[number])) {
    return { valid: false, error: 'Invalid goal value' }
  }

  // Must provide either supplements text or imageBase64, not neither
  const hasText = typeof supplements === 'string' && supplements.trim().length > 0
  const hasImage = typeof imageBase64 === 'string' && imageBase64.length > 0

  if (!hasText && !hasImage) {
    return { valid: false, error: 'Provide either supplements text or an image' }
  }

  // Validate text
  if (hasText) {
    const text = supplements as string
    if (text.trim().length < MIN_SUPPLEMENTS_LENGTH) {
      return { valid: false, error: 'Supplements text is too short' }
    }
    if (text.length > MAX_SUPPLEMENTS_LENGTH) {
      return { valid: false, error: `Supplements text exceeds ${MAX_SUPPLEMENTS_LENGTH} character limit` }
    }
  }

  // Validate image
  if (hasImage) {
    const img = imageBase64 as string

    if (img.length > MAX_IMAGE_BASE64_LENGTH) {
      return { valid: false, error: 'Image is too large. Please use an image under 10MB.' }
    }

    // Validate it's actually a base64 string (no data URL prefix allowed — strip client-side)
    if (img.startsWith('data:')) {
      return { valid: false, error: 'Send raw base64 without the data: prefix' }
    }

    // Check it's valid base64
    if (!/^[A-Za-z0-9+/]+=*$/.test(img)) {
      return { valid: false, error: 'Invalid image encoding' }
    }

    // Validate magic bytes — must be JPEG (FFD8FF) or PNG (89504E47)
    const decoded = Buffer.from(img.slice(0, 16), 'base64')
    const isJpeg = decoded[0] === 0xff && decoded[1] === 0xd8 && decoded[2] === 0xff
    const isPng = decoded[0] === 0x89 && decoded[1] === 0x50 && decoded[2] === 0x4e && decoded[3] === 0x47

    if (!isJpeg && !isPng) {
      return { valid: false, error: 'Only JPEG and PNG images are accepted' }
    }
  }

  return { valid: true }
}

/** Generic safe error message — never expose internal details to the client */
export function safeErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    // Allow specific user-facing messages through, block everything else
    const userFacingPhrases = [
      'too large',
      'too short',
      'Invalid goal',
      'Invalid image',
      'Provide either',
      'Payment not completed',
    ]
    if (userFacingPhrases.some((p) => err.message.includes(p))) {
      return err.message
    }
  }
  return 'Something went wrong. Please try again.'
}

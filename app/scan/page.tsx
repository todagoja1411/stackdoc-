'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Navbar from '@/components/ui/Navbar'
import SupplementInput from '@/components/scan/SupplementInput'
import GoalSelector from '@/components/scan/GoalSelector'
import ReviewStep from '@/components/scan/ReviewStep'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import type { Goal, PendingScanData } from '@/types'

const FREE_SCAN_KEY = 'stackdoc_free_used'
const PENDING_SCAN_KEY = 'stackdoc_pending_scan'

type Step = 1 | 2 | 3

function ScanPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [step, setStep] = useState<Step>(1)
  const [supplements, setSupplements] = useState('')
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // After Stripe redirect, resume analysis with stored pending data
  useEffect(() => {
    if (!sessionId) return

    const raw = localStorage.getItem(PENDING_SCAN_KEY)
    if (!raw) return

    try {
      const pending: PendingScanData = JSON.parse(raw)
      setAnalyzing(true)
      runAnalysis({ ...pending, sessionId })
        .then((id) => {
          localStorage.removeItem(PENDING_SCAN_KEY)
          router.push(`/report/${id}`)
        })
        .catch((err: Error) => {
          setAnalyzing(false)
          setError(err.message ?? 'Analysis failed. Please try again.')
        })
    } catch {
      setError('Could not resume your scan. Please try again.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  async function runAnalysis(data: PendingScanData & { sessionId?: string }): Promise<string> {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error ?? `Analysis failed (${res.status})`)
    }

    const { id } = await res.json()
    return id as string
  }

  async function handleSubmit() {
    if (!goal) return

    const data: PendingScanData = {
      goal,
      ...(imageBase64 ? { imageBase64 } : { supplements }),
    }

    const freeUsed = localStorage.getItem(FREE_SCAN_KEY) === 'true'

    if (!freeUsed) {
      // Free scan path
      setAnalyzing(true)
      setError(null)
      try {
        const id = await runAnalysis(data)
        localStorage.setItem(FREE_SCAN_KEY, 'true')
        router.push(`/report/${id}`)
      } catch (err: unknown) {
        setAnalyzing(false)
        setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.')
      }
    } else {
      // Paid scan path — store data, go to Stripe
      localStorage.setItem(PENDING_SCAN_KEY, JSON.stringify(data))
      setAnalyzing(true)
      setError(null)

      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            supplements: data.supplements,
            goal: data.goal,
            hasImage: !!data.imageBase64,
          }),
        })

        if (!res.ok) throw new Error('Could not create checkout session')
        const { url } = await res.json()
        window.location.href = url
      } catch (err: unknown) {
        setAnalyzing(false)
        setError(err instanceof Error ? err.message : 'Could not start payment. Please try again.')
      }
    }
  }

  if (analyzing) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-6">
        <LoadingSpinner size="lg" />
        <div className="text-center">
          <p className="text-white font-medium text-lg mb-1">Analyzing your stack...</p>
          <p className="text-gray-500 text-sm">Claude is reviewing your supplements</p>
        </div>
        <div className="max-w-xs w-full bg-[#111111] border border-[#1f1f1f] rounded-xl p-4">
          <div className="space-y-2">
            {[
              'Reading supplement list',
              'Checking interactions',
              'Evaluating evidence',
              'Building timing guide',
              'Generating recommendations',
            ].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div
                  className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-slow"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
                <span className="text-xs text-gray-400">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-8">
          {([1, 2, 3] as Step[]).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={[
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                  step === s
                    ? 'bg-brand-500 text-black'
                    : step > s
                    ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                    : 'bg-[#1f1f1f] text-gray-600',
                ].join(' ')}
              >
                {step > s ? '✓' : s}
              </div>
              {s < 3 && (
                <div
                  className={['h-px w-8 transition-colors', step > s ? 'bg-brand-500/40' : 'bg-[#1f1f1f]'].join(' ')}
                />
              )}
            </div>
          ))}
          <p className="ml-3 text-sm text-gray-500">
            {step === 1 && 'Add supplements'}
            {step === 2 && 'Choose goal'}
            {step === 3 && 'Review & analyze'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Step 1: Input */}
        {step === 1 && (
          <SupplementInput
            supplements={supplements}
            onSupplementsChange={setSupplements}
            imageBase64={imageBase64}
            onImageChange={setImageBase64}
            onNext={() => setStep(2)}
          />
        )}

        {/* Step 2: Goal */}
        {step === 2 && (
          <GoalSelector
            selectedGoal={goal}
            onGoalChange={setGoal}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {/* Step 3: Review */}
        {step === 3 && goal && (
          <ReviewStep
            supplements={supplements}
            imageBase64={imageBase64}
            goal={goal}
            onBack={() => setStep(2)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  )
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <LoadingSpinner size="lg" label="Loading..." />
        </div>
      }
    >
      <ScanPageContent />
    </Suspense>
  )
}

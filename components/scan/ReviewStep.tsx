'use client'

import { ChevronLeft, FlaskConical, Image as ImageIcon, AlertTriangle } from 'lucide-react'
import Button from '@/components/ui/Button'
import type { Goal } from '@/types'

interface Props {
  supplements: string
  imageBase64: string | null
  goal: Goal
  onBack: () => void
  onSubmit: () => void
}

const GOAL_EMOJI: Record<Goal, string> = {
  'Muscle & Performance': '💪',
  'Sleep & Recovery': '😴',
  'Weight Loss': '🔥',
  'General Health & Immunity': '🛡️',
}

export default function ReviewStep({ supplements, imageBase64, goal, onBack, onSubmit }: Props) {
  const lineCount = supplements.trim() ? supplements.trim().split('\n').filter(Boolean).length : 0

  return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold text-white mb-2">Ready to analyze</h1>
      <p className="text-gray-400 text-sm mb-6">
        Review your submission before running the AI analysis.
      </p>

      {/* Summary card */}
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl divide-y divide-[#1a1a1a] mb-6">
        {/* Input summary */}
        <div className="p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">
            Supplement Input
          </p>
          {imageBase64 ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={`data:image/jpeg;base64,${imageBase64}`}
                  alt="Supplements"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-white">
                <ImageIcon className="w-4 h-4 text-gray-500" />
                Photo uploaded — AI will extract supplement names
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <FlaskConical className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-white mb-2 font-mono whitespace-pre-line line-clamp-5">
                  {supplements}
                </p>
                <p className="text-xs text-gray-500">{lineCount} supplement{lineCount !== 1 ? 's' : ''} entered</p>
              </div>
            </div>
          )}
        </div>

        {/* Goal summary */}
        <div className="p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">
            Health Goal
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xl">{GOAL_EMOJI[goal]}</span>
            <span className="text-sm font-medium text-white">{goal}</span>
          </div>
        </div>

        {/* Free scan notice */}
        <div className="p-4">
          <div className="flex items-start gap-2 text-xs text-gray-500">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-500/60 mt-0.5 flex-shrink-0" />
            <p>
              Analysis is powered by Claude AI. Results are for informational purposes only and do not
              constitute medical advice. Always consult a healthcare provider before changing your supplement
              regimen.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack} className="w-12 flex-shrink-0">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button fullWidth size="lg" onClick={onSubmit}>
          <FlaskConical className="w-4 h-4" />
          Analyze Stack
        </Button>
      </div>

      <p className="text-center text-xs text-gray-600 mt-4">
        First scan is free · $9.99/mo for unlimited scans after that
      </p>
    </div>
  )
}

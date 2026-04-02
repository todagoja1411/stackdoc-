'use client'

import { useState } from 'react'
import { Sparkles, ChevronRight, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'

const EXAMPLES = [
  'I want to build muscle and recover faster after workouts',
  'I struggle to sleep and feel tired during the day',
  'I want to lose weight and boost my metabolism',
  'I want to improve my overall health and immunity',
]

interface Props {
  value: string
  onChange: (v: string) => void
  onNext: () => void
  onBack: () => void
}

export default function ChatInput({ value, onChange, onNext, onBack }: Props) {
  const [focused, setFocused] = useState(false)
  const canProceed = value.trim().length > 10

  return (
    <div className="animate-slide-up">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-white">What's your goal?</h1>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        Describe what you want to achieve and we'll recommend the best supplement stack for you.
      </p>

      <div
        className={[
          'relative rounded-2xl border transition-all',
          focused ? 'border-brand-500/50 ring-1 ring-brand-500/20' : 'border-[#1f1f1f]',
        ].join(' ')}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="e.g. I want to build muscle and recover faster after workouts…"
          rows={5}
          className="w-full bg-[#111111] rounded-2xl px-4 pt-4 pb-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none"
        />
        <div className="flex items-center justify-between px-4 pb-3">
          <span className="text-xs text-gray-600">{value.length} characters</span>
          {value.length > 0 && (
            <button
              onClick={() => onChange('')}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Examples */}
      {!value && (
        <div className="mt-4">
          <p className="text-xs text-gray-600 mb-2 uppercase tracking-wide font-medium">Try an example</p>
          <div className="space-y-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => onChange(ex)}
                className="w-full text-left px-3 py-2.5 bg-[#111111] border border-[#1f1f1f] rounded-xl text-sm text-gray-400 hover:text-white hover:border-[#2a2a2a] transition-all"
              >
                "{ex}"
              </button>
            ))}
          </div>
        </div>
      )}

      <Button fullWidth size="lg" className="mt-6" disabled={!canProceed} onClick={onNext}>
        Continue
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}

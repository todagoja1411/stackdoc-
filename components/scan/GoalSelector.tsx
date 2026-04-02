'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import type { Goal } from '@/types'

interface GoalOption {
  id: Goal
  emoji: string
  title: string
  description: string
  color: string
  borderColor: string
  bgColor: string
}

const GOALS: GoalOption[] = [
  {
    id: 'Muscle & Performance',
    emoji: '💪',
    title: 'Muscle & Performance',
    description: 'Build strength, enhance training output, and support recovery.',
    color: 'text-blue-400',
    borderColor: 'border-blue-500/40',
    bgColor: 'bg-blue-500/5',
  },
  {
    id: 'Sleep & Recovery',
    emoji: '😴',
    title: 'Sleep & Recovery',
    description: 'Improve sleep quality, reduce stress, and accelerate physical recovery.',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    bgColor: 'bg-purple-500/5',
  },
  {
    id: 'Weight Loss',
    emoji: '🔥',
    title: 'Weight Loss',
    description: 'Support metabolism, manage appetite, and maintain energy while cutting.',
    color: 'text-orange-400',
    borderColor: 'border-orange-500/40',
    bgColor: 'bg-orange-500/5',
  },
  {
    id: 'General Health & Immunity',
    emoji: '🛡️',
    title: 'General Health & Immunity',
    description: 'Cover nutritional gaps, support immune function, and promote longevity.',
    color: 'text-brand-400',
    borderColor: 'border-brand-500/40',
    bgColor: 'bg-brand-500/5',
  },
]

interface Props {
  selectedGoal: Goal | null
  onGoalChange: (g: Goal) => void
  onBack: () => void
  onNext: () => void
}

export default function GoalSelector({ selectedGoal, onGoalChange, onBack, onNext }: Props) {
  return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold text-white mb-2">What&apos;s your goal?</h1>
      <p className="text-gray-400 text-sm mb-6">
        This shapes how the AI evaluates your stack and what it recommends.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {GOALS.map((g) => {
          const selected = selectedGoal === g.id
          return (
            <button
              key={g.id}
              onClick={() => onGoalChange(g.id)}
              className={[
                'p-4 rounded-xl border text-left transition-all',
                selected
                  ? `${g.borderColor} ${g.bgColor} ring-1 ring-inset ${g.borderColor}`
                  : 'border-[#1f1f1f] bg-[#111111] hover:border-[#2a2a2a]',
              ].join(' ')}
            >
              <div className="text-2xl mb-2">{g.emoji}</div>
              <p className={`text-sm font-semibold mb-1 ${selected ? g.color : 'text-white'}`}>
                {g.title}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">{g.description}</p>
            </button>
          )
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack} className="w-12 flex-shrink-0">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button fullWidth size="lg" disabled={!selectedGoal} onClick={onNext}>
          Continue
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

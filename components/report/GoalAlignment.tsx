import { Plus, Minus } from 'lucide-react'
import type { GoalAlignment as GoalAlignmentType } from '@/types'

interface Props {
  alignment: GoalAlignmentType
  goal: string
}

function AlignmentBar({ score }: { score: number }) {
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#3b82f6' : score >= 30 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-mono font-bold" style={{ color }}>
        {score}%
      </span>
    </div>
  )
}

export default function GoalAlignment({ alignment, goal }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-300">Alignment with &quot;{goal}&quot;</p>
        </div>
        <AlignmentBar score={alignment.score} />
      </div>

      {alignment.missing.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Plus className="w-4 h-4 text-brand-400" />
            <p className="text-sm font-medium text-brand-400">Consider adding</p>
          </div>
          <ul className="space-y-2">
            {alignment.missing.map((item, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-brand-500/5 border border-brand-500/15 rounded-xl">
                <span className="text-brand-500 font-mono text-xs mt-0.5">+</span>
                <span className="text-sm text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {alignment.unnecessary.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Minus className="w-4 h-4 text-gray-500" />
            <p className="text-sm font-medium text-gray-400">Low relevance for this goal</p>
          </div>
          <ul className="space-y-2">
            {alignment.unnecessary.map((item, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-[#141414] border border-[#1f1f1f] rounded-xl">
                <span className="text-gray-600 font-mono text-xs mt-0.5">−</span>
                <span className="text-sm text-gray-400">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

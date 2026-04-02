import { Sun, Coffee, Sunset, Moon } from 'lucide-react'
import type { TimingGuide as TimingGuideType } from '@/types'

const PERIODS = [
  { key: 'morning' as const, label: 'Morning', icon: Sun, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { key: 'afternoon' as const, label: 'Afternoon', icon: Coffee, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { key: 'evening' as const, label: 'Evening', icon: Sunset, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { key: 'bedtime' as const, label: 'Bedtime', icon: Moon, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
]

interface Props {
  guide: TimingGuideType
}

export default function TimingGuide({ guide }: Props) {
  const hasAny = PERIODS.some((p) => guide[p.key]?.length > 0)

  if (!hasAny) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        No specific timing recommendations for this stack.
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {PERIODS.map(({ key, label, icon: Icon, color, bg, border }) => {
        const items = guide[key] ?? []
        if (items.length === 0) return null

        return (
          <div key={key} className={`${bg} border ${border} rounded-xl p-4`}>
            <div className={`flex items-center gap-2 mb-3 ${color}`}>
              <Icon className="w-4 h-4" />
              <span className="text-sm font-semibold">{label}</span>
            </div>
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className="text-sm text-gray-300 leading-relaxed flex items-start gap-2">
                  <span className={`font-mono text-xs ${color} mt-0.5`}>→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

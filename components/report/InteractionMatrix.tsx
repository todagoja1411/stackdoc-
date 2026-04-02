import { AlertTriangle, Info, Zap } from 'lucide-react'
import type { Interaction, InteractionType } from '@/types'

const typeConfig: Record<
  InteractionType,
  { icon: typeof AlertTriangle; color: string; bg: string; border: string; label: string }
> = {
  Warning: {
    icon: AlertTriangle,
    color: 'text-red-400',
    bg: 'bg-red-500/5',
    border: 'border-red-500/20',
    label: 'Warning',
  },
  Caution: {
    icon: Info,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/5',
    border: 'border-yellow-500/20',
    label: 'Caution',
  },
  Synergy: {
    icon: Zap,
    color: 'text-brand-400',
    bg: 'bg-brand-500/5',
    border: 'border-brand-500/20',
    label: 'Synergy',
  },
}

interface Props {
  interactions: Interaction[]
}

export default function InteractionMatrix({ interactions }: Props) {
  if (interactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        No notable interactions found in this stack.
      </div>
    )
  }

  // Sort: Warnings first, then Caution, then Synergy
  const sorted = [...interactions].sort((a, b) => {
    const order: Record<InteractionType, number> = { Warning: 0, Caution: 1, Synergy: 2 }
    return order[a.type] - order[b.type]
  })

  return (
    <div className="space-y-3">
      {sorted.map((interaction, i) => {
        const cfg = typeConfig[interaction.type]
        const Icon = cfg.icon

        return (
          <div
            key={i}
            className={`${cfg.bg} border ${cfg.border} rounded-xl p-4 flex items-start gap-3`}
          >
            <div className={`flex-shrink-0 mt-0.5 ${cfg.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                <span className="text-xs text-gray-500">
                  {interaction.pair[0]} + {interaction.pair[1]}
                </span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{interaction.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

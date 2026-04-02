'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import type { SupplementDetail, EvidenceRating } from '@/types'

const evidenceConfig: Record<EvidenceRating, { variant: 'green' | 'blue' | 'yellow' | 'red' | 'gray'; label: string }> = {
  Strong: { variant: 'green', label: 'Strong Evidence' },
  Moderate: { variant: 'blue', label: 'Moderate Evidence' },
  Weak: { variant: 'yellow', label: 'Weak Evidence' },
  None: { variant: 'red', label: 'No Evidence' },
}

interface Props {
  supplement: SupplementDetail
  index: number
}

export default function SupplementCard({ supplement, index }: Props) {
  const [expanded, setExpanded] = useState(false)
  const evidence = evidenceConfig[supplement.evidence_rating] ?? evidenceConfig.None

  return (
    <div
      className="bg-[#111111] border border-[#1f1f1f] rounded-xl overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-5 py-4 flex items-start justify-between gap-3 text-left hover:bg-[#161616] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm font-semibold text-white">{supplement.name}</h3>
            <Badge variant={evidence.variant}>{evidence.label}</Badge>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{supplement.what_it_does}</p>
        </div>
        <div className="flex-shrink-0 mt-0.5">
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-4 border-t border-[#1a1a1a] pt-4 space-y-4 animate-fade-in">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              How it works
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">{supplement.how_it_works}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Dosage assessment
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">{supplement.dosage_assessment}</p>
          </div>

          {supplement.secondary_effects.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Side effects &amp; notes
              </p>
              <ul className="space-y-1.5">
                {supplement.secondary_effects.map((effect, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <AlertCircle className="w-3.5 h-3.5 text-yellow-500/70 mt-0.5 flex-shrink-0" />
                    {effect}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

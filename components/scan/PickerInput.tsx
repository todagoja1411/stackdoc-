'use client'

import { useState } from 'react'
import { Search, X, ChevronRight, ArrowLeft, Check } from 'lucide-react'
import Button from '@/components/ui/Button'

interface Supplement {
  name: string
  dose?: string
  category: string
}

const CATALOG: Supplement[] = [
  // Muscle & Performance
  { name: 'Creatine Monohydrate', dose: '5g', category: 'Muscle & Performance' },
  { name: 'Whey Protein', dose: '25–30g', category: 'Muscle & Performance' },
  { name: 'Beta-Alanine', dose: '3.2g', category: 'Muscle & Performance' },
  { name: 'Citrulline Malate', dose: '6–8g', category: 'Muscle & Performance' },
  { name: 'BCAAs', dose: '5–10g', category: 'Muscle & Performance' },
  { name: 'Pre-Workout (Caffeine)', dose: '150–200mg', category: 'Muscle & Performance' },
  { name: 'Glutamine', dose: '5g', category: 'Muscle & Performance' },
  { name: 'Casein Protein', dose: '25g', category: 'Muscle & Performance' },
  { name: 'HMB', dose: '3g', category: 'Muscle & Performance' },
  // Sleep & Recovery
  { name: 'Magnesium Glycinate', dose: '400mg', category: 'Sleep & Recovery' },
  { name: 'Melatonin', dose: '0.5–5mg', category: 'Sleep & Recovery' },
  { name: 'Ashwagandha', dose: '300–600mg', category: 'Sleep & Recovery' },
  { name: 'L-Theanine', dose: '200mg', category: 'Sleep & Recovery' },
  { name: 'ZMA', dose: '30mg zinc / 450mg magnesium', category: 'Sleep & Recovery' },
  { name: 'Valerian Root', dose: '300–600mg', category: 'Sleep & Recovery' },
  { name: 'GABA', dose: '500–750mg', category: 'Sleep & Recovery' },
  { name: 'Phosphatidylserine', dose: '200–400mg', category: 'Sleep & Recovery' },
  // Weight Loss
  { name: 'Caffeine', dose: '200mg', category: 'Weight Loss' },
  { name: 'Green Tea Extract', dose: '500mg', category: 'Weight Loss' },
  { name: 'L-Carnitine', dose: '2g', category: 'Weight Loss' },
  { name: 'CLA', dose: '3g', category: 'Weight Loss' },
  { name: 'Berberine', dose: '500mg', category: 'Weight Loss' },
  { name: 'Glucomannan', dose: '1–3g', category: 'Weight Loss' },
  { name: 'Chromium Picolinate', dose: '200–400mcg', category: 'Weight Loss' },
  // General Health
  { name: 'Vitamin D3', dose: '2000–5000 IU', category: 'General Health' },
  { name: 'Omega-3 Fish Oil', dose: '1–3g EPA/DHA', category: 'General Health' },
  { name: 'Vitamin C', dose: '500–1000mg', category: 'General Health' },
  { name: 'Zinc', dose: '15–30mg', category: 'General Health' },
  { name: 'Magnesium', dose: '200–400mg', category: 'General Health' },
  { name: 'Multivitamin', dose: '1 serving', category: 'General Health' },
  { name: 'Probiotics', dose: '10–50 billion CFU', category: 'General Health' },
  { name: 'Vitamin B12', dose: '500–1000mcg', category: 'General Health' },
  { name: 'Iron', dose: '18–27mg', category: 'General Health' },
  { name: 'Folate (B9)', dose: '400–800mcg', category: 'General Health' },
  // Energy & Focus
  { name: 'CoQ10', dose: '100–300mg', category: 'Energy & Focus' },
  { name: 'Rhodiola Rosea', dose: '200–400mg', category: 'Energy & Focus' },
  { name: 'Lion\'s Mane Mushroom', dose: '500–1000mg', category: 'Energy & Focus' },
  { name: 'Alpha-GPC', dose: '300–600mg', category: 'Energy & Focus' },
  { name: 'Bacopa Monnieri', dose: '300–450mg', category: 'Energy & Focus' },
  { name: 'NAC (N-Acetyl Cysteine)', dose: '600mg', category: 'Energy & Focus' },
  { name: 'Panax Ginseng', dose: '200–400mg', category: 'Energy & Focus' },
]

const CATEGORIES = ['All', ...Array.from(new Set(CATALOG.map((s) => s.category)))]

const CATEGORY_COLORS: Record<string, string> = {
  'Muscle & Performance': 'text-brand-400 bg-brand-500/10 border-brand-500/20',
  'Sleep & Recovery': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Weight Loss': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'General Health': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'Energy & Focus': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
}

interface Props {
  selected: string[]
  onChange: (selected: string[]) => void
  onNext: () => void
  onBack: () => void
}

export default function PickerInput({ selected, onChange, onNext, onBack }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = CATALOG.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory
    return matchesSearch && matchesCategory
  })

  function toggle(name: string) {
    if (selected.includes(name)) {
      onChange(selected.filter((s) => s !== name))
    } else {
      onChange([...selected, name])
    }
  }

  return (
    <div className="animate-slide-up">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="text-2xl font-bold text-white mb-1">Pick your supplements</h1>
      <p className="text-gray-400 text-sm mb-5">Tap to add, tap again to remove</p>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search supplements…"
          className="w-full bg-[#111111] border border-[#1f1f1f] rounded-xl pl-9 pr-4 h-10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-500/40 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-gray-500 hover:text-gray-300" />
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={[
              'flex-shrink-0 px-3 h-7 rounded-full text-xs font-medium transition-all border',
              activeCategory === cat
                ? 'bg-brand-500 text-black border-brand-500'
                : 'bg-[#111111] text-gray-400 border-[#1f1f1f] hover:text-white hover:border-[#2a2a2a]',
            ].join(' ')}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Selected pills */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl">
          {selected.map((name) => (
            <button
              key={name}
              onClick={() => toggle(name)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-medium rounded-full hover:bg-brand-500/25 transition-colors"
            >
              {name}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}

      {/* Supplement grid */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {filtered.map((s) => {
          const isSelected = selected.includes(s.name)
          const colorClass = CATEGORY_COLORS[s.category] ?? 'text-gray-400 bg-[#1a1a1a] border-[#2a2a2a]'
          return (
            <button
              key={s.name}
              onClick={() => toggle(s.name)}
              className={[
                'w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all text-left',
                isSelected
                  ? 'bg-brand-500/10 border-brand-500/40'
                  : 'bg-[#111111] border-[#1f1f1f] hover:border-[#2a2a2a]',
              ].join(' ')}
            >
              <div className="flex-1 min-w-0">
                <p className={['text-sm font-medium', isSelected ? 'text-white' : 'text-gray-300'].join(' ')}>
                  {s.name}
                </p>
                {s.dose && (
                  <p className="text-xs text-gray-600 font-mono mt-0.5">{s.dose}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colorClass}`}>
                  {s.category.split(' ')[0]}
                </span>
                <div
                  className={[
                    'w-5 h-5 rounded-full border flex items-center justify-center transition-all',
                    isSelected
                      ? 'bg-brand-500 border-brand-500'
                      : 'border-[#2a2a2a]',
                  ].join(' ')}
                >
                  {isSelected && <Check className="w-3 h-3 text-black" />}
                </div>
              </div>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-600 py-8">No supplements found</p>
        )}
      </div>

      <Button
        fullWidth
        size="lg"
        className="mt-5"
        disabled={selected.length === 0}
        onClick={onNext}
      >
        Analyze {selected.length > 0 ? `${selected.length} supplement${selected.length > 1 ? 's' : ''}` : 'stack'}
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}

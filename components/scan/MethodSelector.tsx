'use client'

import { Camera, LayoutList, Sparkles, ChevronRight } from 'lucide-react'

export type InputMethod = 'camera' | 'list' | 'chat'

interface Props {
  onSelect: (method: InputMethod) => void
}

export default function MethodSelector({ onSelect }: Props) {
  return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold text-white mb-1">Add your supplements</h1>
      <p className="text-gray-400 text-sm mb-8">Choose how you want to get started</p>

      <div className="space-y-3">
        {/* Camera — hero option */}
        <button
          onClick={() => onSelect('camera')}
          className="w-full group relative overflow-hidden flex items-center gap-4 p-5 bg-brand-500/10 border border-brand-500/30 rounded-2xl hover:bg-brand-500/15 hover:border-brand-500/50 transition-all text-left"
        >
          <div className="w-14 h-14 bg-brand-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/25">
            <Camera className="w-7 h-7 text-black" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-base font-semibold text-white">Scan your bottles</p>
              <span className="text-xs font-medium px-2 py-0.5 bg-brand-500/20 text-brand-400 border border-brand-500/20 rounded-full">
                Fastest
              </span>
            </div>
            <p className="text-sm text-gray-400">Take a photo of your supplement bottles and our AI reads the labels</p>
          </div>
          <ChevronRight className="w-5 h-5 text-brand-400 flex-shrink-0" />
        </button>

        {/* List picker */}
        <button
          onClick={() => onSelect('list')}
          className="w-full group flex items-center gap-4 p-5 bg-[#111111] border border-[#1f1f1f] rounded-2xl hover:border-[#2a2a2a] hover:bg-[#141414] transition-all text-left"
        >
          <div className="w-14 h-14 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl flex items-center justify-center flex-shrink-0">
            <LayoutList className="w-7 h-7 text-gray-300" />
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-white mb-0.5">Pick from a list</p>
            <p className="text-sm text-gray-500">Browse and tap the supplements you already take</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
        </button>

        {/* AI chat */}
        <button
          onClick={() => onSelect('chat')}
          className="w-full group flex items-center gap-4 p-5 bg-[#111111] border border-[#1f1f1f] rounded-2xl hover:border-[#2a2a2a] hover:bg-[#141414] transition-all text-left"
        >
          <div className="w-14 h-14 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-7 h-7 text-gray-300" />
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-white mb-0.5">Get AI recommendations</p>
            <p className="text-sm text-gray-500">Tell us your goal and we'll build the perfect stack for you</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
        </button>
      </div>
    </div>
  )
}

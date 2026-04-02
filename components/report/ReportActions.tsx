'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Download, Share2, Lock, Check } from 'lucide-react'

interface Props {
  scanId: string
  paid: boolean
}

export default function ReportActions({ scanId, paid }: Props) {
  const [copied, setCopied] = useState(false)

  function handleShare() {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex gap-3 mt-4 no-print">
      {paid ? (
        <a
          href={`/api/report/pdf?id=${scanId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 h-9 px-4 bg-[#111111] border border-[#1f1f1f] text-sm text-gray-300 rounded-xl hover:text-white hover:border-[#2a2a2a] transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </a>
      ) : (
        <Link
          href="/scan"
          className="flex items-center gap-2 h-9 px-4 bg-[#111111] border border-[#1f1f1f] text-sm text-gray-600 rounded-xl hover:border-brand-500/30 hover:text-brand-400 transition-colors group"
        >
          <Lock className="w-3.5 h-3.5" />
          Download PDF
          <span className="text-xs bg-brand-500/10 text-brand-400 border border-brand-500/20 px-1.5 py-0.5 rounded-full group-hover:bg-brand-500/20">
            Pro
          </span>
        </Link>
      )}
      <button
        onClick={handleShare}
        className="flex items-center gap-2 h-9 px-4 bg-[#111111] border border-[#1f1f1f] text-sm text-gray-300 rounded-xl hover:text-white hover:border-[#2a2a2a] transition-colors"
      >
        {copied ? <Check className="w-4 h-4 text-brand-400" /> : <Share2 className="w-4 h-4" />}
        {copied ? 'Copied!' : 'Share'}
      </button>
    </div>
  )
}

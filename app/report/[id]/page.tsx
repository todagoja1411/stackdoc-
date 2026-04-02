import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getScanById } from '@/lib/supabase'
import Navbar from '@/components/ui/Navbar'
import ScoreGauge from '@/components/report/ScoreGauge'
import SupplementCard from '@/components/report/SupplementCard'
import InteractionMatrix from '@/components/report/InteractionMatrix'
import TimingGuide from '@/components/report/TimingGuide'
import GoalAlignment from '@/components/report/GoalAlignment'
import {
  FlaskConical,
  ChevronRight,
  Download,
  Share2,
  AlertTriangle,
  Layers,
  ListChecks,
  Lock,
} from 'lucide-react'

interface Props {
  params: { id: string }
}

export default async function ReportPage({ params }: Props) {
  const scan = await getScanById(params.id)

  if (!scan) notFound()

  const report = scan.report_json
  const date = new Date(scan.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        {/* Header */}
        <div className="py-8 border-b border-[#1f1f1f] mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
                  <FlaskConical className="w-4 h-4 text-black" />
                </div>
                <span className="text-sm font-medium text-brand-400">StackDoc Report</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">{scan.goal}</h1>
              <p className="text-sm text-gray-500">{date}</p>
            </div>

            <ScoreGauge score={report.score} />
          </div>

          {/* Overview */}
          <div className="mt-6 p-4 bg-[#111111] border border-[#1f1f1f] rounded-xl">
            <p className="text-sm text-gray-300 leading-relaxed">{report.overview}</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-4 no-print">
            {scan.paid ? (
              <a
                href={`/api/report/pdf?id=${scan.id}`}
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
                className="flex items-center gap-2 h-9 px-4 bg-[#111111] border border-[#1f1f1f] text-sm text-gray-600 rounded-xl cursor-pointer hover:border-brand-500/30 hover:text-brand-400 transition-colors group"
                title="Upgrade to Pro to download PDF"
              >
                <Lock className="w-3.5 h-3.5" />
                Download PDF
                <span className="text-xs bg-brand-500/10 text-brand-400 border border-brand-500/20 px-1.5 py-0.5 rounded-full group-hover:bg-brand-500/20">
                  Pro
                </span>
              </Link>
            )}
            <button
              onClick={() => typeof navigator !== 'undefined' && navigator.clipboard?.writeText(window.location.href)}
              className="flex items-center gap-2 h-9 px-4 bg-[#111111] border border-[#1f1f1f] text-sm text-gray-300 rounded-xl hover:text-white hover:border-[#2a2a2a] transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Supplements */}
        <section className="mb-10">
          <SectionHeader icon={FlaskConical} title="Supplement Breakdown" count={report.supplements.length} />
          <div className="space-y-2 mt-4">
            {report.supplements.map((s, i) => (
              <SupplementCard key={s.name} supplement={s} index={i} />
            ))}
          </div>
        </section>

        {/* Interactions */}
        <section className="mb-10">
          <SectionHeader
            icon={AlertTriangle}
            title="Interactions"
            count={report.interactions.length}
            subtitle="Warnings, cautions, and synergies"
          />
          <div className="mt-4">
            <InteractionMatrix interactions={report.interactions} />
          </div>
        </section>

        {/* Redundancies */}
        {report.redundancies.length > 0 && (
          <section className="mb-10">
            <SectionHeader
              icon={Layers}
              title="Redundancies"
              count={report.redundancies.length}
              subtitle="Overlapping supplements to consolidate"
            />
            <div className="mt-4 space-y-2">
              {report.redundancies.map((r, i) => (
                <div key={i} className="p-3 bg-[#111111] border border-[#1f1f1f] rounded-xl text-sm text-gray-300">
                  {r}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Timing Guide */}
        <section className="mb-10">
          <SectionHeader icon={FlaskConical} title="Daily Timing Guide" subtitle="When to take each supplement" />
          <div className="mt-4">
            <TimingGuide guide={report.timing_guide} />
          </div>
        </section>

        {/* Goal Alignment */}
        <section className="mb-10">
          <SectionHeader
            icon={ListChecks}
            title="Goal Alignment"
            subtitle={`How well this stack fits your ${scan.goal} goal`}
          />
          <div className="mt-4 bg-[#111111] border border-[#1f1f1f] rounded-xl p-5">
            <GoalAlignment alignment={report.goal_alignment} goal={scan.goal} />
          </div>
        </section>

        {/* Recommendations */}
        {report.recommendations.length > 0 && (
          <section className="mb-10">
            <SectionHeader
              icon={ChevronRight}
              title="Recommendations"
              count={report.recommendations.length}
              subtitle="Actionable next steps"
            />
            <div className="mt-4 space-y-2">
              {report.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 bg-[#111111] border border-[#1f1f1f] rounded-xl"
                >
                  <span className="font-mono text-xs text-brand-500 mt-0.5 flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm text-gray-300 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Analyze another */}
        <div className="border-t border-[#1f1f1f] pt-8 text-center no-print">
          <p className="text-gray-500 text-sm mb-4">Want to analyze a different stack?</p>
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 h-10 px-5 bg-brand-500 text-black font-semibold text-sm rounded-xl hover:bg-brand-400 transition-colors"
          >
            <FlaskConical className="w-4 h-4" />
            Analyze Another Stack
          </Link>
        </div>

        {/* Medical disclaimer */}
        <div className="mt-8 p-4 bg-yellow-500/5 border border-yellow-500/15 rounded-xl">
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="font-medium text-yellow-400/80">Medical Disclaimer:</span>{' '}
            This report is for informational purposes only and does not constitute medical advice. Always
            consult a qualified healthcare provider before making changes to your supplement regimen,
            especially if you have a medical condition or take prescription medications.
          </p>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  count,
}: {
  icon: React.ElementType
  title: string
  subtitle?: string
  count?: number
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-500" />
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {count !== undefined && (
          <span className="text-xs font-mono text-gray-600 bg-[#1a1a1a] px-1.5 py-0.5 rounded">
            {count}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-gray-600 text-right">{subtitle}</p>}
    </div>
  )
}

import Link from 'next/link'
import {
  FlaskConical,
  Camera,
  Zap,
  FileText,
  ChevronRight,
  ShieldCheck,
  Star,
  AlertTriangle,
  TrendingUp,
  Clock,
} from 'lucide-react'
import Navbar from '@/components/ui/Navbar'

const STEPS = [
  {
    number: '01',
    icon: Camera,
    title: 'Input your stack',
    description: 'Type your supplements manually or snap a photo of your bottles. Our AI reads the labels.',
  },
  {
    number: '02',
    icon: Zap,
    title: 'Pick your goal',
    description: 'Tell us what you\'re optimizing for — muscle, sleep, weight loss, or general health.',
  },
  {
    number: '03',
    icon: FileText,
    title: 'Get your report',
    description: 'Receive a detailed breakdown: interactions, timing guide, gaps, and evidence ratings.',
  },
]

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Interaction Analysis',
    description: 'Identifies dangerous combinations, beneficial synergies, and redundancies in your stack.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
  },
  {
    icon: Clock,
    title: 'Timing Guide',
    description: 'Know exactly when to take each supplement for maximum absorption and effect.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Evidence Ratings',
    description: 'Every supplement rated Strong / Moderate / Weak / None based on current research.',
    color: 'text-brand-400',
    bg: 'bg-brand-500/10',
  },
  {
    icon: Star,
    title: 'Goal Alignment',
    description: 'See how well your stack matches your goal and what\'s missing or unnecessary.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full text-brand-400 text-xs font-medium mb-8">
            <FlaskConical className="w-3.5 h-3.5" />
            AI-Powered Supplement Analysis
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 text-balance">
            Stop guessing.{' '}
            <span className="text-brand-500">Scan your stack.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 text-balance">
            Get an instant AI-powered analysis of your supplement stack — interactions, evidence ratings,
            timing guide, and personalized recommendations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/scan"
              className="flex items-center gap-2 h-12 px-6 bg-brand-500 text-black font-semibold text-base rounded-xl hover:bg-brand-400 transition-colors shadow-lg hover:shadow-brand-500/25"
            >
              Analyze My Stack
              <ChevronRight className="w-4 h-4" />
            </Link>
            <p className="text-sm text-gray-500">First scan free · $9.99/mo after</p>
          </div>
        </div>

        {/* Hero visual */}
        <div className="max-w-3xl mx-auto mt-16">
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
            {/* Mock report header */}
            <div className="border-b border-[#1f1f1f] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                  <FlaskConical className="w-4 h-4 text-black" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Sample Report</p>
                  <p className="text-xs text-gray-500">Muscle & Performance · 6 supplements</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 relative">
                  <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f1f1f" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke="#22c55e" strokeWidth="3"
                      strokeDasharray="78 22"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold font-mono text-white">78</span>
                </div>
              </div>
            </div>

            {/* Mock supplement rows */}
            <div className="divide-y divide-[#1a1a1a]">
              {[
                { name: 'Creatine Monohydrate', dose: '5g', evidence: 'Strong', color: 'text-brand-400 bg-brand-500/10' },
                { name: 'Whey Protein Isolate', dose: '30g', evidence: 'Strong', color: 'text-brand-400 bg-brand-500/10' },
                { name: 'Vitamin D3', dose: '2000 IU', evidence: 'Moderate', color: 'text-blue-400 bg-blue-500/10' },
                { name: 'Pre-workout (Caffeine)', dose: '200mg', evidence: 'Strong', color: 'text-brand-400 bg-brand-500/10' },
              ].map((s) => (
                <div key={s.name} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{s.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{s.dose}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.color}`}>
                    {s.evidence}
                  </span>
                </div>
              ))}
            </div>

            {/* Mock interaction alert */}
            <div className="px-6 py-4 border-t border-[#1f1f1f]">
              <div className="flex items-start gap-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-300">
                  <span className="font-medium text-yellow-400">Timing note:</span>{' '}
                  Take caffeine and creatine separately — caffeine may slightly reduce creatine uptake if taken together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 border-t border-[#1f1f1f]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-gray-400">Three steps to understanding your stack</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div key={step.number} className="relative">
                <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-5 h-5 text-brand-400" />
                    </div>
                    <span className="font-mono text-xs text-gray-600 mt-2">{step.number}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 border-t border-[#1f1f1f]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What's in your report</h2>
            <p className="text-gray-400">Every report includes these sections</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6 flex gap-4">
                <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 border-t border-[#1f1f1f]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Simple pricing</h2>
          <p className="text-gray-400 mb-12">Start free. Upgrade for unlimited scans.</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Free */}
            <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6 text-left">
              <p className="text-sm font-medium text-gray-400 mb-1">Free</p>
              <p className="text-4xl font-bold text-white mb-1">$0</p>
              <p className="text-sm text-gray-500 mb-6">No credit card required</p>
              <ul className="space-y-2 text-sm text-gray-300">
                {['1 free scan', 'Full AI analysis', 'Interaction check', 'Timing guide'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-brand-500">✓</span> {item}
                  </li>
                ))}
                <li className="flex items-center gap-2 text-gray-600">
                  <span>✕</span> PDF download
                </li>
              </ul>
            </div>

            {/* Paid */}
            <div className="bg-[#111111] border border-brand-500/30 rounded-2xl p-6 text-left relative overflow-hidden">
              <div className="absolute top-3 right-3">
                <span className="text-xs font-medium px-2 py-0.5 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-full">
                  Monthly
                </span>
              </div>
              <p className="text-sm font-medium text-gray-400 mb-1">Pro</p>
              <p className="text-4xl font-bold text-white mb-1">$9.99<span className="text-lg font-normal text-gray-500">/mo</span></p>
              <p className="text-sm text-gray-500 mb-6">Unlimited scans, cancel anytime</p>
              <ul className="space-y-2 text-sm text-gray-300">
                {['Unlimited scans', 'Full AI analysis', 'Interaction check', 'Timing guide', 'PDF download'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-brand-500">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 border-t border-[#1f1f1f]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to know your stack?</h2>
          <p className="text-gray-400 mb-8">First scan is free. $9.99/mo for unlimited. Takes less than 60 seconds.</p>
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 h-12 px-8 bg-brand-500 text-black font-semibold text-base rounded-xl hover:bg-brand-400 transition-colors"
          >
            Analyze My Stack Free
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer + Disclaimer */}
      <footer className="border-t border-[#1f1f1f] py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-brand-500 rounded-md flex items-center justify-center">
                <FlaskConical className="w-3.5 h-3.5 text-black" />
              </div>
              <span className="text-sm font-semibold text-white">StackDoc</span>
            </div>
            <p className="text-xs text-gray-600">© {new Date().getFullYear()} StackDoc. All rights reserved.</p>
          </div>

          <div className="p-4 bg-yellow-500/5 border border-yellow-500/15 rounded-xl">
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="font-medium text-yellow-400/80">Medical Disclaimer:</span>{' '}
              StackDoc is for informational purposes only and does not constitute medical advice. The analysis
              provided is based on general research and should not replace consultation with a qualified healthcare
              provider. Always consult your doctor or pharmacist before starting, stopping, or changing any
              supplement regimen, especially if you have a medical condition or take prescription medications.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

import Link from 'next/link'
import { FlaskConical } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1f1f1f] bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
            <FlaskConical className="w-4 h-4 text-black" />
          </div>
          <span className="font-semibold text-white tracking-tight">StackDoc</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/scan"
            className="h-8 px-4 bg-brand-500 text-black text-sm font-semibold rounded-lg hover:bg-brand-400 transition-colors"
          >
            Analyze Stack
          </Link>
        </div>
      </div>
    </nav>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { DM_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'StackDoc — AI Supplement Stack Analyzer',
  description:
    'Know exactly what your supplements are doing. AI-powered analysis of your supplement stack — interactions, timing, goal alignment, and evidence-based recommendations.',
  keywords: ['supplements', 'supplement stack', 'AI analysis', 'vitamin stack', 'health optimization'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'StackDoc',
  },
  openGraph: {
    title: 'StackDoc — AI Supplement Stack Analyzer',
    description: 'Stop guessing. Scan your supplement stack and get an instant AI-powered report.',
    type: 'website',
    siteName: 'StackDoc',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StackDoc — AI Supplement Stack Analyzer',
    description: 'Stop guessing. Scan your supplement stack.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${dmMono.variable}`}>
      <head>
        <meta name="application-name" content="StackDoc" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="StackDoc" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512.png" />
      </head>
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  )
}

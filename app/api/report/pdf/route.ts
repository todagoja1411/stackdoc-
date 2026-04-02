import { NextRequest, NextResponse } from 'next/server'
import { getScanById } from '@/lib/supabase'
import { generateReportHTML } from '@/lib/pdf'

/**
 * Returns the report as a print-ready HTML page.
 * The browser's native "Print → Save as PDF" handles the PDF conversion,
 * which requires no server-side headless browser and works perfectly on Vercel.
 *
 * Usage: GET /api/report/pdf?id={scanId}
 */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  const scan = await getScanById(id)

  if (!scan) {
    return NextResponse.json({ error: 'Scan not found' }, { status: 404 })
  }

  const html = generateReportHTML(scan)

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Suggest filename when user saves/prints
      'Content-Disposition': `inline; filename="stackdoc-report-${id.slice(0, 8)}.pdf"`,
    },
  })
}

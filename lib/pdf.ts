import type { Scan, AnalysisReport, EvidenceRating, InteractionType } from '@/types'

const evidenceLabel: Record<EvidenceRating, string> = {
  Strong: 'Strong Evidence',
  Moderate: 'Moderate Evidence',
  Weak: 'Weak Evidence',
  None: 'No Evidence',
}

const interactionLabel: Record<InteractionType, string> = {
  Warning: '⚠ Warning',
  Caution: 'ℹ Caution',
  Synergy: '⚡ Synergy',
}

function scoreLabel(score: number): string {
  if (score >= 85) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 55) return 'Fair'
  if (score >= 40) return 'Poor'
  return 'Critical'
}

/** Generates a complete HTML document styled for PDF printing */
export function generateReportHTML(scan: Scan): string {
  const report: AnalysisReport = scan.report_json
  const date = new Date(scan.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const suppRows = report.supplements
    .map(
      (s) => `
    <tr>
      <td class="supp-name">${esc(s.name)}</td>
      <td class="evidence ${s.evidence_rating.toLowerCase()}">${evidenceLabel[s.evidence_rating]}</td>
      <td>${esc(s.what_it_does)}</td>
      <td>${esc(s.dosage_assessment)}</td>
    </tr>`
    )
    .join('')

  const interactionRows = report.interactions
    .map(
      (ix) => `
    <div class="interaction ${ix.type.toLowerCase()}">
      <strong>${interactionLabel[ix.type]}: ${esc(ix.pair[0])} + ${esc(ix.pair[1])}</strong>
      <p>${esc(ix.description)}</p>
    </div>`
    )
    .join('')

  const timingPeriods = ['morning', 'afternoon', 'evening', 'bedtime'] as const
  const timingRows = timingPeriods
    .map((period) => {
      const items = report.timing_guide[period]
      if (!items?.length) return ''
      return `
      <div class="timing-period">
        <h4>${period.charAt(0).toUpperCase() + period.slice(1)}</h4>
        <ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>`
    })
    .join('')

  const recs = report.recommendations
    .map((r, i) => `<li><span class="rec-num">${String(i + 1).padStart(2, '0')}</span>${esc(r)}</li>`)
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>StackDoc Report — ${esc(scan.goal)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #111; background: #fff; line-height: 1.5; }
  .page { max-width: 800px; margin: 0 auto; padding: 40px; }

  /* Header */
  .header { display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 2px solid #22c55e; padding-bottom: 20px; margin-bottom: 24px; }
  .brand { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 16px; color: #111; }
  .brand-dot { width: 12px; height: 12px; background: #22c55e; border-radius: 3px; display: inline-block; }
  .header-meta { text-align: right; color: #666; font-size: 11px; }
  .header-meta h1 { font-size: 18px; color: #111; font-weight: 700; margin-bottom: 2px; }

  /* Score */
  .score-row { display: flex; align-items: center; gap: 24px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; }
  .score-num { font-size: 40px; font-weight: 800; color: #22c55e; font-family: monospace; line-height: 1; }
  .score-label { font-size: 11px; color: #666; }
  .overview { flex: 1; font-size: 12px; color: #333; line-height: 1.6; }

  /* Sections */
  h2 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #666; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 12px; margin-top: 24px; }

  /* Supplement table */
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { background: #f9fafb; font-weight: 600; text-align: left; padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }
  td { padding: 8px 10px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
  .supp-name { font-weight: 600; }
  .evidence { font-weight: 600; font-size: 10px; padding: 2px 6px; border-radius: 99px; white-space: nowrap; }
  .evidence.strong { color: #15803d; background: #dcfce7; }
  .evidence.moderate { color: #1d4ed8; background: #dbeafe; }
  .evidence.weak { color: #b45309; background: #fef3c7; }
  .evidence.none { color: #b91c1c; background: #fee2e2; }

  /* Interactions */
  .interaction { padding: 10px 12px; border-radius: 8px; margin-bottom: 8px; font-size: 11px; }
  .interaction strong { display: block; margin-bottom: 3px; }
  .interaction p { color: #444; }
  .interaction.warning { background: #fef2f2; border-left: 3px solid #ef4444; }
  .interaction.caution { background: #fffbeb; border-left: 3px solid #f59e0b; }
  .interaction.synergy { background: #f0fdf4; border-left: 3px solid #22c55e; }

  /* Timing */
  .timing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .timing-period h4 { font-size: 11px; font-weight: 700; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; color: #666; }
  .timing-period ul { padding-left: 16px; }
  .timing-period li { font-size: 11px; color: #333; margin-bottom: 3px; }

  /* Goal alignment */
  .alignment-bar-bg { height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; margin-bottom: 4px; }
  .alignment-bar-fill { height: 100%; background: #22c55e; border-radius: 4px; }
  .alignment-score { font-size: 13px; font-weight: 700; color: #22c55e; font-family: monospace; }

  /* Recommendations */
  .rec-list { list-style: none; }
  .rec-list li { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 11px; color: #333; }
  .rec-num { font-family: monospace; font-weight: 700; color: #22c55e; flex-shrink: 0; }

  /* Disclaimer */
  .disclaimer { margin-top: 32px; padding: 12px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; font-size: 10px; color: #666; line-height: 1.6; }

  @media print {
    body { font-size: 11px; }
    .page { padding: 20px; }
    @page { margin: 20mm; }
  }
</style>
</head>
<body>
<div class="page">
  <!-- Header -->
  <div class="header">
    <div>
      <div class="brand"><span class="brand-dot"></span> StackDoc</div>
      <div style="color:#666;font-size:11px;margin-top:4px;">AI Supplement Stack Analyzer</div>
    </div>
    <div class="header-meta">
      <h1>${esc(scan.goal)}</h1>
      <div>Generated ${date}</div>
      <div style="font-family:monospace;color:#999;">ID: ${scan.id.slice(0, 8)}</div>
    </div>
  </div>

  <!-- Score + Overview -->
  <div class="score-row">
    <div>
      <div class="score-num">${report.score}</div>
      <div class="score-label">${scoreLabel(report.score)} Stack</div>
    </div>
    <div class="overview">${esc(report.overview)}</div>
  </div>

  <!-- Supplements -->
  <h2>Supplement Breakdown</h2>
  <table>
    <thead>
      <tr>
        <th>Supplement</th>
        <th>Evidence</th>
        <th>What it does</th>
        <th>Dosage assessment</th>
      </tr>
    </thead>
    <tbody>${suppRows}</tbody>
  </table>

  <!-- Interactions -->
  ${report.interactions.length > 0 ? `<h2>Interactions</h2>${interactionRows}` : ''}

  <!-- Redundancies -->
  ${
    report.redundancies.length > 0
      ? `<h2>Redundancies</h2>${report.redundancies.map((r) => `<p style="font-size:11px;color:#333;margin-bottom:6px;">• ${esc(r)}</p>`).join('')}`
      : ''
  }

  <!-- Timing Guide -->
  ${
    timingRows
      ? `<h2>Daily Timing Guide</h2><div class="timing-grid">${timingRows}</div>`
      : ''
  }

  <!-- Goal Alignment -->
  <h2>Goal Alignment</h2>
  <div style="margin-bottom:12px;">
    <div class="alignment-bar-bg"><div class="alignment-bar-fill" style="width:${report.goal_alignment.score}%"></div></div>
    <span class="alignment-score">${report.goal_alignment.score}%</span> alignment with ${esc(scan.goal)}
  </div>
  ${
    report.goal_alignment.missing.length > 0
      ? `<p style="font-size:11px;font-weight:600;color:#15803d;margin-bottom:4px;">Consider adding:</p>
         ${report.goal_alignment.missing.map((m) => `<p style="font-size:11px;color:#333;margin-bottom:4px;">+ ${esc(m)}</p>`).join('')}`
      : ''
  }

  <!-- Recommendations -->
  ${
    report.recommendations.length > 0
      ? `<h2>Recommendations</h2><ul class="rec-list">${recs}</ul>`
      : ''
  }

  <!-- Disclaimer -->
  <div class="disclaimer">
    <strong>Medical Disclaimer:</strong> This report is for informational purposes only and does not constitute
    medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider before making changes
    to your supplement regimen, especially if you have a medical condition or take prescription medications.
    StackDoc makes no warranties about the completeness or accuracy of this information.
  </div>
</div>
</body>
</html>`
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

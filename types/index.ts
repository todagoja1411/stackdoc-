export type EvidenceRating = 'Strong' | 'Moderate' | 'Weak' | 'None'
export type InteractionType = 'Warning' | 'Caution' | 'Synergy'
export type Goal =
  | 'Muscle & Performance'
  | 'Sleep & Recovery'
  | 'Weight Loss'
  | 'General Health & Immunity'

export interface SupplementDetail {
  name: string
  what_it_does: string
  how_it_works: string
  dosage_assessment: string
  evidence_rating: EvidenceRating
  secondary_effects: string[]
}

export interface Interaction {
  pair: [string, string]
  type: InteractionType
  description: string
}

export interface TimingGuide {
  morning: string[]
  afternoon: string[]
  evening: string[]
  bedtime: string[]
}

export interface GoalAlignment {
  score: number
  missing: string[]
  unnecessary: string[]
}

export interface AnalysisReport {
  overview: string
  score: number
  supplements: SupplementDetail[]
  interactions: Interaction[]
  redundancies: string[]
  timing_guide: TimingGuide
  goal_alignment: GoalAlignment
  recommendations: string[]
}

export interface Scan {
  id: string
  supplements_text: string | null
  goal: string
  report_json: AnalysisReport
  stripe_session_id: string | null
  paid: boolean
  created_at: string
}

export interface PendingScanData {
  supplements?: string
  imageBase64?: string
  goal: Goal
  mode?: 'analyze' | 'recommend'
}

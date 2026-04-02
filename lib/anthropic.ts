import Anthropic from '@anthropic-ai/sdk'
import { buildAnalysisPrompt, buildVisionExtractionPrompt } from './prompts'
import type { AnalysisReport } from '@/types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const MODEL = 'claude-sonnet-4-6'

/** If the user uploaded a photo, extract supplement names from it first */
export async function extractSupplementsFromImage(imageBase64: string): Promise<string> {
  const mediaType = imageBase64.startsWith('/9j') ? 'image/jpeg' : 'image/png'

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: buildVisionExtractionPrompt(),
          },
        ],
      },
    ],
  })

  const text = response.content[0]
  if (text.type !== 'text') throw new Error('Unexpected response type from vision extraction')
  return text.text
}

/** Run the main analysis and return a structured report */
export async function analyzeStack({
  supplements,
  goal,
}: {
  supplements: string
  goal: string
}): Promise<AnalysisReport> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: buildAnalysisPrompt({ supplements, goal }),
      },
    ],
  })

  const text = response.content[0]
  if (text.type !== 'text') throw new Error('Unexpected response type from analysis')

  // Extract JSON from the response (Claude may wrap it in markdown)
  const jsonMatch = text.text.match(/```json\n?([\s\S]*?)\n?```/) || text.text.match(/(\{[\s\S]*\})/)
  if (!jsonMatch) throw new Error('Could not extract JSON from Claude response')

  const rawJson = jsonMatch[1] || jsonMatch[0]

  try {
    return JSON.parse(rawJson) as AnalysisReport
  } catch {
    throw new Error('Failed to parse analysis report JSON')
  }
}

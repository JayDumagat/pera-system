export type IsaScore = 'Conservative' | 'Moderate' | 'Aggressive'

export interface InvestorProfile {
  isaScore: IsaScore
  ageBracket: string
  isVerified: boolean
}

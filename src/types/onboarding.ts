export enum IsaScore {
  Conservative = 'Conservative',
  Moderate = 'Moderate',
  Aggressive = 'Aggressive',
}

export type VerificationStatus = 'pending' | 'verified'

export interface InvestorProfile {
  isaScore: IsaScore | null
  ageBracket: string
  verificationStatus: VerificationStatus
}

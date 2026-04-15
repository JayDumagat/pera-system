import { useMemo, useState } from 'react'
import { IsaScore, type InvestorProfile } from '../types/onboarding'

type AccountType = 'Normal' | 'PERA'

export interface IsaQuestion {
  id: number
  prompt: string
  options: { label: string; score: number }[]
}

const isaQuestions: IsaQuestion[] = [
  {
    id: 1,
    prompt: 'A sudden 10% portfolio drop happens. What do you do?',
    options: [
      { label: 'Move to cash immediately', score: 1 },
      { label: 'Wait and review after a week', score: 3 },
      { label: 'Add more while prices are lower', score: 5 },
    ],
  },
  {
    id: 2,
    prompt: 'Your target investment horizon is:',
    options: [
      { label: 'Less than 1 year', score: 1 },
      { label: '1 to 5 years', score: 3 },
      { label: 'More than 5 years', score: 5 },
    ],
  },
  {
    id: 3,
    prompt: 'How familiar are you with market volatility?',
    options: [
      { label: 'Limited familiarity', score: 1 },
      { label: 'Moderate familiarity', score: 3 },
      { label: 'Very familiar', score: 5 },
    ],
  },
  {
    id: 4,
    prompt: 'For retirement growth, your preference is:',
    options: [
      { label: 'Capital preservation first', score: 1 },
      { label: 'Balanced growth and stability', score: 3 },
      { label: 'Higher growth with higher risk', score: 5 },
    ],
  },
  {
    id: 5,
    prompt: 'If returns are below expectations for 6 months, you:',
    options: [
      { label: 'Pause contributions', score: 1 },
      { label: 'Keep current contribution level', score: 3 },
      { label: 'Increase contribution systematically', score: 5 },
    ],
  },
]

const banks = ['BDO', 'BPI', 'UnionBank', 'GCash']

const formatTin = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 12)

  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`

  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}-${digits.slice(9)}`
}

const toIsaScore = (total: number): IsaScore => {
  if (total <= 10) return IsaScore.Conservative
  if (total <= 18) return IsaScore.Moderate
  return IsaScore.Aggressive
}

export const useOnboarding = () => {
  const [step, setStep] = useState(0)
  const [fullName, setFullName] = useState('')
  const [tin, setTin] = useState('')
  const [ageBracket, setAgeBracket] = useState('25-34')
  const [accountType, setAccountType] = useState<AccountType | null>(null)
  const [termsReviewed, setTermsReviewed] = useState(false)
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [isaAnswers, setIsaAnswers] = useState<(number | null)[]>(Array(isaQuestions.length).fill(null))

  const tinDigits = tin.replace(/\D/g, '')
  const isTinValid = tinDigits.length === 9 || tinDigits.length === 12
  const tinError =
    tinDigits.length > 0 && !isTinValid ? 'TIN must contain exactly 9 or 12 digits.' : ''

  const isaTotal = isaAnswers.reduce<number>((sum, answer) => sum + (answer ?? 0), 0)
  const isaAnsweredCount = isaAnswers.filter((answer) => answer !== null).length
  const visibleQuestionCount = Math.min(isaAnsweredCount + 1, isaQuestions.length)

  const investorProfile: InvestorProfile = useMemo(
    () => ({
      isaScore: isaAnsweredCount === isaQuestions.length ? toIsaScore(isaTotal) : null,
      ageBracket,
      verificationStatus: isTinValid ? 'verified' : 'pending',
    }),
    [ageBracket, isTinValid, isaAnsweredCount, isaTotal],
  )

  const canMoveNext =
    (step === 0 && fullName.trim().length >= 3 && isTinValid) ||
    (step === 1 && accountType !== null && termsReviewed) ||
    (step === 2 && isaAnsweredCount === isaQuestions.length)

  const setTinValue = (value: string) => {
    setTin(formatTin(value))
  }

  const answerIsaQuestion = (index: number, score: number) => {
    setIsaAnswers((prev) => {
      const next = [...prev]
      next[index] = score
      return next
    })
  }

  return {
    step,
    setStep,
    fullName,
    setFullName,
    tin,
    setTinValue,
    tinError,
    isTinValid,
    ageBracket,
    setAgeBracket,
    accountType,
    setAccountType,
    termsReviewed,
    setTermsReviewed,
    selectedBank,
    setSelectedBank,
    banks,
    isaQuestions,
    isaAnswers,
    answerIsaQuestion,
    visibleQuestionCount,
    investorProfile,
    canMoveNext,
    nextStep: () => setStep((current) => Math.min(current + 1, 3)),
    previousStep: () => setStep((current) => Math.max(current - 1, 0)),
  }
}

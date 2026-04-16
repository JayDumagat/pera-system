import { useMemo, useState } from 'react'
import type { InvestorProfile, IsaScore } from '../types/onboarding'

export type ProvisioningAccount = 'Normal Trading' | 'Managed PERA Portfolios'

export interface IsaQuestion {
  id: number
  prompt: string
  options: { label: string; score: number }[]
}

const isaQuestions: IsaQuestion[] = [
  {
    id: 1,
    prompt: 'Markets decline 10% over five trading sessions. What is your next move?',
    options: [
      { label: 'Reduce exposure immediately', score: 1 },
      { label: 'Maintain and reassess after one month', score: 3 },
      { label: 'Increase position in line with plan', score: 5 },
    ],
  },
  {
    id: 2,
    prompt: 'Your investment horizon for this capital is best described as:',
    options: [
      { label: 'Less than 2 years', score: 1 },
      { label: '2 to 5 years', score: 3 },
      { label: 'More than 5 years', score: 5 },
    ],
  },
  {
    id: 3,
    prompt: 'How do you view temporary losses while pursuing long-term growth?',
    options: [
      { label: 'Unacceptable in most cases', score: 1 },
      { label: 'Acceptable within moderate limits', score: 3 },
      { label: 'Expected and manageable', score: 5 },
    ],
  },
  {
    id: 4,
    prompt: 'For retirement-oriented allocation, your preference is:',
    options: [
      { label: 'Stability over growth', score: 1 },
      { label: 'Balanced growth and stability', score: 3 },
      { label: 'Growth with higher volatility', score: 5 },
    ],
  },
  {
    id: 5,
    prompt: 'If your plan underperforms for six months, you would:',
    options: [
      { label: 'Pause contributions', score: 1 },
      { label: 'Keep contributions unchanged', score: 3 },
      { label: 'Add strategically to target allocations', score: 5 },
    ],
  },
]

const banks = ['BDO', 'BPI', 'Metrobank', 'LandBank', 'UnionBank', 'GCash']
const TIN_MIN_LENGTH = 9
const TIN_MAX_LENGTH = 12

const formatTin = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, TIN_MAX_LENGTH)
  const groups = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9), digits.slice(9, 12)].filter(Boolean)
  return groups.join('-')
}

const toIsaScore = (total: number): IsaScore => {
  if (total <= 10) return 'Conservative'
  if (total <= 18) return 'Moderate'
  return 'Aggressive'
}

export const useOnboarding = () => {
  const [step, setStep] = useState(0)
  const [fullName, setFullName] = useState('')
  const [tin, setTin] = useState('')
  const [ageBracket, setAgeBracket] = useState('31-40')
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<ProvisioningAccount[]>([])
  const [isaAnswers, setIsaAnswers] = useState<(number | null)[]>(Array(isaQuestions.length).fill(null))

  const tinDigits = tin.replace(/\D/g, '')
  const isTinValid = tinDigits.length >= TIN_MIN_LENGTH && tinDigits.length <= TIN_MAX_LENGTH
  const tinError = tinDigits.length > 0 && !isTinValid ? 'TIN must contain 9 to 12 digits.' : ''

  const isaTotal = isaAnswers.reduce<number>((sum, answer) => sum + (answer ?? 0), 0)
  const isaAnsweredCount = isaAnswers.filter((answer) => answer !== null).length
  const visibleQuestionCount = Math.min(isaAnsweredCount + 1, isaQuestions.length)

  const investorProfile: InvestorProfile = useMemo(
    () => ({
      isaScore: toIsaScore(isaTotal),
      ageBracket,
      isVerified: isTinValid,
    }),
    [ageBracket, isTinValid, isaTotal],
  )

  const canMoveNext =
    (step === 0 && fullName.trim().length >= 3 && isTinValid && selectedBank !== null) ||
    (step === 1 && accounts.length > 0) ||
    (step === 2 && isaAnsweredCount === isaQuestions.length)

  const toggleAccount = (account: ProvisioningAccount) => {
    setAccounts((current) =>
      current.includes(account) ? current.filter((item) => item !== account) : [...current, account],
    )
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
    setTinValue: (value: string) => setTin(formatTin(value)),
    tinError,
    isTinValid,
    ageBracket,
    setAgeBracket,
    selectedBank,
    setSelectedBank,
    banks,
    accounts,
    toggleAccount,
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

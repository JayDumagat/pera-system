import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useOnboarding, type ProvisioningAccount } from './hooks/useOnboarding'

type Page = 'Dashboard' | 'Trading' | 'PERA/Portfolios' | 'Learning Hub' | 'Settings'

interface ToastState {
  id: number
  message: string
}

const pages: { label: Page; icon: string }[] = [
  { label: 'Dashboard', icon: '◫' },
  { label: 'Trading', icon: '⌁' },
  { label: 'PERA/Portfolios', icon: '◧' },
  { label: 'Learning Hub', icon: '◩' },
  { label: 'Settings', icon: '◌' },
]

const onboardingSteps = [
  'Identity & KYC',
  'Portfolio Provisioning',
  'Investor Suitability Assessment',
  'Success Terminal',
]

const panelAnimation = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
}

function App() {
  const [activePage, setActivePage] = useState<Page>('Dashboard')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [toasts, setToasts] = useState<ToastState[]>([])

  const notify = (message: string) => {
    const id = Date.now()
    setToasts((current) => [...current, { id, message }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 2200)
  }

  const netWorth = useMemo(() => '₱ 12,450,890.50', [])

  return (
    <div className="min-h-screen bg-[#022c22] text-emerald-50">
      <div className="grid min-h-screen grid-cols-[250px,1fr]">
        <aside className="border-r border-[#059669] bg-[#022c22] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Emerald Admin</p>
          <p className="mt-2 border border-[#059669] bg-[#064e3b] p-2 text-sm">Institutional Console</p>

          <nav className="mt-5 space-y-2" aria-label="Primary Navigation">
            {pages.map((item) => {
              const active = activePage === item.label
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActivePage(item.label)}
                  className={`flex min-h-11 w-full items-center gap-3 border px-3 text-left text-base ${
                    active
                      ? 'border-[#059669] bg-[#064e3b] text-emerald-100'
                      : 'border-[#059669] text-emerald-200'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span aria-hidden>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        <div className="flex flex-col">
          <header className="border-b border-[#059669] bg-[#064e3b] px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-semibold">{activePage}</h1>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ borderColor: ['#059669', '#10b981', '#059669'] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.2 }}
                  className="min-h-11 border bg-[#022c22] px-4 py-2 text-sm"
                >
                  Total Net Worth: <span className="font-semibold text-emerald-200">{netWorth}</span>
                </motion.div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu((value) => !value)}
                    className="min-h-11 border border-[#059669] bg-[#022c22] px-4 text-sm"
                  >
                    User Profile · Account Level: Premium
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 top-12 z-20 min-w-52 border border-[#059669] bg-[#022c22] p-2 text-sm">
                      <p className="border border-[#059669] p-2">Verify Credentials</p>
                      <p className="mt-2 border border-[#059669] p-2">Security Controls</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="grid flex-1 gap-4 bg-[#022c22] p-4 md:grid-cols-12">
            {activePage === 'Dashboard' && <DashboardWorkspace onFeedback={notify} />}
            {activePage === 'Trading' && <TradingWorkspace onFeedback={notify} />}
            {activePage === 'PERA/Portfolios' && <PeraWorkspace onFeedback={notify} />}
            {activePage === 'Learning Hub' && <LearningHubWorkspace />}
            {activePage === 'Settings' && <SettingsWorkspace />}
          </main>
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-4 right-4 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.p
              key={toast.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="border border-[#10b981] bg-[#022c22] px-4 py-2 text-sm text-emerald-100"
            >
              {toast.message}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function DashboardWorkspace({ onFeedback }: { onFeedback: (message: string) => void }) {
  return (
    <>
      <section className="col-span-12 grid gap-4 lg:col-span-8">
        <article className="border border-[#059669] bg-[#064e3b] p-4">
          <h2 className="text-xl font-semibold">Post-Login Onboarding Wizard</h2>
          <p className="mt-2 text-base text-emerald-100">
            Execute compliance setup in four guided phases with controlled disclosure.
          </p>
          <OnboardingWizard onFeedback={onFeedback} />
        </article>
      </section>

      <aside className="col-span-12 space-y-4 lg:col-span-4">
        <article className="border border-[#059669] bg-[#064e3b] p-4">
          <p className="text-sm uppercase tracking-wide text-emerald-200">Liquidity Window</p>
          <p className="mt-2 text-2xl font-semibold">₱ 1,284,000.00</p>
          <p className="mt-2 text-base text-emerald-100">Available for Execute Trade actions today.</p>
        </article>

        <article className="border border-[#059669] bg-[#064e3b] p-4">
          <p className="text-sm uppercase tracking-wide text-emerald-200">Learning Hub Snapshot</p>
          <p className="mt-2 text-base text-emerald-100">Navigate to Learning Hub to review mandatory modules and completion rings.</p>
        </article>
      </aside>
    </>
  )
}

function OnboardingWizard({ onFeedback }: { onFeedback: (message: string) => void }) {
  const {
    step,
    fullName,
    setFullName,
    tin,
    setTinValue,
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
    nextStep,
    previousStep,
  } = useOnboarding()

  const accountCards: ProvisioningAccount[] = ['Normal Trading', 'Managed PERA Portfolios']

  const handleNext = () => {
    if (!canMoveNext && step < 3) return
    if (step === 3) {
      onFeedback('Onboarding certificate issued. Credentials verified.')
      return
    }
    nextStep()
    onFeedback('Step authorized and recorded.')
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="grid gap-2 md:grid-cols-4">
        {onboardingSteps.map((label, index) => (
          <p
            key={label}
            className={`border p-2 text-sm ${
              index <= step ? 'border-[#10b981] bg-[#022c22]' : 'border-[#059669] bg-[#064e3b]'
            }`}
          >
            {index + 1}. {label}
          </p>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.section key="wizard-kyc" {...panelAnimation} className="space-y-3">
            <h3 className="text-lg font-semibold">Identity & KYC</h3>
            <div>
              <label htmlFor="legal-name" className="text-sm text-emerald-100">
                Legal Name
              </label>
              <input
                id="legal-name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="mt-1 min-h-11 w-full border border-[#059669] bg-[#022c22] px-3 text-base"
                placeholder="Juan Dela Cruz"
              />
            </div>
            <div>
              <label htmlFor="tin" className="text-sm text-emerald-100">
                TIN (9-12 digits)
              </label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  id="tin"
                  value={tin}
                  onChange={(event) => setTinValue(event.target.value)}
                  className="min-h-11 w-full border border-[#059669] bg-[#022c22] px-3 text-base"
                  placeholder="000-000-000"
                />
                <span
                  className={`min-h-11 border px-3 py-2 text-sm ${
                    isTinValid ? 'border-[#10b981] text-emerald-100' : 'border-[#059669] text-emerald-300'
                  }`}
                >
                  {isTinValid ? 'Verified' : 'Pending'}
                </span>
              </div>
              <p className="mt-1 text-sm text-emerald-100">{tinError || 'Masked format applied as you type.'}</p>
            </div>

            <div>
              <label htmlFor="age-bracket" className="text-sm text-emerald-100">
                Age Bracket
              </label>
              <select
                id="age-bracket"
                value={ageBracket}
                onChange={(event) => setAgeBracket(event.target.value)}
                className="mt-1 min-h-11 w-full border border-[#059669] bg-[#022c22] px-3 text-base"
              >
                {['21-30', '31-40', '41-50', '51-60'].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 text-sm text-emerald-100">Open Finance Partners</p>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {banks.map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => {
                      setSelectedBank(bank)
                      onFeedback(`${bank} authorization selected.`)
                    }}
                    className={`min-h-11 border px-3 text-sm font-medium transition ${
                      selectedBank === bank
                        ? 'border-[#10b981] bg-[#022c22] text-emerald-100 grayscale-0'
                        : 'border-[#059669] text-slate-300 grayscale hover:text-emerald-100 hover:grayscale-0'
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {step === 1 && (
          <motion.section key="wizard-provisioning" {...panelAnimation} className="space-y-3">
            <h3 className="text-lg font-semibold">Portfolio Provisioning</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {accountCards.map((account) => {
                const active = accounts.includes(account)
                return (
                  <button
                    key={account}
                    type="button"
                    onClick={() => {
                      toggleAccount(account)
                      onFeedback(`${active ? 'Deactivated' : 'Activated'}: ${account}.`)
                    }}
                    className={`min-h-11 border p-3 text-left text-base ${
                      active ? 'border-[#10b981] bg-[#022c22]' : 'border-[#059669] bg-[#064e3b]'
                    }`}
                  >
                    <p className="font-semibold">{account}</p>
                    <p className="mt-1 text-sm text-emerald-100">
                      {account === 'Managed PERA Portfolios'
                        ? 'Authorize PERA Contribution workflow and managed retirement allocations.'
                        : 'Enable direct execution for listed securities and funds.'}
                    </p>
                  </button>
                )
              })}
            </div>

            <div className="border border-[#10b981] bg-[#022c22] p-3">
              <p className="font-semibold text-emerald-100">55/5 Rule Warning</p>
              <p className="mt-1 text-base text-emerald-100">
                PERA withdrawals before age 55 or before minimum 5-year holding may reduce tax advantages.
              </p>
            </div>
          </motion.section>
        )}

        {step === 2 && (
          <motion.section key="wizard-isa" {...panelAnimation} className="space-y-3">
            <h3 className="text-lg font-semibold">Investor Suitability Assessment</h3>
            <p className="text-base text-emerald-100">Five scenario-based prompts determine your risk profile.</p>
            {isaQuestions.slice(0, visibleQuestionCount).map((question, index) => (
              <article key={question.id} className="border border-[#059669] bg-[#022c22] p-3">
                <p className="text-base font-medium">{question.prompt}</p>
                <div className="mt-2 space-y-2">
                  {question.options.map((option) => {
                    const active = isaAnswers[index] === option.score
                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => {
                          answerIsaQuestion(index, option.score)
                          onFeedback('ISA response recorded.')
                        }}
                        className={`min-h-11 w-full border px-3 text-left text-sm ${
                          active ? 'border-[#10b981] bg-[#059669] text-white' : 'border-[#059669] text-emerald-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </article>
            ))}
          </motion.section>
        )}

        {step === 3 && (
          <motion.section key="wizard-success" {...panelAnimation} className="space-y-3">
            <h3 className="text-lg font-semibold">Success Terminal</h3>
            <article className="border border-[#10b981] bg-[#022c22] p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Corporate Certificate</p>
              <p className="mt-2 text-2xl font-semibold">Onboarding Authorized</p>
              <p className="mt-2 text-base text-emerald-100">Risk Profile: {investorProfile.isaScore}</p>
              <p className="mt-1 text-base text-emerald-100">Age Bracket: {investorProfile.ageBracket}</p>
              <p className="mt-1 text-base text-emerald-100">
                Credential Status: {investorProfile.isVerified ? 'Verified' : 'Pending Verification'}
              </p>
              <p className="mt-3 text-sm text-emerald-200">Reference: EMRLD-CERT-2026-0416</p>
            </article>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap justify-end gap-2 border-t border-[#059669] pt-3">
        <button
          type="button"
          onClick={previousStep}
          disabled={step === 0}
          className="min-h-11 border border-[#059669] px-4 text-base disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={step < 3 && !canMoveNext}
          className="min-h-11 border border-[#10b981] bg-[#059669] px-4 text-base font-semibold text-white disabled:opacity-50"
        >
          {step === 3 ? 'Verify Credentials' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

function TradingWorkspace({ onFeedback }: { onFeedback: (message: string) => void }) {
  return (
    <section className="col-span-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[
        { title: 'Equity Book', value: '₱ 4,280,000', action: 'Execute Trade' },
        { title: 'Fixed Income', value: '₱ 3,120,500', action: 'Execute Trade' },
        { title: 'Cash Buffer', value: '₱ 950,300', action: 'Authorize PERA Contribution' },
      ].map((card) => (
        <article key={card.title} className="border border-[#059669] bg-[#064e3b] p-4">
          <p className="text-sm uppercase tracking-wide text-emerald-300">{card.title}</p>
          <p className="mt-2 text-2xl font-semibold">{card.value}</p>
          <button
            type="button"
            onClick={() => onFeedback(`${card.action} request queued.`)}
            className="mt-3 min-h-11 border border-[#10b981] bg-[#059669] px-4 text-sm font-semibold"
          >
            {card.action}
          </button>
        </article>
      ))}
    </section>
  )
}

function PeraWorkspace({ onFeedback }: { onFeedback: (message: string) => void }) {
  return (
    <section className="col-span-12 grid gap-4 md:grid-cols-2">
      <article className="border border-[#059669] bg-[#064e3b] p-4">
        <h2 className="text-xl font-semibold">Managed PERA Portfolios</h2>
        <p className="mt-2 text-base text-emerald-100">
          Tax-advantaged allocations with retirement-preservation guardrails.
        </p>
        <button
          type="button"
          onClick={() => onFeedback('Authorize PERA Contribution approved.')}
          className="mt-3 min-h-11 border border-[#10b981] bg-[#059669] px-4 text-sm font-semibold text-white"
        >
          Authorize PERA Contribution
        </button>
      </article>
      <article className="border border-[#059669] bg-[#064e3b] p-4">
        <p className="text-sm uppercase tracking-wide text-emerald-300">Policy Notice</p>
        <p className="mt-2 text-base text-emerald-100">
          Withdrawal events are evaluated against the 55/5 requirement before settlement processing.
        </p>
      </article>
    </section>
  )
}

function LearningHubWorkspace() {
  const modules = [
    { title: 'PERA Compliance Basics', progress: 78 },
    { title: 'Risk & Diversification', progress: 52 },
    { title: 'Tax-Efficient Contributions', progress: 31 },
    { title: 'Order Execution Controls', progress: 94 },
  ]

  return (
    <section className="col-span-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {modules.map((module) => (
        <article key={module.title} className="border border-[#059669] bg-[#064e3b] p-4">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold">{module.title}</p>
            <div
              className="grid h-12 w-12 place-items-center border border-[#10b981] text-xs font-semibold"
              style={{ background: `conic-gradient(#10b981 ${module.progress}%, #022c22 ${module.progress}% 100%)` }}
              aria-label={`${module.progress}% complete`}
            >
              <span className="border border-[#059669] bg-[#064e3b] px-1">{module.progress}%</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-emerald-100">Video module with progress-tracking ring status.</p>
        </article>
      ))}
    </section>
  )
}

function SettingsWorkspace() {
  return (
    <section className="col-span-12 grid gap-4 md:grid-cols-2">
      <article className="border border-[#059669] bg-[#064e3b] p-4">
        <h2 className="text-lg font-semibold">Credential Controls</h2>
        <p className="mt-2 text-base text-emerald-100">
          Security preferences, verification state, and institutional audit flags.
        </p>
      </article>
      <article className="border border-[#059669] bg-[#064e3b] p-4">
        <h2 className="text-lg font-semibold">Notification Rules</h2>
        <p className="mt-2 text-base text-emerald-100">
          Delivery profile for trade confirmations and compliance events.
        </p>
      </article>
    </section>
  )
}

export default App

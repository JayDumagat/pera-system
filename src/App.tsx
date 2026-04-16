import { AnimatePresence, motion } from 'framer-motion'
import { useState, type FormEvent, type ReactNode } from 'react'
import { useOnboarding } from './hooks/useOnboarding'

const panelAnimation = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
}
const ONBOARDING_STEPS = ['Identity & KYC', 'Account Provisioning', 'Investor Suitability']
const FINAL_ONBOARDING_STEP_INDEX = ONBOARDING_STEPS.length - 1
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const MIN_PASSWORD_LENGTH = 8
const MIN_FULL_NAME_LENGTH = 3

type AuthMode = 'login' | 'register'
type AppStage = 'authentication' | 'onboarding' | 'dashboard' | 'pera'

interface AuthState {
  mode: AuthMode
  fullName: string
  email: string
}

interface AuthPageProps {
  onAuthenticate: (auth: AuthState) => void
}

function AuthPage({ onAuthenticate }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const isEmailValid = EMAIL_PATTERN.test(email.trim())

  const canSubmit =
    isEmailValid &&
    password.trim().length >= MIN_PASSWORD_LENGTH &&
    (mode === 'login' || fullName.trim().length >= MIN_FULL_NAME_LENGTH)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return

    onAuthenticate({
      mode,
      fullName: mode === 'register' ? fullName.trim() : '',
      email: email.trim(),
    })
  }

  return (
    <main className="min-h-screen bg-slate-950 px-3 py-4 text-white md:flex md:items-center md:justify-center md:p-10">
      <div className="w-full overflow-hidden border border-emerald-900 bg-emerald-950/80 md:max-w-5xl md:grid md:grid-cols-[1.1fr,1fr]">
        <section className="hidden border-r border-emerald-900 bg-gradient-to-b from-emerald-900/40 via-emerald-950 to-slate-950 p-6 md:block">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">PERA System</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight">
            Build your retirement fund with confidence.
          </h1>
          <p className="mt-3 text-base text-slate-200">
            Sign in to manage your account, or create one to start secure onboarding.
          </p>
          <div className="mt-6 space-y-3">
            {[
              'Regulated PERA-ready onboarding',
              'Investor suitability profiling',
              'Secure account dashboard access',
            ].map((item) => (
              <p key={item} className="border border-emerald-800/70 bg-slate-950/60 p-3 text-sm text-slate-100">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section>
          <header className="border-b border-emerald-900 p-4 md:p-6">
            <p className="text-base font-semibold text-emerald-300">Authentication</p>
            <h2 className="mt-1 text-xl font-semibold leading-tight">Access your PERA account</h2>
            <p className="mt-2 text-sm text-slate-200">
              {mode === 'login'
                ? 'Sign in to continue to your dashboard.'
                : 'Create a new account to begin onboarding.'}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 border border-slate-700 bg-slate-900 p-1">
              {(['login', 'register'] as const).map((currentMode) => (
                <button
                  key={currentMode}
                  type="button"
                  onClick={() => setMode(currentMode)}
                  className={`min-h-11 border px-3 text-sm font-semibold ${
                    mode === currentMode
                      ? 'border-emerald-500 bg-emerald-900/40 text-emerald-100'
                      : 'border-transparent text-slate-300'
                  }`}
                >
                  {currentMode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-6">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-slate-200" htmlFor="auth-full-name">
                  Full Name
                </label>
                <input
                  id="auth-full-name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="mt-1 min-h-11 w-full border border-slate-700 bg-slate-900 px-3 text-base text-white outline-none focus:border-emerald-500"
                  placeholder="Juan Dela Cruz"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-200" htmlFor="auth-email">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 min-h-11 w-full border border-slate-700 bg-slate-900 px-3 text-base text-white outline-none focus:border-emerald-500"
                placeholder="name@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200" htmlFor="auth-password">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 min-h-11 w-full border border-slate-700 bg-slate-900 px-3 text-base text-white outline-none focus:border-emerald-500"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-slate-400">Minimum 8 characters required.</p>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="min-h-11 w-full border border-emerald-500 bg-emerald-700 px-4 text-base font-semibold text-white disabled:border-slate-700 disabled:bg-slate-900 disabled:text-slate-500"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account & Continue'}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}

interface OnboardingPageProps {
  auth: AuthState
  onComplete: () => void
  onBackToAuth: () => void
}

function OnboardingPage({ auth, onComplete, onBackToAuth }: OnboardingPageProps) {
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
    canMoveNext,
    nextStep,
    previousStep,
  } = useOnboarding()

  const handleNext = () => {
    if (!canMoveNext) return

    if (step === FINAL_ONBOARDING_STEP_INDEX) {
      onComplete()
      return
    }

    nextStep()
  }

  return (
    <AppWorkspaceLayout
      auth={auth}
      sectionLabel="Onboarding"
      title="Secure Account Activation"
      description="Complete your onboarding with confidence through regulated Philippine open-finance rails."
      activeNav="onboarding"
      onLogout={onBackToAuth}
      footer={
        <div className="flex flex-col gap-2 md:flex-row md:justify-end">
          {step > 0 && (
            <button
              type="button"
              onClick={previousStep}
              className="min-h-11 border border-slate-700 bg-slate-900 px-4 text-base text-slate-100 md:min-w-40"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canMoveNext}
            className="min-h-11 border border-emerald-500 bg-emerald-700 px-4 text-base font-semibold text-white disabled:border-slate-700 disabled:bg-slate-900 disabled:text-slate-500 md:min-w-56"
          >
            {step === 0
              ? 'Submit for Verification'
              : step === 1
                ? 'Confirm Contribution'
                : 'Complete Onboarding'}
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {ONBOARDING_STEPS.map((label, index) => (
          <div
            key={label}
            className={`border p-2 text-left text-sm ${
              index <= step
                ? 'border-emerald-500 bg-emerald-900/35 text-emerald-100'
                : 'border-slate-700 bg-slate-900 text-slate-300'
            }`}
          >
            <p className="text-xs uppercase tracking-wide">Step {index + 1}</p>
            <p className="mt-1 text-sm">{label}</p>
          </div>
        ))}
      </div>

      <section className="mt-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step-1" {...panelAnimation} className="space-y-4">
              <h2 className="text-lg font-semibold">Identity & KYC</h2>
              <p className="text-base text-slate-200">
                We verify identity first so your first investment action is fast and compliant.
              </p>

              <label className="block text-sm font-medium text-slate-200" htmlFor="full-name">
                Full Legal Name
              </label>
              <input
                id="full-name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="min-h-11 w-full border border-slate-700 bg-slate-900 px-3 text-base text-white outline-none focus:border-emerald-500"
                placeholder="Juan Dela Cruz"
              />

              <label className="block text-sm font-medium text-slate-200" htmlFor="tin">
                Tax Identification Number (TIN)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="tin"
                  value={tin}
                  onChange={(event) => setTinValue(event.target.value)}
                  className="min-h-11 w-full border border-slate-700 bg-slate-900 px-3 text-base text-white outline-none focus:border-emerald-500"
                  placeholder="000-000-000"
                />
                <AnimatePresence>
                  {isTinValid && (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      role="status"
                      aria-label="TIN verified"
                      className="min-h-11 border border-emerald-500 bg-emerald-900/40 px-3 text-sm font-semibold text-emerald-300"
                    >
                      Verified
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              {tinError ? (
                <p className="text-sm text-rose-300">{tinError}</p>
              ) : (
                <p className="text-sm text-slate-300">Inline validation confirms format in real time.</p>
              )}

              <label className="block text-sm font-medium text-slate-200" htmlFor="age-bracket">
                Age Bracket
              </label>
              <select
                id="age-bracket"
                value={ageBracket}
                onChange={(event) => setAgeBracket(event.target.value)}
                className="min-h-11 w-full border border-slate-700 bg-slate-900 px-3 text-base text-white outline-none focus:border-emerald-500"
              >
                {['18-24', '25-34', '35-44', '45-54', '55+'].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <p className="border border-slate-700 bg-slate-900 p-3 text-sm text-slate-300">
                eTCC (Electronic Tax Credit Certificates) are securely managed in-platform after
                verification.
              </p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step-2" {...panelAnimation} className="space-y-4">
              <h2 className="text-lg font-semibold">Account Provisioning</h2>
              <p className="text-base text-slate-200">
                Choose the account model that matches your contribution strategy.
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                {(['Normal', 'PERA'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAccountType(type)}
                    className={`min-h-11 border p-4 text-left text-base ${
                      accountType === type
                        ? 'border-emerald-500 bg-emerald-900/40'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    <p className="font-semibold">{type} Account</p>
                    <p className="mt-1 text-sm text-slate-300">
                      {type === 'PERA'
                        ? 'For long-term retirement contributions with tax benefits.'
                        : 'For regular investing and liquidity access.'}
                    </p>
                  </button>
                ))}
              </div>

              <div className="border border-emerald-500 bg-emerald-900/30 p-3">
                <p className="text-sm font-semibold text-emerald-200">55/5 Rule</p>
                <p className="mt-1 text-sm text-slate-100">
                  PERA benefits are designed for disciplined retirement saving. Early withdrawals may
                  trigger tax impacts and reduced incentives.
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-200">Open Finance Partner Banks</p>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {banks.map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`min-h-11 border p-2 text-sm font-semibold transition ${
                        selectedBank === bank
                          ? 'border-emerald-500 text-emerald-200 grayscale-0'
                          : 'border-slate-700 text-slate-300 grayscale hover:border-emerald-500 hover:text-emerald-200 hover:grayscale-0'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className={`min-h-11 border px-4 text-base ${
                  termsReviewed
                    ? 'border-emerald-500 bg-emerald-900/30 text-emerald-200'
                    : 'border-slate-700 bg-slate-900 text-slate-100'
                }`}
                onClick={() => setTermsReviewed(!termsReviewed)}
                aria-pressed={termsReviewed}
              >
                Review Terms
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step-3" {...panelAnimation} className="space-y-4">
              <h2 className="text-lg font-semibold">Investor Suitability Assessment</h2>
              <p className="text-base text-slate-200">
                Please answer each scenario. We reveal one question at a time to keep the process
                focused.
              </p>

              <div className="space-y-4">
                {isaQuestions.slice(0, visibleQuestionCount).map((question, index) => (
                  <div key={question.id} className="border border-slate-700 bg-slate-900 p-3">
                    <p className="text-base font-medium text-white">
                      {question.id}. {question.prompt}
                    </p>
                    <div className="mt-3 space-y-2">
                      {question.options.map((option) => (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => answerIsaQuestion(index, option.score)}
                          className={`min-h-11 w-full border px-3 text-left text-sm ${
                            isaAnswers[index] === option.score
                              ? 'border-emerald-500 bg-emerald-900/30 text-emerald-100'
                              : 'border-slate-700 text-slate-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </AppWorkspaceLayout>
  )
}

interface DashboardPageProps {
  auth: AuthState
  onOpenPera: () => void
  onStartOnboarding: () => void
  onLogout: () => void
}

interface AppWorkspaceLayoutProps {
  auth: AuthState
  sectionLabel: string
  title: string
  description: ReactNode
  activeNav: 'dashboard' | 'pera' | 'onboarding'
  onOpenDashboard?: () => void
  onOpenPera?: () => void
  onOpenOnboarding?: () => void
  onLogout: () => void
  children: ReactNode
  footer?: ReactNode
}

function AppWorkspaceLayout({
  auth,
  sectionLabel,
  title,
  description,
  activeNav,
  onOpenDashboard,
  onOpenPera,
  onOpenOnboarding,
  onLogout,
  children,
  footer,
}: AppWorkspaceLayoutProps) {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', onClick: onOpenDashboard },
    { id: 'onboarding' as const, label: 'Onboarding', onClick: onOpenOnboarding },
    { id: 'pera' as const, label: 'PERA', onClick: onOpenPera },
  ]

  return (
    <main className="min-h-screen bg-slate-950 p-3 text-white md:p-6">
      <div className="mx-auto w-full border border-slate-800 bg-slate-950 md:max-w-7xl">
        <div className="md:grid md:grid-cols-[240px,1fr]">
          <aside className="border-b border-slate-800 p-4 md:border-b-0 md:border-r">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Internal</p>
            <p className="mt-2 text-lg font-semibold text-white">PERA System</p>
            <p className="mt-2 border border-emerald-700 bg-emerald-900/30 px-2 py-1 text-xs font-medium uppercase tracking-wide text-emerald-200">
              Authenticated Session
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Navigation</p>
            <div className="mt-4 space-y-2">
              {navItems.map((item) => {
                const isActive = activeNav === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={!isActive ? item.onClick : undefined}
                    disabled={isActive || !item.onClick}
                    aria-current={isActive ? 'page' : undefined}
                    className={`min-h-11 w-full border px-3 text-left text-sm font-medium ${
                      isActive
                        ? 'border-emerald-500 bg-emerald-900/40 text-emerald-100'
                        : 'border-slate-700 bg-slate-900 text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
            <div className="mt-4 border border-slate-800 bg-slate-900 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">Signed in as</p>
              <p className="mt-1 break-all text-sm font-medium text-slate-100">{auth.email || 'Authenticated user'}</p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="mt-4 min-h-11 w-full border border-slate-700 bg-slate-900 px-3 text-left text-sm font-medium text-slate-100"
            >
              Logout
            </button>
          </aside>

          <div className="flex flex-1 flex-col">
            <header className="border-b border-slate-800 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {sectionLabel}
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold leading-tight">{title}</h1>
                </div>
                <p className="border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium uppercase tracking-wide text-slate-300">
                  Access: Internal Only
                </p>
              </div>
              <div className="mt-3 text-base text-slate-300">{description}</div>
            </header>

            <section className="flex-1 p-4 md:p-6">{children}</section>

            {footer ? <footer className="border-t border-slate-800 p-4">{footer}</footer> : null}
          </div>
        </div>
      </div>
    </main>
  )
}

function DashboardPage({ auth, onOpenPera, onStartOnboarding, onLogout }: DashboardPageProps) {
  return (
    <AppWorkspaceLayout
      auth={auth}
      sectionLabel="Dashboard"
      title="Welcome to PERA System"
      description={
        <p>
          Signed in as <span className="font-semibold text-emerald-200">{auth.email}</span>
        </p>
      }
      activeNav="dashboard"
      onOpenPera={onOpenPera}
      onOpenOnboarding={onStartOnboarding}
      onLogout={onLogout}
      footer={
        <div className="grid gap-2 md:max-w-sm">
          <button
            type="button"
            onClick={onStartOnboarding}
            className="min-h-11 border border-slate-700 bg-slate-900 px-4 text-base text-slate-100"
          >
            Re-open Onboarding
          </button>
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-2">
        <article className="border border-slate-700 bg-slate-900 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-400">Account</p>
          <p className="mt-2 text-base font-semibold text-white capitalize">{auth.mode} profile</p>
          <p className="mt-1 text-sm text-slate-300">
            {auth.fullName ? auth.fullName : 'Authenticated investor account'}
          </p>
        </article>
        <article className="border border-slate-700 bg-slate-900 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-400">Quick Actions</p>
          <p className="mt-2 text-base font-semibold text-white">Manage your retirement flow</p>
          <p className="mt-1 text-sm text-slate-300">Open PERA details or revisit onboarding data.</p>
        </article>
      </section>
    </AppWorkspaceLayout>
  )
}

interface PeraPageProps {
  onBack: () => void
  onStartOnboarding: () => void
  auth: AuthState
  onLogout: () => void
}

function PeraPage({ onBack, onStartOnboarding, auth, onLogout }: PeraPageProps) {
  return (
    <AppWorkspaceLayout
      auth={auth}
      sectionLabel="PERA Page"
      title="Personal Equity and Retirement Account"
      description="Review retirement account details, contribution guidance, and tax-advantaged context."
      activeNav="pera"
      onOpenDashboard={onBack}
      onOpenOnboarding={onStartOnboarding}
      onLogout={onLogout}
    >
      <section className="space-y-4">
        <article className="border border-slate-700 bg-slate-900 p-4">
          <h2 className="text-base font-semibold text-white">Contribution Notes</h2>
          <p className="mt-2 text-sm text-slate-300">
            PERA is designed for long-term retirement goals, with incentives tied to regulated
            contribution behavior.
          </p>
        </article>
        <article className="border border-slate-700 bg-slate-900 p-4">
          <h2 className="text-base font-semibold text-white">Tax Benefit Reminder</h2>
          <p className="mt-2 text-sm text-slate-300">
            Eligible contributions may qualify for tax benefits under current PERA policy rules.
          </p>
        </article>
      </section>
    </AppWorkspaceLayout>
  )
}

function App() {
  const initialAuthState: AuthState = {
    mode: 'login',
    fullName: '',
    email: '',
  }
  const [stage, setStage] = useState<AppStage>('authentication')
  const [auth, setAuth] = useState<AuthState>(initialAuthState)
  const [onboardingResetCounter, setOnboardingResetCounter] = useState(0)

  if (stage === 'authentication') {
    return (
      <AuthPage
        onAuthenticate={(nextAuth) => {
          setAuth(nextAuth)
          setOnboardingResetCounter((current) => current + 1)
          setStage(nextAuth.mode === 'login' ? 'dashboard' : 'onboarding')
        }}
      />
    )
  }

  if (stage === 'onboarding') {
    return (
      <OnboardingPage
        key={onboardingResetCounter}
        auth={auth}
        onComplete={() => setStage('dashboard')}
        onBackToAuth={() => setStage('authentication')}
      />
    )
  }

  if (stage === 'pera') {
    return (
      <PeraPage
        auth={auth}
        onBack={() => setStage('dashboard')}
        onStartOnboarding={() => {
          setOnboardingResetCounter((current) => current + 1)
          setStage('onboarding')
        }}
        onLogout={() => {
          setAuth(initialAuthState)
          setStage('authentication')
        }}
      />
    )
  }

  return (
    <DashboardPage
      auth={auth}
      onOpenPera={() => setStage('pera')}
      onStartOnboarding={() => {
        setOnboardingResetCounter((current) => current + 1)
        setStage('onboarding')
      }}
      onLogout={() => {
        setAuth(initialAuthState)
        setStage('authentication')
      }}
    />
  )
}

export default App

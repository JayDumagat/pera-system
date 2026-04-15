import { AnimatePresence, motion } from 'framer-motion'
import { useOnboarding } from './hooks/useOnboarding'

const panelAnimation = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
}

function App() {
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
    investorProfile,
    canMoveNext,
    nextStep,
    previousStep,
  } = useOnboarding()

  const stepLabels = ['Identity & KYC', 'Account Provisioning', 'Investor Suitability', 'Success']

  return (
    <main className="min-h-screen bg-slate-950 px-3 py-4 text-white md:flex md:items-center md:justify-center md:p-10">
      <div className="w-full border border-emerald-900 bg-emerald-950/80 md:max-w-3xl">
        <header className="border-b border-emerald-900 p-4">
          <p className="text-base font-semibold text-emerald-300">Guided Setup</p>
          <h1 className="mt-1 text-xl font-semibold leading-tight">Secure Account Activation</h1>
          <p className="mt-2 text-base text-slate-200">
            Complete your onboarding with confidence. Your information is reviewed through regulated
            Philippine open-finance rails.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
            {stepLabels.map((label, index) => (
              <div
                key={label}
                className={`border p-2 text-left text-sm ${
                  index <= step
                    ? 'border-emerald-500 bg-emerald-900/40 text-emerald-100'
                    : 'border-slate-700 text-slate-300'
                }`}
              >
                <p className="text-xs uppercase tracking-wide">Step {index + 1}</p>
                <p className="mt-1 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </header>

        <section className="p-4 pb-28 md:p-6 md:pb-6">
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

                <p className="border border-slate-700 p-3 text-sm text-slate-300">
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
                  onClick={() => setTermsReviewed(true)}
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

            {step === 3 && (
              <motion.div key="step-4" {...panelAnimation} className="space-y-4">
                <h2 className="text-lg font-semibold">Success Terminal</h2>
                <p className="text-base text-emerald-200">
                  Setup complete. Your account is now ready for verified contributions.
                </p>

                <div className="border border-emerald-700 bg-slate-900 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-300">Digital Receipt</p>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between gap-3 border-b border-slate-800 pb-2">
                      <dt className="text-slate-400">Verification Status</dt>
                      <dd className="font-semibold text-emerald-200">{investorProfile.verificationStatus}</dd>
                    </div>
                    <div className="flex justify-between gap-3 border-b border-slate-800 pb-2">
                      <dt className="text-slate-400">Age Bracket</dt>
                      <dd className="font-semibold text-white">{investorProfile.ageBracket}</dd>
                    </div>
                    <div className="flex justify-between gap-3 pb-1">
                      <dt className="text-slate-400">ISA Risk Profile</dt>
                      <dd className="font-semibold text-white">{investorProfile.isaScore}</dd>
                    </div>
                  </dl>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <footer className="fixed inset-x-3 bottom-3 border border-emerald-900 bg-emerald-950 p-3 md:static md:inset-auto md:border-x-0 md:border-b-0 md:border-t">
          <div className="flex gap-2 md:justify-end">
            {step > 0 && step < 3 && (
              <button
                type="button"
                onClick={previousStep}
                className="min-h-11 flex-1 border border-slate-700 px-4 text-base text-slate-100 md:max-w-44 md:flex-none"
              >
                Back
              </button>
            )}

            {step < 3 && (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canMoveNext}
                className="min-h-11 flex-1 border border-emerald-500 bg-emerald-700 px-4 text-base font-semibold text-white disabled:border-slate-700 disabled:bg-slate-900 disabled:text-slate-500 md:max-w-56 md:flex-none"
              >
                {step === 0
                  ? 'Submit for Verification'
                  : step === 1
                    ? 'Confirm Contribution'
                    : 'Finalize Assessment'}
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                className="min-h-11 flex-1 border border-emerald-500 bg-emerald-700 px-4 text-base font-semibold text-white md:max-w-56 md:flex-none"
              >
                Start Investing
              </button>
            )}
          </div>
        </footer>
      </div>
    </main>
  )
}

export default App

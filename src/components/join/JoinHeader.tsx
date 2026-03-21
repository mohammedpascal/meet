import ThemeToggle from '../ThemeToggle'

export default function JoinHeader() {
  return (
    <header className="flex flex-col gap-3 border-b border-slate-200/80 pb-4 dark:border-slate-700/80 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span
          className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500"
          aria-hidden
        />
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100 sm:text-lg">
            Join Secure Session
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Prepare your camera and microphone
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  )
}

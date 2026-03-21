export default function JoinHeader() {
  return (
    <header className="flex flex-col gap-3 border-b border-slate-700/80 pb-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-start gap-3">
        <span
          className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-500"
          aria-hidden
        />
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-slate-100 sm:text-lg">
            Join Secure Session
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Prepare your camera and microphone
          </p>
        </div>
      </div>
    </header>
  )
}

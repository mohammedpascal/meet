type Props = {
  /** `card` = frosted inner panel (legacy); `strip` = title row only for use inside a parent glass strip */
  variant?: 'card' | 'strip'
}

export default function JoinHeader({ variant = 'card' }: Props) {
  const inner = (
    <div className="flex min-w-0 items-start gap-3">
      <span
        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.45)]"
        aria-hidden
      />
      <div className="min-w-0">
        <h2 className="text-base font-semibold tracking-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] sm:text-lg">
          Join Secure Session
        </h2>
        <p className="mt-0.5 text-xs text-slate-200/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]">
          Prepare your camera and microphone
        </p>
      </div>
    </div>
  )

  if (variant === 'strip') {
    return <header className="w-full">{inner}</header>
  }

  return (
    <header className="px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5 sm:pb-4 sm:pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="rounded-2xl border border-white/10 bg-black/35 px-3 py-3 shadow-lg shadow-black/20 backdrop-blur-md sm:px-4 sm:py-3.5">
        {inner}
      </div>
    </header>
  )
}

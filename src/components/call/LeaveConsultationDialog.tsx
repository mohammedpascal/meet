import { PhoneOff, X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'

type Props = {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function LeaveConsultationDialog({
  open,
  onCancel,
  onConfirm,
}: Props) {
  const titleId = useId()
  const descId = useId()
  const stayRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  useEffect(() => {
    if (open) stayRef.current?.focus()
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-[3px] transition-opacity dark:bg-slate-950/65"
        aria-label="Dismiss"
        onClick={onCancel}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_64px_-12px_rgba(15,23,42,0.35)] ring-1 ring-black/[0.04] dark:border-slate-700 dark:bg-slate-900 dark:ring-white/[0.06]"
      >
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Close"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="px-6 pb-6 pt-8 sm:px-8 sm:pb-8 sm:pt-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 ring-1 ring-rose-200/80 dark:bg-rose-950/60 dark:text-rose-200 dark:ring-rose-800/50">
            <PhoneOff className="h-7 w-7" aria-hidden />
          </div>

          <h2
            id={titleId}
            className="text-center text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100"
          >
            End this consultation?
          </h2>
          <p
            id={descId}
            className="mt-2 text-center text-sm leading-relaxed text-slate-600 dark:text-slate-400"
          >
            You will leave the call. You can rejoin anytime with the same room
            link if you need to come back.
          </p>

          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center sm:gap-3">
            <button
              ref={stayRef}
              type="button"
              onClick={onCancel}
              className="w-full rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/45 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700/80 sm:w-auto sm:min-w-[8.5rem]"
            >
              Stay in call
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="w-full rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-rose-900/20 transition hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 sm:w-auto sm:min-w-[8.5rem]"
            >
              End & leave
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

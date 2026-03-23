import { PhoneOff } from 'lucide-react'

type Props = {
  onLeave: () => void
  className?: string
  /** Frosted treatment for use over video (e.g. floating dock) */
  variant?: 'solid' | 'glass'
}

const glassLeave =
  'border border-rose-400/35 bg-rose-600/65 backdrop-blur-sm shadow-sm ring-0 hover:bg-rose-600/82 focus-visible:ring-2 focus-visible:ring-rose-300/45 focus-visible:ring-offset-0'

export default function LeaveCallButton({
  onLeave,
  className = '',
  variant = 'solid',
}: Props) {
  const base =
    variant === 'glass'
      ? `inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition focus:outline-none ${glassLeave}`
      : 'inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-rose-700/20 transition hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:ring-rose-900/40'

  return (
    <button
      type="button"
      onClick={onLeave}
      className={`${base} ${className}`}
      aria-label="Leave call"
      title="Leave call"
    >
      <PhoneOff className="h-4 w-4 shrink-0" aria-hidden />
      <span className="hidden sm:inline">Leave call</span>
    </button>
  )
}

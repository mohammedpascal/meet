import { PhoneOff } from 'lucide-react'

type Props = {
  onLeave: () => void
  className?: string
}

export default function LeaveCallButton({ onLeave, className = '' }: Props) {
  return (
    <button
      type="button"
      onClick={onLeave}
      className={`inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-rose-700/20 transition hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:ring-rose-900/40 ${className}`}
      aria-label="End consultation and leave call"
      title="End consultation"
    >
      <PhoneOff className="h-4 w-4 shrink-0" aria-hidden />
      <span className="hidden sm:inline">End call</span>
    </button>
  )
}

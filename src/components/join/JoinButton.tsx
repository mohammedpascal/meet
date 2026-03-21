import { Loader2 } from 'lucide-react'

type Props = {
  disabled: boolean
  loading?: boolean
}

export default function JoinButton({ disabled, loading }: Props) {
  return (
    <div className="space-y-2">
      <button
        type="submit"
        disabled={disabled || loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3.5 text-base font-semibold text-white shadow-md shadow-teal-900/15 transition hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-900/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-teal-600 dark:hover:bg-teal-500 dark:focus-visible:ring-offset-slate-900"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            Joining…
          </>
        ) : (
          'Join the call'
        )}
      </button>
      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        You’ll join instantly
      </p>
      <p className="text-center text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
        Your audio and video are private and encrypted
      </p>
    </div>
  )
}

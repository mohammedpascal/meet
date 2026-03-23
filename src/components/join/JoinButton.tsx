import { Loader2 } from 'lucide-react'

type Props = {
  disabled: boolean
  loading?: boolean
}

/** Primary pre-call CTA — grows to fill the row beside mic/camera controls. */
export default function JoinButton({ disabled, loading }: Props) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="inline-flex h-full min-h-0 w-full min-w-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-base font-semibold whitespace-nowrap text-white shadow-lg shadow-teal-950/25 ring-1 ring-teal-500/30 transition hover:bg-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-45 dark:bg-teal-600 dark:hover:bg-teal-500 dark:focus-visible:ring-offset-slate-950"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden />
          Joining call…
        </>
      ) : (
        'Join'
      )}
    </button>
  )
}

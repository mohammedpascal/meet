type Props = {
  id?: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  autoFocus?: boolean
  /** Accessible name when there is no visible label element */
  ariaLabel?: string
}

const field =
  'w-full rounded-xl border border-white/15 bg-white/95 px-3.5 py-3 text-base text-slate-900 shadow-inner shadow-black/10 transition placeholder:text-slate-400 focus:border-teal-400/60 focus:outline-none focus:ring-2 focus:ring-teal-500/35 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100'

export default function NameInput({
  id = 'precall-name',
  value,
  onChange,
  disabled,
  autoFocus,
  ariaLabel,
}: Props) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      autoFocus={autoFocus}
      className={field}
      autoComplete="name"
      placeholder="Your name"
      required
      aria-required
      aria-label={ariaLabel}
    />
  )
}

type Props = {
  room: string
  name: string
  onRoomChange: (v: string) => void
  onNameChange: (v: string) => void
  disabled?: boolean
}

const field =
  'w-full rounded-xl border border-slate-200/90 bg-white px-3.5 py-3 text-base text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/25 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400/40 dark:focus:ring-teal-400/20'

export default function JoinForm({
  room,
  name,
  onRoomChange,
  onNameChange,
  disabled,
}: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        Your details
      </h3>
      <div className="space-y-3.5">
        <div>
          <label
            htmlFor="join-room"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Room
          </label>
          <input
            id="join-room"
            type="text"
            value={room}
            onChange={(e) => onRoomChange(e.target.value)}
            disabled={disabled}
            className={field}
            autoComplete="off"
            required
          />
        </div>
        <div>
          <label
            htmlFor="join-name"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Name
          </label>
          <input
            id="join-name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            disabled={disabled}
            className={field}
            autoComplete="name"
            required
          />
        </div>
      </div>
    </div>
  )
}

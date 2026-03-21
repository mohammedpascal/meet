import { useMediaDeviceSelect } from '@livekit/components-react'

type DeviceKind = 'audioinput' | 'videoinput'

function DeviceList({ kind, heading }: { kind: DeviceKind; heading: string }) {
  const { devices, activeDeviceId, setActiveMediaDevice } = useMediaDeviceSelect({
    kind,
    requestPermissions: true,
  })

  return (
    <div>
      <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {heading}
      </h4>
      <ul className="max-h-48 space-y-0.5 overflow-y-auto rounded-lg border border-slate-200/90 bg-slate-50/80 p-1 dark:border-slate-600 dark:bg-slate-800/80">
        {devices.length === 0 ? (
          <li className="px-3 py-2 text-xs text-slate-500">No devices found</li>
        ) : (
          devices.map((d) => {
            const active = d.deviceId === activeDeviceId
            return (
              <li key={d.deviceId}>
                <button
                  type="button"
                  onClick={() => void setActiveMediaDevice(d.deviceId)}
                  className={`w-full rounded-md px-3 py-2 text-left text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 ${
                    active
                      ? 'bg-white font-medium text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-slate-700 dark:text-white dark:ring-slate-600'
                      : 'text-slate-600 hover:bg-white/90 dark:text-slate-300 dark:hover:bg-slate-700/80'
                  }`}
                >
                  {d.label || `Device ${d.deviceId.slice(0, 6)}…`}
                </button>
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}

type Props = {
  kind: DeviceKind
  className?: string
}

const titles: Record<DeviceKind, string> = {
  audioinput: 'Microphone',
  videoinput: 'Camera',
}

const listHeadings: Record<DeviceKind, string> = {
  audioinput: 'Available microphones',
  videoinput: 'Available cameras',
}

/** Single-device-type list; opens from the chevron next to mic or camera. */
export default function DevicePopover({ kind, className = '' }: Props) {
  return (
    <div
      className={`rounded-xl border border-slate-200/90 bg-white p-4 shadow-xl dark:border-slate-600 dark:bg-slate-900 ${className}`}
    >
      <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
        {titles[kind]}
      </h3>
      <DeviceList kind={kind} heading={listHeadings[kind]} />
    </div>
  )
}

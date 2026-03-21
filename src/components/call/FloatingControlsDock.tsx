import { useTrackToggle } from '@livekit/components-react'
import { Track } from 'livekit-client'
import {
  ChevronUp,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  Video,
  VideoOff,
} from 'lucide-react'
import LeaveCallButton from './LeaveCallButton'

/** Single square control (screen share, chat) */
const dockBtn =
  'inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-700 shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/45 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'

const dockBtnOff =
  'border-rose-200 bg-rose-50 text-rose-800 ring-2 ring-rose-300/60 dark:border-rose-900/50 dark:bg-rose-950/60 dark:text-rose-100 dark:ring-rose-800/50'

/** Outer shell: one continuous rounded-xl for mic/cam split control */
const splitWrapOn =
  'inline-flex overflow-hidden rounded-xl border border-slate-200/90 bg-white text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'

const splitWrapOff =
  'inline-flex overflow-hidden rounded-xl border-2 border-rose-200 bg-rose-50 text-rose-800 shadow-sm ring-2 ring-rose-300/50 dark:border-rose-800/60 dark:bg-rose-950/70 dark:text-rose-100 dark:ring-rose-800/45'

const splitMainBtn =
  'inline-flex h-12 w-12 shrink-0 items-center justify-center !rounded-none border-0 bg-transparent p-0 text-inherit transition focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-teal-500/45 focus-visible:ring-offset-0 disabled:opacity-50 dark:focus-visible:ring-teal-400/40'

const splitChevronBtn =
  'inline-flex h-12 w-9 shrink-0 items-center justify-center !rounded-none border-0 border-l border-slate-200/90 bg-transparent p-0 text-slate-500 transition hover:bg-black/[0.04] focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-teal-500/45 focus-visible:ring-offset-0 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-white/[0.06]'

const splitChevronBtnOff =
  'border-l-rose-300/70 hover:bg-rose-100/80 dark:border-rose-700/50 dark:hover:bg-rose-900/40'

type MediaToggleSource =
  | typeof Track.Source.Microphone
  | typeof Track.Source.Camera

type ToggleProps = {
  source: MediaToggleSource
  labelOn: string
  labelOff: string
  IconOn: typeof Mic
  IconOff: typeof MicOff
  onOpenDeviceList?: () => void
  deviceListLabel: string
}

function MediaToggle({
  source,
  labelOn,
  labelOff,
  IconOn,
  IconOff,
  onOpenDeviceList,
  deviceListLabel,
}: ToggleProps) {
  const { buttonProps, enabled, pending } = useTrackToggle({ source })
  const off = !enabled
  const label = off ? labelOff : labelOn

  if (!onOpenDeviceList) {
    return (
      <button
        type="button"
        {...buttonProps}
        disabled={pending || buttonProps.disabled}
        aria-label={label}
        title={label}
        className={`${dockBtn} ${off ? dockBtnOff : ''} ${buttonProps.className ?? ''}`}
      >
        {off ? (
          <IconOff className="h-5 w-5" aria-hidden />
        ) : (
          <IconOn className="h-5 w-5" aria-hidden />
        )}
      </button>
    )
  }

  return (
    <div className={off ? splitWrapOff : splitWrapOn}>
      <button
        type="button"
        {...buttonProps}
        disabled={pending || buttonProps.disabled}
        aria-label={label}
        title={label}
        className={`${splitMainBtn} ${buttonProps.className ?? ''}`}
      >
        {off ? (
          <IconOff className="h-5 w-5" aria-hidden />
        ) : (
          <IconOn className="h-5 w-5" aria-hidden />
        )}
      </button>
      <button
        type="button"
        onClick={onOpenDeviceList}
        className={`${splitChevronBtn} ${off ? splitChevronBtnOff : ''}`}
        aria-label={deviceListLabel}
        title={deviceListLabel}
      >
        <ChevronUp className="h-4 w-4" aria-hidden />
      </button>
    </div>
  )
}

type Props = {
  onLeave: () => void
  onOpenMicDevices: () => void
  onOpenCameraDevices: () => void
  chatOpen: boolean
  onChatToggle: () => void
}

export default function FloatingControlsDock({
  onLeave,
  onOpenMicDevices,
  onOpenCameraDevices,
  chatOpen,
  onChatToggle,
}: Props) {
  const screen = useTrackToggle({ source: Track.Source.ScreenShare })

  return (
    <div className="pointer-events-auto absolute bottom-0 left-1/2 z-30 flex w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 translate-y-[45%] flex-col items-stretch gap-3 sm:w-auto sm:min-w-0 sm:translate-y-1/2">
      <div
        className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-200/90 bg-white/95 px-3 py-2.5 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.2)] ring-1 ring-black/[0.04] backdrop-blur-md dark:border-slate-600/90 dark:bg-slate-900/95 dark:ring-white/[0.06] sm:gap-3 sm:px-4"
        role="toolbar"
        aria-label="Call controls"
      >
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <MediaToggle
            source={Track.Source.Microphone}
            labelOn="Mute microphone"
            labelOff="Unmute microphone"
            IconOn={Mic}
            IconOff={MicOff}
            onOpenDeviceList={onOpenMicDevices}
            deviceListLabel="Choose microphone"
          />
          <MediaToggle
            source={Track.Source.Camera}
            labelOn="Turn camera off"
            labelOff="Turn camera on"
            IconOn={Video}
            IconOff={VideoOff}
            onOpenDeviceList={onOpenCameraDevices}
            deviceListLabel="Choose camera"
          />
        </div>

        <div
          className="hidden h-8 w-px bg-slate-200 dark:bg-slate-600 sm:block"
          aria-hidden
        />

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            {...screen.buttonProps}
            disabled={screen.pending || screen.buttonProps.disabled}
            aria-label={
              screen.enabled ? 'Stop screen sharing' : 'Share screen'
            }
            title={screen.enabled ? 'Stop sharing' : 'Share screen'}
            className={`${dockBtn} ${screen.enabled ? 'border-teal-200 bg-teal-50 text-teal-900 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-100' : ''} ${screen.buttonProps.className ?? ''} !rounded-xl`}
          >
            <MonitorUp className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onChatToggle}
            aria-label={chatOpen ? 'Close chat' : 'Open chat'}
            title="Chat"
            className={`${dockBtn} ${chatOpen ? 'border-teal-200 bg-teal-50 text-teal-900 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-100' : ''} !rounded-xl`}
          >
            <MessageSquare className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div
          className="hidden h-8 w-px bg-slate-200 dark:bg-slate-600 sm:block"
          aria-hidden
        />

        <LeaveCallButton onLeave={onLeave} className="shrink-0" />
      </div>
    </div>
  )
}

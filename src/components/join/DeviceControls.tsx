import { Mic, MicOff, Video, VideoOff } from 'lucide-react'

type Props = {
  audioEnabled: boolean
  videoEnabled: boolean
  onToggleAudio: () => void
  onToggleVideo: () => void
  disabled?: boolean
}

const chip =
  'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/45 disabled:opacity-50'

const chipOn =
  'border-slate-200/90 bg-white text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700/80'

const chipOff =
  'border-rose-200 bg-rose-50 text-rose-900 ring-1 ring-rose-200/80 hover:bg-rose-100/80 dark:border-rose-900/50 dark:bg-rose-950/50 dark:text-rose-100 dark:ring-rose-800/40'

export default function DeviceControls({
  audioEnabled,
  videoEnabled,
  onToggleAudio,
  onToggleVideo,
  disabled,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <button
        type="button"
        disabled={disabled}
        onClick={onToggleAudio}
        aria-pressed={audioEnabled}
        className={`${chip} ${audioEnabled ? chipOn : chipOff}`}
      >
        {audioEnabled ? (
          <Mic className="h-4 w-4 shrink-0" aria-hidden />
        ) : (
          <MicOff className="h-4 w-4 shrink-0" aria-hidden />
        )}
        {audioEnabled ? 'Mic on' : 'Mic off'}
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onToggleVideo}
        aria-pressed={videoEnabled}
        className={`${chip} ${videoEnabled ? chipOn : chipOff}`}
      >
        {videoEnabled ? (
          <Video className="h-4 w-4 shrink-0" aria-hidden />
        ) : (
          <VideoOff className="h-4 w-4 shrink-0" aria-hidden />
        )}
        {videoEnabled ? 'Camera on' : 'Camera off'}
      </button>
    </div>
  )
}

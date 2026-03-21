import CameraPreview from './CameraPreview'
import DeviceControls from './DeviceControls'
import JoinButton from './JoinButton'
import JoinForm from './JoinForm'

type Props = {
  stream: MediaStream | null
  videoEnabled: boolean
  audioEnabled: boolean
  onToggleVideo: () => void
  onToggleAudio: () => void
  permissionDenied: boolean
  room: string
  name: string
  onRoomChange: (v: string) => void
  onNameChange: (v: string) => void
  onJoin: () => void
  joinDisabled: boolean
  joining: boolean
  error: string | null
}

export default function PreCallCard({
  stream,
  videoEnabled,
  audioEnabled,
  onToggleVideo,
  onToggleAudio,
  permissionDenied,
  room,
  name,
  onRoomChange,
  onNameChange,
  onJoin,
  joinDisabled,
  joining,
  error,
}: Props) {
  const noDevices = permissionDenied && !stream

  return (
    <div className="mt-5 rounded-2xl border border-slate-200/90 bg-slate-50/90 p-4 shadow-lg ring-1 ring-slate-200/50 dark:border-slate-700/80 dark:bg-slate-900/40 dark:ring-slate-700/50 sm:p-6">
      {noDevices ? (
        <p className="mb-4 rounded-xl border border-amber-200/90 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
          Allow camera and microphone in your browser to preview devices. You
          can still join; we’ll ask again when the call starts.
        </p>
      ) : null}

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault()
          onJoin()
        }}
      >
        <div className="rise-in">
          <CameraPreview stream={stream} videoEnabled={videoEnabled} />
        </div>

        <JoinForm
          room={room}
          name={name}
          onRoomChange={onRoomChange}
          onNameChange={onNameChange}
          disabled={joining}
        />

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Device readiness
          </p>
          <DeviceControls
            audioEnabled={audioEnabled}
            videoEnabled={videoEnabled}
            onToggleAudio={onToggleAudio}
            onToggleVideo={onToggleVideo}
            disabled={!stream || joining}
          />
        </div>

        {error ? (
          <p className="rounded-xl border border-red-200/90 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100">
            {error}
          </p>
        ) : null}

        <JoinButton disabled={joinDisabled} loading={joining} />
      </form>
    </div>
  )
}

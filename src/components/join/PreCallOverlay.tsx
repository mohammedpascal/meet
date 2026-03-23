import { Mic, MicOff, Video, VideoOff } from 'lucide-react'
import JoinButton from './JoinButton'
import NameInput from './NameInput'
import PrecallMediaToggle from './PrecallMediaToggle'

type Props = {
  name: string
  onNameChange: (v: string) => void
  joinDisabled: boolean
  joining: boolean
  /** Show hint when browser denied preview devices */
  mediaPermissionHint: boolean
  error: string | null
  audioEnabled: boolean
  videoEnabled: boolean
  onToggleAudio: () => void
  onToggleVideo: () => void
  mediaDisabled: boolean
  onOpenMicDevices: () => void
  onOpenCameraDevices: () => void
}

/**
 * Centered waiting-room card: name + primary CTA, styled like in-call empty / waiting states.
 */
export default function PreCallOverlay({
  name,
  onNameChange,
  joinDisabled,
  joining,
  mediaPermissionHint,
  error,
  audioEnabled,
  videoEnabled,
  onToggleAudio,
  onToggleVideo,
  mediaDisabled,
  onOpenMicDevices,
  onOpenCameraDevices,
}: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 z-15 flex items-center justify-center px-4 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] pt-[calc(5.5rem+env(safe-area-inset-top,0px))] sm:pb-10 sm:pt-20">
      <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-white/12 bg-black/50 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.5)] ring-1 ring-white/10 backdrop-blur-xl sm:p-8">
        <h1 className="text-left text-lg font-semibold tracking-tight text-white sm:text-xl">
          Join call
        </h1>

        <div className="mt-6 space-y-4">
          <div className="text-left">
            <label
              htmlFor="precall-name"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/55"
            >
              Your name
            </label>
            <div className="flex flex-row gap-2 items-stretch">
              <div className="min-w-0 flex-1">
                <NameInput
                  value={name}
                  onChange={onNameChange}
                  disabled={joining}
                />
              </div>
              <JoinButton disabled={joinDisabled} loading={joining} />
            </div>
            <div
              className="mt-3 flex flex-wrap items-center gap-2"
              role="group"
              aria-label="Microphone and camera"
            >
              <PrecallMediaToggle
                enabled={audioEnabled}
                labelOn="Mute microphone"
                labelOff="Unmute microphone"
                IconOn={Mic}
                IconOff={MicOff}
                onToggle={onToggleAudio}
                onOpenDeviceList={onOpenMicDevices}
                deviceListLabel="Choose microphone"
                disabled={mediaDisabled}
              />
              <PrecallMediaToggle
                enabled={videoEnabled}
                labelOn="Turn camera off"
                labelOff="Turn camera on"
                IconOn={Video}
                IconOff={VideoOff}
                onToggle={onToggleVideo}
                onOpenDeviceList={onOpenCameraDevices}
                deviceListLabel="Choose camera"
                disabled={mediaDisabled}
              />
            </div>
          </div>

          {mediaPermissionHint ? (
            <p className="rounded-xl border border-amber-400/25 bg-amber-950/40 px-3 py-2.5 text-left text-sm text-amber-100/95">
              Allow camera and microphone when prompted to preview your devices.
              You can still start; we’ll ask again in the consultation.
            </p>
          ) : null}

          {error ? (
            <p className="rounded-xl border border-red-400/25 bg-red-950/45 px-3 py-2.5 text-left text-sm text-red-100">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

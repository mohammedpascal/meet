import { useCallback, useRef, useState } from 'react'
import type { PreviewInputKind } from './usePreviewMedia'
import CameraPreview from './CameraPreview'
import JoinForm from './JoinForm'
import JoinHeader from './JoinHeader'
import PreCallFloatingDock from './PreCallFloatingDock'
import PreviewDevicePopover from './PreviewDevicePopover'

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
  replaceInputDevice: (kind: PreviewInputKind, deviceId: string) => Promise<void>
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
  replaceInputDevice,
}: Props) {
  const noDevices = permissionDenied && !stream
  const dockBoundsRef = useRef<HTMLFormElement>(null)
  const [devicePanelKind, setDevicePanelKind] = useState<PreviewInputKind | null>(
    null,
  )

  const openMicDevices = useCallback(() => {
    setDevicePanelKind((k) => (k === 'audioinput' ? null : 'audioinput'))
  }, [])

  const openCameraDevices = useCallback(() => {
    setDevicePanelKind((k) => (k === 'videoinput' ? null : 'videoinput'))
  }, [])

  const activeMicId = stream?.getAudioTracks()[0]?.getSettings().deviceId
  const activeCamId = stream?.getVideoTracks()[0]?.getSettings().deviceId

  return (
    <form
      ref={dockBoundsRef}
      className="relative h-full min-h-0 w-full"
      onSubmit={(e) => {
        e.preventDefault()
        onJoin()
      }}
    >
      <CameraPreview
        stream={stream}
        videoEnabled={videoEnabled}
        variant="fullscreen"
      />
      <div
        className="pointer-events-none absolute inset-0 z-1 bg-linear-to-b from-black/50 via-black/15 to-black/55"
        aria-hidden
      />
      <div className="pointer-events-auto absolute inset-x-0 top-0 z-20 max-h-[42dvh] overflow-y-auto overscroll-contain border-b border-white/10 bg-black/45 px-4 pb-4 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-md supports-[backdrop-filter]:bg-black/35 sm:px-5 sm:pb-5 sm:pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="mx-auto w-full max-w-lg space-y-4">
          <JoinHeader variant="strip" />
          {noDevices ? (
            <p className="rounded-xl border border-amber-200/90 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
              Allow camera and microphone in your browser to preview devices.
              You can still join; we’ll ask again when the call starts.
            </p>
          ) : null}
          <JoinForm
            room={room}
            name={name}
            onRoomChange={onRoomChange}
            onNameChange={onNameChange}
            disabled={joining}
          />
          {error ? (
            <p className="rounded-xl border border-red-200/90 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100">
              {error}
            </p>
          ) : null}
        </div>
      </div>
      <PreCallFloatingDock
        dockBoundsRef={dockBoundsRef}
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        onToggleAudio={onToggleAudio}
        onToggleVideo={onToggleVideo}
        mediaDisabled={!stream || joining}
        onOpenMicDevices={openMicDevices}
        onOpenCameraDevices={openCameraDevices}
        joinDisabled={joinDisabled}
        joining={joining}
      />
      {devicePanelKind ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-slate-900/25 backdrop-blur-[2px]"
            aria-label="Close device list"
            onClick={() => setDevicePanelKind(null)}
          />
          <div className="fixed bottom-[max(8rem,28vh)] left-1/2 z-[70] w-[min(calc(100vw-1.5rem),20rem)] -translate-x-1/2 sm:bottom-[32vh]">
            <PreviewDevicePopover
              kind={devicePanelKind}
              onPickDevice={async (deviceId) => {
                await replaceInputDevice(devicePanelKind, deviceId)
                setDevicePanelKind(null)
              }}
              activeDeviceId={
                devicePanelKind === 'audioinput' ? activeMicId : activeCamId
              }
            />
          </div>
        </>
      ) : null}
    </form>
  )
}

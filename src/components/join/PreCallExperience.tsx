import { useCallback, useState } from 'react'
import type { PreviewInputKind } from './usePreviewMedia'
import PreCallOverlay from './PreCallOverlay'
import PreCallVideoStage from './PreCallVideoStage'
import PreviewDevicePopover from './PreviewDevicePopover'

type Props = {
  stream: MediaStream | null
  videoEnabled: boolean
  audioEnabled: boolean
  onToggleVideo: () => void
  onToggleAudio: () => void
  permissionDenied: boolean
  name: string
  onNameChange: (v: string) => void
  onJoin: () => void
  joinDisabled: boolean
  joining: boolean
  error: string | null
  replaceInputDevice: (kind: PreviewInputKind, deviceId: string) => Promise<void>
}

/**
 * Pre-call “waiting room”: video column, overlay controls, stage.
 */
export default function PreCallExperience({
  stream,
  videoEnabled,
  audioEnabled,
  onToggleVideo,
  onToggleAudio,
  permissionDenied,
  name,
  onNameChange,
  onJoin,
  joinDisabled,
  joining,
  error,
  replaceInputDevice,
}: Props) {
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
      className="relative min-h-0 min-w-0 flex-1"
      onSubmit={(e) => {
        e.preventDefault()
        onJoin()
      }}
    >
      <PreCallVideoStage stream={stream} videoEnabled={videoEnabled} />
      <div
        className="pointer-events-none absolute inset-0 z-5 bg-linear-to-t from-black/45 via-transparent to-black/25"
        aria-hidden
      />
      <PreCallOverlay
        name={name}
        onNameChange={onNameChange}
        joinDisabled={joinDisabled}
        joining={joining}
        mediaPermissionHint={permissionDenied && !stream}
        error={error}
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        onToggleAudio={onToggleAudio}
        onToggleVideo={onToggleVideo}
        mediaDisabled={!stream || joining}
        onOpenMicDevices={openMicDevices}
        onOpenCameraDevices={openCameraDevices}
      />
      {devicePanelKind ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-60 bg-slate-900/25 backdrop-blur-[2px]"
            aria-label="Close device list"
            onClick={() => setDevicePanelKind(null)}
          />
          <div className="fixed bottom-[max(7rem,26vh)] left-1/2 z-70 w-[min(calc(100vw-1.5rem),20rem)] -translate-x-1/2 sm:bottom-[30vh]">
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

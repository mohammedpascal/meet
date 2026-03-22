import { useCallback, useEffect, useRef, useState } from 'react'

export type PreviewInputKind = 'audioinput' | 'videoinput'

/**
 * Preview stream for the join screen. When `acquire` is false (e.g. user is in
 * a call), tracks are released; when it becomes true again, a fresh
 * getUserMedia stream is requested so the landing page works after leaving.
 */
export function usePreviewMedia(acquire: boolean) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const streamRef = useRef<MediaStream | null>(null)
  streamRef.current = stream

  useEffect(() => {
    if (!acquire) {
      setStream((prev) => {
        prev?.getTracks().forEach((t) => t.stop())
        return null
      })
      return
    }

    let cancelled = false
    let active: MediaStream | null = null

    void (async () => {
      try {
        active = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        if (cancelled) {
          active.getTracks().forEach((t) => t.stop())
          return
        }
        setStream(active)
        setPermissionDenied(false)
      } catch {
        if (!cancelled) {
          setStream(null)
          setPermissionDenied(true)
        }
      }
    })()

    return () => {
      cancelled = true
      active?.getTracks().forEach((t) => t.stop())
    }
  }, [acquire])

  useEffect(() => {
    stream?.getVideoTracks().forEach((t) => {
      t.enabled = videoEnabled
    })
  }, [stream, videoEnabled])

  useEffect(() => {
    stream?.getAudioTracks().forEach((t) => {
      t.enabled = audioEnabled
    })
  }, [stream, audioEnabled])

  const replaceInputDevice = useCallback(
    async (kind: PreviewInputKind, deviceId: string) => {
      const prev = streamRef.current
      if (!prev) return

      const videoTrack = prev.getVideoTracks()[0]
      const audioTrack = prev.getAudioTracks()[0]
      const vId = videoTrack?.getSettings().deviceId
      const aId = audioTrack?.getSettings().deviceId

      const constraints: MediaStreamConstraints =
        kind === 'videoinput'
          ? {
              video: { deviceId: { exact: deviceId } },
              audio: aId ? { deviceId: { exact: aId } } : true,
            }
          : {
              audio: { deviceId: { exact: deviceId } },
              video: vId ? { deviceId: { exact: vId } } : true,
            }

      try {
        const next = await navigator.mediaDevices.getUserMedia(constraints)
        prev.getTracks().forEach((t) => t.stop())
        setStream(next)
      } catch {
        /* keep existing stream */
      }
    },
    [],
  )

  return {
    stream,
    permissionDenied,
    videoEnabled,
    audioEnabled,
    setVideoEnabled,
    setAudioEnabled,
    replaceInputDevice,
  }
}

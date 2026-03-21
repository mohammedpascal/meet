import { useEffect, useState } from 'react'

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

  return {
    stream,
    permissionDenied,
    videoEnabled,
    audioEnabled,
    setVideoEnabled,
    setAudioEnabled,
  }
}

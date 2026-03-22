import {
  ChevronUp,
  GripVertical,
  Loader2,
  Mic,
  MicOff,
  Phone,
  Video,
  VideoOff,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import {
  clampDockOffsetPure,
  dockBtn,
  DRAG_THRESHOLD_PX,
  splitChevronBtn,
  splitChevronBtnOff,
  splitMainBtn,
  splitWrapOff,
  splitWrapOn,
  VIEW_MARGIN,
} from '../call/floating-dock-primitives'

function PrecallMediaToggle({
  enabled,
  labelOn,
  labelOff,
  IconOn,
  IconOff,
  onToggle,
  onOpenDeviceList,
  deviceListLabel,
  disabled,
}: {
  enabled: boolean
  labelOn: string
  labelOff: string
  IconOn: LucideIcon
  IconOff: LucideIcon
  onToggle: () => void
  onOpenDeviceList: () => void
  deviceListLabel: string
  disabled: boolean
}) {
  const off = !enabled
  const label = off ? labelOff : labelOn

  return (
    <div className={off ? splitWrapOff : splitWrapOn}>
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        aria-label={label}
        title={label}
        className={splitMainBtn}
      >
        {off ? (
          <IconOff className="h-5 w-5" aria-hidden />
        ) : (
          <IconOn className="h-5 w-5" aria-hidden />
        )}
      </button>
      <button
        type="button"
        disabled={disabled}
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
  dockBoundsRef: RefObject<HTMLElement | null>
  audioEnabled: boolean
  videoEnabled: boolean
  onToggleAudio: () => void
  onToggleVideo: () => void
  mediaDisabled: boolean
  onOpenMicDevices: () => void
  onOpenCameraDevices: () => void
  joinDisabled: boolean
  joining: boolean
}

export default function PreCallFloatingDock({
  dockBoundsRef,
  audioEnabled,
  videoEnabled,
  onToggleAudio,
  onToggleVideo,
  mediaDisabled,
  onOpenMicDevices,
  onOpenCameraDevices,
  joinDisabled,
  joining,
}: Props) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [collapsed, setCollapsed] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(offset)
  offsetRef.current = offset

  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    ox: number
    oy: number
    rect: DOMRect
    dragStarted: boolean
  } | null>(null)

  const dragRafRef = useRef<number | null>(null)
  const pendingOffsetRef = useRef<{ x: number; y: number } | null>(null)

  const getBounds = useCallback(
    () => dockBoundsRef.current?.getBoundingClientRect() ?? null,
    [dockBoundsRef],
  )

  const reclamp = useCallback(() => {
    const el = rootRef.current
    if (!el) return
    setOffset((o) => {
      const r = el.getBoundingClientRect()
      return clampDockOffsetPure(o.x, o.y, o.x, o.y, r, getBounds(), VIEW_MARGIN)
    })
  }, [getBounds])

  const flushDragRaf = useCallback(() => {
    dragRafRef.current = null
    const p = pendingOffsetRef.current
    pendingOffsetRef.current = null
    if (p) setOffset(p)
  }, [])

  const scheduleDragOffset = useCallback(() => {
    if (dragRafRef.current != null) return
    dragRafRef.current = requestAnimationFrame(flushDragRaf)
  }, [flushDragRaf])

  useEffect(() => {
    window.addEventListener('resize', reclamp)
    return () => window.removeEventListener('resize', reclamp)
  }, [reclamp])

  useEffect(() => {
    reclamp()
  }, [reclamp])

  useEffect(() => {
    if (!collapsed) reclamp()
  }, [collapsed, reclamp])

  useEffect(
    () => () => {
      if (dragRafRef.current != null) {
        cancelAnimationFrame(dragRafRef.current)
      }
    },
    [],
  )

  const onHandlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    const el = rootRef.current
    if (!el) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    const ox = offsetRef.current.x
    const oy = offsetRef.current.y
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      ox,
      oy,
      rect: el.getBoundingClientRect(),
      dragStarted: false,
    }
    pendingOffsetRef.current = null
  }

  const onHandlePointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d || e.pointerId !== d.pointerId) return
    if (!d.dragStarted) {
      const dist = Math.hypot(e.clientX - d.startX, e.clientY - d.startY)
      if (dist < DRAG_THRESHOLD_PX) return
      d.dragStarted = true
      setIsDragging(true)
    }
    const nx = d.ox + (e.clientX - d.startX)
    const ny = d.oy + (e.clientY - d.startY)
    const clamped = clampDockOffsetPure(
      nx,
      ny,
      d.ox,
      d.oy,
      d.rect,
      getBounds(),
      VIEW_MARGIN,
    )
    pendingOffsetRef.current = clamped
    scheduleDragOffset()
  }

  const endDrag = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d || e.pointerId !== d.pointerId) return
    const didDrag = d.dragStarted
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
    dragRef.current = null
    setIsDragging(false)

    if (dragRafRef.current != null) {
      cancelAnimationFrame(dragRafRef.current)
      dragRafRef.current = null
    }
    const p = pendingOffsetRef.current
    pendingOffsetRef.current = null
    if (p) setOffset(p)
    if (!didDrag) setCollapsed(true)
  }

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className={`pointer-events-auto fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-4 z-30 ${dockBtn}`}
        aria-label="Show join controls"
        title="Show join controls"
      >
        <GripVertical className="h-5 w-5 text-slate-400 dark:text-slate-500" aria-hidden />
      </button>
    )
  }

  return (
    <div
      ref={rootRef}
      className={`pointer-events-auto absolute left-1/2 z-30 w-[calc(100%-1.5rem)] max-w-3xl sm:w-auto sm:min-w-0 ${isDragging ? 'will-change-transform transition-none' : ''}`}
      style={{
        bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
        transform: `translate(calc(-50% + ${offset.x}px), ${offset.y}px)`,
      }}
    >
      <div className="flex flex-row overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.38)] ring-1 ring-black/[0.06] backdrop-blur-md dark:border-slate-600/90 dark:bg-slate-900/95 dark:ring-white/[0.08]">
        <button
          type="button"
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="flex h-auto shrink-0 cursor-grab touch-none flex-col items-center justify-center self-stretch border-r border-slate-200/80 bg-white/90 px-2 text-slate-400 active:cursor-grabbing dark:border-slate-600/80 dark:bg-slate-800/90 dark:text-slate-500"
          aria-label="Drag to move or tap to hide join controls"
          title="Drag to move; tap to hide"
        >
          <GripVertical className="h-5 w-5" aria-hidden />
        </button>
        <div
          className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4"
          role="toolbar"
          aria-label="Join controls"
        >
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
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

          <div
            className="hidden h-8 w-px bg-slate-200 dark:bg-slate-600 sm:block"
            aria-hidden
          />

          <button
            type="submit"
            disabled={joinDisabled || joining}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-rose-700/20 transition hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-rose-900/40 dark:focus-visible:ring-offset-slate-900"
            aria-label={joining ? 'Joining' : 'Join the call'}
            title={joining ? 'Joining…' : 'Join the call'}
          >
            {joining ? (
              <>
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                <span className="hidden sm:inline">Joining…</span>
              </>
            ) : (
              <>
                <Phone className="h-4 w-4 shrink-0" aria-hidden />
                <span className="hidden sm:inline">Join</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

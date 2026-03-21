import { useTrackToggle } from '@livekit/components-react'
import { Track } from 'livekit-client'
import {
  ChevronUp,
  GripHorizontal,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  Settings,
  Users,
  Video,
  VideoOff,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { SidePanelTab } from './CallSidePanel'
import LeaveCallButton from './LeaveCallButton'

const VIEW_MARGIN = 8

/**
 * Clamp translate offset without touching DOM. `rectAtRef` must be
 * getBoundingClientRect() when the dock was at (refOx, refOy).
 * Moving to (nx, ny) shifts the box by (nx - refOx, ny - refOy).
 */
function clampDockOffsetPure(
  nx: number,
  ny: number,
  refOx: number,
  refOy: number,
  rectAtRef: DOMRect,
  bounds: DOMRect | null,
  margin: number,
): { x: number; y: number } {
  const minL = bounds ? bounds.left + margin : margin
  const maxR = bounds
    ? bounds.right - margin
    : typeof window !== 'undefined'
      ? window.innerWidth - margin
      : Number.POSITIVE_INFINITY
  const minT = bounds ? bounds.top + margin : margin
  const maxB = bounds
    ? bounds.bottom - margin
    : typeof window !== 'undefined'
      ? window.innerHeight - margin
      : Number.POSITIVE_INFINITY

  let cx = nx
  let cy = ny
  for (let i = 0; i < 8; i++) {
    const dx = cx - refOx
    const dy = cy - refOy
    const left = rectAtRef.left + dx
    const right = rectAtRef.right + dx
    const top = rectAtRef.top + dy
    const bottom = rectAtRef.bottom + dy
    let ax = 0
    let ay = 0
    if (left < minL) ax += minL - left
    if (right > maxR) ax -= right - maxR
    if (top < minT) ay += minT - top
    if (bottom > maxB) ay -= bottom - maxB
    if (!ax && !ay) return { x: cx, y: cy }
    cx += ax
    cy += ay
  }
  return { x: cx, y: cy }
}

const dockBtn =
  'inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-700 shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/45 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'

const dockBtnOff =
  'border-rose-200 bg-rose-50 text-rose-800 ring-2 ring-rose-300/60 dark:border-rose-900/50 dark:bg-rose-950/60 dark:text-rose-100 dark:ring-rose-800/50'

/* Idle split matches dockBtn so mic/cam/chevron icon color matches chat (slate-700 / slate-200) */
const splitWrapOn =
  'inline-flex overflow-hidden rounded-xl border border-slate-200/90 bg-white text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'

const splitWrapOff =
  'inline-flex overflow-hidden rounded-xl border-2 border-rose-200 bg-rose-50 text-rose-800 shadow-sm ring-2 ring-rose-300/50 dark:border-rose-900/50 dark:bg-rose-950/60 dark:text-rose-100 dark:ring-rose-800/50'

const splitMainBtn =
  'inline-flex h-12 w-12 shrink-0 items-center justify-center !rounded-none border-0 !bg-transparent p-0 !text-inherit transition focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-teal-500/45 focus-visible:ring-offset-0 disabled:opacity-50 dark:!bg-transparent dark:!text-inherit dark:focus-visible:ring-teal-400/40'

const splitChevronBtn =
  'inline-flex h-12 w-9 shrink-0 items-center justify-center !rounded-none border-0 border-l border-slate-200/90 !bg-transparent p-0 !text-inherit transition hover:bg-black/[0.04] focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-teal-500/45 focus-visible:ring-offset-0 dark:border-slate-600 dark:hover:bg-white/[0.06]'

const splitChevronBtnOff =
  'border-l-rose-300/70 hover:bg-rose-100/80 dark:border-rose-700/50 dark:hover:bg-rose-900/40'

/* Override LiveKit screen-share toggle so idle/active match chat (same as split wrap) */
const dockScreenLkIdle =
  '!border-slate-200/90 !bg-white !text-slate-700 dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-200'

const dockScreenLkActive =
  '!border-teal-200 !bg-teal-50 !text-teal-900 dark:!border-teal-800 dark:!bg-teal-950/50 dark:!text-teal-100'

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
  /** Video column; dock clamps and positions within this rect */
  dockBoundsRef: RefObject<HTMLElement | null>
  sidePanelOpen: boolean
  sidePanelTab: SidePanelTab
  onSelectSidePanelTab: (tab: SidePanelTab) => void
}

export default function FloatingControlsDock({
  onLeave,
  onOpenMicDevices,
  onOpenCameraDevices,
  dockBoundsRef,
  sidePanelOpen,
  sidePanelTab,
  onSelectSidePanelTab,
}: Props) {
  const screen = useTrackToggle({ source: Track.Source.ScreenShare })
  const [offset, setOffset] = useState({ x: 0, y: 0 })
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
  }, [sidePanelOpen, reclamp])

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
    }
    pendingOffsetRef.current = null
    setIsDragging(true)
  }

  const onHandlePointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d || e.pointerId !== d.pointerId) return
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
  }

  const panelActive = (tab: SidePanelTab) =>
    sidePanelOpen && sidePanelTab === tab

  return (
    <div
      ref={rootRef}
      className={`pointer-events-auto absolute left-1/2 z-30 w-[calc(100%-1.5rem)] max-w-3xl sm:w-auto sm:min-w-0 ${isDragging ? 'will-change-transform transition-none' : ''}`}
      style={{
        bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
        transform: `translate(calc(-50% + ${offset.x}px), ${offset.y}px)`,
      }}
    >
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.38)] ring-1 ring-black/[0.06] backdrop-blur-md dark:border-slate-600/90 dark:bg-slate-900/95 dark:ring-white/[0.08]">
        <button
          type="button"
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="flex w-full cursor-grab touch-none items-center justify-center border-b border-slate-200/80 bg-white/90 py-2 text-slate-400 active:cursor-grabbing dark:border-slate-600/80 dark:bg-slate-800/90 dark:text-slate-500"
          aria-label="Drag to move call controls"
          title="Drag to move"
        >
          <GripHorizontal className="h-5 w-5" aria-hidden />
        </button>
        <div
          className="flex flex-wrap items-center justify-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4"
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
              className={`${dockBtn} ${screen.enabled ? dockScreenLkActive : dockScreenLkIdle} ${screen.buttonProps.className ?? ''}`}
            >
              <MonitorUp className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => onSelectSidePanelTab('chat')}
              aria-label={panelActive('chat') ? 'Close chat panel' : 'Open chat'}
              title="Chat"
              className={`${dockBtn} ${panelActive('chat') ? 'border-teal-200 bg-teal-50 text-teal-900 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-100' : ''} !rounded-xl`}
            >
              <MessageSquare className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => onSelectSidePanelTab('participants')}
              aria-label={
                panelActive('participants')
                  ? 'Close participants panel'
                  : 'Open participants'
              }
              title="Participants"
              className={`${dockBtn} ${panelActive('participants') ? 'border-teal-200 bg-teal-50 text-teal-900 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-100' : ''} !rounded-xl`}
            >
              <Users className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => onSelectSidePanelTab('settings')}
              aria-label={
                panelActive('settings')
                  ? 'Close settings panel'
                  : 'Open settings'
              }
              title="Settings"
              className={`${dockBtn} ${panelActive('settings') ? 'border-teal-200 bg-teal-50 text-teal-900 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-100' : ''} !rounded-xl`}
            >
              <Settings className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div
            className="hidden h-8 w-px bg-slate-200 dark:bg-slate-600 sm:block"
            aria-hidden
          />

          <LeaveCallButton onLeave={onLeave} className="shrink-0" />
        </div>
      </div>
    </div>
  )
}

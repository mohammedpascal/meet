import { useTrackToggle } from '@livekit/components-react'
import { Track } from 'livekit-client'
import {
  ChevronUp,
  GripVertical,
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
import {
  clampDockOffsetPure,
  dockBtnGlass,
  dockBtnGlassOff,
  dockPanelGlassActive,
  DRAG_THRESHOLD_PX,
  splitChevronBtnGlass,
  splitChevronBtnGlassOff,
  splitMainBtn,
  splitWrapGlassOff,
  splitWrapGlassOn,
  VIEW_MARGIN,
} from './floating-dock-primitives'
import type { SidePanelTab } from './CallSidePanel'
import LeaveCallButton from './LeaveCallButton'

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
        className={`${dockBtnGlass} ${off ? dockBtnGlassOff : ''} ${buttonProps.className ?? ''}`}
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
    <div className={off ? splitWrapGlassOff : splitWrapGlassOn}>
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
        className={`${splitChevronBtnGlass} ${off ? splitChevronBtnGlassOff : ''}`}
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
  const { className: _omitScreenLkClass, ...screenButtonProps } =
    screen.buttonProps
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
  }, [sidePanelOpen, reclamp])

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
    if (!didDrag) setCollapsed((c) => !c)
  }

  const panelActive = (tab: SidePanelTab) =>
    sidePanelOpen && sidePanelTab === tab

  return (
    <div
      ref={rootRef}
      className={`pointer-events-auto absolute right-3 z-30 w-fit max-w-[min(100%-1.5rem,48rem)] sm:right-4`}
      style={{
        bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }}
    >
      <div className="flex min-w-0 flex-row overflow-hidden rounded-2xl bg-white/10 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)] ring-1 ring-white/15 backdrop-blur-sm">
        <button
          type="button"
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="flex h-auto shrink-0 cursor-grab touch-none flex-col items-center justify-center self-stretch border-r border-white/20 bg-white/20 px-2 text-white/65 backdrop-blur-sm active:cursor-grabbing"
          aria-label={
            collapsed
              ? 'Drag to move or tap to show call controls'
              : 'Drag to move or tap to hide call controls'
          }
          title={collapsed ? 'Drag to move; tap to show' : 'Drag to move; tap to hide'}
        >
          <GripVertical className="h-5 w-5" aria-hidden />
        </button>
        <div
          className={`min-w-0 overflow-hidden ${isDragging ? 'transition-none' : 'transition-[max-width,opacity] duration-300 ease-in-out'} ${
            collapsed ? 'max-w-0 opacity-0 pointer-events-none' : 'max-w-[2000px] opacity-100'
          }`}
          aria-hidden={collapsed}
        >
          <div
            className="flex w-max min-w-0 max-w-[min(100vw-3rem,48rem)] flex-wrap items-center justify-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4"
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
              className="hidden h-8 w-px bg-white/20 sm:block"
              aria-hidden
            />

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              {...screenButtonProps}
              disabled={screen.pending || screen.buttonProps.disabled}
              aria-label={
                screen.enabled ? 'Stop screen sharing' : 'Share screen'
              }
              title={screen.enabled ? 'Stop sharing' : 'Share screen'}
              className={`${dockBtnGlass} ${screen.enabled ? dockPanelGlassActive : ''} rounded-xl`}
            >
              <MonitorUp className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => onSelectSidePanelTab('chat')}
              aria-label={panelActive('chat') ? 'Close chat panel' : 'Open chat'}
              title="Chat"
              className={`${dockBtnGlass} ${panelActive('chat') ? dockPanelGlassActive : ''} rounded-xl`}
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
              className={`${dockBtnGlass} ${panelActive('participants') ? dockPanelGlassActive : ''} rounded-xl`}
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
              className={`${dockBtnGlass} ${panelActive('settings') ? dockPanelGlassActive : ''} rounded-xl`}
            >
              <Settings className="h-5 w-5" aria-hidden />
            </button>
            </div>

            <div
              className="hidden h-8 w-px bg-white/20 sm:block"
              aria-hidden
            />

            <LeaveCallButton
              onLeave={onLeave}
              variant="glass"
              className="shrink-0"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export const VIEW_MARGIN = 8
/** Movement past this (px) counts as drag; below is treated as tap (collapse). */
export const DRAG_THRESHOLD_PX = 8

/**
 * Clamp translate offset without touching DOM. `rectAtRef` must be
 * getBoundingClientRect() when the dock was at (refOx, refOy).
 * Moving to (nx, ny) shifts the box by (nx - refOx, ny - refOy).
 */
export function clampDockOffsetPure(
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

export const dockBtn =
  'inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-700 shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/45 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'

export const dockBtnOff =
  'border-rose-200 bg-rose-50 text-rose-800 ring-2 ring-rose-300/60 dark:border-rose-900/50 dark:bg-rose-950/60 dark:text-rose-100 dark:ring-rose-800/50'

export const splitWrapOn =
  'inline-flex overflow-hidden rounded-xl border border-slate-200/90 bg-white text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'

export const splitWrapOff =
  'inline-flex overflow-hidden rounded-xl border-2 border-rose-200 bg-rose-50 text-rose-800 shadow-sm ring-2 ring-rose-300/50 dark:border-rose-900/50 dark:bg-rose-950/60 dark:text-rose-100 dark:ring-rose-800/50'

export const splitMainBtn =
  'inline-flex h-12 w-12 shrink-0 items-center justify-center !rounded-none border-0 !bg-transparent p-0 !text-inherit transition focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-teal-500/45 focus-visible:ring-offset-0 disabled:opacity-50 dark:!bg-transparent dark:!text-inherit dark:focus-visible:ring-teal-400/40'

export const splitChevronBtn =
  'inline-flex h-12 w-9 shrink-0 items-center justify-center !rounded-none border-0 border-l border-slate-200/90 !bg-transparent p-0 !text-inherit transition hover:bg-black/[0.04] focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-teal-500/45 focus-visible:ring-offset-0 dark:border-slate-600 dark:hover:bg-white/[0.06]'

export const splitChevronBtnOff =
  'border-l-rose-300/70 hover:bg-rose-100/80 dark:border-rose-700/50 dark:hover:bg-rose-900/40'

export const dockScreenLkIdle =
  '!border-slate-200/90 !bg-white !text-slate-700 dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-200'

export const dockScreenLkActive =
  '!border-teal-200 !bg-teal-50 !text-teal-900 dark:!border-teal-800 dark:!bg-teal-950/50 dark:!text-teal-100'

/** Frosted icon buttons over video (aligned with dock drag handle) */
export const dockBtnGlass =
  'inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/20 text-white/85 backdrop-blur-sm shadow-sm transition hover:bg-white/28 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/35 disabled:opacity-50'

export const dockBtnGlassOff =
  'border border-white/20 bg-rose-500/25 text-rose-100 ring-0 hover:bg-rose-500/35'

export const splitWrapGlassOn =
  'inline-flex overflow-hidden rounded-xl border border-white/20 bg-white/20 text-white/85 backdrop-blur-sm shadow-sm'

export const splitWrapGlassOff =
  'inline-flex overflow-hidden rounded-xl border border-white/20 bg-rose-500/22 text-rose-100 backdrop-blur-sm shadow-sm ring-0'

export const splitChevronBtnGlass =
  'inline-flex h-12 w-9 shrink-0 items-center justify-center !rounded-none border-0 border-l border-white/25 !bg-transparent p-0 !text-inherit transition hover:bg-white/15 focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-0 disabled:opacity-50'

export const splitChevronBtnGlassOff =
  'border-l border-white/25 hover:bg-rose-600/20'

export const dockPanelGlassActive =
  'border-teal-400/50 bg-teal-500/28 text-teal-50 ring-1 ring-teal-300/30 hover:bg-teal-500/36'

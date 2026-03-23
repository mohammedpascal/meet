import { ChevronUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  splitChevronBtn,
  splitChevronBtnOff,
  splitMainBtn,
  splitWrapOff,
  splitWrapOn,
} from '../call/floating-dock-primitives'

type Props = {
  enabled: boolean
  labelOn: string
  labelOff: string
  IconOn: LucideIcon
  IconOff: LucideIcon
  onToggle: () => void
  onOpenDeviceList: () => void
  deviceListLabel: string
  disabled: boolean
}

/** Mic/camera split control matching the in-call floating dock. */
export default function PrecallMediaToggle({
  enabled,
  labelOn,
  labelOff,
  IconOn,
  IconOff,
  onToggle,
  onOpenDeviceList,
  deviceListLabel,
  disabled,
}: Props) {
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

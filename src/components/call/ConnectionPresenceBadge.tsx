import { ConnectionState } from 'livekit-client'
import CallOverlayPill from './CallOverlayPill'

type Props = {
  connection: ConnectionState
  participantCount: number
  className?: string
}

function presenceLabel(
  connection: ConnectionState,
  n: number,
): { label: string; ariaLabel: string } {
  if (connection === ConnectionState.Disconnected) {
    return {
      label: 'Unable to connect',
      ariaLabel: 'Connection failed, unable to connect',
    }
  }
  if (connection === ConnectionState.Connecting) {
    return {
      label: 'Connecting…',
      ariaLabel: 'Connecting to the call',
    }
  }
  if (connection === ConnectionState.Reconnecting) {
    return {
      label: 'Reconnecting…',
      ariaLabel: 'Reconnecting to the call',
    }
  }
  if (connection === ConnectionState.Connected) {
    if (n <= 1) {
      return {
        label: 'Waiting for participant',
        ariaLabel: 'Connected, waiting for another participant',
      }
    }
    if (n > 999) {
      return {
        label: '999+ participants',
        ariaLabel: 'More than 999 participants in the call',
      }
    }
    return {
      label: `${n} participants`,
      ariaLabel: `${n} participants in the call`,
    }
  }
  return {
    label: '…',
    ariaLabel: 'Connection status unknown',
  }
}

function presenceDotClass(connection: ConnectionState): string {
  switch (connection) {
    case ConnectionState.Disconnected:
      return 'bg-red-400 shadow-[0_0_0_3px_rgba(248,113,113,0.25)]'
    case ConnectionState.Connecting:
    case ConnectionState.Reconnecting:
      return 'bg-amber-400 animate-pulse'
    case ConnectionState.Connected:
      return 'bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.25)]'
    default:
      return 'bg-zinc-400'
  }
}

/** Single pill: LiveKit connection state + in-room participant count semantics. */
export default function ConnectionPresenceBadge({
  connection,
  participantCount,
  className = '',
}: Props) {
  const { label, ariaLabel } = presenceLabel(connection, participantCount)

  return (
    <CallOverlayPill
      dotClassName={presenceDotClass(connection)}
      className={className}
      aria-label={ariaLabel}
    >
      {label}
    </CallOverlayPill>
  )
}

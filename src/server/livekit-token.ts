import { createServerFn } from '@tanstack/react-start'

const DEFAULT_LIVEKIT_URL = 'wss://meet.successta.co'

function parseJoinInput(input: unknown): { room: string; name: string } {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid request')
  }
  const rec = input as Record<string, unknown>
  const room = typeof rec.room === 'string' ? rec.room.trim() : ''
  const name = typeof rec.name === 'string' ? rec.name.trim() : ''
  if (!room || !name) {
    throw new Error('Room and display name are required')
  }
  if (room.length > 64 || !/^[\w.-]+$/.test(room)) {
    throw new Error(
      'Room name: use up to 64 characters (letters, numbers, dots, underscores, hyphens)',
    )
  }
  if (name.length < 1 || name.length > 80) {
    throw new Error('Display name must be 1–80 characters')
  }
  return { room, name }
}

/** Mint a participant token. Requires LIVEKIT_API_KEY and LIVEKIT_API_SECRET. Optional LIVEKIT_URL (default wss://meet.successta.co). */
export const getLiveKitToken = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => parseJoinInput(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LIVEKIT_API_KEY
    const apiSecret = process.env.LIVEKIT_API_SECRET
    if (!apiKey || !apiSecret) {
      throw new Error(
        'Server missing LIVEKIT_API_KEY / LIVEKIT_API_SECRET. Add them to your environment.',
      )
    }
    const { AccessToken } = await import('livekit-server-sdk')
    const serverUrl = process.env.LIVEKIT_URL ?? DEFAULT_LIVEKIT_URL
    const tokenModel = new AccessToken(apiKey, apiSecret, {
      identity: crypto.randomUUID(),
      name: data.name,
      ttl: '6h',
    })
    tokenModel.addGrant({
      roomJoin: true,
      room: data.room,
      canPublish: true,
      canSubscribe: true,
    })
    const token = await tokenModel.toJwt()
    return { token, serverUrl }
  })

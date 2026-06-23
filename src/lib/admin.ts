import crypto from 'crypto'

const PASSWORD = process.env.ADMIN_PASSWORD || 'admin'

export function createToken(): string {
  const payload = JSON.stringify({ role: 'admin', exp: Date.now() + 24 * 60 * 60 * 1000 })
  const hmac = crypto.createHmac('sha256', PASSWORD).update(payload).digest('hex')
  return Buffer.from(JSON.stringify({ payload, hmac })).toString('base64')
}

export function verifyToken(token: string): boolean {
  try {
    const { payload, hmac } = JSON.parse(Buffer.from(token, 'base64').toString())
    const expected = crypto.createHmac('sha256', PASSWORD).update(payload).digest('hex')
    const { exp } = JSON.parse(payload)
    return hmac === expected && exp > Date.now()
  } catch {
    return false
  }
}

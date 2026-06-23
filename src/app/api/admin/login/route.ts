import { createToken } from '@/lib/admin'

export async function POST(request: Request) {
  const { password } = await request.json()

  if (password === process.env.ADMIN_PASSWORD) {
    const token = createToken()
    return Response.json({ token })
  }

  return Response.json({ error: 'Invalid password' }, { status: 401 })
}

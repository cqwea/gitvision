import { getSupabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/admin'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabase()
  const { id } = await params
  const body = await request.json()

  const { data: existing } = await (supabase.from('reviews') as any).select('author_token').eq('id', Number(id)).single() as { data: { author_token: string | null } | null }
  if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })

  const authHeader = request.headers.get('authorization')?.replace('Bearer ', '')
  const authorToken = body.author_token

  if (!authorToken || existing.author_token !== authorToken) {
    if (!authHeader || !body._admin) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const updates: Record<string, unknown> = {}
  if (body.rating) updates.rating = body.rating
  if (body.text !== undefined) updates.text = body.text
  if (body.pros !== undefined) updates.pros = body.pros
  if (body.cons !== undefined) updates.cons = body.cons

  const { data, error } = await (supabase.from('reviews') as any).update(updates).eq('id', Number(id)).select().single() as unknown as { data: Record<string, unknown> | null; error: { message: string } | null }
  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json(data)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabase()
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || !verifyToken(token)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { error } = await (supabase.from('reviews') as any).delete().eq('id', Number(id)) as { error: { message: string } | null }
  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json({ success: true })
}

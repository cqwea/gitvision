import { getSupabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/admin'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabase()
  const { id } = await params

  const { data: model } = await supabase
    .from('models')
    .select('*')
    .eq('id', Number(id))
    .single() as { data: Record<string, unknown> | null }

  if (!model) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('model_id', Number(id))
    .order('created_at', { ascending: false })

  return Response.json({ ...model, reviews })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = getSupabase()
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || !verifyToken(token)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()

  const updates: Record<string, unknown> = {}
  if (body.name) updates.name = body.name
  if (body.provider) updates.provider = body.provider
  if (body.description !== undefined) updates.description = body.description
  if (body.category) updates.category = body.category

  const { data, error } = await (supabase.from('models') as any).update(updates).eq('id', Number(id)).select().single() as unknown as { data: Record<string, unknown> | null; error: { message: string } | null }
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
  const { error } = await (supabase.from('models') as any).delete().eq('id', Number(id)) as { error: { message: string } | null }
  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json({ success: true })
}

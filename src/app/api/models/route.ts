import { getSupabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/admin'

export async function GET() {
  const supabase = getSupabase()
  const { data: models } = await supabase.from('models').select('*') as { data: Record<string, unknown>[] | null }
  const { data: reviews } = await supabase.from('reviews').select('model_id, rating') as { data: { model_id: number; rating: number }[] | null }

  const stats: Record<number, { count: number; total: number }> = {}
  for (const r of reviews || []) {
    if (!stats[r.model_id]) stats[r.model_id] = { count: 0, total: 0 }
    stats[r.model_id].count++
    stats[r.model_id].total += r.rating
  }

  const result = (models || []).map(m => {
    const id = m.id as number
    return { ...m, review_count: stats[id]?.count || 0, avg_rating: stats[id] ? Math.round((stats[id].total / stats[id].count) * 10) / 10 : 0 }
  }).sort((a, b) => b.review_count - a.review_count)

  return Response.json(result)
}

export async function POST(request: Request) {
  const supabase = getSupabase()
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || !verifyToken(token)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  if (!body.name || !body.provider) {
    return Response.json({ error: 'Name and provider are required' }, { status: 400 })
  }

  const { data, error } = await (supabase.from('models') as any).insert({
    name: body.name,
    provider: body.provider,
    description: body.description || null,
    category: body.category || 'Text',
  }).select().single() as { data: Record<string, unknown> | null; error: unknown }

  if (error) return Response.json({ error: (error as { message: string }).message }, { status: 400 })
  return Response.json(data, { status: 201 })
}

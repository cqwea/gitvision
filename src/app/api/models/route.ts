import { getSupabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/admin'

export async function GET(request: Request) {
  const supabase = getSupabase()
  const url = new URL(request.url)
  const search = url.searchParams.get('search') || ''
  const category = url.searchParams.get('category') || ''
  const provider = url.searchParams.get('provider') || ''
  const sort = url.searchParams.get('sort') || 'popular'
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit')) || 12))

  let query = (supabase.from('models') as any).select('*', { count: 'exact' })
  if (search) query = query.or(`name.ilike.%${search}%,provider.ilike.%${search}%`)
  if (category) query = query.eq('category', category)
  if (provider) query = query.eq('provider', provider)

  const { data: models, count } = await query as { data: Record<string, unknown>[] | null; count: number | null }

  const { data: reviews } = await supabase.from('reviews').select('model_id, rating') as { data: { model_id: number; rating: number }[] | null }

  const stats: Record<number, { count: number; total: number }> = {}
  for (const r of reviews || []) {
    if (!stats[r.model_id]) stats[r.model_id] = { count: 0, total: 0 }
    stats[r.model_id].count++
    stats[r.model_id].total += r.rating
  }

  let result = (models || []).map(m => {
    const id = m.id as number
    return { ...m, review_count: stats[id]?.count || 0, avg_rating: stats[id] ? Math.round((stats[id].total / stats[id].count) * 10) / 10 : 0 }
  })

  if (sort === 'newest') result.sort((a: any, b: any) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime())
  else if (sort === 'rated') result.sort((a: any, b: any) => b.avg_rating - a.avg_rating || b.review_count - a.review_count)
  else result.sort((a: any, b: any) => b.review_count - a.review_count || b.avg_rating - a.avg_rating)

  const total = result.length
  const paginated = result.slice((page - 1) * limit, page * limit)

  const { data: providers } = await (supabase.from('models') as any).select('provider').limit(100) as { data: { provider: string }[] | null }
  const uniqueProviders = [...new Set((providers || []).map(p => p.provider))].sort()

  return Response.json({ models: paginated, total, page, limit, totalPages: Math.ceil(total / limit), providers: uniqueProviders })
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
  }).select().single() as unknown as { data: Record<string, unknown> | null; error: { message: string } | null }

  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json(data, { status: 201 })
}

import { getSupabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/admin'

export async function POST(request: Request) {
  const supabase = getSupabase()
  const body = await request.json()

  if (!body.model_id || !body.rating || body.rating < 1 || body.rating > 5) {
    return Response.json({ error: 'Invalid model_id or rating (1-5 required)' }, { status: 400 })
  }

  const { data, error } = await (supabase.from('reviews') as any).insert({
    model_id: body.model_id,
    rating: body.rating,
    text: body.text || null,
    pros: body.pros || null,
    cons: body.cons || null,
    author: body.author || null,
    author_token: body.author_token || null,
  }).select().single() as unknown as { data: Record<string, unknown> | null; error: { message: string } | null }

  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json(data, { status: 201 })
}

export async function GET(request: Request) {
  const supabase = getSupabase()
  const url = new URL(request.url)
  const all = url.searchParams.get('all')

  if (all === 'true') {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token || !verifyToken(token)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: reviews } = await (supabase as any)
      .from('reviews')
      .select('*, models(name)')
      .order('created_at', { ascending: false }) as { data: any[] | null }

    const result = (reviews || []).map((r: any) => ({
      ...r, model_name: r.models?.name || null, models: undefined,
    }))

    return Response.json(result)
  }

  return Response.json([])
}

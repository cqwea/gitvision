import { getSupabase } from '@/lib/supabase'

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

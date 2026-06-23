import { getSupabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/admin'

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

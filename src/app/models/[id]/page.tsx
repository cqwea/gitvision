import { getSupabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import ModelDetailClient from './ModelDetailClient'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data: model } = await (getSupabase().from('models') as any).select('name, provider').eq('id', Number(id)).single() as { data: { name: string; provider: string } | null }
  if (!model) return { title: 'Not Found' }
  return { title: `${model.name} — AI Review Hub`, description: `Reviews for ${model.name} by ${model.provider}` }
}

export default async function ModelDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = getSupabase()
  const { data: model, error } = await (supabase.from('models') as any).select('*').eq('id', Number(id)).single() as { data: any; error: unknown }

  if (error || !model) notFound()

  const { data: reviews } = await (supabase.from('reviews') as any)
    .select('*')
    .eq('model_id', Number(id))
    .order('created_at', { ascending: false }) as { data: any[] | null }

  const ratings = (reviews || []).map(r => r.rating)
  const avgRating = ratings.length > 0 ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : 0

  const providerGradients: Record<string, string> = {
    OpenAI: 'from-emerald-500 to-green-600',
    Anthropic: 'from-amber-500 to-yellow-600',
    Google: 'from-blue-500 to-indigo-600',
    Meta: 'from-violet-500 to-purple-600',
    Mistral: 'from-orange-500 to-red-600',
    Midjourney: 'from-pink-500 to-rose-600',
    'Stability AI': 'from-cyan-500 to-teal-600',
    Perplexity: 'from-teal-500 to-emerald-600',
    xAI: 'from-slate-600 to-slate-700',
  }

  const gradient = providerGradients[model.provider as string] || 'from-indigo-500 to-violet-600'

  return (
    <div>
      <div className="mb-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-300 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to models
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-3xl glass-card border-slate-800 p-6 sm:p-8 mb-8 shadow-2xl">
        <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${gradient}`} />
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${gradient} flex items-center justify-center text-white font-black text-2xl shrink-0 shadow-lg`}>
            {model.provider.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{model.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-450 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-850">{model.provider}</span>
              <span className="text-slate-700 text-sm">·</span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/10">{model.category}</span>
              {reviews && reviews.length > 0 && (
                <>
                  <span className="text-slate-700 text-sm">·</span>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-sm font-extrabold text-white">{avgRating}</span>
                    <span className="text-xs text-slate-500 font-semibold">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
                  </div>
                </>
              )}
            </div>
            {model.description && <p className="text-slate-400 text-sm mt-4 max-w-3xl leading-relaxed">{model.description}</p>}
          </div>
        </div>
      </div>

      <ModelDetailClient modelId={model.id} initialReviews={reviews || []} />
    </div>
  )
}

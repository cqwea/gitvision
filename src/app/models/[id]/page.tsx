import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ModelDetailClient from './ModelDetailClient'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data: model } = await supabase.from('models').select('name, provider').eq('id', Number(id)).single()
  if (!model) return { title: 'Not Found' }
  return { title: `${model.name} — AI Review Hub`, description: `Reviews for ${model.name} by ${model.provider}` }
}

export default async function ModelDetailPage({ params }: Props) {
  const { id } = await params
  const { data: model, error } = await supabase.from('models').select('*').eq('id', Number(id)).single()

  if (error || !model) notFound()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('model_id', Number(id))
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{model.name}</h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-sm font-medium text-gray-500">{model.provider}</span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-sm text-gray-500">{model.category}</span>
        </div>
        {model.description && <p className="text-gray-600 mt-3 max-w-2xl">{model.description}</p>}
      </div>
      <ModelDetailClient modelId={model.id} initialReviews={reviews || []} />
    </div>
  )
}

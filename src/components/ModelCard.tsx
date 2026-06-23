import Link from 'next/link'
import StarRating from './StarRating'

interface ModelCardProps {
  id: number
  name: string
  provider: string
  category: string
  avgRating: number
  reviewCount: number
}

const providerStyles: Record<string, { color: string; gradient: string }> = {
  OpenAI: { color: 'from-emerald-500 to-green-600', gradient: 'from-emerald-400/20 to-green-400/10' },
  Anthropic: { color: 'from-amber-500 to-yellow-600', gradient: 'from-amber-400/20 to-yellow-400/10' },
  Google: { color: 'from-blue-500 to-indigo-600', gradient: 'from-blue-400/20 to-indigo-400/10' },
  Meta: { color: 'from-violet-500 to-purple-600', gradient: 'from-violet-400/20 to-purple-400/10' },
  Mistral: { color: 'from-orange-500 to-red-600', gradient: 'from-orange-400/20 to-red-400/10' },
  Midjourney: { color: 'from-pink-500 to-rose-600', gradient: 'from-pink-400/20 to-rose-400/10' },
  'Stability AI': { color: 'from-cyan-500 to-teal-600', gradient: 'from-cyan-400/20 to-teal-400/10' },
  Perplexity: { color: 'from-teal-500 to-emerald-600', gradient: 'from-teal-400/20 to-emerald-400/10' },
  xAI: { color: 'from-slate-600 to-slate-700', gradient: 'from-slate-400/20 to-slate-400/10' },
}

const categoryColors: Record<string, string> = {
  Text: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  Image: 'bg-pink-50 text-pink-700 ring-pink-200',
  Video: 'bg-violet-50 text-violet-700 ring-violet-200',
  Audio: 'bg-amber-50 text-amber-700 ring-amber-200',
  Code: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
}

export default function ModelCard({ id, name, provider, category, avgRating, reviewCount }: ModelCardProps) {
  const style = providerStyles[provider] || { color: 'from-slate-500 to-slate-600', gradient: 'from-slate-400/20 to-slate-400/10' }
  const initial = provider.charAt(0).toUpperCase()

  return (
    <Link
      href={`/models/${id}`}
      className="group block bg-white rounded-2xl border border-slate-200/70 overflow-hidden card-hover hover:border-indigo-200/50"
    >
      <div className={`h-1.5 bg-linear-to-r ${style.color}`} />
      <div className="p-5">
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${style.color} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm`}>
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
              {name}
            </h3>
            <span className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600`}>
              {provider}
            </span>
          </div>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ring-1 shrink-0 ${categoryColors[category] || 'bg-slate-50 text-slate-600 ring-slate-200'}`}>
            {category}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <StarRating value={avgRating} interactive={false} size="sm" />
            <span className="text-sm font-medium text-slate-600">
              {reviewCount > 0 ? avgRating.toFixed(1) : '—'}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      </div>
    </Link>
  )
}

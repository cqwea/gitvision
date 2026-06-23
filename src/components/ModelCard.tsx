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

const providerColors: Record<string, string> = {
  OpenAI: 'bg-green-100 text-green-800',
  Anthropic: 'bg-yellow-100 text-yellow-800',
  Google: 'bg-blue-100 text-blue-800',
  Meta: 'bg-purple-100 text-purple-800',
  Mistral: 'bg-orange-100 text-orange-800',
  Midjourney: 'bg-pink-100 text-pink-800',
  'Stability AI': 'bg-indigo-100 text-indigo-800',
  Perplexity: 'bg-teal-100 text-teal-800',
  xAI: 'bg-gray-100 text-gray-800',
}

export default function ModelCard({ id, name, provider, category, avgRating, reviewCount }: ModelCardProps) {
  const initial = provider.charAt(0).toUpperCase()

  return (
    <Link href={`/models/${id}`} className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 truncate">{name}</h3>
          <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded ${providerColors[provider] || 'bg-gray-100 text-gray-800'}`}>
            {provider}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded shrink-0">{category}</span>
        <div className="flex items-center gap-1.5 ml-auto">
          <StarRating value={avgRating} interactive={false} size="sm" />
          <span className="text-sm text-gray-500">{reviewCount > 0 ? avgRating.toFixed(1) : '—'}</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">{reviewCount} review{reviewCount !== 1 ? 's' : ''}</p>
    </Link>
  )
}

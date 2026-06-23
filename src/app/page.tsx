import { supabase } from '@/lib/supabase'
import ModelCard from '@/components/ModelCard'

interface ReviewRow {
  rating: number
}

interface ModelRow {
  id: number
  name: string
  provider: string
  description: string | null
  category: string
  image_url: string | null
  created_at: string
  reviews: ReviewRow[]
}

export default async function Home() {
  const { data: models } = await supabase
    .from('models')
    .select('*, reviews(rating)')
    .order('created_at', { ascending: false }) as { data: ModelRow[] | null }

  const modelsWithStats = (models || []).map(m => {
    const ratings = m.reviews.map(r => r.rating)
    const count = ratings.length
    const avg = count > 0 ? ratings.reduce((a, b) => a + b, 0) / count : 0
    return { ...m, avg_rating: Math.round(avg * 10) / 10, review_count: count }
  }).sort((a, b) => b.review_count - a.review_count)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Model Reviews</h1>
        <p className="text-gray-500 mt-1">Rate and review the latest AI models. Sorted by popularity.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modelsWithStats.map(m => (
          <ModelCard
            key={m.id}
            id={m.id}
            name={m.name}
            provider={m.provider}
            category={m.category}
            avgRating={m.avg_rating}
            reviewCount={m.review_count}
          />
        ))}
      </div>
    </div>
  )
}

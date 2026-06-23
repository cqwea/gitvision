'use client'

import { useState } from 'react'
import ReviewCard from '@/components/ReviewCard'
import ReviewForm from '@/components/ReviewForm'

interface Review {
  id: number
  model_id: number
  rating: number
  text: string | null
  pros: string | null
  cons: string | null
  author: string | null
  created_at: string
}

export default function ModelDetailClient({
  modelId,
  initialReviews,
}: {
  modelId: number
  initialReviews: Review[]
}) {
  const [reviews, setReviews] = useState(initialReviews)
  const [loading, setLoading] = useState(false)

  async function refreshReviews() {
    setLoading(true)
    const res = await fetch(`/api/models/${modelId}`)
    if (res.ok) {
      const data = await res.json()
      setReviews(data.reviews || [])
    }
    setLoading(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Reviews
          <span className="text-gray-400 font-normal text-base ml-2">({reviews.length})</span>
        </h2>
        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-400">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className={`space-y-4 ${loading ? 'opacity-50' : ''}`}>
            {reviews.map(r => (
              <ReviewCard key={r.id} {...r} createdAt={r.created_at} />
            ))}
          </div>
        )}
      </div>
      <div>
        <ReviewForm modelId={modelId} onSuccess={refreshReviews} />
      </div>
    </div>
  )
}

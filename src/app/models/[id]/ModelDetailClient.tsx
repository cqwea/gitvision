'use client'

import { useState } from 'react'
import ReviewCard from '@/components/ReviewCard'
import ReviewForm from '@/components/ReviewForm'

interface Review {
  id: number; model_id: number; rating: number; text: string | null
  pros: string | null; cons: string | null; author: string | null; created_at: string; author_token: string | null
}

export default function ModelDetailClient({ modelId, initialReviews }: { modelId: number; initialReviews: Review[] }) {
  const [reviews, setReviews] = useState(initialReviews)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  async function refreshReviews() {
    setLoading(true)
    const res = await fetch(`/api/models/${modelId}`)
    if (res.ok) {
      const data = await res.json()
      setReviews(data.reviews || [])
    }
    setLoading(false)
  }

  const myToken = typeof window !== 'undefined' ? localStorage.getItem('reviewer_token') : null

  const editingReview = editingId ? reviews.find(r => r.id === editingId) : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Reviews
            <span className="text-slate-500 font-semibold text-sm ml-2">({reviews.length})</span>
          </h2>
        </div>
        {reviews.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-slate-900/60 flex items-center justify-center mx-auto mb-4 border border-slate-800 shadow-inner">
              <svg className="w-7 h-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
            <p className="text-slate-350 font-bold">No reviews yet</p>
            <p className="text-slate-500 text-sm mt-1">Be the first to share your experience with this model!</p>
          </div>
        ) : (
          <div className={`space-y-4 transition-all duration-255 ${loading ? 'opacity-40 scale-[0.99]' : ''}`}>
            {reviews.map(r => (
              <ReviewCard
                key={r.id} id={r.id} rating={r.rating} text={r.text} pros={r.pros}
                cons={r.cons} author={r.author} createdAt={r.created_at}
                onEdit={myToken && r.author_token === myToken ? () => setEditingId(r.id) : undefined}
              />
            ))}
          </div>
        )}
      </div>
      <div>
        {editingReview ? (
          <ReviewForm
            key={editingReview.id}
            modelId={modelId}
            onSuccess={() => { setEditingId(null); refreshReviews() }}
            initial={{ id: editingReview.id, rating: editingReview.rating, text: editingReview.text, pros: editingReview.pros, cons: editingReview.cons }}
          />
        ) : (
          <ReviewForm modelId={modelId} onSuccess={refreshReviews} />
        )}
      </div>
    </div>
  )
}

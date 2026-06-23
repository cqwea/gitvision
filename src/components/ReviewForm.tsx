'use client'

import { useState } from 'react'
import StarRating from './StarRating'

interface ReviewFormProps {
  modelId: number
  onSuccess: () => void
}

export default function ReviewForm({ modelId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [author, setAuthor] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating) { setError('Please select a rating'); return }
    if (!text.trim() && !pros.trim() && !cons.trim()) { setError('Please fill in at least one field'); return }
    setSubmitting(true)
    setError('')

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model_id: modelId, rating, text: text.trim() || null, pros: pros.trim() || null, cons: cons.trim() || null, author: author.trim() || null }),
    })

    if (res.ok) {
      setRating(0); setText(''); setPros(''); setCons(''); setAuthor('')
      onSuccess()
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to submit review')
    }
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 sticky top-8">
      <h3 className="font-semibold text-lg text-gray-900">Write a Review</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating *</label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Review</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Share your experience with this model..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1.5">Pros</label>
          <input
            value={pros}
            onChange={e => setPros(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="What did you like?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-red-700 mb-1.5">Cons</label>
          <input
            value={cons}
            onChange={e => setCons(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="What could be better?"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Name (optional)</label>
        <input
          value={author}
          onChange={e => setAuthor(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Leave blank for anonymous"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}

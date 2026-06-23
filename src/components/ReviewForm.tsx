'use client'

import { useState, useEffect } from 'react'
import StarRating from './StarRating'

interface ReviewFormProps {
  modelId: number
  onSuccess: () => void
  initial?: { id: number; rating: number; text: string | null; pros: string | null; cons: string | null }
}

function getToken(): string {
  if (typeof window === 'undefined') return ''
  let t = localStorage.getItem('reviewer_token')
  if (!t) { t = crypto.randomUUID(); localStorage.setItem('reviewer_token', t) }
  return t
}

export default function ReviewForm({ modelId, onSuccess, initial }: ReviewFormProps) {
  const [rating, setRating] = useState(initial?.rating || 0)
  const [text, setText] = useState(initial?.text || '')
  const [pros, setPros] = useState(initial?.pros || '')
  const [cons, setCons] = useState(initial?.cons || '')
  const [author, setAuthor] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating) { setError('Please select a rating'); return }
    if (!text.trim() && !pros.trim() && !cons.trim()) { setError('Please fill in at least one field'); return }
    setSubmitting(true); setError('')

    const token = getToken()
    const body: Record<string, unknown> = { model_id: modelId, rating, text: text.trim() || null, pros: pros.trim() || null, cons: cons.trim() || null, author: author.trim() || null, author_token: token }

    let res: Response
    if (initial) {
      res = await fetch(`/api/reviews/${initial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, _admin: false }),
      })
    } else {
      res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    }

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
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5 sticky top-24 shadow-2xl border-slate-800">
      <div className="flex items-center gap-3 pb-3.5 border-b border-slate-900">
        <div className="w-8.5 h-8.5 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </div>
        <h3 className="font-bold text-lg text-white tracking-tight">{initial ? 'Edit Your Review' : 'Write a Review'}</h3>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Rating <span className="text-rose-500">*</span></label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Review Comment</label>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
          className="w-full rounded-xl border border-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-900/40 text-slate-100 placeholder-slate-500 resize-none transition-all shadow-inner"
          placeholder="Share your detailed experience with this model..." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-emerald-450 mb-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></svg>
            Pros
          </label>
          <input value={pros} onChange={e => setPros(e.target.value)}
            className="w-full rounded-xl border border-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-900/40 text-slate-100 placeholder-slate-500 transition-all shadow-inner"
            placeholder="What works well?" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-rose-450 mb-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>
            Cons
          </label>
          <input value={cons} onChange={e => setCons(e.target.value)}
            className="w-full rounded-xl border border-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-slate-900/40 text-slate-100 placeholder-slate-500 transition-all shadow-inner"
            placeholder="What needs improvement?" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Display Name <span className="text-slate-600 font-medium font-normal">(optional)</span></label>
        <input value={author} onChange={e => setAuthor(e.target.value)}
          className="w-full rounded-xl border border-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-900/40 text-slate-100 placeholder-slate-500 transition-all shadow-inner"
          placeholder="Anonymous" />
      </div>

      {error && <div className="bg-rose-950/20 border border-rose-900/30 rounded-xl p-3.5"><p className="text-rose-400 text-xs font-semibold leading-relaxed">{error}</p></div>}

      <button type="submit" disabled={submitting}
        className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-650 hover:to-purple-700 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-650/15 cursor-pointer">
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Submitting Review...
          </span>
        ) : initial ? 'Update Review' : 'Submit Review'}
      </button>
    </form>
  )
}

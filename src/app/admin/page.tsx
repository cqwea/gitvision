'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Model {
  id: number
  name: string
  provider: string
  category: string
  review_count: number
}

interface Review {
  id: number
  model_id: number
  rating: number
  text: string | null
  author: string | null
  created_at: string
  model_name?: string
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [models, setModels] = useState<Model[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [tab, setTab] = useState<'models' | 'reviews'>('models')

  useEffect(() => {
    const saved = localStorage.getItem('admin_token')
    if (saved) setToken(saved)
  }, [])

  const authedFetch = useCallback(async (url: string, options?: RequestInit) => {
    return fetch(url, {
      ...options,
      headers: { ...options?.headers, Authorization: `Bearer ${token}` },
    })
  }, [token])

  useEffect(() => {
    if (!token) return
    fetch('/api/models').then(r => r.json()).then(setModels)
    authedFetch('/api/reviews?all=true').then(r => r.json()).then(setReviews).catch(() => {})
  }, [token, authedFetch])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      const { token: t } = await res.json()
      localStorage.setItem('admin_token', t)
      setToken(t)
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  function handleLogout() {
    localStorage.removeItem('admin_token')
    setToken(null)
  }

  async function deleteReview(id: number) {
    if (!confirm('Delete this review?')) return
    const res = await authedFetch(`/api/reviews/${id}`, { method: 'DELETE' })
    if (res.ok) setReviews(reviews.filter(r => r.id !== id))
  }

  if (!token) {
    return (
      <div className="max-w-sm mx-auto mt-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleLogin} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link href="/admin/models/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            + Add Model
          </Link>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Logout
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button onClick={() => setTab('models')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'models' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          Models ({models.length})
        </button>
        <button onClick={() => setTab('reviews')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'reviews' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          Reviews ({reviews.length})
        </button>
      </div>

      {tab === 'models' ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Provider</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Reviews</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {models.map(m => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{m.name}</td>
                  <td className="px-4 py-3 text-gray-600">{m.provider}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{m.category}</span></td>
                  <td className="px-4 py-3 text-center text-gray-600">{m.review_count}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/models/${m.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium mr-3">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Model</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Author</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Rating</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Review</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.model_name || `#${r.model_id}`}</td>
                  <td className="px-4 py-3 text-gray-600">{r.author || 'Anonymous'}</td>
                  <td className="px-4 py-3 text-center">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{r.text || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 text-right whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => deleteReview(r.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

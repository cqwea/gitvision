'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Model { id: number; name: string; provider: string; category: string; review_count: number }
interface Review { id: number; model_id: number; rating: number; text: string | null; author: string | null; created_at: string; model_name?: string }

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
    return fetch(url, { ...options, headers: { ...options?.headers, Authorization: `Bearer ${token}` } })
  }, [token])

  useEffect(() => {
    if (!token) return
    fetch('/api/models').then(r => r.json()).then(setModels)
    authedFetch('/api/reviews?all=true').then(r => r.json()).then(setReviews).catch(() => {})
  }, [token, authedFetch])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
    })
    if (res.ok) {
      const { token: t } = await res.json()
      localStorage.setItem('admin_token', t)
      setToken(t); setError('')
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

  async function deleteModel(id: number) {
    if (!confirm('Delete this model and all its reviews?')) return
    const res = await authedFetch(`/api/models/${id}`, { method: 'DELETE' })
    if (res.ok) setModels(models.filter(m => m.id !== id))
  }

  const totalReviews = reviews.length
  const totalModels = models.length

  if (!token) {
    return (
      <div className="max-w-sm mx-auto mt-20">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-slate-500 text-sm mt-1">Enter your password to continue</p>
        </div>
        <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-slate-200/70 p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-shadow"
              autoFocus />
          </div>
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
              <p className="text-rose-600 text-sm font-medium">{error}</p>
            </div>
          )}
          <button type="submit" className="w-full bg-linear-to-r from-indigo-500 to-violet-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-violet-700 transition-all duration-200 shadow-md">
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Manage models and reviews</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/models/new"
            className="inline-flex items-center gap-1.5 bg-linear-to-r from-indigo-500 to-violet-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-violet-700 transition-all duration-200 shadow-md">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Model
          </Link>
          <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-slate-600 transition-colors font-medium px-3 py-2">
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{totalModels}</div>
              <div className="text-xs text-slate-500 font-medium">Total Models</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{totalReviews}</div>
              <div className="text-xs text-slate-500 font-medium">Total Reviews</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1 w-fit">
        <button onClick={() => setTab('models')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'models' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          Models ({totalModels})
        </button>
        <button onClick={() => setTab('reviews')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'reviews' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          Reviews ({totalReviews})
        </button>
      </div>

      {tab === 'models' ? (
        <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Name', 'Provider', 'Category', 'Reviews', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {models.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-slate-900">{m.name}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{m.provider}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">{m.category}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-semibold text-slate-700">{m.review_count}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link href={`/models/${m.id}`} className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold">View</Link>
                        <button onClick={() => deleteModel(m.id)} className="text-rose-500 hover:text-rose-700 text-xs font-semibold">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Model', 'Author', 'Rating', 'Review', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-400 text-sm">No reviews yet</td>
                  </tr>
                ) : (
                  reviews.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-slate-900">{r.model_name || `#${r.model_id}`}</td>
                      <td className="px-5 py-3.5 text-slate-600">{r.author || 'Anonymous'}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                          {r.rating}/5
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">{r.text || '—'}</td>
                      <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => deleteReview(r.id)} className="text-rose-500 hover:text-rose-700 text-xs font-semibold">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

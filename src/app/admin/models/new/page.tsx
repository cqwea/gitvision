'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewModelPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [provider, setProvider] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Text')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('admin_token')
    if (!saved) router.push('/admin')
    else setToken(saved)
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !provider.trim()) { setError('Name and provider are required'); return }
    setSubmitting(true); setError('')

    const res = await fetch('/api/models', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: name.trim(), provider: provider.trim(), description: description.trim() || null, category }),
    })

    if (res.ok) router.push('/admin')
    else { const d = await res.json(); setError(d.error || 'Failed to add model') }
    setSubmitting(false)
  }

  if (!token) return null

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Add AI Model</h1>
        <p className="text-slate-500 text-sm mt-1">Add a new model to the review platform</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/70 p-6 space-y-5 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Model Name <span className="text-rose-500">*</span></label>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-shadow"
            placeholder="e.g. GPT-5" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Provider <span className="text-rose-500">*</span></label>
          <input value={provider} onChange={e => setProvider(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-shadow"
            placeholder="e.g. OpenAI" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-shadow">
            {['Text', 'Image', 'Video', 'Audio', 'Code', 'Other'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-shadow resize-none"
            placeholder="Brief description of the model" />
        </div>
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
            <p className="text-rose-600 text-sm font-medium">{error}</p>
          </div>
        )}
        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="bg-linear-to-r from-indigo-500 to-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-violet-700 disabled:opacity-50 transition-all duration-200 shadow-md">
            {submitting ? 'Adding...' : 'Add Model'}
          </button>
          <button type="button" onClick={() => router.push('/admin')}
            className="text-slate-500 px-6 py-2.5 rounded-xl text-sm font-semibold hover:text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

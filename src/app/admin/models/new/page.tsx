'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
    setSubmitting(true)
    setError('')

    const res = await fetch('/api/models', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: name.trim(), provider: provider.trim(), description: description.trim() || null, category }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to add model')
    }
    setSubmitting(false)
  }

  if (!token) return null

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add AI Model</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Model Name *</label>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. GPT-5" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Provider *</label>
          <input value={provider} onChange={e => setProvider(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. OpenAI" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Text</option>
            <option>Image</option>
            <option>Video</option>
            <option>Audio</option>
            <option>Code</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Brief description of the model" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {submitting ? 'Adding...' : 'Add Model'}
          </button>
          <button type="button" onClick={() => router.push('/admin')}
            className="text-gray-500 px-6 py-2 rounded-lg text-sm font-medium hover:text-gray-700 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

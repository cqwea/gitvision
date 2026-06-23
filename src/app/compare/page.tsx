'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import StarRating from '@/components/StarRating'

interface ModelData {
  id: number; name: string; provider: string; category: string
  avg_rating: number; review_count: number; description: string | null
}

export default function ComparePage() {
  const [models, setModels] = useState<ModelData[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [compareModels, setCompareModels] = useState<(ModelData & { reviews: any[] })[]>([])

  useEffect(() => {
    fetch('/api/models?limit=50').then(r => r.json()).then(d => setModels(d.models))
  }, [])

  useEffect(() => {
    if (selected.length < 2) { setCompareModels([]); return }
    Promise.all(selected.map(id => fetch(`/api/models/${id}`).then(r => r.json())))
      .then(results => setCompareModels(results))
  }, [selected])

  function toggle(id: number) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">Compare Models</h1>
        <p className="text-slate-400 text-sm mt-1">Select 2-3 models to compare side by side</p>
      </div>

      <div className="flex flex-wrap gap-2.5 mb-8">
        {models.map(m => (
          <button key={m.id} onClick={() => toggle(m.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              selected.includes(m.id) ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/15' : 'bg-slate-900/45 text-slate-300 border-slate-850 hover:border-slate-700 hover:text-white'
            }`}>
            {m.name}
          </button>
        ))}
      </div>

      {selected.length < 2 && (
        <div className="text-center py-20 glass-card rounded-2xl border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-slate-900/60 flex items-center justify-center mx-auto mb-4 border border-slate-800 shadow-inner">
            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
          </div>
          <p className="text-slate-350 font-bold">Select at least 2 models to compare</p>
          <p className="text-slate-500 text-xs mt-1">Click the model badges above to initiate a side-by-side comparison</p>
        </div>
      )}

      {compareModels.length >= 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={compareModels.length === 3 ? { gridTemplateColumns: 'repeat(3, 1fr)' } : {}}>
          {compareModels.map((m, i) => {
            const ratings = (m.reviews || []).map((r: any) => r.rating)
            const avg = ratings.length > 0 ? Math.round((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) * 10) / 10 : 0
            const ratingCounts = [0, 0, 0, 0, 0]
            ratings.forEach((r: number) => { if (r >= 1 && r <= 5) ratingCounts[r - 1]++ })
            const maxCount = Math.max(...ratingCounts, 1)
            const prosCount = (m.reviews || []).filter((r: any) => r.pros).length
            const consCount = (m.reviews || []).filter((r: any) => r.cons).length

            return (
              <div key={m.id} className="glass-card rounded-2xl border-slate-800 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-900/80">
                  <Link href={`/models/${m.id}`} className="text-lg font-black text-white hover:text-indigo-400 transition-colors tracking-tight">{m.name}</Link>
                  <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{m.provider} · {m.category}</p>
                  {m.description && <p className="text-slate-450 text-xs mt-3 leading-relaxed line-clamp-3">{m.description}</p>}
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-3">
                    <StarRating value={avg} interactive={false} size="md" />
                    <span className="text-xl font-black text-white tracking-tight">{avg.toFixed(1)}</span>
                    <span className="text-xs text-slate-550 font-medium">({ratings.length} reviews)</span>
                  </div>

                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = ratingCounts[star - 1]
                      return (
                        <div key={star} className="flex items-center gap-2.5 text-[11px]">
                          <span className="w-3 text-slate-500 font-bold">{star}</span>
                          <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                          <div className="flex-1 h-1.5 bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-linear-to-r from-amber-500 to-amber-600 rounded-full transition-all" style={{ width: `${(count / maxCount) * 100}%` }} />
                          </div>
                          <span className="w-5 text-right text-slate-450 font-bold">{count}</span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center text-sm pt-2">
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3.5">
                      <div className="text-xl font-extrabold text-emerald-450 leading-tight">{prosCount}</div>
                      <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-1">Pros tagged</div>
                    </div>
                    <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3.5">
                      <div className="text-xl font-extrabold text-rose-450 leading-tight">{consCount}</div>
                      <div className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mt-1">Cons tagged</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

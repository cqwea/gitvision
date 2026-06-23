'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import ModelCard from '@/components/ModelCard'

interface ModelData {
  id: number; name: string; provider: string; category: string
  avg_rating: number; review_count: number
}

const CATEGORIES = ['Text', 'Image', 'Video', 'Audio', 'Code', 'Other']

const categoryIcons: Record<string, React.ReactNode> = {
  Text: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>,
  Image: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>,
  Video: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9.75a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H4.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25z" /></svg>,
  Audio: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>,
  Code: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
  Other: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>,
}

export default function CategoriesPage() {
  const [models, setModels] = useState<ModelData[]>([])

  useEffect(() => {
    fetch('/api/models?limit=50').then(r => r.json()).then(d => setModels(d.models))
  }, [])

  const grouped = CATEGORIES.map(cat => ({
    name: cat,
    icon: categoryIcons[cat],
    items: models.filter(m => m.category === cat),
    colors: ['bg-indigo-500/5', 'bg-pink-500/5', 'bg-purple-500/5', 'bg-amber-500/5', 'bg-emerald-500/5', 'bg-slate-900/30'],
  }))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">Categories</h1>
        <p className="text-slate-400 text-sm mt-1">Browse AI models by category</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {grouped.map((cat, ci) => (
          <div key={cat.name} className="glass-card rounded-2xl border-slate-800 overflow-hidden shadow-xl">
            <div className={`p-5 ${cat.colors[ci]} border-b border-slate-900/80`}>
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-350 shadow-inner">
                  {cat.icon}
                </div>
                <div>
                  <h2 className="font-extrabold text-white text-base leading-tight tracking-tight">{cat.name}</h2>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{cat.items.length} models</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-slate-900/60">
              {cat.items.length === 0 ? (
                <p className="p-5 text-sm text-slate-500">No models in this category yet</p>
              ) : (
                cat.items.slice(0, 5).map(m => (
                  <Link key={m.id} href={`/models/${m.id}`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-900/30 transition-colors">
                    <div>
                      <span className="text-sm font-bold text-slate-200 hover:text-white transition-colors">{m.name}</span>
                      <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 ml-2">{m.provider}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-semibold bg-slate-900/60 px-2 py-1 rounded border border-slate-850">{m.review_count} {m.review_count === 1 ? 'review' : 'reviews'}</span>
                  </Link>
                ))
              )}
              {cat.items.length > 5 && (
                <Link href={`/?category=${cat.name}`} className="block px-5 py-3.5 text-xs font-bold text-indigo-400 hover:text-indigo-350 hover:bg-slate-900/25 transition-colors text-center uppercase tracking-wider">
                  View all {cat.items.length} models →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

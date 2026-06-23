'use client'

import { useState, useEffect, useCallback } from 'react'
import ModelCard from '@/components/ModelCard'

interface ModelData {
  id: number; name: string; provider: string; category: string;
  avg_rating: number; review_count: number; description: string | null
}

const CATEGORIES = ['Text', 'Image', 'Video', 'Audio', 'Code', 'Other']

export default function Home() {
  const [models, setModels] = useState<ModelData[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [providers, setProviders] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [provider, setProvider] = useState('')
  const [sort, setSort] = useState('popular')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [inputVal, setInputVal] = useState('')

  const fetchModels = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    if (provider) params.set('provider', provider)
    params.set('sort', sort)
    params.set('page', String(page))
    params.set('limit', '12')
    const res = await fetch(`/api/models?${params}`)
    const data = await res.json()
    setModels(data.models)
    setTotal(data.total)
    setTotalPages(data.totalPages)
    if (data.providers) setProviders(data.providers)
    setLoading(false)
  }, [search, category, provider, sort, page])

  useEffect(() => { fetchModels() }, [fetchModels])

  const totalReviews = models.reduce((s, m) => s + m.review_count, 0)

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900/80 via-slate-950 to-slate-950/40 border border-slate-800 p-8 sm:p-12 mb-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold backdrop-blur-md border border-indigo-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              {total} Models Available
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
            Discover & Compare the Best <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400">AI Intelligence</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed mb-6">
            Explore trusted, community-driven ratings and reviews for the world's leading language and generative AI models.
          </p>
          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-900/60 flex items-center justify-center border border-slate-800 shadow-inner">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
              </div>
              <div>
                <div className="text-white text-lg font-extrabold">{totalReviews}</div>
                <div className="text-slate-400 text-xs font-medium">Total Reviews</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-900/60 flex items-center justify-center border border-slate-800 shadow-inner">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
              </div>
              <div>
                <div className="text-white text-lg font-extrabold">{models.filter(m => m.review_count > 0).length}</div>
                <div className="text-slate-400 text-xs font-medium">Models Rated</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setSearch(inputVal); setPage(1) } }}
            onBlur={() => { setSearch(inputVal); setPage(1) }}
            placeholder="Search models by name or keyword..."
            className="w-full rounded-xl border border-slate-800 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-900/40 text-slate-100 placeholder-slate-500 transition-all shadow-inner"
          />
        </div>
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1) }}
          className="rounded-xl border border-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-900/40 text-slate-300 font-semibold cursor-pointer">
          <option value="" className="bg-[#090b11]">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#090b11]">{c}</option>)}
        </select>
        <select value={provider} onChange={e => { setProvider(e.target.value); setPage(1) }}
          className="rounded-xl border border-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-900/40 text-slate-300 font-semibold cursor-pointer">
          <option value="" className="bg-[#090b11]">All Providers</option>
          {providers.map(p => <option key={p} value={p} className="bg-[#090b11]">{p}</option>)}
        </select>
        <div className="flex rounded-xl border border-slate-800 overflow-hidden bg-slate-900/20 p-1 shrink-0">
          {(['popular', 'newest', 'rated'] as const).map(s => (
            <button key={s} onClick={() => { setSort(s); setPage(1) }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${sort === s ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'text-slate-400 hover:text-slate-200'}`}>
              {s === 'popular' ? 'Popular' : s === 'newest' ? 'Newest' : 'Top Rated'}
            </button>
          ))}
        </div>
      </div>

      {/* Model Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {search || category || provider ? 'Search Results' : 'Explore Models'}
          </h2>
          <span className="text-xs text-slate-400 font-semibold bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-850">{total} model{total !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-slate-950/40 rounded-2xl border border-slate-900 p-6 animate-pulse">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-800" />
                  <div className="flex-1 space-y-2"><div className="h-4 bg-slate-800 rounded w-3/4" /><div className="h-3 bg-slate-800 rounded w-1/2" /></div>
                </div>
                <div className="h-4 bg-slate-800 rounded w-1/3 mt-4" />
              </div>
            ))}
          </div>
        ) : models.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-slate-900/60 flex items-center justify-center mx-auto mb-4 border border-slate-800">
              <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="text-slate-300 font-semibold">No models found</p>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search or category filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {models.map((m, i) => (
                <div key={m.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <ModelCard id={m.id} name={m.name} provider={m.provider} category={m.category} avgRating={m.avg_rating} reviewCount={m.review_count} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2.5 mt-10">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-800 bg-slate-900/20 text-slate-300 hover:text-white hover:bg-slate-900/60 hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${page === p ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-650/15' : 'border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/40'}`}>
                    {p}
                  </button>
                ))}
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-800 bg-slate-900/20 text-slate-300 hover:text-white hover:bg-slate-900/60 hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

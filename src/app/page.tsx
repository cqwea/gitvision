import { getSupabase } from '@/lib/supabase'
import ModelCard from '@/components/ModelCard'

interface ReviewRow { rating: number }
interface ModelRow {
  id: number; name: string; provider: string; description: string | null
  category: string; image_url: string | null; created_at: string; reviews: ReviewRow[]
}

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { data: models } = await (getSupabase() as any)
    .from('models')
    .select('*, reviews(rating)')
    .order('created_at', { ascending: false }) as { data: ModelRow[] | null }

  const modelsWithStats = (models || []).map(m => {
    const ratings = m.reviews.map(r => r.rating)
    const count = ratings.length
    const avg = count > 0 ? ratings.reduce((a, b) => a + b, 0) / count : 0
    return { ...m, avg_rating: Math.round(avg * 10) / 10, review_count: count }
  }).sort((a, b) => b.review_count - a.review_count)

  const totalReviews = modelsWithStats.reduce((s, m) => s + m.review_count, 0)

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 via-indigo-700 to-violet-800 p-8 sm:p-12 mb-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMjBhMTAgMTAgMCAxIDEgMCAyMCAxMCAxMCAwIDAgMSAwLTIweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvc3ZnPg==')] opacity-30" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-sm border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {modelsWithStats.length} Models Available
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Find the Perfect<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-200 to-yellow-300">AI Model</span> for You
          </h1>
          <p className="text-indigo-200 text-base sm:text-lg max-w-xl leading-relaxed mb-6">
            Community-driven reviews for the latest AI models. Real opinions from real users.
          </p>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
              </div>
              <div>
                <div className="text-white text-lg font-bold">{totalReviews}</div>
                <div className="text-indigo-300 text-xs font-medium">Total Reviews</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
              </div>
              <div>
                <div className="text-white text-lg font-bold">{modelsWithStats.filter(m => m.review_count > 0).length}</div>
                <div className="text-indigo-300 text-xs font-medium">Models Rated</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">All Models</h2>
          <span className="text-sm text-slate-400 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            Sorted by popularity
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modelsWithStats.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">No models loaded yet</p>
              <p className="text-slate-400 text-sm mt-1">Run the seed script to populate models.</p>
            </div>
          ) : (
            modelsWithStats.map((m, i) => (
              <div key={m.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
                <ModelCard
                  id={m.id}
                  name={m.name}
                  provider={m.provider}
                  category={m.category}
                  avgRating={m.avg_rating}
                  reviewCount={m.review_count}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

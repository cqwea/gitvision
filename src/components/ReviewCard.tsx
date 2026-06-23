import StarRating from './StarRating'

interface ReviewCardProps {
  rating: number; text: string | null; pros: string | null; cons: string | null
  author: string | null; createdAt: string; id?: number
  onEdit?: () => void
}

export default function ReviewCard({ rating, text, pros, cons, author, createdAt, id, onEdit }: ReviewCardProps) {
  const initials = (author || 'A').slice(0, 2).toUpperCase()
  const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500']
  const colorIndex = (author || '').length % colors.length

  return (
    <div className="glass-card rounded-2xl p-6 glass-card-hover hover:border-slate-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${colors[colorIndex]} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
            {initials}
          </div>
          <div>
            <span className="text-sm font-semibold text-slate-100">{author || 'Anonymous'}</span>
            <span className="text-xs text-slate-500 ml-2">{new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {onEdit && id && (
            <button onClick={onEdit} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer">Edit</button>
          )}
          <StarRating value={rating} interactive={false} size="sm" />
        </div>
      </div>
      {text && <p className="text-slate-300 text-sm leading-relaxed mb-4">{text}</p>}
      {(pros || cons) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-4">
          {pros && (
            <div className="bg-emerald-500/5 rounded-xl p-3.5 border border-emerald-500/10">
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></svg>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Pros</span>
              </div>
              <p className="text-slate-300 text-sm">{pros}</p>
            </div>
          )}
          {cons && (
            <div className="bg-rose-500/5 rounded-xl p-3.5 border border-rose-500/10">
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="w-3.5 h-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Cons</span>
              </div>
              <p className="text-slate-300 text-sm">{cons}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

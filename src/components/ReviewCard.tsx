import StarRating from './StarRating'

interface ReviewCardProps {
  rating: number
  text: string | null
  pros: string | null
  cons: string | null
  author: string | null
  createdAt: string
}

export default function ReviewCard({ rating, text, pros, cons, author, createdAt }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
            {(author || 'A').charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">{author || 'Anonymous'}</span>
            <span className="text-xs text-gray-400 ml-2">{new Date(createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <StarRating value={rating} interactive={false} size="sm" />
      </div>
      {text && <p className="text-gray-700 text-sm mb-3">{text}</p>}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {pros && (
          <div className="bg-green-50 rounded-lg p-3">
            <span className="text-green-700 font-semibold text-xs uppercase tracking-wide">Pros</span>
            <p className="text-gray-700 mt-1">{pros}</p>
          </div>
        )}
        {cons && (
          <div className="bg-red-50 rounded-lg p-3">
            <span className="text-red-700 font-semibold text-xs uppercase tracking-wide">Cons</span>
            <p className="text-gray-700 mt-1">{cons}</p>
          </div>
        )}
      </div>
    </div>
  )
}

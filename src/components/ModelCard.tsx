import React from 'react'
import Link from 'next/link'
import StarRating from './StarRating'

interface ModelCardProps {
  id: number; name: string; provider: string; category: string
  avgRating: number; reviewCount: number
}

const providerStyles: Record<string, { color: string }> = {
  OpenAI: { color: 'from-emerald-500 to-green-600' },
  Anthropic: { color: 'from-amber-500 to-yellow-600' },
  Google: { color: 'from-blue-500 to-indigo-600' },
  Meta: { color: 'from-violet-500 to-purple-600' },
  Mistral: { color: 'from-orange-500 to-red-600' },
  Midjourney: { color: 'from-pink-500 to-rose-600' },
  'Stability AI': { color: 'from-cyan-500 to-teal-600' },
  Perplexity: { color: 'from-teal-500 to-emerald-600' },
  xAI: { color: 'from-slate-600 to-slate-700' },
}

const providerLogos: Record<string, React.ReactNode> = {
  OpenAI: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
  ),
  Anthropic: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-8h3l2.5 5 2.5-5h3l-4 8h-3z"/></svg>
  ),
  Google: (
    <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/></svg>
  ),
  Meta: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white"><circle cx="12" cy="12" r="10"/><path d="M8 8h3l1 4 1-4h3v8h-2.5v-5.5L12 16l-1.5-5.5V16H8V8z"/></svg>
  ),
  Mistral: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/></svg>
  ),
  Midjourney: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
  ),
  'Stability AI': (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white"><polygon points="12,2 22,22 2,22"/></svg>
  ),
  Perplexity: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M6 12h12"/></svg>
  ),
  xAI: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-8h3l3.5 5.5L16 9h3l-5 8h-3z"/></svg>
  ),
}

const categoryColors: Record<string, string> = {
  Text: 'bg-indigo-500/10 text-indigo-300 ring-indigo-500/25',
  Image: 'bg-pink-500/10 text-pink-300 ring-pink-500/25',
  Video: 'bg-purple-500/10 text-purple-300 ring-purple-500/25',
  Audio: 'bg-amber-500/10 text-amber-300 ring-amber-500/25',
  Code: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/25',
}

export default function ModelCard({ id, name, provider, category, avgRating, reviewCount }: ModelCardProps) {
  const style = providerStyles[provider] || { color: 'from-slate-500 to-slate-600' }
  const logo = providerLogos[provider]

  return (
    <Link href={`/models/${id}`}
      className="group block glass-card rounded-2xl overflow-hidden glass-card-hover hover:border-indigo-500/30">
      <div className={`h-1 bg-linear-to-r ${style.color}`} />
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${style.color} flex items-center justify-center shrink-0 shadow-lg`}>
            {logo || <span className="text-white font-bold text-sm">{provider.charAt(0).toUpperCase()}</span>}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors truncate tracking-tight text-base">{name}</h3>
            <span className="inline-block mt-1 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400">{provider}</span>
          </div>
          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md ring-1 ring-inset shrink-0 ${categoryColors[category] || 'bg-slate-800/50 text-slate-400 ring-slate-700/50'}`}>{category}</span>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-900">
          <div className="flex items-center gap-2">
            <StarRating value={avgRating} interactive={false} size="sm" />
            <span className="text-xs font-bold text-slate-300">{reviewCount > 0 ? avgRating.toFixed(1) : '—'}</span>
          </div>
          <span className="text-xs text-slate-500 font-semibold">{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
        </div>
      </div>
    </Link>
  )
}

'use client'

import { Star } from 'lucide-react'

interface Props {
  rating: number
  size?: number
}

export default function StarRating({ rating, size = 14 }: Props) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}
          fill="currentColor"
        />
      ))}
    </div>
  )
}

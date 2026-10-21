import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 5.0, count = null, size = 16 }) {
  const rounded = Math.round(rating * 10) / 10;
  
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', color: '#F59E0B' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            fill={star <= Math.round(rating) ? '#F59E0B' : 'transparent'}
            stroke="#F59E0B"
            strokeWidth={2}
          />
        ))}
      </div>
      <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-navy)', marginLeft: '2px' }}>
        {rounded.toFixed(1)}
      </span>
      {count !== null && (
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          ({count})
        </span>
      )}
    </div>
  );
}

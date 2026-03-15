import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TwoColumnsProps {
  split: '50-50' | '60-40' | '40-60' | '70-30' | '30-70';
  gap: 'sm' | 'md' | 'lg';
  reverseOnMobile: boolean;
  children?: ReactNode[];
}

export const TwoColumns = ({ split, gap, reverseOnMobile, children }: TwoColumnsProps) => {
  const gridClass = {
    '50-50': 'grid-cols-1 md:grid-cols-2',
    '60-40': 'grid-cols-1 md:grid-cols-[1.5fr_1fr]',
    '40-60': 'grid-cols-1 md:grid-cols-[1fr_1.5fr]',
    '70-30': 'grid-cols-1 md:grid-cols-[2.3fr_1fr]',
    '30-70': 'grid-cols-1 md:grid-cols-[1fr_2.3fr]',
  }[split];

  const gapClass = {
    sm: 'gap-4',
    md: 'gap-8',
    lg: 'gap-12',
  }[gap];

  return (
    <div
      className={cn(
        'grid w-full',
        gridClass,
        gapClass,
        reverseOnMobile && 'flex flex-col-reverse md:grid'
      )}
    >
      <div className="w-full">
        {children?.[0]}
      </div>
      <div className="w-full">
        {children?.[1]}
      </div>
    </div>
  );
};

export default TwoColumns;

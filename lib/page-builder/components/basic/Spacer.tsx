'use client';

import React from 'react';

export interface SpacerProps {
  size: 'sm' | 'md' | 'lg' | 'xl';
}

export const Spacer = ({ size }: SpacerProps) => {
  const heightClass = {
    sm: 'h-4',
    md: 'h-8',
    lg: 'h-16',
    xl: 'h-24',
  }[size];

  return <div className={heightClass} />;
};

Spacer.defaultProps = {
  size: 'md',
};

export default Spacer;

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ImageBannerProps {
  src: string;
  alt: string;
  height: 'sm' | 'md' | 'lg' | 'full';
  objectFit: 'cover' | 'contain';
  radius: 'none' | 'sm' | 'lg';
}

export const ImageBanner = ({ src, alt, height, objectFit, radius }: ImageBannerProps) => {
  const heightClass = {
    sm: 'h-48',
    md: 'h-64',
    lg: 'h-96',
    full: 'h-screen',
  }[height];

  const radiusClass = {
    none: 'rounded-none',
    sm: 'rounded-lg',
    lg: 'rounded-2xl',
  }[radius];

  return (
    <div className={cn('w-full overflow-hidden', heightClass, radiusClass)}>
      <img
        src={src}
        alt={alt}
        className={cn('w-full h-full', `object-${objectFit}`, radiusClass)}
        loading="lazy"
      />
    </div>
  );
};

ImageBanner.defaultProps = {
  src: 'https://placehold.co/1200x400/e0f2fe/0284c7?text=Image',
  alt: '',
  height: 'md',
  objectFit: 'cover',
  radius: 'none',
};

export default ImageBanner;

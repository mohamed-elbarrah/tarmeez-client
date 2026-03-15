'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface HeroBannerProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  backgroundColor: 'primary' | 'dark' | 'light' | 'custom';
  overlayOpacity: 'none' | 'light' | 'medium' | 'dark';
  textColor: 'white' | 'dark';
  buttonLabel: string;
  buttonHref: string;
  showButton: boolean;
  minHeight: 'sm' | 'md' | 'lg' | 'full';
  contentAlign: 'right' | 'center' | 'left';
}

export const HeroBanner = ({
  title,
  subtitle,
  backgroundImage,
  backgroundColor,
  overlayOpacity,
  textColor,
  buttonLabel,
  buttonHref,
  showButton,
  minHeight,
  contentAlign,
}: HeroBannerProps) => {
  const minHeightClass = {
    sm: 'min-h-64',
    md: 'min-h-96',
    lg: 'min-h-[500px]',
    full: 'min-h-screen',
  }[minHeight];

  const bgColorClass = {
    primary: 'bg-[var(--p-color)]',
    dark: 'bg-[var(--s-color)]',
    light: 'bg-[var(--color-bg,#f8fafc)]',
    custom: '',
  }[backgroundColor];

  const overlayOpacityValue = {
    none: 0,
    light: 0.2,
    medium: 0.5,
    dark: 0.7,
  }[overlayOpacity];

  const textColorClass = textColor === 'white' ? 'text-white' : 'text-[var(--t-color)]';
  const headingColorClass = textColor === 'white' ? 'text-white' : 'text-[var(--h-color)]';

  const alignClass = {
    right: 'text-right items-end',
    center: 'text-center items-center',
    left: 'text-left items-start',
  }[contentAlign];

  return (
    <section
      className={cn(
        'relative w-full flex flex-col justify-center px-6 py-12 bg-cover bg-center overflow-hidden',
        minHeightClass,
        bgColorClass
      )}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black pointer-events-none"
        style={{ opacity: overlayOpacityValue }}
      />

      {/* Content */}
      <div className={cn('relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-6', alignClass)}>
        <h1 className={cn('text-4xl md:text-6xl font-bold leading-tight', headingColorClass)}>
          {title}
        </h1>
        <p className={cn('text-lg md:text-xl max-w-2xl opacity-90', textColorClass)}>
          {subtitle}
        </p>
        
        {showButton && (
          <a
            href={buttonHref}
            className="inline-flex items-center px-8 py-4 rounded-full bg-[var(--b-color)] text-white font-bold hover:scale-105 transition-transform duration-200 shadow-lg"
          >
            {buttonLabel}
          </a>
        )}
      </div>
    </section>
  );
};

HeroBanner.defaultProps = {
  title: 'عنوان رئيسي جذاب',
  subtitle: 'وصف مختصر يشرح ما تقدمه',
  backgroundImage: 'https://placehold.co/1400x600/0f172a/ffffff?text=Hero',
  backgroundColor: 'dark',
  overlayOpacity: 'medium',
  textColor: 'white',
  buttonLabel: 'اكتشف الآن',
  buttonHref: '#',
  showButton: true,
  minHeight: 'md',
  contentAlign: 'center',
};

export default HeroBanner;

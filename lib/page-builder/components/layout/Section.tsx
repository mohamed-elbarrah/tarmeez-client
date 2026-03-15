'use client';

import React from 'react';
import { DropZone } from '@puckeditor/core';
import { cn } from '@/lib/utils';

export interface SectionProps {
  backgroundColor: 'transparent' | 'light' | 'dark' | 'primary';
  paddingY: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth: 'sm' | 'md' | 'lg' | 'full';
}

export const Section = ({ backgroundColor, paddingY, maxWidth }: SectionProps) => {
  const bgClass = {
    transparent: 'bg-transparent',
    light: 'bg-[var(--color-bg,#f8fafc)]',
    dark: 'bg-[var(--s-color)]',
    primary: 'bg-[var(--p-color)]',
  }[backgroundColor];

  const paddingClass = {
    none: 'py-0',
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-16',
    xl: 'py-24',
  }[paddingY];

  const maxWidthClass = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    full: 'max-w-full',
  }[maxWidth];

  return (
    <section className={cn(bgClass, paddingClass)}>
      <div className={cn(maxWidthClass, 'mx-auto px-4')}>
        <DropZone zone="content" />
      </div>
    </section>
  );
};

Section.defaultProps = {
  backgroundColor: 'transparent',
  paddingY: 'md',
  maxWidth: 'lg',
};

export default Section;

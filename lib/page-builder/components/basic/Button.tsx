'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface ButtonProps {
  label: string;
  href: string;
  variant: 'primary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  align: 'right' | 'center' | 'left' | 'full';
}

export const Button = ({ label, href, variant, size, align }: ButtonProps) => {
  const isExternal = href.startsWith('http');

  const variantClasses = {
    primary: 'bg-[var(--b-color)] text-white hover:opacity-90',
    outline: 'border border-[var(--p-color)] text-[var(--p-color)] hover:bg-[var(--p-color)] hover:text-white',
    ghost: 'text-[var(--p-color)] hover:bg-[var(--p-color)]/10',
  }[variant];

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }[size];

  const alignClasses = {
    right: 'justify-end',
    center: 'justify-center',
    left: 'justify-start',
    full: 'w-full',
  }[align];

  const buttonContent = (
    <span
      className={cn(
        'inline-flex items-center rounded-lg transition-all duration-200 font-medium cursor-pointer',
        variantClasses,
        sizeClasses,
        align === 'full' && 'w-full justify-center'
      )}
    >
      {label}
    </span>
  );

  return (
    <div className={cn('flex', alignClasses)}>
      {isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cn(align === 'full' && 'w-full')}>
          {buttonContent}
        </a>
      ) : (
        <Link href={href} className={cn(align === 'full' && 'w-full')}>
          {buttonContent}
        </Link>
      )}
    </div>
  );
};

Button.defaultProps = {
  label: 'اضغط هنا',
  href: '#',
  variant: 'primary',
  size: 'md',
  align: 'center',
};

export default Button;

'use client';

import React from 'react';

export interface TextBlockProps {
  content: string;
  align: 'right' | 'center' | 'left';
  size: 'sm' | 'base' | 'lg' | 'xl';
  color: 'heading' | 'text' | 'primary';
}

export const TextBlock = ({ content, align, size, color }: TextBlockProps) => {
  const colorValue = {
    heading: 'var(--h-color)',
    text: 'var(--t-color)',
    primary: 'var(--p-color)',
  }[color];

  const fontSize = {
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  }[size];

  return (
    <div
      style={{
        color: colorValue,
        textAlign: align as any,
        fontSize,
        whiteSpace: 'pre-wrap',
      }}
      className="w-full"
    >
      {content}
    </div>
  );
};

TextBlock.defaultProps = {
  content: 'أضف نصك هنا',
  align: 'right',
  size: 'base',
  color: 'text',
};

export default TextBlock;

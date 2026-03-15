'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ProductBlockProps {
  productId: string;
  layout: 'card' | 'hero' | 'minimal';
  showPrice: boolean;
  showDescription: boolean;
  showRating: boolean;
  checkoutMode: 'modal' | 'cart' | 'both';
  buttonLabel: string;
  // Resolved data from Renderer
  resolvedProduct?: {
    id: string;
    name: string;
    price: number;
    comparePrice?: number;
    images: string[];
    description?: string;
    averageRating?: number;
  };
}

export const ProductBlock = ({
  productId,
  layout,
  showPrice,
  showDescription,
  showRating,
  checkoutMode,
  buttonLabel,
  resolvedProduct,
}: ProductBlockProps) => {
  if (!productId || !resolvedProduct) {
    return (
      <div className="p-12 border-2 border-dashed border-[var(--p-color)] rounded-2xl flex flex-col items-center justify-center text-[var(--p-color)] bg-[var(--p-color)]/5">
        <span className="text-xl font-bold">🛒 بلوك عرض المنتج</span>
        <span className="text-sm opacity-70">اختر منتجاً من الإعدادات الجانبية</span>
      </div>
    );
  }

  const { name, price, comparePrice, images, description, averageRating } = resolvedProduct;
  const image = images?.[0] || 'https://placehold.co/600x600?text=Product';

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(p);
  };

  if (layout === 'hero') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-12 px-6 bg-[var(--color-bg,#f8fafc)] rounded-3xl">
        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-6 text-right">
          <h2 className="text-4xl font-bold text-[var(--h-color)]">{name}</h2>
          {showRating && averageRating !== undefined && (
            <div className="flex items-center gap-1 text-yellow-400">
              <span>{averageRating.toFixed(1)}</span>
              <span>⭐</span>
            </div>
          )}
          {showDescription && description && (
            <p className="text-lg text-[var(--t-color)] opacity-80 leading-relaxed">
              {description}
            </p>
          )}
          {showPrice && (
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-[var(--p-color)]">{formatPrice(price)}</span>
              {comparePrice && (
                <span className="text-xl text-[var(--t-color)] opacity-50 line-through">
                  {formatPrice(comparePrice)}
                </span>
              )}
            </div>
          )}
          <div className="flex flex-wrap gap-4 mt-4">
            {(checkoutMode === 'modal' || checkoutMode === 'both') && (
              <button className="flex-1 px-8 py-4 bg-[var(--b-color)] text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">
                {buttonLabel}
              </button>
            )}
            {(checkoutMode === 'cart' || checkoutMode === 'both') && (
              <button className="flex-1 px-8 py-4 border-2 border-[var(--b-color)] text-[var(--b-color)] font-bold rounded-xl hover:bg-[var(--b-color)] hover:text-white transition-all">
                أضف للسلة
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'minimal') {
    return (
      <div className="flex items-center justify-between p-6 bg-white border border-[var(--p-color)]/10 rounded-2xl shadow-sm">
        <div className="flex flex-col">
          <h3 className="font-bold text-[var(--h-color)]">{name}</h3>
          {showPrice && <span className="text-[var(--p-color)] font-bold">{formatPrice(price)}</span>}
        </div>
        <button className="px-6 py-2 bg-[var(--b-color)] text-white text-sm font-bold rounded-lg whitespace-nowrap">
          {buttonLabel}
        </button>
      </div>
    );
  }

  // Default: Card layout
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-[var(--p-color)]/5">
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6 flex flex-col gap-3 text-right">
        <h3 className="text-xl font-bold text-[var(--h-color)] line-clamp-1">{name}</h3>
        {showRating && averageRating !== undefined && (
          <div className="flex items-center gap-1 text-sm text-yellow-400">
            <span>{averageRating.toFixed(1)}</span>
            <span>⭐</span>
          </div>
        )}
        {showDescription && description && (
          <p className="text-sm text-[var(--t-color)] opacity-70 line-clamp-2">{description}</p>
        )}
        {showPrice && (
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xl font-bold text-[var(--p-color)]">{formatPrice(price)}</span>
            {comparePrice && (
              <span className="text-sm text-[var(--t-color)] opacity-50 line-through">
                {formatPrice(comparePrice)}
              </span>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2 mt-4">
          {(checkoutMode === 'modal' || checkoutMode === 'both') && (
            <button className="w-full py-3 bg-[var(--b-color)] text-white font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity">
              {buttonLabel}
            </button>
          )}
          {(checkoutMode === 'cart' || checkoutMode === 'both') && (
            <button className="w-full py-3 border-2 border-[var(--b-color)] text-[var(--b-color)] font-bold rounded-xl hover:bg-[var(--b-color)] hover:text-white transition-all">
              أضف للسلة
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

ProductBlock.defaultProps = {
  productId: '',
  layout: 'card',
  showPrice: true,
  showDescription: true,
  showRating: true,
  checkoutMode: 'both',
  buttonLabel: 'اشتري الآن',
};

export default ProductBlock;

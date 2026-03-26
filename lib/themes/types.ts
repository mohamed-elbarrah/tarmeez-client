export interface ThemeTokens {
  primary: string;
  secondary: string;
  accent: string;
  textColor: string;
  headingColor: string;
  buttonColor: string;
  fontFamily: string;
  borderRadius: string;
  logoWidth: number;
  logoHeight: number;
  showStoreName: boolean;
}

export interface ProductOffer {
  id: string;
  title: string;
  description?: string;
  quantity: number;
  price: number;
  badge?: string;
  sortOrder: number;
}

export interface ProductOptionValue {
  id: string;
  value: string;
  position: number;
}

export interface ProductOption {
  id: string;
  name: string;
  /** COLORS | BUTTONS | DROPDOWN | RADIO */
  type: string;
  position: number;
  values: ProductOptionValue[];
}

export interface ProductVariantValue {
  optionValueId: string;
  optionValue: ProductOptionValue;
}

export interface ProductVariant {
  id: string;
  sku?: string;
  price?: number;
  comparePrice?: number;
  quantity: number;
  image?: string;
  isActive: boolean;
  optionValues: ProductVariantValue[];
}

export interface StoreProduct {
  id: number | string;
  name: string;
  price: number;
  oldPrice?: number;
  comparePrice?: number;
  discount?: string;
  rating?: number;
  category?: string;
  image: string;
  images?: string[];
  slug?: string;
  description?: string;
  offers?: ProductOffer[];
  options?: ProductOption[];
  variants?: ProductVariant[];
  averageRating?: number;
  reviewCount?: number;
  isWishlisted?: boolean;
}

export interface StoreMerchant {
  fullName: string;
  category: string;
  city: string;
  country: string;
  description?: string | null;
}

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  sortOrder: number;
}

import type { ActiveTheme } from "./engine/types";

export interface StoreData {
  slug: string;
  name: string;
  logo?: string | null;
  logoWidth?: number | null;
  logoHeight?: number | null;
  showStoreName?: boolean;
  favicon?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  textColor?: string | null;
  headingColor?: string | null;
  buttonColor?: string | null;
  fontFamily?: string | null;
  borderRadius?: string | null;
  themeId?: string | null;
  /** Populated from the Theme relation — null when no theme is linked yet */
  theme?: ActiveTheme | null;
  products?: StoreProduct[];
  categories?: StoreCategory[];
  merchant?: StoreMerchant;
}

export interface ThemeProps {
  storeData: StoreData;
  initialView?: string;
}

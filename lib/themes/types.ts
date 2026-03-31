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
  /** Explicit hex color the merchant chose — takes priority over name-based resolution */
  colorCode?: string;
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
  quantity?: number;
  donationMetadata?: {
    isDonation?: boolean;
    targetAmount?: number;
    currentAmount?: number;
    donationOptions?: number[];
    donationLabels?: Record<string, string>;
    allowCustomAmount?: boolean;
    progressMessages?: Record<string, string>;
  } | null;
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
  /** Store activity type — determines which theme branch to use */
  activityType?: "RETAIL" | "CHARITY";
  /** Populated from the Theme relation — null when no theme is linked yet */
  theme?: ActiveTheme | null;
  /** ISO currency code from merchant dashboard, e.g. "SAR" | "USD" */
  systemCurrency?: string | null;
  /** Optional currency icon image URL from merchant dashboard */
  currencyIcon?: string | null;
  /** Checkout form field configuration — array of ordered field descriptors */
  checkoutFieldsConfig?:
    | import("@/lib/types/auth").CheckoutFieldConfig[]
    | null;
  products?: StoreProduct[];
  categories?: StoreCategory[];
  merchant?: StoreMerchant;
}

export interface ThemeProps {
  storeData: StoreData;
  initialView?: string;
}

/**
 * Global Widget Contract: ProductCard
 * Strictly serializable (primitives/flat objects) for Visual Page Builder compatibility.
 */
export interface WidgetProductCardProps {
  id: string | number;
  title: string;
  description?: string;
  imageUrl: string | null;
  /** Legacy combined string – prefer priceAmount + currency */
  displayPrice?: string;
  /** Numeric/formatted amount only, e.g. "199" */
  priceAmount?: string;
  /** Currency symbol/code, e.g. "ر.س" */
  currency?: string;
  discountBadge?: string;

  primaryActionText?: string;
  /** Icon name (e.g., 'plus', 'heart') or pre-rendered node (for flexibility) */
  primaryActionIcon?: React.ReactNode;

  productUrl: string;

  // Charity/Specialized Fields (Optional)
  progressBarPercent?: number;
  progressMessage?: string;
  goalDisplay?: string;
  collectedDisplay?: string;
  donationPresets?: number[];
  allowCustomAmount?: boolean;

  onPrimaryAction: (payload?: { amount?: number }) => void;
}

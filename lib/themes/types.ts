export interface ThemeTokens {
  primary: string
  secondary: string
  accent: string
  fontFamily: string
  borderRadius: string
}

export interface StoreProduct {
  id: number | string
  name: string
  price: number
  oldPrice?: number
  discount?: string
  rating?: number
  category?: string
  image: string
  slug?: string
}

export interface StoreMerchant {
  fullName: string
  category: string
  city: string
  country: string
  description?: string | null
}

export interface StoreData {
  name: string
  logo?: string | null
  primaryColor?: string | null
  secondaryColor?: string | null
  accentColor?: string | null
  fontFamily?: string | null
  borderRadius?: string | null
  products?: StoreProduct[]
  merchant?: StoreMerchant
}

export interface ThemeProps {
  storeData: StoreData
}

export interface ThemeTokens {
  primary: string
  secondary: string
  accent: string
  textColor: string
  headingColor: string
  buttonColor: string
  fontFamily: string
  borderRadius: string
  logoWidth: number
  logoHeight: number
  showStoreName: boolean
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
  slug: string
  name: string
  logo?: string | null
  logoWidth?: number | null
  logoHeight?: number | null
  showStoreName?: boolean
  favicon?: string | null
  primaryColor?: string | null
  secondaryColor?: string | null
  accentColor?: string | null
  textColor?: string | null
  headingColor?: string | null
  buttonColor?: string | null
  fontFamily?: string | null
  borderRadius?: string | null
  themeId?: string | null
  products?: StoreProduct[]
  merchant?: StoreMerchant
}

export interface ThemeProps {
  storeData: StoreData
  initialView?: string
}

export type MerchantStatus = "PENDING" | "ACTIVE" | "REJECTED";

export interface StoreInfo {
  id: string;
  slug: string;
  name: string;
  themeId: string | null;
  activityType?: "RETAIL" | "CHARITY";
  isOnboarded: boolean;
  customDomain: string | null;
}

export interface StoreBrandInfo extends StoreInfo {
  logo?: string | null;
  logoWidth?: number | null;
  logoHeight?: number | null;
  showStoreName?: boolean;
  favicon?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  fontFamily?: string | null;
  borderRadius?: string | null;

  // New Settings Fields
  supportEmail?: string | null;
  supportWhatsapp?: string | null;
  socialLinks?: { platform: string; url: string; icon?: string }[] | null;
  systemCurrency?: string;
  currencyIcon?: string | null;
  taxNumber?: string | null;
  taxPercentage?: number;
  isTaxEnabled?: boolean;
}

export interface StoreSettings {
  logo?: string | null;
  favicon?: string | null;
  supportEmail?: string | null;
  supportWhatsapp?: string | null;
  socialLinks?: { platform: string; url: string; icon?: string }[] | null;
  systemCurrency: string;
  currencyIcon?: string | null;
  taxNumber?: string | null;
  taxPercentage: number;
  isTaxEnabled: boolean;
}

export interface MerchantProfile {
  id: string;
  fullName: string;
  storeName: string;
  storeSlug: string;
  status: MerchantStatus;
}

export interface MerchantDashboardData {
  merchant: MerchantProfile;
  store: StoreBrandInfo;
}
export type UserRole = "SUPERADMIN" | "MERCHANT" | "CUSTOMER";
export type StoreRole = "OWNER" | "ADMIN" | "EDITOR" | "MARKETER";

export interface MerchantInfo {
  status: MerchantStatus;
  storeName: string;
  storeSlug: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  role: UserRole;
  currentRole?: StoreRole; // Role in the active store
  merchant?: MerchantInfo | null;
}

export interface PlatformLoginPayload {
  email: string;
  password: string;
}

export interface MerchantRegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  storeName: string;
  category: string;
  country: string;
  city: string;
  description?: string;
}

export interface CustomerLoginPayload {
  email: string;
  password: string;
  storeSlug: string;
}

export interface CustomerRegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  storeSlug: string;
}

// Existing local form types (kept for UI forms)
export interface MerchantRegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  storeName: string;
  category: string;
  country: string;
  city: string;
  description?: string;
  agreedToTerms: boolean;
}

export interface CustomerRegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  agreedToTerms: boolean;
}

// Mock types (kept for legacy parts if used)
export interface MockPlatformUser {
  email: string;
  password: string;
  role: UserRole;
  status?: MerchantStatus;
}

export interface MockCustomer {
  storeSlug: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  createdAt?: number;
}

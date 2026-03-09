export type UserRole = 'SUPERADMIN' | 'MERCHANT' | 'CUSTOMER'
export type MerchantStatus = 'PENDING' | 'ACTIVE' | 'REJECTED'

export interface CurrentUser {
  id: string
  email: string
  role: UserRole
  merchant?: {
    status: MerchantStatus
    storeName: string
    storeSlug: string
  }
}

export interface PlatformLoginPayload {
  email: string
  password: string
}

export interface MerchantRegisterPayload {
  fullName: string
  email: string
  password: string
  phone: string
  storeName: string
  category: string
  country: string
  city: string
  description?: string
}

export interface CustomerLoginPayload {
  email: string
  password: string
  storeSlug: string
}

export interface CustomerRegisterPayload {
  fullName: string
  email: string
  password: string
  phone?: string
  storeSlug: string
}

// Existing local form types (kept for UI forms)
export interface MerchantRegisterFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  storeName: string
  category: string
  country: string
  city: string
  description?: string
  agreedToTerms: boolean
}

export interface CustomerRegisterFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  agreedToTerms: boolean
}

// Mock types (kept for legacy parts if used)
export interface MockPlatformUser {
  email: string
  password: string
  role: UserRole
  status?: MerchantStatus
}

export interface MockCustomer {
  storeSlug: string
  email: string
  password: string
  name: string
  phone?: string
  createdAt?: number
}

export type UserRole = 'superadmin' | 'merchant' | 'customer'
export type MerchantStatus = 'active' | 'pending' | 'rejected'

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

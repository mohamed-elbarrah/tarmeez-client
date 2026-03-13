export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    comparePrice?: number;
    cost?: number;
    quantity: number;
    status: ProductStatus;
    images: string[];
    slug: string;
    category?: string;
    categoryId?: string;
    tags: string[];
    sku?: string;
    barcode?: string;
    trackStock: boolean;
    weight?: number;
    isPhysical: boolean;
    seoTitle?: string;
    seoDesc?: string;
    options?: any[];
    variants?: any[];
    createdAt: string;
}

export interface ProductStats {
    total: number;
    active: number;
    outOfStock: number;
    drafts: number;
}

export interface StoreCustomization {
    logo?: string;
    logoWidth?: number;
    logoHeight?: number;
    showStoreName?: boolean;
    favicon?: string | null;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    storeName?: string;
    textColor?: string;
    headingColor?: string;
    buttonColor?: string;
    fontFamily?: string;
    borderRadius?: string;
}

export interface StoreProduct {
    id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
    status: ProductStatus;
}

export interface StoreData {
    id: string;
    slug: string;
    name: string;
    logo: string | null;
    logoWidth?: number | null;
    logoHeight?: number | null;
    showStoreName?: boolean;
    favicon?: string | null;
    primaryColor: string | null;
    secondaryColor: string | null;
    accentColor?: string | null;
    fontFamily: string | null;
    borderRadius?: string | null;
    storeName?: string | null;
    textColor?: string | null;
    headingColor?: string | null;
    buttonColor?: string | null;
    merchant: {
        fullName: string;
        category: string;
        city: string;
        country: string;
        description: string | null;
    };
    products: StoreProduct[];
}

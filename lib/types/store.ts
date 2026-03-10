export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    comparePrice?: number;
    quantity: number;
    status: ProductStatus;
    images: string[];
    slug: string;
    category?: string;
    tags: string[];
    sku?: string;
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
    favicon?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
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
    merchant: {
        fullName: string;
        category: string;
        city: string;
        country: string;
        description: string | null;
    };
    products: StoreProduct[];
}

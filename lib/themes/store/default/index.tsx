"use client"

import React, { useState } from 'react'
import { resolveTokens } from './config'
import { ThemeProps, StoreProduct } from '../../types'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import AccountPage from './pages/AccountPage'

interface CartItem extends StoreProduct { qty: number }

const MOCK_PRODUCTS: StoreProduct[] = [
  { id: 1, name: "Samsung Galaxy S24 Ultra, 512GB", price: 4499, oldPrice: 5399, discount: "20%", rating: 4.8, category: "جوالات", image: "https://m.media-amazon.com/images/I/71RZAucP-GL._AC_SL1500_.jpg" },
  { id: 2, name: "Apple Watch Series 9 GPS 45mm", price: 1599, oldPrice: 1899, discount: "15%", rating: 4.9, category: "ساعات", image: "https://m.media-amazon.com/images/I/71YdE55GvOL._AC_SL1500_.jpg" },
  { id: 3, name: "Sony WH-1000XM5 Wireless", price: 1249, oldPrice: 1499, rating: 4.7, category: "إلكترونيات", image: "https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SL1200_.jpg" },
  { id: 4, name: "Nike Jordan Brooklyn Hoodie", price: 350, rating: 4.5, category: "موضة", image: "https://m.media-amazon.com/images/I/61N9yD7M45L._AC_SX679_.jpg" },
  { id: 5, name: "Inflatable Beanless Bag Chair", price: 190, oldPrice: 250, rating: 4.2, category: "منزل", image: "https://m.media-amazon.com/images/I/71KkLgG2x6L._AC_SL1500_.jpg" },
  { id: 6, name: "iPhone 15 Pro Max 256GB", price: 4800, oldPrice: 5200, rating: 4.9, category: "جوالات", image: "https://m.media-amazon.com/images/I/81Os13RBOnL._AC_SL1500_.jpg" },
  { id: 7, name: "عطر ديور سوفاج 100 مل", price: 550, rating: 4.7, category: "عطور", image: "https://m.media-amazon.com/images/I/61Iun9G8r3L._AC_SL1000_.jpg" },
  { id: 8, name: "ماكينة قهوة نسبريسو", price: 899, oldPrice: 1100, rating: 4.6, category: "منزل", image: "https://m.media-amazon.com/images/I/61-9p0vV7SL._AC_SL1500_.jpg" },
]

export default function DefaultTheme({ storeData }: ThemeProps) {
  const theme = resolveTokens(storeData)
  
  const [view, setView] = useState('home')
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('الكل')

  const allProducts = storeData.products?.length 
    ? storeData.products 
    : MOCK_PRODUCTS

  const navigate = (v: string, p: StoreProduct | null = null) => {
    if (p) setSelectedProduct(p)
    setView(v)
    if (typeof window !== 'undefined') window.scrollTo(0, 0)
  }

  const addToCart = (p: StoreProduct) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === p.id)
      if (exists) return prev.map(i => i.id === p.id ? {...i, qty: i.qty + 1} : i)
      return [...prev, {...p, qty: 1}]
    })
    navigate('cart')
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <div
      style={{
        '--p-color': theme.primary,
        '--s-color': theme.secondary,
        '--a-color': theme.accent,
        '--radius': theme.borderRadius,
        fontFamily: theme.fontFamily,
      } as React.CSSProperties}
      className="min-h-screen bg-[#f8fafc] text-right text-gray-900"
      dir="rtl"
    >
      <Header
        storeName={storeData.name}
        logo={storeData.logo}
        theme={theme}
        cartCount={cartCount}
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); if (view !== 'products') setView('products') }}
        onNavigate={navigate}
      />

      {view === 'home' && (
        <HomePage
          theme={theme}
          products={allProducts}
          onNavigate={navigate}
          onCategorySelect={(cat) => { setSelectedCategory(cat); navigate('products') }}
        />
      )}

      {view === 'products' && (
        <ProductsPage
          theme={theme}
          products={allProducts}
          initialSearch={searchQuery}
          initialCategory={selectedCategory}
          onProductClick={(p) => navigate('product', p)}
        />
      )}

      {view === 'product' && selectedProduct && (
        <ProductDetailPage
          theme={theme}
          product={selectedProduct}
          onAddToCart={addToCart}
          onBack={() => navigate('products')}
        />
      )}

      {view === 'cart' && (
        <CartPage
          theme={theme}
          cart={cart}
          onUpdateQty={(id, delta) => setCart(prev =>
            prev.map(i => i.id === id ? {...i, qty: Math.max(1, i.qty + delta)} : i)
          )}
          onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))}
          onContinueShopping={() => navigate('home')}
        />
      )}

      {view === 'account' && (
        <AccountPage theme={theme} products={allProducts} />
      )}

      <Footer
        storeName={storeData.name}
        logo={storeData.logo}
        theme={theme}
        onNavigate={navigate}
      />
    </div>
  )
}

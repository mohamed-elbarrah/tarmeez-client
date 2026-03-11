import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  id: string | number
  name: string
  price: number
  image?: string | null
  quantity: number
  slug?: string
}

interface CartState {
  items: CartItem[]
  storeSlug: string | null
}

const initialState: CartState = { items: [], storeSlug: null }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const it = action.payload
      const existing = state.items.find(i => i.id === it.id)
      if (existing) {
        existing.quantity += it.quantity
      } else {
        state.items.push(it)
      }
    },
    removeItem(state, action: PayloadAction<string | number>) {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
    updateQuantity(state, action: PayloadAction<{ id: string | number; quantity: number }>) {
      const { id, quantity } = action.payload
      const it = state.items.find(i => i.id === id)
      if (it) it.quantity = Math.max(1, quantity)
    },
    clearCart(state) {
      state.items = []
      state.storeSlug = null
    },
    setStoreSlug(state, action: PayloadAction<string | null>) {
      state.storeSlug = action.payload
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart, setStoreSlug } = cartSlice.actions

export default cartSlice.reducer

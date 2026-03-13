import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  id: string | number
  name: string
  price: number
  image?: string | null
  quantity: number
  slug?: string
}

interface CartStore {
  items: CartItem[]
}

interface CartState {
  carts: Record<string, CartStore>
}

const initialState: CartState = { carts: {} }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<{ storeSlug: string; item: CartItem }>) {
      const { storeSlug, item } = action.payload
      if (!state.carts[storeSlug]) state.carts[storeSlug] = { items: [] }
      const cart = state.carts[storeSlug]
      const existing = cart.items.find(i => i.id === item.id)
      if (existing) {
        existing.quantity += item.quantity
      } else {
        cart.items.push(item)
      }
    },
    removeItem(state, action: PayloadAction<{ storeSlug: string; id: string | number }>) {
      const { storeSlug, id } = action.payload
      if (state.carts[storeSlug]) {
        state.carts[storeSlug].items = state.carts[storeSlug].items.filter(i => i.id !== id)
      }
    },
    updateQuantity(state, action: PayloadAction<{ storeSlug: string; id: string | number; quantity: number }>) {
      const { storeSlug, id, quantity } = action.payload
      const cart = state.carts[storeSlug]
      if (cart) {
        const it = cart.items.find(i => i.id === id)
        if (it) it.quantity = Math.max(1, quantity)
      }
    },
    clearCart(state, action: PayloadAction<string>) {
      const storeSlug = action.payload
      if (state.carts[storeSlug]) {
        state.carts[storeSlug].items = []
      }
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions

export default cartSlice.reducer

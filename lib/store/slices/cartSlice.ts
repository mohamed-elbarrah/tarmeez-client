import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
  slug?: string;
  /** The selected variant's ID — undefined when product has no variants */
  variantId?: string;
  /** Human-readable map of selections e.g. { "اللون": "أحمر", "المقاس": "L" } */
  selectedOptions?: Record<string, string>;
  /** True when this item is a donation (charity mode) */
  isDonation?: boolean;
}

interface CartStore {
  items: CartItem[];
}

interface CartState {
  carts: Record<string, CartStore>;
}

/** Two cart lines are the same only when both product ID and variant ID match */
function isSameLine(a: CartItem, b: CartItem): boolean {
  return a.id === b.id && (a.variantId ?? null) === (b.variantId ?? null);
}

const initialState: CartState = { carts: {} };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(
      state,
      action: PayloadAction<{ storeSlug: string; item: CartItem }>,
    ) {
      const { storeSlug, item } = action.payload;
      if (!state.carts[storeSlug]) state.carts[storeSlug] = { items: [] };
      const cart = state.carts[storeSlug];
      const existing = cart.items.find((i) => isSameLine(i, item));
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        cart.items.push(item);
      }
    },
    removeItem(
      state,
      action: PayloadAction<{
        storeSlug: string;
        id: string | number;
        variantId?: string;
      }>,
    ) {
      const { storeSlug, id, variantId } = action.payload;
      if (state.carts[storeSlug]) {
        state.carts[storeSlug].items = state.carts[storeSlug].items.filter(
          (i) =>
            !(i.id === id && (i.variantId ?? null) === (variantId ?? null)),
        );
      }
    },
    updateQuantity(
      state,
      action: PayloadAction<{
        storeSlug: string;
        id: string | number;
        variantId?: string;
        quantity: number;
      }>,
    ) {
      const { storeSlug, id, variantId, quantity } = action.payload;
      const cart = state.carts[storeSlug];
      if (cart) {
        const it = cart.items.find(
          (i) => i.id === id && (i.variantId ?? null) === (variantId ?? null),
        );
        if (it) it.quantity = Math.max(1, quantity);
      }
    },
    clearCart(state, action: PayloadAction<string>) {
      const storeSlug = action.payload;
      if (state.carts[storeSlug]) {
        state.carts[storeSlug].items = [];
      }
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;

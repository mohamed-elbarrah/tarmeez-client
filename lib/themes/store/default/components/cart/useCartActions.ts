"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { removeItem, updateQuantity } from "@/lib/store/slices/cartSlice";
import { cartAbandoned } from "@/lib/store/analytics-listener";
import { store } from "@/lib/store";
import type { CartItem } from "@/lib/store/slices/cartSlice";

/**
 * All interactive cart logic: qty update, removal, and abandon-event on unmount.
 * Zero JSX — pure logic / RTK bridge.
 */
export function useCartActions(storeSlug: string) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(
    (state): CartItem[] => state.cart.carts[storeSlug]?.items ?? [],
  );

  // Fire cart_abandon ONLY when user leaves with items and did NOT go to checkout
  useEffect(() => {
    return () => {
      const items = store.getState().cart.carts[storeSlug]?.items ?? [];
      if (items.length > 0 && !window.location.pathname.includes("/checkout")) {
        dispatch(
          cartAbandoned({ storeRef: storeSlug, itemCount: items.length }),
        );
      }
    };
    // storeSlug is stable for the lifetime of the page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateQty = (id: string | number, delta: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      dispatch(
        updateQuantity({ storeSlug, id, quantity: item.quantity + delta }),
      );
    }
  };

  const removeCartItem = (id: string | number) => {
    dispatch(removeItem({ storeSlug, id }));
  };

  return { cartItems, updateQty, removeCartItem } as const;
}

'use client'

import { createListenerMiddleware, createAction } from '@reduxjs/toolkit'
import { addItem } from './slices/cartSlice'
import { ordersApi } from '../services/ordersApi'

export const analyticsListenerMiddleware = createListenerMiddleware()

const startListening = analyticsListenerMiddleware.startListening

// ─── Custom analytics actions ─────────────────────────────────────────────────

export const productViewed = createAction<{
  productId: string
  storeRef: string
}>('analytics/productViewed')

export const checkoutStarted = createAction<{
  storeRef: string
  cartTotal: number
}>('analytics/checkoutStarted')

// Dispatched explicitly from CartPage on unmount — NEVER on purchase or store switch
export const cartAbandoned = createAction<{
  storeRef: string
  itemCount: number
}>('analytics/cartAbandoned')

// ─── Internal send helper ────────────────────────────────────────────────────

const ANALYTICS_ENDPOINT =
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api')
    .replace(/\/api$/, '') + '/api/analytics/collect'

function track(
  type: string,
  storeRef: string,
  page: string,
  metadata?: Record<string, unknown>,
) {
  try {
    if (typeof window === 'undefined') return
    if (typeof navigator?.sendBeacon !== 'function') return
    if (!storeRef) return

    const sessionId =
      sessionStorage.getItem('_tmz') ||
      Math.random().toString(36).slice(2) + Date.now().toString(36)

    // Wrap in Blob so sendBeacon sends application/json (plain string → text/plain → body parser ignores it)
    navigator.sendBeacon(
      ANALYTICS_ENDPOINT,
      new Blob(
        [
          JSON.stringify({
            type,
            storeRef,
            sessionId,
            page: window.location.pathname,
            ts: Date.now(),
            ...(metadata ? { metadata } : {}),
          }),
        ],
        { type: 'application/json' },
      ),
    )
  } catch (_) {
    // Always silent — ANALYTICS-RULE 4
  }
}

// ─── Listeners ───────────────────────────────────────────────────────────────

// Cart add — fired when user adds a product to cart
startListening({
  actionCreator: addItem,
  effect: (action) => {
    track('cart_add', action.payload.storeSlug, window.location.pathname, {
      productId: String(action.payload.item.id),
    })
  },
})

// Cart abandon — ONLY fires from CartPage unmount when user leaves with items
// (NOT from clearCart — that fires on purchase AND store switch too)
startListening({
  actionCreator: cartAbandoned,
  effect: (action) => {
    track('cart_abandon', action.payload.storeRef, window.location.pathname, {
      itemCount: action.payload.itemCount,
    })
  },
})

// Product view — dispatched from ProductDetailPage on mount
startListening({
  actionCreator: productViewed,
  effect: (action) => {
    track('product_view', action.payload.storeRef, window.location.pathname, {
      productId: action.payload.productId,
    })
  },
})

// Checkout start — dispatched from CheckoutPage on mount
startListening({
  actionCreator: checkoutStarted,
  effect: (action) => {
    track('checkout_start', action.payload.storeRef, window.location.pathname, {
      cartTotal: action.payload.cartTotal,
    })
  },
})

// Order fulfilled — clear-cart already fired; purchase counted via Orders model (ANALYTICS-RULE 10)
// No separate tracking event needed — funnel queries Orders table directly
startListening({
  matcher: ordersApi.endpoints.createOrder.matchFulfilled,
  effect: (_action, _listenerApi) => {
    // Intentionally empty — ANALYTICS-RULE 10: revenue comes from Orders model, not events
  },
})

'use client'

import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import { authApi } from '@/lib/services/authApi'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'

type Props = {
  children: React.ReactNode
}

function InitAuth({ children }: Props) {
  const dispatch = useAppDispatch()
  const isInitialized = useAppSelector((s) => s.auth.isInitialized)

  useEffect(() => {
    // initiate getMe to populate user state on mount
    dispatch(authApi.endpoints.getMe.initiate())
  }, [dispatch])

  if (!isInitialized) return null
  return <>{children}</>
}

export default function StoreProvider({ children }: Props) {
  return (
    <Provider store={store}>
      <InitAuth>{children}</InitAuth>
    </Provider>
  )
}

"use client"

import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import { authApi } from '@/lib/services/authApi'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { useRouter, usePathname } from 'next/navigation'

type Props = {
  children: React.ReactNode
}

function InitAuth({ children }: Props) {
  const dispatch = useAppDispatch()
  const isInitialized = useAppSelector((s) => s.auth.isInitialized)
  const user = useAppSelector((s) => s.auth.user)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // initiate getMe to populate user state on mount
    dispatch(authApi.endpoints.getMe.initiate())
  }, [dispatch])

  useEffect(() => {
    // once initialized, redirect unauthenticated users to home
    if (isInitialized && !user) {
      // allow public routes: home, login, register, store (and any store subpath)
      const publicPaths = ['/', '/login', '/register', '/store']
      const isStorePath = pathname ? pathname.startsWith('/store') : false
      if (pathname && !(publicPaths.includes(pathname) || isStorePath)) router.push('/')
    }
  }, [isInitialized, user, pathname, router])

  if (!isInitialized)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="loader">جاري التحميل...</div>
      </div>
    )

  return <>{children}</>
}

export default function StoreProvider({ children }: Props) {
  return (
    <Provider store={store}>
      <InitAuth>{children}</InitAuth>
    </Provider>
  )
}

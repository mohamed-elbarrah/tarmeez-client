import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CurrentUser } from '@/lib/types/auth'

interface AuthState {
  user: CurrentUser | null
  isLoading: boolean
  isInitialized: boolean
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isInitialized: false,
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<CurrentUser | null>) {
      state.user = action.payload
    },
    setInitialized(state, action: PayloadAction<boolean>) {
      state.isInitialized = action.payload
    },
    clearUser(state) {
      state.user = null
    },
  },
})

export const { setUser, setInitialized, clearUser } = slice.actions
export default slice.reducer

import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { clearUser } from '@/lib/store/slices/authSlice'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export const baseQuery = fetchBaseQuery({
    baseUrl,
    credentials: 'include',
})

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    // Check if we got a 401 error
    if (result.error && result.error.status === 401) {
        // We don't want to refresh if the failed request was already for refresh or logout
        const url = typeof args === 'string' ? args : args.url
        if (url !== '/auth/refresh' && url !== '/auth/logout') {
            // Try to refresh tokens
            const refreshResult = await baseQuery(
                { url: '/auth/refresh', method: 'POST' },
                api,
                extraOptions
            )

            if (refreshResult.data) {
                // Refresh successful, retry original request
                result = await baseQuery(args, api, extraOptions)
            } else {
                // Refresh failed, clear user state
                api.dispatch(clearUser())
            }
        }
    }

    return result
}

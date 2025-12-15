"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

export function useQueryState(key: string, defaultValue: string = "") {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    // Get initial value from URL or default
    const value = searchParams.get(key) || defaultValue

    // Update URL function
    const setValue = React.useCallback((newValue: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (newValue && newValue !== defaultValue) {
            params.set(key, newValue)
        } else {
            params.delete(key)
        }

        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, [key, defaultValue, searchParams, pathname, router])

    return [value, setValue] as const
}

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState(value)

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        return () => clearTimeout(handler)
    }, [value, delay])

    return debouncedValue
}

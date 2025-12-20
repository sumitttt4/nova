"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

export const LiveMap = dynamic(() => import("./LiveMapClient"), {
    loading: () => <Skeleton className="h-full w-full rounded-lg" />,
    ssr: false
})

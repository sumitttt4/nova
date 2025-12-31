"use client"

import * as React from "react"
import { Activity, Package, Bike, Store, TrendingUp, Clock } from "lucide-react"
import { useMockData } from "@/contexts/MockDataContext"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface ActivityItem {
    id: string
    type: 'order' | 'rider' | 'merchant' | 'system'
    message: string
    timestamp: Date
    icon: React.ReactNode
}

export function LiveTicker() {
    const { orders, riders, merchants } = useMockData()
    const [activities, setActivities] = React.useState<ActivityItem[]>([])
    const [isLive, setIsLive] = React.useState(true)

    // Generate activity feed from mock data
    const generateActivities = React.useCallback(() => {
        const newActivities: ActivityItem[] = []

        // Recent orders
        orders.slice(0, 3).forEach((order, i) => {
            newActivities.push({
                id: `order-${order.id}-${Date.now()}`,
                type: 'order',
                message: `Order #${order.id.slice(-6)} ${order.status === 'delivered' ? 'delivered' : order.status === 'out_for_delivery' ? 'out for delivery' : 'placed'}`,
                timestamp: new Date(order.createdAt),
                icon: <Package className="h-3 w-3" />
            })
        })

        // Active riders
        riders.filter(r => r.status === 'active').slice(0, 2).forEach((rider) => {
            newActivities.push({
                id: `rider-${rider.id}-${Date.now()}`,
                type: 'rider',
                message: `${rider.name} is now online`,
                timestamp: new Date(),
                icon: <Bike className="h-3 w-3" />
            })
        })

        // New merchants
        merchants.filter(m => m.status === 'approved').slice(0, 1).forEach((merchant) => {
            newActivities.push({
                id: `merchant-${merchant.id}-${Date.now()}`,
                type: 'merchant',
                message: `${merchant.storeName} store is active`,
                timestamp: new Date(merchant.submittedAt),
                icon: <Store className="h-3 w-3" />
            })
        })

        // Shuffle and limit to 5
        return newActivities.sort(() => Math.random() - 0.5).slice(0, 5)
    }, [orders, riders, merchants])

    // Initial load
    React.useEffect(() => {
        setActivities(generateActivities())
    }, [generateActivities])

    // Update every 5 seconds
    React.useEffect(() => {
        if (!isLive) return

        const interval = setInterval(() => {
            setActivities(prev => {
                const newActivity = generateActivities()[0]
                if (!newActivity) return prev
                return [newActivity, ...prev.slice(0, 4)]
            })
        }, 5000)

        return () => clearInterval(interval)
    }, [isLive, generateActivities])

    const typeColors = {
        order: 'text-blue-600 bg-blue-50',
        rider: 'text-green-600 bg-green-50',
        merchant: 'text-purple-600 bg-purple-50',
        system: 'text-slate-600 bg-slate-50'
    }

    return (
        <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-semibold text-slate-700">Live Activity</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className={cn(
                            "absolute inline-flex h-full w-full rounded-full opacity-75",
                            isLive ? "animate-ping bg-[#278F27]" : "bg-slate-400"
                        )}></span>
                        <span className={cn(
                            "relative inline-flex rounded-full h-2 w-2",
                            isLive ? "bg-[#278F27]" : "bg-slate-400"
                        )}></span>
                    </span>
                    <button
                        onClick={() => setIsLive(!isLive)}
                        className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded",
                            isLive ? "text-[#278F27] bg-[#278F27]/10" : "text-slate-500 bg-slate-100"
                        )}
                    >
                        {isLive ? 'LIVE' : 'PAUSED'}
                    </button>
                </div>
            </div>

            <div className="divide-y divide-slate-50">
                {activities.map((activity, index) => (
                    <div
                        key={activity.id}
                        className={cn(
                            "flex items-center gap-3 px-4 py-2.5 transition-all duration-300",
                            index === 0 && "bg-slate-50/50 animate-in slide-in-from-top-2"
                        )}
                    >
                        <div className={cn(
                            "p-1.5 rounded-lg",
                            typeColors[activity.type]
                        )}>
                            {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-700 truncate">{activity.message}</p>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Clock className="h-3 w-3" />
                            <span className="whitespace-nowrap">
                                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

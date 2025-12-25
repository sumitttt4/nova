"use client"

import * as React from "react"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"
import {
    Users,
    Store,
    Wallet,
    TrendingUp,
    ShoppingBag,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    MoreHorizontal,
    Bike,
    ChevronRight,
    Map
} from "lucide-react"
import Link from "next/link"
import {
    Tooltip as UITooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { DeliveryPerformance } from "@/components/dashboard/DeliveryPerformance"
import { useMockData } from "@/contexts/MockDataContext"
import { useStore } from "@/lib/store"
import { isSameDay, isSameMonth, isSameYear, subDays, formatDistanceToNow, subMinutes, subHours } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

// --- Mock Data ---
const DATA_SETS = {
    daily: [
        { name: "00:00", value: 400, previous: 350 },
        { name: "04:00", value: 200, previous: 220 },
        { name: "08:00", value: 1200, previous: 1100 },
        { name: "12:00", value: 3800, previous: 3400 },
        { name: "16:00", value: 4200, previous: 3900 },
        { name: "20:00", value: 5400, previous: 4800 },
        { name: "23:59", value: 3100, previous: 2900 },
    ],
    monthly: [
        { name: "Week 1", value: 12500, previous: 11000 },
        { name: "Week 2", value: 18900, previous: 17500 },
        { name: "Week 3", value: 15400, previous: 16000 },
        { name: "Week 4", value: 24500, previous: 22000 },
    ],
    yearly: [
        { name: "Jan", value: 45000, previous: 40000 },
        { name: "Mar", value: 85000, previous: 78000 },
        { name: "Jun", value: 65000, previous: 62000 },
        { name: "Sep", value: 95000, previous: 88000 },
        { name: "Dec", value: 120000, previous: 110000 },
    ]
}

export default function DashboardPage() {
    const { orders, users } = useMockData()
    const { connectSocket, disconnectSocket, isConnected, notifications } = useStore()
    const [isLoading, setIsLoading] = React.useState(true)

    // Simulate initial data fetch
    React.useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000)
        return () => clearTimeout(timer)
    }, [])

    // Connect to HQ Socket on mount
    React.useEffect(() => {
        connectSocket()
        return () => disconnectSocket()
    }, [connectSocket, disconnectSocket])

    const [timeRange, setTimeRange] = React.useState<"daily" | "monthly" | "yearly">("daily")
    const [chartData, setChartData] = React.useState(DATA_SETS.daily)
    const [isAnimating, setIsAnimating] = React.useState(false)

    // Handle data switch with simple transition effect
    React.useEffect(() => {
        if (isLoading) return
        setIsAnimating(true)
        const timer = setTimeout(() => {
            setChartData(DATA_SETS[timeRange])
            setIsAnimating(false)
        }, 200)
        return () => clearTimeout(timer)
    }, [timeRange, isLoading])

    // --- Dynamic Calculations ---
    const now = new Date()
    const filteredOrders = React.useMemo(() => {
        return orders.filter(order => {
            const orderDate = new Date(order.createdAt)
            if (timeRange === 'daily') return isSameDay(orderDate, now)
            if (timeRange === 'monthly') return isSameMonth(orderDate, now)
            if (timeRange === 'yearly') return isSameYear(orderDate, now)
            return true
        })
    }, [orders, timeRange])

    const totalRevenue = filteredOrders.reduce((acc, curr) => acc + curr.amount, 0)
    const totalOrders = filteredOrders.length
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

    // Dynamic Activity Feed with Freshness
    const [recentActivity, setRecentActivity] = React.useState([
        {
            id: 'init-1',
            type: "order",
            title: "New Order #4092",
            description: "Burger King • ₹450 paid",
            timestamp: subMinutes(new Date(), 2),
            status: "success",
            icon: ShoppingBag
        },
        {
            id: 'init-2',
            type: "alert",
            title: "High Demand Alert",
            description: "Koramangala Zone overload",
            timestamp: subMinutes(new Date(), 5),
            status: "warning",
            icon: TrendingUp
        },
        {
            id: 'init-3',
            type: "store",
            title: "Store Went Live",
            description: "Fresh Mart is now open",
            timestamp: subMinutes(new Date(), 15),
            status: "success",
            icon: Store
        },
        {
            id: 'init-4',
            type: "payout",
            title: "Payout Processed",
            description: "Batch #9921 settled",
            timestamp: subHours(new Date(), 1),
            status: "info",
            icon: Wallet
        }
    ])

    // Live Ticker Effect
    React.useEffect(() => {
        if (isLoading || users.length === 0) return

        const interval = setInterval(() => {
            const randomUser = users[Math.floor(Math.random() * users.length)]
            const randomAmount = Math.floor(Math.random() * 2000) + 100

            const newActivity = {
                id: `live-${Date.now()}`,
                type: "order",
                title: `Order from ${randomUser.name.split(' ')[0]}`,
                description: `Placed order for ₹${randomAmount}`,
                timestamp: new Date(),
                status: "success",
                icon: ShoppingBag
            }

            setRecentActivity(prev => [newActivity, ...prev].slice(0, 5))
        }, 5000)

        return () => clearInterval(interval)
    }, [isLoading, users])

    if (isLoading) {
        return (
            <div className="space-y-8 pb-8">
                {/* Header Skeleton */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-64 rounded-xl" />
                </div>

                {/* Metrics Grid Skeleton */}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-[180px] rounded-2xl" />
                    ))}
                </div>

                {/* Main Content Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Skeleton className="lg:col-span-2 h-[450px] rounded-3xl" />
                    <Skeleton className="h-[450px] rounded-3xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-8">
            {/* Header & Control Deck */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Overviews</h1>
                    <p className="text-slate-500 font-medium mt-1">Hello Sumit, here's what's happening {timeRange === 'daily' ? 'today' : timeRange === 'monthly' ? 'this month' : 'this year'}.</p>
                </div>

                <div className="bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-1">
                    {(["Daily", "Monthly", "Yearly"] as const).map((range) => {
                        const value = range.toLowerCase() as "daily" | "monthly" | "yearly"
                        const isActive = timeRange === value
                        return (
                            <button
                                key={range}
                                onClick={() => setTimeRange(value)}
                                className={cn(
                                    "px-4 py-2 text-xs font-bold rounded-lg transition-all duration-300",
                                    isActive
                                        ? "bg-slate-900 text-white shadow-md transform scale-105"
                                        : "text-slate-500 hover:bg-gray-50 hover:text-slate-700"
                                )}
                            >
                                {range}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* High-Density Metrics Grid */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {/* 1. CAPACITY & DEMAND */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Bike className="h-4 w-4 text-slate-500" />
                            Live Capacity
                        </h3>
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-xs font-semibold text-slate-500">Active Orders</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{totalOrders}</p>
                            <Link href="/orders/live" className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 mt-2">
                                Track Live <ChevronRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-xs font-semibold text-slate-500">Online Riders</p>
                            <div className="flex items-end gap-1 mt-1">
                                <p className="text-2xl font-bold text-slate-900">42</p>
                                <span className="text-[10px] text-green-600 font-bold mb-1">/ 58</span>
                            </div>
                            <p className="text-[10px] font-medium text-green-600 mt-2 flex items-center">
                                <ArrowUpRight className="h-3 w-3 mr-0.5" /> High Supply
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. REVENUE PERFORMANCE */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-slate-500" />
                            Financial Performance
                        </h3>
                        <div className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-100">
                            +8.2% vs last msg
                        </div>
                    </div>

                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400">Total Revenue</p>
                            <h2 className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">
                                ₹{totalRevenue.toLocaleString()}
                            </h2>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-semibold text-slate-400">Avg. Order Value</p>
                            <p className="text-lg font-bold text-slate-700 mt-0.5">₹{avgOrderValue}</p>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-50">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-[#2BD67C] w-[65%]" title="Food" />
                            <div className="h-full bg-blue-400 w-[20%]" title="Delivery" />
                            <div className="h-full bg-amber-400 w-[15%]" title="Taxes" />
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] font-medium text-slate-400">
                            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#2BD67C]" /> Item Total</span>
                            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Fees</span>
                            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Tax</span>
                        </div>
                    </div>
                </div>

                {/* 3. DELIVERY PERFORMANCE (New Widget) */}
                <DeliveryPerformance />

                {/* 4. NETWORK HEALTH */}
                <div className={cn(
                    "rounded-2xl border bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between transition-colors duration-300",
                    (92 - 85) > 0 ? "border-red-200 bg-red-50/30" : "border-gray-100"
                )}>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Store className="h-4 w-4 text-slate-500" />
                            Network Status
                        </h3>
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${isConnected ? 'bg-green-50 text-green-700 border-green-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-rose-500 animate-pulse'}`} />
                            {isConnected ? "HQ LIVE" : "OFFLINE"}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 h-full items-end">
                        <Link href="/stores" className="group cursor-pointer">
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">85</span>
                                <span className="text-sm font-medium text-slate-400">/ 92</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-xs font-semibold text-slate-500">Active Stores</p>
                                {(92 - 85) > 0 && (
                                    <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-md animate-pulse">
                                        {92 - 85} Down
                                    </span>
                                )}
                            </div>
                            <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className={cn("h-full w-[92%] rounded-full transition-colors", (92 - 85) > 0 ? "bg-amber-500" : "bg-green-500")} />
                            </div>
                        </Link>

                        <div className="pl-4 border-l border-slate-100">
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-slate-900">12.4k</span>
                            </div>
                            <p className="text-xs font-semibold text-slate-500 mt-1">Total Users</p>
                            <p className="text-[10px] text-green-600 font-bold mt-1.5">+124 this week</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Split-View Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Revenue Trends (2/3) */}
                <div className="lg:col-span-2 rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-slate-900 text-xl">Revenue Trends</h3>
                            <p className="text-sm font-medium text-slate-500 mt-1">
                                {timeRange === 'daily' ? 'Today\'s performance' : timeRange === 'monthly' ? 'This month\'s performance' : 'Yearly performance'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="rounded-lg h-9">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className={cn("h-[350px] w-full transition-opacity duration-300", isAnimating ? "opacity-50" : "opacity-100")}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2BD67C" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2BD67C" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#94A3B8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                    fontWeight={500}
                                />
                                <YAxis
                                    stroke="#94A3B8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `₹${value}`}
                                    fontWeight={500}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        padding: '12px 16px'
                                    }}
                                    itemStyle={{ color: '#1E293B' }}
                                    cursor={{ stroke: '#2BD67C', strokeWidth: 2 }}
                                    formatter={(value: number, name: string) => [
                                        `₹${value}`,
                                        name === "value" ? "Revenue" : "Projected"
                                    ]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="previous"
                                    stroke="#cbd5e1"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    fillOpacity={0}
                                    fill="transparent"
                                />
                                <Area
                                    type="linear"
                                    dataKey="value"
                                    stroke="#2BD67C"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                    animationDuration={1000}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center gap-8 mt-6">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-[#2BD67C]" />
                            <span className="text-xs font-semibold text-slate-600">Actual Revenue</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-gray-300" />
                            <span className="text-xs font-semibold text-slate-400">Projected</span>
                        </div>
                    </div>
                </div>

                {/* Right: Live Operations Feed (1/3) */}
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-slate-900 text-xl">Live Activity</h3>
                        <div className="relative">
                            <div className="absolute -right-1 -top-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                            <Clock className="h-5 w-5 text-slate-400" />
                        </div>
                    </div>

                    <div className="flex flex-col h-full">
                        <div className="relative pl-3 flex-1">
                            {/* Timeline Line */}
                            <div className="absolute left-[19px] top-3 bottom-4 w-[2px] bg-slate-100/80 rounded-full" />

                            <div className="space-y-8 pb-4">
                                {recentActivity.map((item) => (
                                    <div key={item.id} className="relative flex gap-4 group cursor-pointer animate-in slide-in-from-right-4 duration-500">
                                        {/* Icon Indicator */}
                                        <div className={cn(
                                            "relative z-10 flex-none h-10 w-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-transform duration-200 group-hover:scale-110",
                                            item.status === 'success' ? 'bg-green-50 text-green-600 ring-1 ring-green-100' :
                                                item.status === 'warning' ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-100' :
                                                    'bg-slate-50 text-slate-600 ring-1 ring-slate-100'
                                        )}>
                                            <item.icon className="h-4 w-4" />
                                        </div>

                                        <div className="flex-1 py-1">
                                            <div className="flex justify-between items-center gap-2">
                                                <p className="text-sm font-bold text-slate-900 group-hover:text-[#2BD67C] transition-colors line-clamp-1">{item.title}</p>
                                                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap">
                                                    {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-500 mt-0.5 leading-relaxed truncate">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Link href="/orders" className="block w-full">
                            <button className="w-full mt-6 py-3 text-sm font-bold text-slate-600 hover:text-white hover:bg-slate-900 rounded-xl transition-all duration-300 border-2 border-slate-100 hover:border-slate-900">
                                View Full Feed
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div >
    )
}

function Button({ children, variant, size, className, ...props }: any) {
    return <button className={className} {...props}>{children}</button>
}

// Reusable Metric Component with Semantic Variants
function MetricCard({ title, icon: Icon, mainValue, subValue, trend, trendUp, variant = "neutral" }: any) {

    // Semantic Styling Map
    const styles = {
        neutral: {
            iconBg: "bg-slate-50 border-slate-100",
            iconColor: "text-slate-600",
            ringColor: "group-hover:ring-slate-200"
        },
        success: {
            iconBg: "bg-green-50 border-green-100",
            iconColor: "text-[#2BD67C]",
            ringColor: "group-hover:ring-green-200"
        },
        warning: {
            iconBg: "bg-amber-50 border-amber-100",
            iconColor: "text-amber-600",
            ringColor: "group-hover:ring-amber-200"
        },
        danger: {
            iconBg: "bg-red-50 border-red-100",
            iconColor: "text-red-600",
            ringColor: "group-hover:ring-red-200"
        }
    }

    // @ts-ignore
    const currentStyle = styles[variant] || styles.neutral;

    return (
        <div className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group ring-1 ring-transparent ${currentStyle.ringColor}`}>
            <div className="relative z-10 flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl shadow-sm border ${currentStyle.iconBg} ${currentStyle.iconColor}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className={`
                    flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm border
                    ${trendUp ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}
                `}>
                    {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {trend}
                </div>
            </div>
            <div className="relative z-10">
                <p className="text-sm font-semibold text-slate-500">{title}</p>
                <div className="flex items-baseline gap-2 mt-2">
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{mainValue}</h3>
                </div>
                <div className="text-xs font-medium text-slate-400 mt-2">{subValue}</div>
            </div>
        </div>
    )
}



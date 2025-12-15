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
    MoreHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useMockData } from "@/contexts/MockDataContext"
import { useStore } from "@/lib/store"
import { isSameDay, isSameMonth, isSameYear, subDays } from "date-fns"

// --- Mock Data ---
const DATA_SETS = {
    daily: [
        { name: "00:00", value: 400 },
        { name: "04:00", value: 200 },
        { name: "08:00", value: 1200 },
        { name: "12:00", value: 3800 },
        { name: "16:00", value: 4200 },
        { name: "20:00", value: 5400 },
        { name: "23:59", value: 3100 },
    ],
    monthly: [
        { name: "Week 1", value: 12500 },
        { name: "Week 2", value: 18900 },
        { name: "Week 3", value: 15400 },
        { name: "Week 4", value: 24500 },
    ],
    yearly: [
        { name: "Jan", value: 45000 },
        { name: "Mar", value: 85000 },
        { name: "Jun", value: 65000 },
        { name: "Sep", value: 95000 },
        { name: "Dec", value: 120000 },
    ]
}

const recentActivity = [
    {
        id: 1,
        type: "order",
        title: "New Order #4092",
        description: "Burger King • ₹450 paid",
        time: "2 mins ago",
        status: "success",
        icon: ShoppingBag
    },
    {
        id: 2,
        type: "alert",
        title: "High Demand Alert",
        description: "Koramangala Zone overload",
        time: "5 mins ago",
        status: "warning",
        icon: TrendingUp
    },
    {
        id: 3,
        type: "store",
        title: "Store Went Live",
        description: "Fresh Mart is now open",
        time: "15 mins ago",
        status: "success",
        icon: Store
    },
    {
        id: 4,
        type: "payout",
        title: "Payout Processed",
        description: "Batch #9921 settled",
        time: "1 hour ago",
        status: "info",
        icon: Wallet
    }
]

export default function DashboardPage() {
    const { orders } = useMockData()
    const { connectSocket, disconnectSocket, isConnected, notifications } = useStore()

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
        setIsAnimating(true)
        const timer = setTimeout(() => {
            setChartData(DATA_SETS[timeRange])
            setIsAnimating(false)
        }, 200)
        return () => clearTimeout(timer)
    }, [timeRange])

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

    return (
        <div className="space-y-8 pb-8">
            {/* Header & Control Deck */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Overviews</h1>
                    <p className="text-slate-500 font-medium mt-1">Hello Maniya, here's what's happening {timeRange === 'daily' ? 'today' : timeRange === 'monthly' ? 'this month' : 'this year'}.</p>
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

            {/* Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Users"
                    icon={Users}
                    mainValue="12,450"
                    subValue="Active: 854"
                    trend="+12%"
                    trendUp={true}
                    color="blue"
                    gradient="from-blue-50 to-indigo-50/50"
                />

                {/* Store Health */}
                <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-orange-50/30 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-orange-100/50">
                            <Store className="h-6 w-6 text-orange-500" />
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border shadow-sm ${isConnected ? 'border-green-100' : 'border-slate-100'}`}>
                            <span className="relative flex h-2.5 w-2.5">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'bg-green-400' : 'bg-slate-400'}`}></span>
                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isConnected ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                            </span>
                            <span className={`text-[11px] font-bold tracking-wide ${isConnected ? 'text-green-700' : 'text-slate-500'}`}>
                                {isConnected ? "LIVE HQ" : "OFFLINE"}
                            </span>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500">Store Health</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <h3 className="text-3xl font-bold text-slate-900 group-hover:scale-105 transition-transform origin-left">85/92</h3>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 w-[92%] rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                <MetricCard
                    title="Calculated Revenue"
                    icon={Wallet}
                    mainValue={`₹${totalRevenue.toLocaleString()}`}
                    subValue={`Avg Order: ₹${avgOrderValue}`}
                    trend="+8.2%"
                    trendUp={true}
                    color="green"
                    gradient="from-emerald-50 to-teal-50/50"
                />

                <MetricCard
                    title="Active Orders"
                    icon={ShoppingBag}
                    mainValue={totalOrders.toString()}
                    subValue="Live Tracking"
                    trend="-2.1%"
                    trendUp={false}
                    color="purple"
                    gradient="from-purple-50 to-pink-50/50"
                />
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
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#2BD67C"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                    animationDuration={1000}
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

                    <div className="relative pl-3">
                        {/* Timeline Line */}
                        <div className="absolute left-[19px] top-3 bottom-0 w-[2px] bg-slate-100/80 rounded-full" />

                        <div className="space-y-8">
                            {recentActivity.map((item) => (
                                <div key={item.id} className="relative flex gap-4 group cursor-pointer">
                                    {/* Icon Indicator */}
                                    <div className={cn(
                                        "relative z-10 flex-none h-10 w-10 rounded-2xl border-4 border-white shadow-md flex items-center justify-center transition-transform duration-200 group-hover:scale-110",
                                        item.status === 'success' ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' :
                                            item.status === 'warning' ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white' :
                                                'bg-gradient-to-br from-blue-400 to-blue-600 text-white'
                                    )}>
                                        <item.icon className="h-4 w-4" />
                                    </div>

                                    <div className="flex-1 py-1">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-bold text-slate-800 group-hover:text-[#2BD67C] transition-colors">{item.title}</p>
                                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{item.time}</span>
                                        </div>
                                        <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-10 py-3 text-sm font-bold text-slate-600 hover:text-white hover:bg-slate-900 rounded-xl transition-all duration-300 border-2 border-slate-100 hover:border-slate-900">
                            View Full Feed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Button({ children, variant, size, className, ...props }: any) {
    return <button className={className} {...props}>{children}</button>
}

// Reusable Metric Component with gradient support
function MetricCard({ title, icon: Icon, mainValue, subValue, trend, trendUp, color, gradient }: any) {
    const colorStyles: Record<string, string> = {
        blue: "text-blue-600",
        green: "text-[#2BD67C]",
        purple: "text-purple-600",
        orange: "text-orange-600",
    }

    return (
        <div className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group`}>
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="relative z-10 flex justify-between items-start mb-6">
                <div className={`p-3 bg-white rounded-xl shadow-sm border border-gray-100 ${colorStyles[color]}`}>
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
                <p className="text-xs font-medium text-slate-400 mt-2">{subValue}</p>
            </div>
        </div>
    )
}



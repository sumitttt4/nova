"use client"

import * as React from "react"
import Link from "next/link"
import { useMockData } from "@/contexts/MockDataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, Bike, ShoppingBag, Wallet, Users, TrendingUp, TrendingDown, Package, XCircle, Clock, CheckCircle2, DollarSign, CreditCard, Banknote, ArrowRight, Activity } from "lucide-react"
import { isSameDay, isWithinInterval, subDays, subWeeks, subMonths, subYears, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"
import { cn } from "@/lib/utils"

type TimeRange = 'today' | 'weekly' | 'monthly' | 'yearly'

export default function DashboardPage() {
    const { merchants, riders, orders, users } = useMockData()
    const [timeRange, setTimeRange] = React.useState<TimeRange>('today')

    // Helper function to check if date is in current time range
    const isInTimeRange = React.useCallback((date: Date) => {
        const now = new Date()

        switch (timeRange) {
            case 'today':
                return isSameDay(date, now)
            case 'weekly':
                return isWithinInterval(date, { start: startOfWeek(now), end: endOfWeek(now) })
            case 'monthly':
                return isWithinInterval(date, { start: startOfMonth(now), end: endOfMonth(now) })
            case 'yearly':
                return isWithinInterval(date, { start: startOfYear(now), end: endOfYear(now) })
            default:
                return false
        }
    }, [timeRange])

    // Store Metrics
    const activeStores = merchants.filter(m => m.status === 'approved' && !m.flags.blocked).length
    const totalStores = merchants.length
    const todayMerchantApplications = merchants.filter(m => {
        const submittedDate = new Date(m.submittedAt)
        return isSameDay(submittedDate, new Date())
    }).length

    // Rider Metrics
    const activeRiders = riders.filter(r => r.status === 'active').length
    const totalRiders = riders.length
    const todayRiderApplications = riders.filter(r => {
        const submittedDate = new Date(r.submittedAt)
        return isSameDay(submittedDate, new Date())
    }).length

    // Order Metrics (Time-filtered)
    const timeFilteredOrders = orders.filter(o => isInTimeRange(new Date(o.createdAt)))
    const totalOrders = timeFilteredOrders.length
    const deliveredOrders = timeFilteredOrders.filter(o => o.status === 'delivered').length
    const cancelledOrders = timeFilteredOrders.filter(o => o.status === 'cancelled').length
    const pendingOrders = orders.filter(o =>
        o.status !== 'delivered' && o.status !== 'cancelled'
    ).length

    // Payment Metrics (Time-filtered)
    const totalPaymentReceived = timeFilteredOrders
        .filter(o => o.isPaid)
        .reduce((sum, o) => sum + o.amount, 0)

    const codReceived = timeFilteredOrders
        .filter(o => o.paymentMode === 'COD' && o.status === 'delivered')
        .reduce((sum, o) => sum + o.amount, 0)

    const codWithRiders = timeFilteredOrders
        .filter(o => o.paymentMode === 'COD' && o.status === 'out_for_delivery')
        .reduce((sum, o) => sum + o.amount, 0)

    const prepaidReceived = timeFilteredOrders
        .filter(o => o.paymentMode === 'Prepaid' && o.isPaid)
        .reduce((sum, o) => sum + o.amount, 0)

    // User Metrics
    const totalUsers = users.length
    const todayUserRegistrations = users.filter(u => {
        const joinedDate = new Date(u.joinedAt)
        return isSameDay(joinedDate, new Date())
    }).length

    // Conversion Rate
    const ordersPlaced = timeFilteredOrders.length
    const ordersPaid = timeFilteredOrders.filter(o => o.isPaid).length
    const conversionRate = ordersPlaced > 0 ? ((ordersPaid / ordersPlaced) * 100).toFixed(1) : '0'
    const cancellationRate = ordersPlaced > 0 ? ((cancelledOrders / ordersPlaced) * 100).toFixed(1) : '0'

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
                        Comprehensive business metrics and insights
                    </p>
                </div>

                {/* Time Range Selector */}
                <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)} className="w-full sm:w-auto">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="today" className="text-xs sm:text-sm">Today</TabsTrigger>
                        <TabsTrigger value="weekly" className="text-xs sm:text-sm">Week</TabsTrigger>
                        <TabsTrigger value="monthly" className="text-xs sm:text-sm">Month</TabsTrigger>
                        <TabsTrigger value="yearly" className="text-xs sm:text-sm">Year</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <QuickStat label="Live Orders" value={pendingOrders} icon={Activity} pulse />
                <QuickStat label="Active Riders" value={activeRiders} icon={Bike} />
                <QuickStat label="Revenue Today" value={`₹${totalPaymentReceived.toLocaleString()}`} icon={DollarSign} />
                <QuickStat label="Active Stores" value={activeStores} icon={Store} />
            </div>

            {/* Store & Rider Metrics Combined */}
            <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Store className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
                    Store & Rider Metrics
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <MetricCard
                        title="Active / Total Stores"
                        value={`${activeStores} / ${totalStores}`}
                        icon={Store}
                        trend={`${((activeStores / totalStores) * 100).toFixed(0)}% active`}
                        trendUp={activeStores > totalStores * 0.8}
                        href="/stores"
                    />
                    <MetricCard
                        title="Today's Applications"
                        value={todayMerchantApplications}
                        icon={Package}
                        trend="Merchant applications"
                        trendUp={todayMerchantApplications > 0}
                        href="/stores/kyc"
                    />
                    <MetricCard
                        title="Active / Total Riders"
                        value={`${activeRiders} / ${totalRiders}`}
                        icon={Bike}
                        trend={`${((activeRiders / totalRiders) * 100).toFixed(0)}% active`}
                        trendUp={activeRiders > totalRiders * 0.7}
                        href="/riders"
                    />
                    <MetricCard
                        title="Today's Applications"
                        value={todayRiderApplications}
                        icon={Users}
                        trend="Rider applications"
                        trendUp={todayRiderApplications > 0}
                        href="/riders"
                    />
                </div>
            </div>

            {/* Order Metrics */}
            <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
                    <span className="truncate">Order Metrics ({timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <MetricCard title="Total Orders" value={totalOrders} icon={ShoppingBag} trend={`${ordersPlaced} placed`} trendUp={true} href="/orders" />
                    <MetricCard title="Delivered Orders" value={deliveredOrders} icon={CheckCircle2} trend={`${ordersPlaced > 0 ? ((deliveredOrders / ordersPlaced) * 100).toFixed(0) : 0}% success rate`} trendUp={deliveredOrders > cancelledOrders} variant="success" href="/orders" />
                    <MetricCard title="Cancelled Orders" value={cancelledOrders} icon={XCircle} trend={`${cancellationRate}% cancelled`} trendUp={false} variant="danger" href="/orders" />
                    <MetricCard title="Pending Orders" value={pendingOrders} icon={Clock} trend="In progress" trendUp={false} variant="warning" href="/orders" />
                </div>
            </div>

            {/* Payment Metrics */}
            <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
                    <span className="truncate">Payment Metrics ({timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <MetricCard title="Total Payment Received" value={`₹${totalPaymentReceived.toLocaleString()}`} icon={DollarSign} trend="All prepaid cash" trendUp={true} variant="success" href="/finance" />
                    <MetricCard title="COD Received" value={`₹${codReceived.toLocaleString()}`} icon={Banknote} trend="Cash on delivery" trendUp={true} href="/finance" />
                    <MetricCard title="COD with Riders" value={`₹${codWithRiders.toLocaleString()}`} icon={Bike} trend="Cash collected" trendUp={false} variant="warning" href="/riders" />
                    <MetricCard title="Prepaid Received" value={`₹${prepaidReceived.toLocaleString()}`} icon={CreditCard} trend="Online payments" trendUp={true} href="/finance" />
                </div>
            </div>

            {/* User Metrics */}
            <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
                    User Metrics
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <MetricCard title="Total Users Registered" value={totalUsers.toLocaleString()} icon={Users} trend="Overall registrations" trendUp={true} href="/users" />
                    <MetricCard title="Today's Registrations" value={todayUserRegistrations} icon={TrendingUp} trend="New signups today" trendUp={todayUserRegistrations > 0} href="/users" />
                </div>
            </div>

            {/* Conversion Funnel */}
            <Card className="border-2 shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.5)]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="truncate">Order Conversion Funnel ({timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Track customer journey from order placement to completion</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <div className="text-center p-3 sm:p-4 rounded-lg bg-slate-50 shadow-inner">
                            <div className="text-3xl sm:text-4xl font-bold text-slate-900">{ordersPlaced}</div>
                            <div className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Orders Placed</div>
                            <div className="text-xs text-slate-400 mt-2">100%</div>
                        </div>
                        <div className="text-center p-3 sm:p-4 rounded-lg bg-green-50 shadow-inner">
                            <div className="text-3xl sm:text-4xl font-bold text-green-600">{ordersPaid}</div>
                            <div className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Orders Paid</div>
                            <div className="text-xs text-green-600 mt-2 font-semibold">{conversionRate}% conversion</div>
                        </div>
                        <div className="text-center p-3 sm:p-4 rounded-lg bg-red-50 shadow-inner">
                            <div className="text-3xl sm:text-4xl font-bold text-red-600">{cancelledOrders}</div>
                            <div className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Orders Cancelled</div>
                            <div className="text-xs text-red-600 mt-2 font-semibold">{cancellationRate}% drop-off</div>
                        </div>
                    </div>

                    {/* Visual Funnel */}
                    <div className="mt-4 sm:mt-6 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="h-2 sm:h-3 bg-slate-300 rounded-full w-full shadow-inner"></div>
                            <span className="text-xs text-slate-500 whitespace-nowrap">Placed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 sm:h-3 bg-green-500 rounded-full transition-all duration-500 shadow-md" style={{ width: `${conversionRate}%` }}></div>
                            <span className="text-xs text-green-600 whitespace-nowrap font-semibold">{conversionRate}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 sm:h-3 bg-red-500 rounded-full transition-all duration-500 shadow-md" style={{ width: `${cancellationRate}%` }}></div>
                            <span className="text-xs text-red-600 whitespace-nowrap font-semibold">{cancellationRate}%</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function QuickStat({ label, value, icon: Icon, pulse = false }: { label: string, value: string | number, icon: any, pulse?: boolean }) {
    return (
        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)]">
            <div className={cn("p-1.5 sm:p-2 rounded-lg bg-slate-100", pulse && "relative")}>
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700" />
                {pulse && (
                    <span className="absolute top-0 right-0 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-500"></span>
                    </span>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold text-slate-900 truncate">{value}</div>
                <div className="text-[10px] sm:text-xs text-slate-500 truncate">{label}</div>
            </div>
        </div>
    )
}

function MetricCard({
    title,
    value,
    icon: Icon,
    trend,
    trendUp,
    variant = 'neutral',
    href
}: {
    title: string
    value: string | number
    icon: any
    trend: string
    trendUp: boolean
    variant?: 'neutral' | 'success' | 'warning' | 'danger'
    href: string
}) {
    const variantStyles = {
        neutral: 'border-slate-200 bg-white hover:border-slate-300',
        success: 'border-green-200 bg-green-50/30 hover:border-green-300',
        warning: 'border-amber-200 bg-amber-50/30 hover:border-amber-300',
        danger: 'border-red-200 bg-red-50/30 hover:border-red-300'
    }

    const iconStyles = {
        neutral: 'text-slate-600 bg-slate-100',
        success: 'text-green-600 bg-green-100',
        warning: 'text-amber-600 bg-amber-100',
        danger: 'text-red-600 bg-red-100'
    }

    return (
        <Link href={href}>
            <Card className={cn(
                "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] relative overflow-hidden",
                "shadow-[0_2px_6px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.6)]",
                variantStyles[variant]
            )}>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className={cn("p-1.5 sm:p-2 rounded-lg", iconStyles[variant])}>
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                            {trendUp ? (
                                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                            ) : (
                                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                            )}
                            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                    <CardDescription className="text-[10px] sm:text-xs mt-2">{title}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">{value}</div>
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-1 truncate">{trend}</p>
                </CardContent>
            </Card>
        </Link>
    )
}

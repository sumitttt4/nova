"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { OrdersTable } from "@/components/orders/orders-table"
import { Search, X } from "lucide-react"
import { useMockData } from "@/contexts/MockDataContext"
import { useQueryState, useDebounce } from "@/hooks/use-url-state"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrdersFilter, FilterState, INITIAL_FILTERS } from "@/components/orders/orders-filter"
import { isSameDay, isSameWeek, isSameMonth } from "date-fns"

function OrdersContent() {
    const { orders } = useMockData()

    // URL State
    const [searchQuery, setSearchQuery] = useQueryState("q")
    // We treat 'time' as a tab state, defaulting to 'today' as requested by "Live Orders" context
    const [timeFilter, setTimeFilter] = useQueryState("time", "today")

    // Local search state for immediate feedback
    const [localSearch, setLocalSearch] = React.useState(searchQuery)
    const debouncedSearch = useDebounce(localSearch, 300)

    // Advanced Filter State
    const [filters, setFilters] = React.useState<FilterState>(INITIAL_FILTERS)

    React.useEffect(() => {
        setSearchQuery(debouncedSearch)
    }, [debouncedSearch, setSearchQuery])

    // Filter Logic
    const filterOrdersByTime = (orderDate: Date, filter: string) => {
        const now = new Date()
        const target = new Date(orderDate)

        switch (filter) {
            case 'today':
                return isSameDay(target, now)
            case 'week':
                return isSameWeek(target, now, { weekStartsOn: 1 })
            case 'month':
                return isSameMonth(target, now)
            case 'overall':
            default:
                return true
        }
    }

    const filteredOrders = React.useMemo(() => {
        return orders.filter(order => {
            const orderDate = new Date(order.createdAt)

            // 1. Time Filter (Tabs)
            if (!filterOrdersByTime(orderDate, timeFilter)) return false

            // 2. Global Search (ID, Customer, Store - loose search)
            const query = (searchQuery || "").toLowerCase()
            const matchesSearch =
                !query ||
                order.id.toLowerCase().includes(query) ||
                order.customerName.toLowerCase().includes(query) ||
                order.storeName.toLowerCase().includes(query)

            if (!matchesSearch) return false

            // 3. Advanced Filters
            // Status
            if (filters.status.length > 0 && !filters.status.includes(order.status)) return false

            // Amount Min
            if (filters.minAmount && order.amount < parseFloat(filters.minAmount)) return false
            // Amount Max
            if (filters.maxAmount && order.amount > parseFloat(filters.maxAmount)) return false

            // Specific Customer Name (strict filter from sheet)
            if (filters.customerName && !order.customerName.toLowerCase().includes(filters.customerName.toLowerCase())) return false

            // Specific Store Name (strict filter from sheet)
            if (filters.storeName && !order.storeName.toLowerCase().includes(filters.storeName.toLowerCase())) return false

            return true
        })
    }, [orders, timeFilter, searchQuery, filters])

    // Metrics for the CURRENT view (Filtered orders)
    const metrics = React.useMemo(() => {
        return {
            total: filteredOrders.length,
            preparing: filteredOrders.filter(o => o.status === 'preparing').length,
            delivered: filteredOrders.filter(o => o.status === 'delivered').length,
            cancelled: filteredOrders.filter(o => o.status === 'cancelled').length
        }
    }, [filteredOrders])

    const handleFilterReset = () => {
        setFilters(INITIAL_FILTERS)
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders Management</h1>
                <p className="text-slate-500">
                    Track and manage order fulfillment across all partner stores.
                </p>
            </div>

            {/* Time Tabs */}
            <Tabs value={timeFilter} onValueChange={setTimeFilter} className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <TabsList className="grid w-full max-w-[400px] grid-cols-4">
                        <TabsTrigger value="today">Today</TabsTrigger>
                        <TabsTrigger value="week">Weekly</TabsTrigger>
                        <TabsTrigger value="month">Monthly</TabsTrigger>
                        <TabsTrigger value="overall">Overall</TabsTrigger>
                    </TabsList>
                </div>

                {/* Metrics Row (Dynamic based on selected tab & filters) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="shadow-sm border-slate-100 bg-white p-4">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {timeFilter === 'overall' ? 'Total Orders' : `${timeFilter}'s Orders`}
                        </p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.total}</p>
                    </Card>
                    <Card className="shadow-sm border-orange-100 bg-orange-50/50 p-4">
                        <p className="text-xs font-medium text-orange-600 uppercase tracking-wider">Preparing</p>
                        <p className="text-2xl font-bold text-orange-700 mt-1">{metrics.preparing}</p>
                    </Card>
                    <Card className="shadow-sm border-green-100 bg-green-50/50 p-4">
                        <p className="text-xs font-medium text-green-600 uppercase tracking-wider">Delivered</p>
                        <p className="text-2xl font-bold text-green-700 mt-1">{metrics.delivered}</p>
                    </Card>
                    <Card className="shadow-sm border-red-100 bg-red-50/50 p-4">
                        <p className="text-xs font-medium text-red-600 uppercase tracking-wider">Cancelled</p>
                        <p className="text-2xl font-bold text-red-700 mt-1">{metrics.cancelled}</p>
                    </Card>
                </div>

                {/* Controls: Search and Advanced Filter */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm mb-6">
                    {/* Search Input */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder={`Search ${timeFilter} orders...`}
                            className="w-full pl-9 h-10 bg-slate-50 border-slate-200 focus-visible:ring-slate-200"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => { setLocalSearch(""); setSearchQuery(""); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <OrdersFilter
                            filters={filters}
                            onApply={setFilters}
                            onReset={handleFilterReset}
                        />
                    </div>
                </div>

                <TabsContent value="today" className="mt-0">
                    <OrdersTable orders={filteredOrders} />
                </TabsContent>
                <TabsContent value="week" className="mt-0">
                    <OrdersTable orders={filteredOrders} />
                </TabsContent>
                <TabsContent value="month" className="mt-0">
                    <OrdersTable orders={filteredOrders} />
                </TabsContent>
                <TabsContent value="overall" className="mt-0">
                    <OrdersTable orders={filteredOrders} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default function OrdersPage() {
    return (
        <React.Suspense fallback={<div className="p-8 text-center text-slate-500">Loading orders...</div>}>
            <OrdersContent />
        </React.Suspense>
    )
}

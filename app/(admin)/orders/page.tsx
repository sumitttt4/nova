"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { OrdersTable } from "@/components/orders/orders-table"
import { Search, X } from "lucide-react"
import { useMockData } from "@/contexts/MockDataContext"
import { useQueryState, useDebounce } from "@/hooks/use-url-state"

function OrdersContent() {
    const { orders } = useMockData()

    // URL State
    const [searchQuery, setSearchQuery] = useQueryState("q")
    const [statusFilter, setStatusFilter] = useQueryState("status", "all")

    // Local search state for immediate feedback
    const [localSearch, setLocalSearch] = React.useState(searchQuery)
    const debouncedSearch = useDebounce(localSearch, 300)

    React.useEffect(() => {
        setSearchQuery(debouncedSearch)
    }, [debouncedSearch, setSearchQuery])

    // ... (previous state code)

    // Metrics
    const metrics = React.useMemo(() => {
        return {
            total: orders.length,
            preparing: orders.filter(o => o.status === 'preparing').length,
            delivered: orders.filter(o => o.status === 'delivered').length,
            cancelled: orders.filter(o => o.status === 'cancelled').length
        }
    }, [orders])

    // Filter Logic
    const filteredOrders = React.useMemo(() => {
        return orders.filter(order => {
            const query = (searchQuery || "").toLowerCase()
            const matchesSearch =
                order.id.toLowerCase().includes(query) ||
                order.customerName.toLowerCase().includes(query) ||
                order.storeName.toLowerCase().includes(query)

            const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase()

            return matchesSearch && matchesStatus
        })
    }, [orders, searchQuery, statusFilter])

    const handleReset = () => {
        setLocalSearch("")
        setSearchQuery("")
        setStatusFilter("all")
    }

    const statuses = [
        { id: 'all', label: 'All Orders', count: metrics.total },
        { id: 'preparing', label: 'Preparing', count: metrics.preparing },
        { id: 'delivered', label: 'Delivered', count: metrics.delivered },
        { id: 'cancelled', label: 'Cancelled', count: metrics.cancelled },
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders Management</h1>
                <p className="text-slate-500">
                    Track and manage order fulfillment across all partner stores.
                </p>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="shadow-sm border-slate-100 bg-white p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Orders</p>
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

            <div className="flex flex-col gap-4">
                {/* Search and Filters Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    {/* Status Pills */}
                    <div className="flex p-1 gap-1 overflow-x-auto w-full md:w-auto no-scrollbar">
                        {statuses.map((status) => (
                            <button
                                key={status.id}
                                onClick={() => setStatusFilter(status.id)}
                                className={`
                                    flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                                    ${statusFilter === status.id
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                                `}
                            >
                                {status.label}
                                <span className={`
                                    px-1.5 py-0.5 rounded-full text-[10px] 
                                    ${statusFilter === status.id ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-600'}
                                `}>
                                    {status.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-80 mr-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search orders..."
                            className="w-full pl-9 h-9 bg-slate-50 border-slate-200 focus-visible:ring-slate-200"
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
                </div>

                <OrdersTable orders={filteredOrders} />
            </div>
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

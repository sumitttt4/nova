"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { OrdersTable } from "@/components/orders/orders-table"
import { Search, Filter, X } from "lucide-react"
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

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders Management</h1>
                <p className="text-slate-500">
                    Track and manage order fulfillment across all partner stores.
                </p>
            </div>

            <Card className="shadow-sm border-gray-100">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by Order ID, Customer, or Store..."
                                className="w-full pl-9 h-10 bg-white border-slate-200"
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-[180px] h-10 border-slate-200">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Filter className="h-4 w-4" />
                                        <SelectValue placeholder="Status" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="preparing">Preparing</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>

                            {(searchQuery || statusFilter !== 'all') && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleReset}
                                    className="h-10 px-4 text-slate-500 hover:text-slate-900 border-slate-200"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Reset
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <OrdersTable orders={filteredOrders} />
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

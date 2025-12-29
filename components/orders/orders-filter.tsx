"use client"

import * as React from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface OrdersFilterProps {
    className?: string
    filters: FilterState
    onApply: (filters: FilterState) => void
    onReset: () => void
}

export type FilterState = {
    status: string[]
    minAmount: string
    maxAmount: string
    customerName: string
    storeName: string
}

export const INITIAL_FILTERS: FilterState = {
    status: [],
    minAmount: "",
    maxAmount: "",
    customerName: "",
    storeName: ""
}

export function OrdersFilter({ className, filters, onApply, onReset }: OrdersFilterProps) {
    const [localFilters, setLocalFilters] = React.useState<FilterState>(filters)
    const [open, setOpen] = React.useState(false)

    // Sync when external filters change
    React.useEffect(() => {
        setLocalFilters(filters)
    }, [filters])

    const handleApply = () => {
        onApply(localFilters)
        setOpen(false)
    }

    const handleReset = () => {
        setLocalFilters(INITIAL_FILTERS)
        onReset()
        setOpen(false)
    }

    const toggleStatus = (status: string) => {
        setLocalFilters(prev => {
            const exists = prev.status.includes(status)
            if (exists) {
                return { ...prev, status: prev.status.filter(s => s !== status) }
            } else {
                return { ...prev, status: [...prev.status, status] }
            }
        })
    }

    const activeFilterCount = React.useMemo(() => {
        let count = 0
        if (filters.status.length > 0) count++
        if (filters.minAmount) count++
        if (filters.maxAmount) count++
        if (filters.customerName) count++
        if (filters.storeName) count++
        return count
    }, [filters])

    const statuses = ["pending", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"]

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 border-slate-200">
                    <Filter className="h-4 w-4 text-slate-500" />
                    Filters
                    {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] px-1 bg-[#2BD67C] text-white">
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Filter Orders</SheetTitle>
                    <SheetDescription>
                        Refine your order list using detailed parameters.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-8 py-8 px-1">
                    {/* Order Status */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold text-slate-900">Order Status</Label>
                            {localFilters.status.length > 0 && (
                                <Badge variant="secondary" className="px-2 py-0.5 h-6 text-xs font-medium">
                                    {localFilters.status.length} selected
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {statuses.map(status => {
                                const isSelected = localFilters.status.includes(status)
                                return (
                                    <div
                                        key={status}
                                        onClick={() => toggleStatus(status)}
                                        className={`
                                            cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border select-none
                                            ${isSelected
                                                ? "bg-slate-900 text-white border-slate-900 shadow-sm ring-1 ring-slate-900"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                            }
                                        `}
                                    >
                                        {status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <Separator className="bg-slate-100" />

                    {/* Amount Range */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold text-slate-900">Order Amount</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="min-amount" className="text-xs font-medium text-slate-500 uppercase tracking-wider">Minimum</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                                    <Input
                                        id="min-amount"
                                        type="number"
                                        placeholder="0"
                                        className="pl-8 h-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                        value={localFilters.minAmount}
                                        onChange={(e) => setLocalFilters({ ...localFilters, minAmount: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="max-amount" className="text-xs font-medium text-slate-500 uppercase tracking-wider">Maximum</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                                    <Input
                                        id="max-amount"
                                        type="number"
                                        placeholder="10,000+"
                                        className="pl-8 h-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                        value={localFilters.maxAmount}
                                        onChange={(e) => setLocalFilters({ ...localFilters, maxAmount: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-slate-100" />

                    {/* Specific Search */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-base font-semibold text-slate-900">Store Name</Label>
                            <Input
                                placeholder="Search by store name..."
                                className="h-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                value={localFilters.storeName}
                                onChange={(e) => setLocalFilters({ ...localFilters, storeName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-base font-semibold text-slate-900">Customer Name</Label>
                            <Input
                                placeholder="Search by customer name..."
                                className="h-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                value={localFilters.customerName}
                                onChange={(e) => setLocalFilters({ ...localFilters, customerName: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <SheetFooter className="flex-col sm:flex-row gap-2 mt-auto border-t pt-4">
                    <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
                        Reset All
                    </Button>
                    <Button onClick={handleApply} className="w-full sm:w-auto bg-[#2BD67C] hover:bg-[#25bf42] text-white">
                        Apply Filters
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

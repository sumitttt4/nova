"use client"

import * as React from "react"
import { Filter, RotateCcw, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

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

// FilterSection Sub-component
function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="mb-6">
            <h4 className="text-sm font-bold text-slate-700 mb-3">{label}</h4>
            {children}
        </div>
    )
}

// FilterChip Sub-component 
function FilterChip({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border",
                isActive
                    ? "bg-[#2BD67C]/10 text-[#2BD67C] border-[#2BD67C]/30 shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
            )}
        >
            {label}
        </button>
    )
}

export function OrdersFilter({ className, filters, onApply, onReset }: OrdersFilterProps) {
    const [localFilters, setLocalFilters] = React.useState<FilterState>(filters)
    const [open, setOpen] = React.useState(false)
    const [amountRange, setAmountRange] = React.useState<[number, number]>([
        filters.minAmount ? parseInt(filters.minAmount) : 0,
        filters.maxAmount ? parseInt(filters.maxAmount) : 10000
    ])

    // Sync when external filters change
    React.useEffect(() => {
        setLocalFilters(filters)
        setAmountRange([
            filters.minAmount ? parseInt(filters.minAmount) : 0,
            filters.maxAmount ? parseInt(filters.maxAmount) : 10000
        ])
    }, [filters])

    const handleApply = () => {
        onApply({
            ...localFilters,
            minAmount: amountRange[0] > 0 ? amountRange[0].toString() : "",
            maxAmount: amountRange[1] < 10000 ? amountRange[1].toString() : ""
        })
        setOpen(false)
    }

    const handleReset = () => {
        setLocalFilters(INITIAL_FILTERS)
        setAmountRange([0, 10000])
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
        if (filters.minAmount || filters.maxAmount) count++
        if (filters.customerName) count++
        if (filters.storeName) count++
        return count
    }, [filters])

    const statuses = ["pending", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"]

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "gap-2 border-slate-200 hover:border-[#2BD67C]/50 hover:bg-[#2BD67C]/5 transition-all",
                        activeFilterCount > 0 && "border-[#2BD67C]/30 bg-[#2BD67C]/5",
                        className
                    )}
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                        <Badge className="bg-[#2BD67C] text-white text-[10px] h-5 px-1.5 min-w-[20px] flex items-center justify-center">
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[340px] sm:w-[400px] p-0 flex flex-col">
                {/* Header */}
                <SheetHeader className="px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-lg font-bold text-slate-900">Filter Orders</SheetTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="h-8 px-2 text-xs text-slate-500 hover:text-slate-700 gap-1"
                        >
                            <RotateCcw className="h-3 w-3" />
                            Reset
                        </Button>
                    </div>
                </SheetHeader>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {/* Order Status */}
                    <FilterSection label="Order Status">
                        <div className="flex flex-wrap gap-2">
                            {statuses.map(status => (
                                <FilterChip
                                    key={status}
                                    label={status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                    isActive={localFilters.status.includes(status)}
                                    onClick={() => toggleStatus(status)}
                                />
                            ))}
                        </div>
                        {localFilters.status.length > 0 && (
                            <p className="text-[10px] text-[#2BD67C] mt-2 font-medium">
                                {localFilters.status.length} selected
                            </p>
                        )}
                    </FilterSection>

                    {/* Amount Range Slider */}
                    <FilterSection label="Order Amount">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500">Range</span>
                                <span className="text-xs font-bold text-slate-700">
                                    ₹{amountRange[0].toLocaleString('en-IN')} - ₹{amountRange[1].toLocaleString('en-IN')}
                                </span>
                            </div>
                            <Slider
                                min={0}
                                max={10000}
                                step={100}
                                value={amountRange}
                                onValueChange={(val) => setAmountRange(val as [number, number])}
                                className="[&_[role=slider]]:bg-[#2BD67C] [&_[role=slider]]:border-[#2BD67C] [&_.bg-primary]:bg-[#2BD67C]"
                            />
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                                <span>₹0</span>
                                <span>₹10,000</span>
                            </div>
                        </div>
                    </FilterSection>

                    {/* Store Name */}
                    <FilterSection label="Store Name">
                        <Input
                            placeholder="Search by store name..."
                            className="h-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                            value={localFilters.storeName}
                            onChange={(e) => setLocalFilters({ ...localFilters, storeName: e.target.value })}
                        />
                    </FilterSection>

                    {/* Customer Name */}
                    <FilterSection label="Customer Name">
                        <Input
                            placeholder="Search by customer name..."
                            className="h-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                            value={localFilters.customerName}
                            onChange={(e) => setLocalFilters({ ...localFilters, customerName: e.target.value })}
                        />
                    </FilterSection>
                </div>

                {/* Fixed Footer */}
                <SheetFooter className="px-6 py-4 border-t border-slate-100 bg-white sticky bottom-0 z-10">
                    <div className="flex gap-3 w-full">
                        <SheetClose asChild>
                            <Button
                                variant="outline"
                                className="flex-1 border-slate-200 hover:bg-slate-50"
                            >
                                Cancel
                            </Button>
                        </SheetClose>
                        <Button
                            onClick={handleApply}
                            className="flex-1 bg-[#278F27] hover:bg-[#278F27]/90 text-white font-semibold"
                        >
                            Apply Filters
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

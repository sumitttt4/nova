"use client"

import * as React from "react"
import { RotateCcw, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface UsersFilterProps {
    className?: string
    filters: UserFilterState
    onApply: (filters: UserFilterState) => void
    onReset: () => void
}

export type UserFilterState = {
    status: string[]
    minBalance: number
    maxBalance: number
}

export const INITIAL_USER_FILTERS: UserFilterState = {
    status: [],
    minBalance: 0,
    maxBalance: 10000
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
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border capitalize",
                isActive
                    ? "bg-[#2BD67C]/10 text-[#2BD67C] border-[#2BD67C]/30 shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
            )}
        >
            {label}
        </button>
    )
}

export function UsersFilter({ className, filters, onApply, onReset }: UsersFilterProps) {
    const [localFilters, setLocalFilters] = React.useState<UserFilterState>(filters)
    const [open, setOpen] = React.useState(false)
    const [balanceRange, setBalanceRange] = React.useState<[number, number]>([
        filters.minBalance,
        filters.maxBalance
    ])

    // Sync when external filters change
    React.useEffect(() => {
        setLocalFilters(filters)
        setBalanceRange([filters.minBalance, filters.maxBalance])
    }, [filters])

    const handleApply = () => {
        onApply({
            ...localFilters,
            minBalance: balanceRange[0],
            maxBalance: balanceRange[1]
        })
        setOpen(false)
    }

    const handleReset = () => {
        setLocalFilters(INITIAL_USER_FILTERS)
        setBalanceRange([0, 10000])
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
        if (filters.minBalance > 0 || filters.maxBalance < 10000) count++
        return count
    }, [filters])

    const statuses = ["active", "warned", "banned"]

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                        "border-slate-200 hover:border-[#2BD67C]/50 hover:bg-[#2BD67C]/5 transition-all",
                        activeFilterCount > 0 && "border-[#2BD67C]/30 bg-[#2BD67C]/5",
                        className
                    )}
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#2BD67C] text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[340px] sm:w-[400px] p-0 flex flex-col">
                {/* Header */}
                <SheetHeader className="px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-lg font-bold text-slate-900">Filter Users</SheetTitle>
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
                    {/* Status */}
                    <FilterSection label="Account Status">
                        <div className="flex flex-wrap gap-2">
                            {statuses.map(status => (
                                <FilterChip
                                    key={status}
                                    label={status}
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

                    {/* Wallet Balance Range Slider */}
                    <FilterSection label="Wallet Balance">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500">Range</span>
                                <span className="text-xs font-bold text-slate-700">
                                    ₹{balanceRange[0].toLocaleString('en-IN')} - ₹{balanceRange[1].toLocaleString('en-IN')}
                                </span>
                            </div>
                            <Slider
                                min={0}
                                max={10000}
                                step={100}
                                value={balanceRange}
                                onValueChange={(val) => setBalanceRange(val as [number, number])}
                                className="[&_[role=slider]]:bg-[#2BD67C] [&_[role=slider]]:border-[#2BD67C] [&_.bg-primary]:bg-[#2BD67C]"
                            />
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                                <span>₹0</span>
                                <span>₹10,000</span>
                            </div>
                        </div>
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

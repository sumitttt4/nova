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
} from "@/components/ui/sheet"

interface StoresFilterProps {
    className?: string
    filters: StoreFilterState
    onApply: (filters: StoreFilterState) => void
    onReset: () => void
}

export type StoreFilterState = {
    status: string[]
    storeType: string[]
    location: string
}

export const INITIAL_STORE_FILTERS: StoreFilterState = {
    status: [],
    storeType: [],
    location: ""
}

export function StoresFilter({ className, filters, onApply, onReset }: StoresFilterProps) {
    const [localFilters, setLocalFilters] = React.useState<StoreFilterState>(filters)
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
        setLocalFilters(INITIAL_STORE_FILTERS)
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

    const toggleType = (type: string) => {
        setLocalFilters(prev => {
            const exists = prev.storeType.includes(type)
            if (exists) {
                return { ...prev, storeType: prev.storeType.filter(t => t !== type) }
            } else {
                return { ...prev, storeType: [...prev.storeType, type] }
            }
        })
    }

    const activeFilterCount = React.useMemo(() => {
        let count = 0
        if (filters.status.length > 0) count++
        if (filters.storeType.length > 0) count++
        if (filters.location) count++
        return count
    }, [filters])

    const statuses = ["approved", "under_review", "rejected", "blocked"]
    const storeTypes = ["restaurant", "grocery", "bakery", "pharmacy", "electronics"]

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
                    <SheetTitle>Filter Stores</SheetTitle>
                    <SheetDescription>
                        Filter stores based on status, category, and location.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-8 py-8 px-1">
                    {/* Status */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold text-slate-900">Status</Label>
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
                                            cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border select-none capitalize
                                            ${isSelected
                                                ? "bg-slate-900 text-white border-slate-900 shadow-sm ring-1 ring-slate-900"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                            }
                                        `}
                                    >
                                        {status.replace(/_/g, " ")}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <Separator className="bg-slate-100" />

                    {/* Store Type */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold text-slate-900">Category</Label>
                            {localFilters.storeType.length > 0 && (
                                <Badge variant="secondary" className="px-2 py-0.5 h-6 text-xs font-medium">
                                    {localFilters.storeType.length} selected
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {storeTypes.map(type => {
                                const isSelected = localFilters.storeType.includes(type)
                                return (
                                    <div
                                        key={type}
                                        onClick={() => toggleType(type)}
                                        className={`
                                            cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border select-none capitalize
                                            ${isSelected
                                                ? "bg-slate-900 text-white border-slate-900 shadow-sm ring-1 ring-slate-900"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                            }
                                        `}
                                    >
                                        {type}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <Separator className="bg-slate-100" />

                    {/* Location */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold text-slate-900">Location</Label>
                        <Input
                            placeholder="Search by city or area..."
                            className="h-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                            value={localFilters.location}
                            onChange={(e) => setLocalFilters({ ...localFilters, location: e.target.value })}
                        />
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

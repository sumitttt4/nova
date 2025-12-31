"use client"

import * as React from "react"
import { X, SlidersHorizontal, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

// ============================================
// FilterSection Sub-component
// ============================================
interface FilterSectionProps {
    label: string
    children: React.ReactNode
    className?: string
}

export function FilterSection({ label, children, className }: FilterSectionProps) {
    return (
        <div className={cn("mb-6", className)}>
            <h4 className="text-sm font-bold text-slate-700 mb-3">{label}</h4>
            {children}
        </div>
    )
}

// ============================================
// FilterChip Sub-component
// ============================================
interface FilterChipProps {
    label: string
    isActive: boolean
    onClick: () => void
}

export function FilterChip({ label, isActive, onClick }: FilterChipProps) {
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

// ============================================
// RangeSlider Sub-component
// ============================================
interface RangeSliderProps {
    label: string
    min: number
    max: number
    value: [number, number]
    onChange: (value: [number, number]) => void
    prefix?: string
    step?: number
}

export function RangeSlider({ label, min, max, value, onChange, prefix = "₹", step = 1 }: RangeSliderProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{label}</span>
                <span className="text-xs font-bold text-slate-700">
                    {prefix}{value[0].toLocaleString('en-IN')} - {prefix}{value[1].toLocaleString('en-IN')}
                </span>
            </div>
            <Slider
                min={min}
                max={max}
                step={step}
                value={value}
                onValueChange={(val) => onChange(val as [number, number])}
                className="[&_[role=slider]]:bg-[#2BD67C] [&_[role=slider]]:border-[#2BD67C] [&_.bg-primary]:bg-[#2BD67C]"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>{prefix}{min.toLocaleString('en-IN')}</span>
                <span>{prefix}{max.toLocaleString('en-IN')}</span>
            </div>
        </div>
    )
}

// ============================================
// ActiveFiltersBar Sub-component
// ============================================
interface ActiveFilter {
    key: string
    label: string
}

interface ActiveFiltersBarProps {
    filters: ActiveFilter[]
    onRemove: (key: string) => void
    onClearAll: () => void
}

export function ActiveFiltersBar({ filters, onRemove, onClearAll }: ActiveFiltersBarProps) {
    if (filters.length === 0) return null

    return (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-xs font-medium text-slate-500">Active:</span>
            {filters.map((filter) => (
                <Badge
                    key={filter.key}
                    variant="outline"
                    className="bg-[#2BD67C]/10 text-[#2BD67C] border-[#2BD67C]/20 text-[10px] h-6 px-2 flex items-center gap-1 cursor-pointer hover:bg-[#2BD67C]/20 transition-colors"
                    onClick={() => onRemove(filter.key)}
                >
                    {filter.label}
                    <X className="h-3 w-3" />
                </Badge>
            ))}
            <button
                onClick={onClearAll}
                className="text-[10px] text-slate-400 hover:text-slate-600 underline ml-auto"
            >
                Clear all
            </button>
        </div>
    )
}

// ============================================
// GlobalFilterSidebar Main Component
// ============================================
interface GlobalFilterSidebarProps {
    title?: string
    children: React.ReactNode
    triggerLabel?: string
    onApply?: () => void
    onReset?: () => void
    activeFilterCount?: number
    className?: string
}

export function GlobalFilterSidebar({
    title = "Filters",
    children,
    triggerLabel = "Filters",
    onApply,
    onReset,
    activeFilterCount = 0,
    className
}: GlobalFilterSidebarProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    const handleApply = () => {
        onApply?.()
        setIsOpen(false)
    }

    const handleReset = () => {
        onReset?.()
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
                    {triggerLabel}
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
                        <SheetTitle className="text-lg font-bold text-slate-900">{title}</SheetTitle>
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
                    {children}
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

// ============================================
// Example Usage Component (Reference)
// ============================================
//
// function MerchantFilters() {
//     const [status, setStatus] = React.useState<string[]>([])
//     const [amountRange, setAmountRange] = React.useState<[number, number]>([0, 100000])
//
//     return (
//         <GlobalFilterSidebar
//             title="Merchant Filters"
//             onApply={() => console.log('Apply')}
//             onReset={() => { setStatus([]); setAmountRange([0, 100000]) }}
//             activeFilterCount={status.length + (amountRange[0] > 0 || amountRange[1] < 100000 ? 1 : 0)}
//         >
//             <FilterSection label="Status">
//                 <div className="flex flex-wrap gap-2">
//                     {['Active', 'Pending', 'Blocked'].map(s => (
//                         <FilterChip
//                             key={s}
//                             label={s}
//                             isActive={status.includes(s)}
//                             onClick={() => setStatus(prev =>
//                                 prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
//                             )}
//                         />
//                     ))}
//                 </div>
//             </FilterSection>
//
//             <FilterSection label="Order Amount">
//                 <RangeSlider
//                     label="Range"
//                     min={0}
//                     max={100000}
//                     value={amountRange}
//                     onChange={setAmountRange}
//                 />
//             </FilterSection>
//         </GlobalFilterSidebar>
//     )
// }

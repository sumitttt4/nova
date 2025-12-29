"use client"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StoresFilter, INITIAL_STORE_FILTERS, StoreFilterState } from "@/components/stores/stores-filter"
import { useQueryState } from "@/hooks/use-url-state"
import { useState } from "react"

import { Search, MoreHorizontal, Star, MapPin } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMockData } from "@/contexts/MockDataContext"
import Link from "next/link"

export default function StoresPage() {
    const { merchants, updateMerchantStatus } = useMockData()
    const [searchQuery, setSearchQuery] = useQueryState("q")

    // Store Filter State
    const [filterState, setFilterState] = useState<StoreFilterState>(INITIAL_STORE_FILTERS)

    // Filter Logic
    const filteredMerchants = merchants.filter(merchant => {
        // Search
        const matchesSearch = !searchQuery ||
            merchant.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            merchant.location?.toLowerCase().includes(searchQuery.toLowerCase())

        // Status Filter (default to approved/under_review if no filter, else follow filter)
        // If filter is active, show what matches filter. If not, showing "active stores" default.
        const matchesStatus = filterState.status.length > 0
            ? filterState.status.includes(merchant.status)
            : (merchant.status === 'approved' || merchant.status === 'under_review')

        const matchesType = filterState.storeType.length > 0
            ? filterState.storeType.includes(merchant.storeType)
            : true

        const matchesLocation = !filterState.location ||
            merchant.location?.toLowerCase().includes(filterState.location.toLowerCase()) ||
            merchant.address.city.toLowerCase().includes(filterState.location.toLowerCase())

        return matchesSearch && matchesStatus && matchesType && matchesLocation
    })

    const handleSuspendStore = (id: string) => {
        if (confirm("Are you sure you want to suspend this store? It will be moved to inactive status.")) {
            updateMerchantStatus(id, 'rejected', ['Suspended by Admin'])
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Stores</h1>
                    <p className="text-slate-500">
                        Manage your partner stores, catalog and settings.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search stores..."
                        className="pl-9 bg-white border-slate-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <StoresFilter
                    filters={filterState}
                    onApply={setFilterState}
                    onReset={() => setFilterState(INITIAL_STORE_FILTERS)}
                />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Store Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMerchants.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                    No active stores found. Try onboarding a new merchant.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredMerchants.map((store) => (
                                <TableRow key={store.id} className="hover:bg-slate-50 transition-colors">
                                    <TableCell>
                                        <Avatar className="h-9 w-9 rounded-md border border-slate-100">
                                            <AvatarFallback className="rounded-md bg-orange-50 text-orange-600 font-bold">
                                                {store.storeName.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-semibold text-sm text-slate-900">{store.storeName}</TableCell>
                                    <TableCell className="text-slate-500">
                                        <div className="flex items-center gap-1 text-xs">
                                            <MapPin className="h-3 w-3" />
                                            {store.location}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-medium text-slate-600 border-slate-200 bg-slate-50">
                                            {store.storeType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 font-medium text-slate-700">
                                            4.5
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                store.status === "approved"
                                                    ? "bg-green-100 text-green-700 border-green-200 capitalize"
                                                    : "bg-orange-100 text-orange-700 border-orange-200 capitalize"
                                            }
                                        >
                                            {store.status === "approved" ? "Open" : "Onboarding"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/merchants/${store.id}`}>View dashboard</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>Manage menu</DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600 cursor-pointer"
                                                    onClick={() => handleSuspendStore(store.id)}
                                                >
                                                    Suspend Store
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

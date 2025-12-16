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
import { Search, MoreHorizontal, Filter, Star, MapPin, Plus } from "lucide-react"
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
    const { merchants } = useMockData()

    // Filter merchants to only show "approved" ones as active stores
    const activeStores = merchants.filter(m => m.status === 'approved' || m.status === 'under_review')

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Stores</h1>
                    <p className="text-slate-500">
                        Manage your partner stores, catalog and settings.
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Link href="/stores/new">
                        <Button className="gap-2 w-full sm:w-auto">
                            <Plus className="h-4 w-4" />
                            Add New Store
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search stores..."
                        className="pl-9 bg-white border-slate-200"
                    />
                </div>
                <Button variant="outline" size="icon" className="border-slate-200">
                    <Filter className="h-4 w-4 text-slate-500" />
                </Button>
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
                        {activeStores.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                    No active stores found. Try onboarding a new merchant.
                                </TableCell>
                            </TableRow>
                        ) : (
                            activeStores.map((store) => (
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
                                                <DropdownMenuItem>View dashboard</DropdownMenuItem>
                                                <DropdownMenuItem>Edit details</DropdownMenuItem>
                                                <DropdownMenuItem>Manage menu</DropdownMenuItem>
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

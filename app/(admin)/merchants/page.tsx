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
import { Search, MoreHorizontal, Building2, Store } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMockData } from "@/contexts/MockDataContext"
import Link from "next/link"
import { MerchantInsights } from "@/components/merchants/MerchantInsights"
import * as React from "react"

export default function MerchantsPage() {
    const { merchants, updateMerchantStatus } = useMockData()
    const [searchTerm, setSearchTerm] = React.useState("")

    const handleOffboard = (id: string) => {
        if (confirm("Are you sure you want to offboard this merchant? This will block their access.")) {
            updateMerchantStatus(id, 'rejected', ['Offboarded by Admin'])
        }
    }

    const filteredMerchants = merchants.filter(merchant =>
        merchant.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.personName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Merchants & Catalog</h1>
                    <p className="text-slate-500">
                        Manage business partners, menu health, and payouts.
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Link href="/merchants/applications">
                        <Button className="gap-2 w-full sm:w-auto bg-[#2BD67C] hover:bg-[#2BD67C]/90 text-black font-semibold">
                            <Building2 className="h-4 w-4" />
                            View Applications
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Consolidated Insights Panel */}
            <MerchantInsights />

            {/* Merchant Directory */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">Partner Directory</h2>
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Search merchants..."
                            className="pl-9 h-9 bg-white border-slate-200 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden overflow-x-auto">
                    <Table className="min-w-[900px]">
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead>Business Name</TableHead>
                                <TableHead>Contact Person</TableHead>
                                <TableHead>Store Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMerchants.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                        No merchants found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredMerchants.map((merchant) => (
                                    <TableRow key={merchant.id} className="hover:bg-slate-50 transition-colors">
                                        <TableCell>
                                            <Avatar className="h-9 w-9 rounded-md border border-slate-100">
                                                <AvatarFallback className="rounded-md bg-blue-50 text-blue-600 font-bold">
                                                    {merchant.storeName.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm text-slate-900">{merchant.storeName}</span>
                                                <span className="text-xs text-slate-500">{merchant.email || merchant.personal?.email || "N/A"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-700">{merchant.personName || merchant.personal?.name || "N/A"}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                                                <Store className="h-3.5 w-3.5" />
                                                {merchant.storeType}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    merchant.status === "approved"
                                                        ? "bg-green-100 text-green-700 border-green-200 capitalize"
                                                        : merchant.status === "under_review"
                                                            ? "bg-blue-50 text-blue-700 border-blue-200 capitalize"
                                                            : "bg-red-50 text-red-700 border-red-200 capitalize"
                                                }
                                            >
                                                {merchant.status.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-500 w-[200px] truncate" title={merchant.location}>
                                            {merchant.location}
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
                                                        <Link href={`/merchants/${merchant.id}`}>
                                                            View dashboard
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>Manage Stores</DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600 cursor-pointer"
                                                        onClick={() => handleOffboard(merchant.id)}
                                                    >
                                                        Offboard
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
        </div>
    )
}

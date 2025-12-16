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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreHorizontal, Filter, Bike, Phone, MapPin } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMockData } from "@/contexts/MockDataContext"
import Link from "next/link"

export default function RidersPage() {
    const { riders } = useMockData()

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Riders Fleet</h1>
                    <p className="text-slate-500">
                        Monitor active riders, assignments and performance.
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Link href="/orders/live">
                        <Button variant="outline" className="gap-2">
                            <MapPin className="h-4 w-4" />
                            Live Map
                        </Button>
                    </Link>
                    <Link href="/riders/onboarding">
                        <Button className="gap-2">
                            <Bike className="h-4 w-4" />
                            Add Rider
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search riders..."
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
                            <TableHead>Rider Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">Wallet</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {riders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                    No riders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            riders.map((rider) => (
                                <TableRow key={rider.id} className="hover:bg-slate-50 transition-colors">
                                    <TableCell>
                                        <Avatar className="h-9 w-9 rounded-full border border-slate-100">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rider.name}`} alt={rider.name} />
                                            <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">{rider.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm text-slate-900">{rider.name}</span>
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <Bike className="h-3 w-3" />
                                                {rider.vehicleType}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Phone className="h-3 w-3" />
                                            {rider.phone}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                rider.status === "active"
                                                    ? "bg-green-100 text-green-700 border-green-200 capitalize"
                                                    : rider.status === "under_review" // Using 'under_review' as mapped before
                                                        ? "bg-orange-100 text-orange-700 border-orange-200 capitalize"
                                                        : "bg-gray-100 text-gray-700 border-gray-200 capitalize"
                                            }
                                        >
                                            {rider.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-slate-600 max-w-[200px] truncate" title={rider.location.address}>
                                            <MapPin className="h-3 w-3 text-slate-400" />
                                            {rider.location.address || "Unknown"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-slate-900">
                                        ₹{rider.walletBalance?.toLocaleString() || 0}
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
                                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                <DropdownMenuItem>Assign Order</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">Suspend</DropdownMenuItem>
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

"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMockData } from "@/contexts/MockDataContext"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Filter, Bike, Phone, MapPin, Activity, Zap, Clock, PowerOff } from "lucide-react"

export default function RidersPage() {
    const { riders } = useMockData()
    const router = useRouter()
    const [filter, setFilter] = React.useState("all")
    const [searchQuery, setSearchQuery] = React.useState("")

    // Metrics Calculation
    const totalRiders = riders.length
    const activeRiders = riders.filter(r => r.status === 'active')
    const busyRiders = riders.filter(r => r.status === 'active' && r.activeOrder)
    const offlineRiders = riders.filter(r => r.status !== 'active')

    // Filter Logic
    const filteredRiders = riders.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.phone.includes(searchQuery)

        let matchesFilter = true
        if (filter === 'active') matchesFilter = r.status === 'active'
        if (filter === 'busy') matchesFilter = r.status === 'active' && !!r.activeOrder
        if (filter === 'offline') matchesFilter = r.status !== 'active'

        return matchesSearch && matchesFilter
    })

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Rider Cockpit</h1>
                    <p className="text-slate-500">
                        Live monitoring of fleet status and active assignments.
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

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Fleet</CardTitle>
                        <Bike className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalRiders}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Online</CardTitle>
                        <Zap className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{activeRiders.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">On Delivery</CardTitle>
                        <Activity className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{busyRiders.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Offline</CardTitle>
                        <PowerOff className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-500">{offlineRiders.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Tabs defaultValue="all" onValueChange={setFilter} className="w-full sm:w-auto">
                    <TabsList>
                        <TabsTrigger value="all">All Riders</TabsTrigger>
                        <TabsTrigger value="active">Online</TabsTrigger>
                        <TabsTrigger value="busy">On Job</TabsTrigger>
                        <TabsTrigger value="offline">Offline</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Search by name or phone..."
                            className="pl-9 bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Rider List Table */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Rider Name</TableHead>
                            <TableHead>Current Status</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">Wallet</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRiders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                                    No riders found matching your filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRiders.map((rider) => (
                                <TableRow
                                    key={rider.id}
                                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                                    onClick={() => router.push(`/riders/${rider.id}`)}
                                >
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
                                                <Phone className="h-3 w-3" />
                                                {rider.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className={
                                                    rider.status === "active"
                                                        ? "bg-green-100 text-green-700 border-green-200 shadow-none px-2 py-0.5"
                                                        : rider.status === "under_review"
                                                            ? "bg-orange-100 text-orange-700 border-orange-200 shadow-none"
                                                            : "bg-slate-100 text-slate-700 border-slate-200 shadow-none"
                                                }
                                            >
                                                {rider.status === "active" ? "Online" : rider.status.replace('_', ' ')}
                                            </Badge>
                                            {rider.activeOrder && (
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 shadow-none">
                                                    On Order
                                                </Badge>
                                            )}
                                        </div>
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
                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/riders/${rider.id}`) }}>
                                                    View Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Assign Order</DropdownMenuItem>
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

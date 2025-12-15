"use client"

import * as React from "react"
import { useMockData, Rider } from "@/contexts/MockDataContext"
import { Skeleton } from "@/components/ui/skeleton"
import { useQueryState, useDebounce } from "@/hooks/use-url-state"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Card
} from "@/components/ui/card"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Search,
    Filter,
    User,
    Phone,
    Bike,
    Calendar,
    Wallet,
    MapPin,
    ShieldAlert,
    MoreHorizontal,
    Ban
} from "lucide-react"
import { format } from "date-fns"

const ITEMS_PER_PAGE = 10

export default function RiderDatabasePage() {
    const { riders, updateRiderStatus } = useMockData()

    // URL State Management
    const [searchQuery, setSearchQuery] = useQueryState("q")
    const [statusFilter, setStatusFilter] = useQueryState("status", "all")
    const [vehicleFilter, setVehicleFilter] = useQueryState("vehicle", "all")
    const [pageString, setPage] = useQueryState("page", "1")
    const page = parseInt(pageString) || 1

    // Local state for immediate input feedback
    const [localSearch, setLocalSearch] = React.useState(searchQuery)
    const debouncedSearch = useDebounce(localSearch, 300)

    // Sync local search with URL when debounced changes
    React.useEffect(() => {
        setSearchQuery(debouncedSearch)
    }, [debouncedSearch, setSearchQuery])

    const [selectedRider, setSelectedRider] = React.useState<Rider | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    // Simulate Loading on Filter Change
    React.useEffect(() => {
        setIsLoading(true)
        const timer = setTimeout(() => setIsLoading(false), 600)
        return () => clearTimeout(timer)
    }, [searchQuery, statusFilter, vehicleFilter])

    // Filter Logic
    const filteredRiders = React.useMemo(() => {
        return riders.filter(rider => {
            const query = (searchQuery || "").toLowerCase()
            const matchesSearch =
                rider.name.toLowerCase().includes(query) ||
                rider.phone.includes(query) ||
                rider.id.toLowerCase().includes(query)

            const matchesStatus = statusFilter === 'all' || rider.status === statusFilter
            const matchesVehicle = vehicleFilter === 'all' || rider.vehicleType.toLowerCase() === vehicleFilter.toLowerCase()

            return matchesSearch && matchesStatus && matchesVehicle
        })
    }, [riders, searchQuery, statusFilter, vehicleFilter])

    const handleBlockRider = (id: string) => {
        const confirm = window.confirm("Are you sure you want to BLOCK this rider from the platform? They will not be able to log in.")
        if (confirm) {
            updateRiderStatus(id, 'rejected', ['Manually blocked by admin'])
            setSelectedRider(prev => prev ? { ...prev, status: 'rejected' } : null)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Master Rider Database</h1>
                    <p className="text-slate-500 mt-1">View and manage all active and onboarding riders.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-1 rounded-xl border border-gray-100 shadow-sm md:col-span-2 relative">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by name, phone or ID..."
                        className="border-none shadow-none pl-9 focus-visible:ring-0"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="rounded-xl border-gray-200 bg-white">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-slate-500" />
                            <SelectValue placeholder="Status" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="rejected">Banned/Rejected</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                    <SelectTrigger className="rounded-xl border-gray-200 bg-white">
                        <div className="flex items-center gap-2">
                            <Bike className="h-4 w-4 text-slate-500" />
                            <SelectValue placeholder="Vehicle Type" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Vehicles</SelectItem>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="cycle">Cycle</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card className="shadow-sm border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Rider Details</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Wallet</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-9 w-9 rounded-full" />
                                            <div className="space-y-1">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-3 w-16" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredRiders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-64 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center">
                                            <User className="h-6 w-6 text-slate-300" />
                                        </div>
                                        <p>No riders found matching your filters.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRiders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((rider) => (
                                <TableRow key={rider.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-mono text-xs font-medium text-slate-500">
                                        {rider.id}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border border-gray-100">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rider.name}`} />
                                                <AvatarFallback className="text-xs">{rider.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 text-sm">{rider.name}</span>
                                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                                    <Phone size={10} /> {rider.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="gap-1.5 font-medium border-slate-200 text-slate-700">
                                            {rider.vehicleType === 'Bike' ? <Bike size={12} /> : <Bike size={12} className="text-green-600" />}
                                            {rider.vehicleType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-slate-600">
                                        {rider.joiningDate ? format(new Date(rider.joiningDate), "MMM dd, yyyy") : '-'}
                                    </TableCell>
                                    <TableCell className="font-medium text-slate-900">
                                        ₹{rider.walletBalance?.toLocaleString() ?? 0}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={rider.status} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setSelectedRider(rider)}>
                                                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                                                {selectedRider && (
                                                    <div className="space-y-6">
                                                        <SheetHeader>
                                                            <SheetTitle>Rider Profile</SheetTitle>
                                                            <SheetDescription>Read-only view of rider details.</SheetDescription>
                                                        </SheetHeader>

                                                        {/* Profile Header */}
                                                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                            <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRider.name}`} />
                                                                <AvatarFallback>{selectedRider.name[0]}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <h3 className="text-lg font-bold text-slate-900">{selectedRider.name}</h3>
                                                                <div className="flex flex-wrap gap-2 mt-1">
                                                                    <Badge variant="secondary" className="text-xs h-5">{selectedRider.id}</Badge>
                                                                    <StatusBadge status={selectedRider.status} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Quick Stats */}
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="p-3 border rounded-xl bg-white space-y-1">
                                                                <span className="text-xs text-slate-500 font-medium uppercase">Wallet Balance</span>
                                                                <div className="flex items-center gap-1.5 text-xl font-bold text-slate-900">
                                                                    <Wallet className="h-5 w-5 text-[#2BD67C]" />
                                                                    ₹{selectedRider.walletBalance ?? 0}
                                                                </div>
                                                            </div>
                                                            <div className="p-3 border rounded-xl bg-white space-y-1">
                                                                <span className="text-xs text-slate-500 font-medium uppercase">Joined On</span>
                                                                <div className="flex items-center gap-1.5 text-base font-bold text-slate-900">
                                                                    <Calendar className="h-4 w-4 text-slate-400" />
                                                                    {selectedRider.joiningDate ? format(new Date(selectedRider.joiningDate), "dd MMM yyyy") : 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Details List */}
                                                        <div className="space-y-4">
                                                            <h4 className="font-bold text-slate-900 text-sm border-b pb-2">Personal Information</h4>
                                                            <div className="grid gap-4 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span className="text-slate-500">Phone</span>
                                                                    <span className="font-medium">{selectedRider.phone}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-slate-500">Address</span>
                                                                    <span className="font-medium text-right max-w-[250px]">{selectedRider.location.address}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-slate-500">DOB</span>
                                                                    <span className="font-medium">{selectedRider.ekyc.apiFetched.dob}</span>
                                                                </div>
                                                            </div>

                                                            <h4 className="font-bold text-slate-900 text-sm border-b pb-2 pt-2">Logistics</h4>
                                                            <div className="grid gap-4 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span className="text-slate-500">Vehicle Type</span>
                                                                    <span className="font-medium">{selectedRider.vehicleType}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-slate-500">Plate Number</span>
                                                                    <span className="font-medium uppercase">{selectedRider.logistics.plateNumber}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-slate-500">T-Shirt Size</span>
                                                                    <span className="font-medium">{selectedRider.logistics.tShirtSize}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Danger Zone */}
                                                        {selectedRider.status === 'active' && (
                                                            <div className="pt-6 border-t mt-6">
                                                                <Button
                                                                    variant="destructive"
                                                                    className="w-full h-11 font-bold shadow-lg shadow-red-500/10"
                                                                    onClick={() => handleBlockRider(selectedRider.id)}
                                                                >
                                                                    <Ban className="mr-2 h-4 w-4" />
                                                                    Block Rider Permanently
                                                                </Button>
                                                                <p className="text-xs text-center text-slate-400 mt-2">
                                                                    This will immediately revoke their access.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </SheetContent>
                                        </Sheet>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Pagination Controls */}
            {filteredRiders.length > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-medium">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(page * ITEMS_PER_PAGE, filteredRiders.length)}</span> of <span className="font-medium">{filteredRiders.length}</span> results
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(String(page - 1))}
                            disabled={page <= 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(String(page + 1))}
                            disabled={page >= Math.ceil(filteredRiders.length / ITEMS_PER_PAGE)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'active':
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none shadow-none">Active</Badge>
        case 'under_review':
            return <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200 shadow-none">Review</Badge>
        case 'rejected':
            return <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-red-100 shadow-none">Restricted</Badge>
        default:
            return <Badge variant="secondary">{status}</Badge>
    }
}

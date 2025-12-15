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

const riders = [
    {
        id: "RID-101",
        name: "Suresh Kumar",
        phone: "+91 98765 00001",
        vehicle: "Bike (KA-01-AB-1234)",
        status: "Available",
        currentZone: "Indiranagar",
        todayRides: 12,
        rating: 4.8
    },
    {
        id: "RID-102",
        name: "Ramesh Babu",
        phone: "+91 98765 00002",
        vehicle: "Scooter (KA-03-XY-9876)",
        status: "On Delivery",
        currentZone: "Koramangala",
        todayRides: 8,
        rating: 4.5
    },
    {
        id: "RID-103",
        name: "John Doe",
        phone: "+91 98765 00003",
        vehicle: "Bike (KA-05-ZZ-5555)",
        status: "Offline",
        currentZone: "MG Road",
        todayRides: 0,
        rating: 4.2
    },
    {
        id: "RID-104",
        name: "Mohammed Ali",
        phone: "+91 98765 00004",
        vehicle: "Scooter (KA-51-MM-1111)",
        status: "Available",
        currentZone: "Whitefield",
        todayRides: 15,
        rating: 4.9
    },
    {
        id: "RID-105",
        name: "Karthik R",
        phone: "+91 98765 00005",
        vehicle: "Bike (KA-53-NN-2222)",
        status: "On Delivery",
        currentZone: "HSR Layout",
        todayRides: 5,
        rating: 4.6
    },
]

export default function RidersPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold tracking-tight">Riders Fleet</h1>
                    <p className="text-muted-foreground">
                        Monitor active riders, assignments and performance.
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline">MapView</Button>
                    <Button>Add Rider</Button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search riders..."
                        className="pl-9"
                    />
                </div>
                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Rider Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Current Zone</TableHead>
                            <TableHead className="text-right">Today's Rides</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {riders.map((rider) => (
                            <TableRow key={rider.id}>
                                <TableCell>
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rider.name}`} alt={rider.name} />
                                        <AvatarFallback>{rider.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{rider.name}</span>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Bike className="h-3 w-3" />
                                            {rider.vehicle}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {rider.phone}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            rider.status === "Available"
                                                ? "bg-green-100 text-green-700 border-green-200"
                                                : rider.status === "On Delivery"
                                                    ? "bg-blue-100 text-blue-700 border-blue-200"
                                                    : "bg-gray-100 text-gray-700 border-gray-200"
                                        }
                                    >
                                        {rider.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 text-sm">
                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                        {rider.currentZone}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-medium">{rider.todayRides}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
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
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

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

const stores = [
    {
        id: "STR-882",
        name: "Burger King",
        location: "MG Road, Bangalore",
        category: "Fast Food",
        rating: 4.2,
        status: "Open",
        orders: 1250,
        revenue: "₹4,50,000"
    },
    {
        id: "STR-883",
        name: "Pizza Hut",
        location: "Indiranagar, Bangalore",
        category: "Fast Food",
        rating: 4.5,
        status: "Closed",
        orders: 980,
        revenue: "₹3,80,000"
    },
    {
        id: "STR-884",
        name: "Fresh Mart",
        location: "Koramangala, Bangalore",
        category: "Grocery",
        rating: 4.8,
        status: "Open",
        orders: 2100,
        revenue: "₹5,20,000"
    },
    {
        id: "STR-885",
        name: "Apollo Pharmacy",
        location: "HSR Layout, Bangalore",
        category: "Pharmacy",
        rating: 4.6,
        status: "Open",
        orders: 560,
        revenue: "₹1,10,000"
    },
    {
        id: "STR-886",
        name: "Chai Point",
        location: "Whitefield, Bangalore",
        category: "Beverages",
        rating: 4.3,
        status: "Busy",
        orders: 890,
        revenue: "₹1,50,000"
    },
]

export default function StoresPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold tracking-tight">Stores</h1>
                    <p className="text-muted-foreground">
                        Manage your partner stores, catalog and settings.
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Store
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search stores..."
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
                            <TableHead>Store Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Revenue</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stores.map((store) => (
                            <TableRow key={store.id}>
                                <TableCell>
                                    <Avatar className="h-9 w-9 rounded-sm">
                                        <AvatarFallback className="rounded-sm bg-primary/10 text-primary">{store.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium">{store.name}</TableCell>
                                <TableCell className="text-muted-foreground">
                                    <div className="flex items-center gap-1 text-xs">
                                        <MapPin className="h-3 w-3" />
                                        {store.location}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-normal text-muted-foreground">
                                        {store.category}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 font-medium">
                                        {store.rating}
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            store.status === "Open"
                                                ? "bg-green-100 text-green-700 border-green-200"
                                                : store.status === "Closed"
                                                    ? "bg-red-100 text-red-700 border-red-200"
                                                    : "bg-orange-100 text-orange-700 border-orange-200"
                                        }
                                    >
                                        {store.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-medium">{store.revenue}</TableCell>
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
                                            <DropdownMenuItem>View dashboard</DropdownMenuItem>
                                            <DropdownMenuItem>Edit details</DropdownMenuItem>
                                            <DropdownMenuItem>Manage menu</DropdownMenuItem>
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

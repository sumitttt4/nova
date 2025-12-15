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
import { Search, MoreHorizontal, Filter, Building2, Store } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const merchants = [
    {
        id: "MER-001",
        name: "Spice World Pvt Ltd",
        contactPerson: "Rajiv Malhotra",
        email: "rajiv@spiceworld.com",
        phone: "+91 98765 44444",
        storesCount: 5,
        status: "Active",
        joined: "12 Aug, 2023"
    },
    {
        id: "MER-002",
        name: "Fresh Foods Inc.",
        contactPerson: "Sunita Williams",
        email: "sunita@freshfoods.com",
        phone: "+91 98765 55555",
        storesCount: 3,
        status: "Active",
        joined: "01 Sep, 2023"
    },
    {
        id: "MER-003",
        name: "Urban Retailers",
        contactPerson: "Anand Kumar",
        email: "anand@urbanretail.com",
        phone: "+91 98765 66666",
        storesCount: 2,
        status: "Pending Verified",
        joined: "20 Nov, 2023"
    },
    {
        id: "MER-004",
        name: "Global Brands",
        contactPerson: "David Smith",
        email: "david@globalbrands.com",
        phone: "+91 98765 77777",
        storesCount: 10,
        status: "Active",
        joined: "15 Jul, 2023"
    },
]

export default function MerchantsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold tracking-tight">Merchants</h1>
                    <p className="text-muted-foreground">
                        Manage business partners and agreements.
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button className="gap-2">
                        <Building2 className="h-4 w-4" />
                        Onboard Merchant
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search merchants..."
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
                            <TableHead>Business Name</TableHead>
                            <TableHead>Contact Person</TableHead>
                            <TableHead>Stores</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {merchants.map((merchant) => (
                            <TableRow key={merchant.id}>
                                <TableCell>
                                    <Avatar className="h-9 w-9 rounded-sm">
                                        <AvatarFallback className="rounded-sm bg-blue-100 text-blue-700">{merchant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{merchant.name}</span>
                                        <span className="text-xs text-muted-foreground">{merchant.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{merchant.contactPerson}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <Store className="h-3 w-3 text-muted-foreground" />
                                        {merchant.storesCount}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            merchant.status === "Active"
                                                ? "bg-green-100 text-green-700 border-green-200"
                                                : "bg-orange-100 text-orange-700 border-orange-200"
                                        }
                                    >
                                        {merchant.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{merchant.joined}</TableCell>
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
                                            <DropdownMenuItem>View details</DropdownMenuItem>
                                            <DropdownMenuItem>Manage Stores</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">Offboard</DropdownMenuItem>
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

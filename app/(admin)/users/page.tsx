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
import { Search, MoreHorizontal, Filter } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const users = [
    {
        id: "USR-001",
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        phone: "+91 98765 43210",
        status: "Active",
        joined: "12 Oct, 2023",
        orders: 45
    },
    {
        id: "USR-002",
        name: "Priya Singh",
        email: "priya.singh@example.com",
        phone: "+91 98765 12345",
        status: "Active",
        joined: "15 Oct, 2023",
        orders: 12
    },
    {
        id: "USR-003",
        name: "Amit Patel",
        email: "amit.patel@example.com",
        phone: "+91 98765 67890",
        status: "Inactive",
        joined: "20 Oct, 2023",
        orders: 0
    },
    {
        id: "USR-004",
        name: "Sneha Gupta",
        email: "sneha.gupta@example.com",
        phone: "+91 98765 98765",
        status: "Suspended",
        joined: "05 Nov, 2023",
        orders: 2
    },
    {
        id: "USR-005",
        name: "Vikram Malhotra",
        email: "vikram.m@example.com",
        phone: "+91 98765 11223",
        status: "Active",
        joined: "10 Dec, 2023",
        orders: 89
    },
    {
        id: "USR-006",
        name: "Anjali Rao",
        email: "anjali.r@example.com",
        phone: "+91 98765 33445",
        status: "Active",
        joined: "12 Dec, 2023",
        orders: 23
    },
]

export default function UsersPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">
                        Manage customer accounts, view history and status.
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button>Export Users</Button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search users..."
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
                            <TableHead>Customer</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Orders</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{user.name}</span>
                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {user.phone}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            user.status === "Active"
                                                ? "default"
                                                : user.status === "Inactive"
                                                    ? "secondary"
                                                    : "destructive"
                                        }
                                        className={
                                            user.status === "Active"
                                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                : user.status === "Inactive"
                                                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                        }
                                    >
                                        {user.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{user.joined}</TableCell>
                                <TableCell className="text-right font-medium">{user.orders}</TableCell>
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
                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                                                Copy ID
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>View details</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">Block user</DropdownMenuItem>
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

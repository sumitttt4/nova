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
import { Search, MoreHorizontal, Filter, Download, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const transactions = [
    {
        id: "TXN-77821",
        orderId: "ORD-9921",
        user: "Rahul Sharma",
        amount: "₹450.00",
        method: "UPI",
        status: "Success",
        date: "12 Oct, 10:30 AM"
    },
    {
        id: "TXN-77822",
        orderId: "ORD-9922",
        user: "Priya Singh",
        amount: "₹1,200.00",
        method: "Credit Card",
        status: "Success",
        date: "12 Oct, 10:45 AM"
    },
    {
        id: "TXN-77823",
        orderId: "ORD-9923",
        user: "Amit Patel",
        amount: "₹350.00",
        method: "Wallet",
        status: "Failed",
        date: "12 Oct, 11:00 AM"
    },
    {
        id: "TXN-77824",
        orderId: "ORD-9924",
        user: "Sneha Gupta",
        amount: "₹850.00",
        method: "UPI",
        status: "Success",
        date: "12 Oct, 11:15 AM"
    },
    {
        id: "TXN-77825",
        orderId: "ORD-9925",
        user: "Vikram Malhotra",
        amount: "₹250.00",
        method: "Net Banking",
        status: "Pending",
        date: "12 Oct, 11:30 AM"
    },
    {
        id: "TXN-77826",
        orderId: "ORD-9926",
        user: "Anjali Rao",
        amount: "₹600.00",
        method: "UPI",
        status: "Success",
        date: "12 Oct, 11:45 AM"
    },
]

export default function PaymentsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
                    <p className="text-muted-foreground">
                        History of all incoming payments from customer orders.
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search transaction ID..."
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
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((txn) => (
                            <TableRow key={txn.id}>
                                <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                                <TableCell className="font-mono text-xs text-muted-foreground">{txn.orderId}</TableCell>
                                <TableCell>{txn.user}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="font-normal">
                                        {txn.method}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            txn.status === "Success"
                                                ? "bg-green-100 text-green-700 border-green-200"
                                                : txn.status === "Failed"
                                                    ? "bg-red-100 text-red-700 border-red-200"
                                                    : "bg-yellow-100 text-yellow-700 border-yellow-200"
                                        }
                                    >
                                        {txn.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">{txn.date}</TableCell>
                                <TableCell className="text-right font-medium">
                                    <span className="text-green-600 flex items-center justify-end gap-1">
                                        {txn.amount}
                                    </span>
                                </TableCell>
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
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem>Issue Refund</DropdownMenuItem>
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

"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye } from "lucide-react"
import { cn } from "@/lib/utils"

const mockOrders = [
    {
        id: "ORD-7829",
        userName: "Rahul Sharma",
        userPhone: "+91 98765 43210",
        storeName: "Burger King",
        riderName: "Amit Kumar",
        amount: 450.00,
        status: "Delivered",
        paymentStatus: "Paid",
        createdAt: "Oct 24, 2023 10:30 AM",
    },
    {
        id: "ORD-7830",
        userName: "Priya Singh",
        userPhone: "+91 98765 43211",
        storeName: "Pizza Hut",
        riderName: "Vikram Singh",
        amount: 1200.00,
        status: "Preparing",
        paymentStatus: "Paid",
        createdAt: "Oct 24, 2023 11:15 AM",
    },
    {
        id: "ORD-7831",
        userName: "Rohan Gupta",
        userPhone: "+91 98765 43212",
        storeName: "Subway",
        riderName: "Pending",
        amount: 350.00,
        status: "Pending",
        paymentStatus: "Unpaid",
        createdAt: "Oct 24, 2023 11:45 AM",
    },
    {
        id: "ORD-7832",
        userName: "Anjali Desai",
        userPhone: "+91 98765 43213",
        storeName: "KFC",
        riderName: "Suresh Patel",
        amount: 850.00,
        status: "Picked",
        paymentStatus: "COD",
        createdAt: "Oct 24, 2023 12:00 PM",
    },
    {
        id: "ORD-7833",
        userName: "Arjun Reddy",
        userPhone: "+91 98765 43214",
        storeName: "McDonalds",
        riderName: "-",
        amount: 250.00,
        status: "Cancelled",
        paymentStatus: "Refunded",
        createdAt: "Oct 24, 2023 09:15 AM",
    },
]

const getStatusColor = (status: string) => {
    switch (status) {
        case "Delivered":
            return "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
        case "Preparing":
        case "Picked":
            return "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100"
        case "Pending":
            return "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
        case "Cancelled":
            return "bg-red-100 text-red-700 border-red-200 hover:bg-red-100"
        default:
            return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100"
    }
}

const getPaymentColor = (status: string) => {
    switch (status) {
        case "Paid":
            return "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
        case "COD":
            return "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100"
        case "Refunded":
        case "Failed":
            return "bg-red-100 text-red-700 border-red-200 hover:bg-red-100"
        case "Unpaid":
            return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100"
        default:
            return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100"
    }
}

export function OrdersTable() {
    return (
        <Card className="shadow-apple overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[120px]">Order ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Store</TableHead>
                        <TableHead>Rider</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockOrders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-muted/40 cursor-pointer">
                            <TableCell className="py-2">
                                <Button variant="link" size="sm" className="h-auto p-0 text-primary font-medium">
                                    {order.id}
                                </Button>
                            </TableCell>
                            <TableCell className="py-2">
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{order.userName}</span>
                                    <span className="text-xs text-muted-foreground">{order.userPhone}</span>
                                </div>
                            </TableCell>
                            <TableCell className="py-2 font-medium">{order.storeName}</TableCell>
                            <TableCell className="py-2 text-muted-foreground">{order.riderName}</TableCell>
                            <TableCell className="py-2 font-medium">₹{order.amount.toFixed(2)}</TableCell>
                            <TableCell className="py-2">
                                <Badge
                                    variant="outline"
                                    className={cn("text-xs px-2 py-0.5 rounded-full border", getStatusColor(order.status))}
                                >
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="py-2">
                                <Badge
                                    variant="outline"
                                    className={cn("text-xs px-2 py-0.5 rounded-full border", getPaymentColor(order.paymentStatus))}
                                >
                                    {order.paymentStatus}
                                </Badge>
                            </TableCell>
                            <TableCell className="py-2 text-xs text-muted-foreground">{order.createdAt}</TableCell>
                            <TableCell className="py-2 text-right">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                    <span className="sr-only">View</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}

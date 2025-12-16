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
import { Order } from "@/contexts/MockDataContext"
import { format } from "date-fns"

interface OrdersTableProps {
    orders: Order[]
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "delivered":
            return "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
        case "preparing":
            return "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100"
        case "cancelled":
            return "bg-red-100 text-red-700 border-red-200 hover:bg-red-100"
        default:
            return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100"
    }
}

export function OrdersTable({ orders }: OrdersTableProps) {
    if (orders.length === 0) {
        return (
            <Card className="p-8 text-center text-muted-foreground shadow-sm">
                No orders found matching your filters.
            </Card>
        )
    }

    return (
        <Card className="shadow-sm border-gray-100 overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow>
                        <TableHead className="w-[120px]">Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Store</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-slate-50/50 cursor-pointer transition-colors">
                            <TableCell className="py-3">
                                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                    {order.id}
                                </span>
                            </TableCell>
                            <TableCell className="py-3">
                                <span className="font-medium text-sm text-slate-900">{order.customerName}</span>
                            </TableCell>
                            <TableCell className="py-3 font-medium text-slate-700">{order.storeName}</TableCell>
                            <TableCell className="py-3 font-bold text-slate-900">₹{order.amount.toLocaleString()}</TableCell>
                            <TableCell className="py-3">
                                <Badge
                                    variant="outline"
                                    className={cn("text-xs font-bold px-2.5 py-0.5 rounded-lg border-none capitalize shadow-sm", getStatusColor(order.status))}
                                >
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="py-3 text-xs text-slate-500 font-medium">
                                {format(new Date(order.createdAt), "MMM dd, p")}
                            </TableCell>
                            <TableCell className="py-3 text-right">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full">
                                    <Eye className="h-4 w-4 text-slate-400" />
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

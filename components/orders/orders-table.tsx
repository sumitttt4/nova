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

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, CheckCircle2, XCircle, Clock, ShoppingBag, Truck } from "lucide-react"
import { useMockData } from "@/contexts/MockDataContext"

// ... imports

import { useRouter } from "next/navigation"

// ... imports

export function OrdersTable({ orders }: OrdersTableProps) {
    const { updateOrderStatus } = useMockData()
    const router = useRouter()

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
                        <TableRow
                            key={order.id}
                            className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                            onClick={() => router.push(`/orders/${order.id}`)}
                        >
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
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[160px]">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation() // Prevent row click
                                            router.push(`/orders/${order.id}`)
                                        }}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>
                                                <ShoppingBag className="mr-2 h-4 w-4" />
                                                Update Status
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem disabled={order.status === 'preparing'} onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'preparing') }}>
                                                    <Clock className="mr-2 h-4 w-4" />
                                                    Preparing
                                                </DropdownMenuItem>
                                                <DropdownMenuItem disabled={order.status === 'ready'} onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'ready') }}>
                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                    Ready
                                                </DropdownMenuItem>
                                                <DropdownMenuItem disabled={order.status === 'delivered'} onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'delivered') }}>
                                                    <Truck className="mr-2 h-4 w-4" />
                                                    Delivered
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-red-600 focus:text-red-600"
                                            disabled={order.status === 'cancelled'}
                                            onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'cancelled') }}
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Cancel Order
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}

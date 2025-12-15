"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function OrderHistoryPage() {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Order History</h1>
                <p className="text-muted-foreground">Archive of all past completed orders.</p>
            </div>

            <div className="bg-white rounded-xl border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <TableRow key={i}>
                                <TableCell className="font-mono text-xs">ORD-2023-88{i}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">Customer {i}</span>
                                        <span className="text-xs text-muted-foreground">+91 98765 0000{i}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">2 items • Burger King</TableCell>
                                <TableCell className="text-sm text-muted-foreground">Oct 2{i}, 10:00 AM</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">Delivered</Badge>
                                </TableCell>
                                <TableCell className="text-right font-medium">₹{350 + (i * 50)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

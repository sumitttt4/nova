"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function RiderPayoutsPage() {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Rider Payouts</h1>
                    <p className="text-muted-foreground">Weekly earnings and settlements for the fleet.</p>
                </div>
                <Button>Process Batch Payout</Button>
            </div>

            <div className="bg-white rounded-xl border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rider ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Week</TableHead>
                            <TableHead>Trips</TableHead>
                            <TableHead>Incentives</TableHead>
                            <TableHead>Total Earnings</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3, 4].map((i) => (
                            <TableRow key={i}>
                                <TableCell className="font-mono text-xs">RID-{100 + i}</TableCell>
                                <TableCell className="font-medium">Rider Name {i}</TableCell>
                                <TableCell className="text-muted-foreground">Oct 15 - Oct 21</TableCell>
                                <TableCell>{45 + i * 2}</TableCell>
                                <TableCell className="text-green-600">+₹{500 + i * 50}</TableCell>
                                <TableCell className="font-bold">₹{4500 + i * 200}</TableCell>
                                <TableCell>
                                    {i % 2 === 0 ? (
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Paid</Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700">Processing</Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

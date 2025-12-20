"use client"

import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useMockData } from "@/contexts/MockDataContext"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"

export function PayoutsTable() {
    const { payouts } = useMockData()

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-bold">Payout Cycles</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-x-auto">
                    <Table className="min-w-[600px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transaction ID</TableHead>
                                <TableHead>Merchant</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payouts.map((payout) => (
                                <TableRow key={payout.id}>
                                    <TableCell className="font-medium">{payout.transactionId}</TableCell>
                                    <TableCell>{payout.merchantName}</TableCell>
                                    <TableCell>{new Date(payout.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">₹{payout.amount.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge
                                            className={
                                                payout.status === 'processed'
                                                    ? "bg-[#278F27] hover:bg-[#278F27]/90 text-white"
                                                    : payout.status === 'pending'
                                                        ? "bg-[#FBC02D] hover:bg-[#FBC02D]/90 text-black border-transparent"
                                                        : "bg-red-500 hover:bg-red-600 text-white"
                                            }
                                        >
                                            {payout.status === 'processed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                            {payout.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                                            {payout.status === 'failed' && <AlertCircle className="h-3 w-3 mr-1" />}
                                            {payout.status === 'processed' ? 'Paid' : payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

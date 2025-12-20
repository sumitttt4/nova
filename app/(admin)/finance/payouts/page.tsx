"use client"

import * as React from "react"
import { useMockData } from "@/contexts/MockDataContext"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function PayoutsPage() {
    const { payouts } = useMockData()

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payouts</h1>
                <p className="text-slate-500">Track settlements and payments to merchant partners.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Merchant</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Transaction ID</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payouts.map((payout) => (
                            <TableRow key={payout.id} className="hover:bg-slate-50/50">
                                <TableCell className="font-mono text-xs font-medium text-slate-500">{payout.id}</TableCell>
                                <TableCell className="font-medium text-slate-900">{payout.merchantName}</TableCell>
                                <TableCell>₹{payout.amount.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={`
                                            ${payout.status === 'processed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                payout.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                    'bg-red-50 text-red-700 border-red-200'}
                                        `}
                                    >
                                        {payout.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-500 text-sm">
                                    {format(new Date(payout.date), "MMM dd, yyyy")}
                                </TableCell>
                                <TableCell className="font-mono text-xs text-slate-500">{payout.transactionId}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

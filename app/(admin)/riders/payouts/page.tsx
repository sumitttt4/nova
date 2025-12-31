"use client"

import * as React from "react"
import { useMockData } from "@/contexts/MockDataContext"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Wallet, CheckCircle2, Clock, Loader2, AlertCircle } from "lucide-react"
import { format } from "date-fns"

export default function RiderPayoutsPage() {
    const { riderPayouts } = useMockData()
    const [processing, setProcessing] = React.useState(false)

    const pendingPayouts = riderPayouts.filter(p => p.status === 'pending')
    const totalPending = pendingPayouts.reduce((sum, p) => sum + p.amount, 0)

    const handleProcessBatch = () => {
        if (pendingPayouts.length === 0) {
            alert("No pending payouts to process.")
            return
        }
        setProcessing(true)
        setTimeout(() => {
            setProcessing(false)
            alert(`Successfully processed ${pendingPayouts.length} payouts totaling ₹${totalPending.toLocaleString('en-IN')}`)
        }, 2000)
    }

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Rider Payouts</h1>
                    <p className="text-muted-foreground">Weekly earnings and settlements for the fleet.</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Summary */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <Wallet className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-bold text-amber-700">₹{totalPending.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-amber-600">Pending</span>
                    </div>
                    <Button
                        onClick={handleProcessBatch}
                        disabled={processing || pendingPayouts.length === 0}
                        className="bg-[#278F27] hover:bg-[#278F27]/90 text-white"
                    >
                        {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {processing ? "Processing..." : "Process Batch Payout"}
                    </Button>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Rider ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {riderPayouts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <AlertCircle className="h-8 w-8 text-slate-300" />
                                        No payout records found.
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            riderPayouts.map((payout) => (
                                <TableRow key={payout.id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-mono text-xs text-slate-500">{payout.transactionId}</TableCell>
                                    <TableCell className="font-mono text-xs text-slate-500">{payout.riderId}</TableCell>
                                    <TableCell className="font-medium text-slate-900">{payout.riderName}</TableCell>
                                    <TableCell className="text-sm text-slate-500">
                                        {format(new Date(payout.date), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-slate-900">₹{payout.amount.toLocaleString('en-IN')}</TableCell>
                                    <TableCell>
                                        {payout.status === 'processed' ? (
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Paid
                                            </Badge>
                                        ) : payout.status === 'failed' ? (
                                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                Failed
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
                                                <Clock className="h-3 w-3" />
                                                Pending
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}

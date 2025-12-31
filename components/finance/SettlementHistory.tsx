"use client"

import * as React from "react"
import { useMockData } from "@/contexts/MockDataContext"
import { Button } from "@/components/ui/button"
import { Settlement } from "@/contexts/MockDataContext"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, Download } from "lucide-react"
import { format } from "date-fns"

export function SettlementHistory() {
    const { settlements } = useMockData()

    return (
        <div className="rounded-md border bg-card text-card-foreground shadow-sm">
            <div className="p-6 border-b">
                <h3 className="text-lg font-medium">Settlement History</h3>
                <p className="text-sm text-muted-foreground">Detailed breakdown of all generated settlements.</p>
            </div>
            {settlements.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                    No settlements generated yet.
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Settlement ID</TableHead>
                            <TableHead>Recipient</TableHead>
                            <TableHead>Period</TableHead>
                            <TableHead className="text-right">Net Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {settlements.map((settlement) => (
                            <TableRow key={settlement.id}>
                                <TableCell className="font-mono text-xs">{settlement.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{settlement.recipientName}</span>
                                        <span className="text-xs text-muted-foreground capitalize">{settlement.type}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {format(new Date(settlement.periodStart), 'dd MMM')} - {format(new Date(settlement.periodEnd), 'dd MMM')}
                                </TableCell>
                                <TableCell className="text-right font-bold text-slate-700">
                                    ₹{settlement.netAmount.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={
                                        settlement.status === 'processed' ? 'bg-green-50 text-green-700 border-green-200' :
                                            settlement.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                'bg-red-50 text-red-700 border-red-200'
                                    }>
                                        {settlement.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <SettlementDetailsSheet settlement={settlement} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}

function SettlementDetailsSheet({ settlement }: { settlement: Settlement }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" /> View
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0">
                <div className="flex flex-col h-full bg-[#FAFAFA]">
                    {/* Header */}
                    <div className="p-6 border-b bg-white sticky top-0 z-10 shadow-sm">
                        <SheetTitle className="text-lg font-bold">Settlement Details</SheetTitle>
                        <SheetDescription className="mt-1">
                            Breakdown for {settlement.id}
                        </SheetDescription>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Header Box */}
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-medium tracking-wider">Total Payable</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">₹{settlement.netAmount.toLocaleString()}</p>
                            </div>
                            <Badge className={
                                settlement.status === 'processed' ? 'bg-green-100 text-green-700 border-green-200' :
                                    settlement.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                        'bg-red-100 text-red-700 border-red-200'
                            }>
                                {settlement.status}
                            </Badge>
                        </div>

                        {/* Recipient Info */}
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Recipient Info</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-400 text-xs">Recipient</p>
                                    <p className="font-semibold text-slate-900 mt-0.5">{settlement.recipientName}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs">Type</p>
                                    <p className="font-semibold text-slate-900 capitalize mt-0.5">{settlement.type}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs">Period Start</p>
                                    <p className="font-semibold text-slate-900 mt-0.5">{format(new Date(settlement.periodStart), 'dd MMM yyyy')}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs">Period End</p>
                                    <p className="font-semibold text-slate-900 mt-0.5">{format(new Date(settlement.periodEnd), 'dd MMM yyyy')}</p>
                                </div>
                                {settlement.transactionReference && (
                                    <div className="col-span-2">
                                        <p className="text-slate-400 text-xs">Reference ID</p>
                                        <p className="font-mono text-xs bg-slate-100 p-2 rounded inline-block mt-1">
                                            {settlement.transactionReference}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Financial Breakdown */}
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Financial Breakdown</h4>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm py-2 border-b border-dashed border-slate-200">
                                    <span className="text-slate-600">Gross Sales / Earnings</span>
                                    <span className="font-semibold text-slate-900">₹{settlement.breakdown.grossAmount.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between text-sm py-2 border-b border-dashed border-slate-200 text-red-600">
                                    <span>Platform Commission</span>
                                    <span className="font-semibold">- ₹{settlement.breakdown.commission.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between text-sm py-2 border-b border-dashed border-slate-200 text-red-600">
                                    <span>Tax (TDS/GST)</span>
                                    <span className="font-semibold">- ₹{settlement.breakdown.tax.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between text-sm py-2 border-b border-dashed border-slate-200">
                                    <span className="text-slate-600">Adjustments (Refunds/Bonus)</span>
                                    <span className={`font-semibold ${settlement.breakdown.adjustments >= 0 ? "text-green-600" : "text-red-600"}`}>
                                        {settlement.breakdown.adjustments >= 0 ? '+' : ''} ₹{settlement.breakdown.adjustments.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between text-base font-bold pt-4 mt-2 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <span>Net Settlement Amount</span>
                                    <span className="text-[#2BD67C]">₹{settlement.netAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-white border-t shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
                        <Button
                            className="w-full gap-2 h-12 font-semibold"
                            variant="outline"
                            onClick={() => {
                                // Create settlement statement content
                                const content = `
SETTLEMENT STATEMENT
====================

Settlement ID: ${settlement.id}
Generated: ${new Date().toLocaleString()}

RECIPIENT INFORMATION
---------------------
Name: ${settlement.recipientName}
Type: ${settlement.type}
Period: ${new Date(settlement.periodStart).toLocaleDateString()} - ${new Date(settlement.periodEnd).toLocaleDateString()}
${settlement.transactionReference ? `Reference: ${settlement.transactionReference}` : ''}

FINANCIAL BREAKDOWN
-------------------
Gross Sales/Earnings:    ₹${settlement.breakdown.grossAmount.toLocaleString()}
Platform Commission:     -₹${settlement.breakdown.commission.toLocaleString()}
Tax (TDS/GST):           -₹${settlement.breakdown.tax.toLocaleString()}
Adjustments:             ${settlement.breakdown.adjustments >= 0 ? '+' : ''}₹${settlement.breakdown.adjustments.toLocaleString()}

---------------------
NET SETTLEMENT:          ₹${settlement.netAmount.toLocaleString()}
STATUS:                  ${settlement.status.toUpperCase()}

====================
This is a system-generated statement from Bazuroo Admin Panel.
                                `.trim()

                                // Create blob and download
                                const blob = new Blob([content], { type: 'text/plain' })
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = `settlement_${settlement.id}_${new Date().toISOString().split('T')[0]}.txt`
                                document.body.appendChild(a)
                                a.click()
                                document.body.removeChild(a)
                                URL.revokeObjectURL(url)
                            }}
                        >
                            <Download className="h-4 w-4" /> Download PDF Statement
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
